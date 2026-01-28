import axios from 'axios';
import type { Tool } from './interfaces';

const API_URL = 'https://tt-jsonserver-01.alt-tools.tech';

export const api = axios.create({
  baseURL: API_URL,
});

// On définit le type attendu pour la création (tout sauf ID et dates)
export type NewToolPayload = Omit<Tool, 'id' | 'created_at' | 'updated_at'>;

export const getTools = async (): Promise<Tool[]> => {
  const response = await api.get<Tool[]>('/tools');
  return response.data;
};

export const createTool = async (tool: NewToolPayload): Promise<Tool> => {
  const newTool = {
    ...tool,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    icon_url: tool.icon_url || `https://ui-avatars.com/api/?name=${tool.name}&background=random`
  };
  const response = await api.post<Tool>('/tools', newTool);
  return response.data;
};

export const updateTool = async (id: number, tool: Partial<Tool>): Promise<Tool> => {
  const updatedTool = {
    ...tool,
    updated_at: new Date().toISOString()
  };
  const response = await api.patch<Tool>(`/tools/${id}`, updatedTool);
  return response.data;
};

export const deleteTool = async (id: number): Promise<void> => {
  await api.delete(`/tools/${id}`);
};