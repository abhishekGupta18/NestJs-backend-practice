import { CategoryDto, CategoryResponseDto } from "api/categories/dto/categories.dto";
import { CategoriesDbRepository } from "./categoroies-db.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesDbService {  
    constructor(private readonly categoriesDbRepository: CategoriesDbRepository) {}

    async createCategory(category: CategoryDto): Promise<CategoryResponseDto> {
        const categoryResponse = await this.categoriesDbRepository.createCategory(category);
        return categoryResponse;
    }
    async getCategoryById(id: string): Promise<CategoryResponseDto> {
        const categoryResponse = await this.categoriesDbRepository.getCategoryById(id);
        return categoryResponse;
    }
    async getAllCategories(): Promise<CategoryResponseDto[]> {
        const categoryResponse = await this.categoriesDbRepository.getAllCategories();
        return categoryResponse;
    }
    async updateCategory(id: string, category: CategoryDto): Promise<CategoryResponseDto> {
        const categoryResponse = await this.categoriesDbRepository.updateCategory(id, category);
        return categoryResponse;
    }
    async deleteCategory(id: string): Promise<CategoryResponseDto> {
        const categoryResponse = await this.categoriesDbRepository.deleteCategory(id);  
        return categoryResponse;
    }
}
