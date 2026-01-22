import { AppDataSource } from "../data-source";
import { Tool } from "../entities/Tool";

export class ToolService {
    private toolRepository = AppDataSource.getRepository(Tool);

    async getAllTools() { 
        return await this.toolRepository.find();
    }
}