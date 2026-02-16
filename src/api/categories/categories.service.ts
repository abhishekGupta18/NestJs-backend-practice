import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CategoriesDbService } from "@db/categories/categories-db.service";
import { CategoryDto, CategoryResponseDto } from "./dto/categories.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { 
    CATEGORIES_CACHE_CONFIG, 
    refreshAllCategoriesCache, 
    getCategoryFromCache 
} from "./utils/cache.utils";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesDbService: CategoriesDbService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async createCategory(category: CategoryDto): Promise<CategoryResponseDto> {
        if(!category.name) {
            throw new BadRequestException("Category name is required");
        }
        const categoryResponse = await this.categoriesDbService.createCategory(category);

        // Refresh cache after creating a new category
        await refreshAllCategoriesCache(this.cacheManager, this.categoriesDbService);

        return categoryResponse;
    }

    async getCategoryById(id: string): Promise<CategoryResponseDto> {
        if(!id) {
            throw new BadRequestException("Category id is required");
        }

        // Try to get from the all categories cache first
        const cachedCategory = await getCategoryFromCache(this.cacheManager, id);
        if (cachedCategory) {
            console.log(`Category ${id} fetched from cache`);
            return cachedCategory;
        }

        // If not in cache, fetch from DB
        const categoryResponse = await this.categoriesDbService.getCategoryById(id);
        
        // Refresh the all categories cache for next time
        await refreshAllCategoriesCache(this.cacheManager, this.categoriesDbService);
        
        return categoryResponse;
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        // Check if the data is in cache 
        const cachedCategories = await this.cacheManager.get<CategoryResponseDto[]>(CATEGORIES_CACHE_CONFIG.KEY);
        if(cachedCategories) {
            console.log("All categories fetched from cache");
            return cachedCategories;
        }

        // If not in cache, get it from db and cache it
        const categoryResponse = await this.categoriesDbService.getAllCategories();

        // Set cache
        if(categoryResponse) {
            await this.cacheManager.set(CATEGORIES_CACHE_CONFIG.KEY, categoryResponse, CATEGORIES_CACHE_CONFIG.TTL);
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

        // Refresh cache after updating a category
        await refreshAllCategoriesCache(this.cacheManager, this.categoriesDbService);
        
        return categoryResponse;
    }

    async deleteCategory(id: string): Promise<CategoryResponseDto> {
        if(!id) {
            throw new BadRequestException("Category id is required");
        }
        const categoryResponse = await this.categoriesDbService.deleteCategory(id);

        // Refresh cache after deleting a category
        await refreshAllCategoriesCache(this.cacheManager, this.categoriesDbService);
        
        return categoryResponse;
    }
}
