import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CategoriesDbService } from "@db/categories/categories-db.service";
import { CategoryDto, CategoryResponseDto } from "./dto/categories.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesDbService: CategoriesDbService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async createCategory(category: CategoryDto): Promise<CategoryResponseDto> {

        if(!category.name) {
            throw new BadRequestException("Category name is required");
        }
        const categoryResponse = await this.categoriesDbService.createCategory(category);

        // clear cache
        await this.cacheManager.del('categories:all');

        return categoryResponse;
    }

    async getCategoryById(id: string): Promise<CategoryResponseDto> {
        if(!id) {
            throw new BadRequestException("Category id is required");
        }

        const cacheKey = `categories:${id}`

        // check if the data is in chache 
        const cachedCategory = await this.cacheManager.get<CategoryResponseDto>(cacheKey);
        if(cachedCategory) {
            return cachedCategory;
        }
        
        const categoryResponse = await this.categoriesDbService.getCategoryById(id);

        // set cache for 24 hours (in milliseconds)
        if(categoryResponse) {
            await this.cacheManager.set(cacheKey, categoryResponse, 60 * 60 * 24 * 1000);
        }
        return categoryResponse;
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        const cacheKey = 'categories:all'

        // check if the data is in chache 
        const cachedCategories = await this.cacheManager.get<CategoryResponseDto[]>(cacheKey);
        if(cachedCategories) {
            console.log("Categories fetched from cache");
            return cachedCategories;
        }

        // if not in chache get it from db
        const categoryResponse = await this.categoriesDbService.getAllCategories();

        // set cache for 24 hours (in milliseconds)
        if(categoryResponse) {
            await this.cacheManager.set(cacheKey, categoryResponse, 60 * 60 * 24 * 1000);
        }
        return categoryResponse;
    }

    async updateCategory(id: string, category: CategoryDto): Promise<CategoryResponseDto> {
        if(!id) {
            throw new BadRequestException("Category id is required");
        }
        if(!category.name) {
            throw new BadRequestException("Category name is required");
        }
        const categoryResponse = await this.categoriesDbService.updateCategory(id, category);

        // clear cache
        await this.cacheManager.del('categories:all');
        await this.cacheManager.del(`categories:${id}`);
        return categoryResponse;
    }

    async deleteCategory(id: string): Promise<CategoryResponseDto> {
        if(!id) {
            throw new BadRequestException("Category id is required");
        }
        const categoryResponse = await this.categoriesDbService.deleteCategory(id);

        // clear cache
        await this.cacheManager.del('categories:all');
        return categoryResponse;
    }
}
