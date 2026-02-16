import { DBService } from "@db/db.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryDto, CategoryResponseDto } from "api/categories/dto/categories.dto";

@Injectable()
export class CategoriesDbRepository {

    constructor(private readonly db: DBService) {}
    
    async createCategory(category: CategoryDto): Promise<CategoryResponseDto> {
        
        const createdCategory = await this.db.categories.create({
            data: {
                category_name: category.name,
            }
        });
        return {
            id: createdCategory.id,
            name: createdCategory.category_name,
        }

    }

    async getCategoryById(id: string): Promise<CategoryResponseDto> {
        const category = await this.db.categories.findUnique({
            where: {
                id: id,
                deleted_at: null,
            }
        });
        if(!category) {
            throw new NotFoundException("Category not found");
        }
        return {
            id: category.id,
            name: category.category_name,
        }
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        const categories = await this.db.categories.findMany({
            where: {
                deleted_at: null,
            },
            select: {
                id: true,
                category_name: true,
            }
        });
        return categories.map((category) => {
            return {
                id: category.id,
                name: category.category_name,
            }
        });
    }

    async updateCategory(id: string, category: CategoryDto): Promise<CategoryResponseDto> {
        const categoryExists = await this.db.categories.findUnique({
            where: {
                id: id,
                deleted_at: null,
            }
        });
        if(!categoryExists) {
            throw new NotFoundException("Category not found");
        }
        const updatedCategory = await this.db.categories.update({
            where: {
                id: id,
            },
            data: {
                category_name: category.name,
            }
        });
        return {
            id: updatedCategory.id,
            name: updatedCategory.category_name,
        }
    }

    async deleteCategory(id: string): Promise<CategoryResponseDto> {
        const deletedCategory = await this.db.categories.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            }
        });
        return {
            id: deletedCategory.id,
            name: deletedCategory.category_name,
        }
    }


}