import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/header';
import * as api from '../utils/api';
import type { Tool } from '../utils/interfaces';

// simulation globale 
vi.mock('../utils/api', () => ({
  getTools: vi.fn(() => Promise.resolve([])),
}));

const mockTool: Tool = {
  id: 1,
  name: 'Jira',
  description: 'gestion tickets',
  vendor: 'Atlassian',
  category: 'Productivity',
  monthly_cost: 3000,
  previous_month_cost: 2900,
  owner_department: 'IT',
  status: 'active',
  website_url: 'https://jira.com',
  active_users_count: 50,
  icon_url: '',
  created_at: '',
  updated_at: ''
};

describe('Composant Header', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test 1 : toggle theme
  it('appelle la fonction toggleTheme lors du clic sur le bouton de thème', () => {
    const toggleThemeMock = vi.fn();
    render(<BrowserRouter><Navbar isDark={true} toggleTheme={toggleThemeMock} /></BrowserRouter>);
    const toggleButton = screen.getByTestId('theme-toggle');
    fireEvent.click(toggleButton);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  // test 2 : persistance du bouton
  it('affiche le bouton de thème dans les deux modes', () => {
    const { rerender } = render(<BrowserRouter><Navbar isDark={true} toggleTheme={() => {}} /></BrowserRouter>);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    
    rerender(<BrowserRouter><Navbar isDark={false} toggleTheme={() => {}} /></BrowserRouter>);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  // test 3 : recherche (asynchrone)
  it('affiche des suggestions quand l\'utilisateur saisit un nom d\'outil', async () => {
    vi.mocked(api.getTools).mockResolvedValue([mockTool]);

    render(<BrowserRouter><Navbar isDark={true} toggleTheme={() => {}} /></BrowserRouter>);

    // attend que l'appel api initial soit fait
    await waitFor(() => expect(api.getTools).toHaveBeenCalled());

    const searchInput = screen.getByPlaceholderText(/Search tools/i);
    fireEvent.change(searchInput, { target: { value: 'Jira' } });

    // attend l'affichage de la suggestion
    const suggestion = await screen.findByText('Jira');
    expect(suggestion).toBeInTheDocument();
  });

  // test 4 : absence de résultats
  it('affiche un message si aucun outil n\'est trouvé', async () => {
    vi.mocked(api.getTools).mockResolvedValue([mockTool]);

    render(<BrowserRouter><Navbar isDark={true} toggleTheme={() => {}} /></BrowserRouter>);
    await waitFor(() => expect(api.getTools).toHaveBeenCalled());

    const searchInput = screen.getByPlaceholderText(/Search tools/i);
    fireEvent.change(searchInput, { target: { value: 'Inconnu' } });

    const noResults = await screen.findByText(/No results found/i);
    expect(noResults).toBeInTheDocument();
  });
});