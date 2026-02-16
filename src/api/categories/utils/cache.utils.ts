import { Cache } from "cache-manager";
import { CategoriesDbService } from "@db/categories/categories-db.service";
import { CategoryResponseDto } from "../dto/categories.dto";

/**
 * Cache configuration constants for categories
 */
export const CATEGORIES_CACHE_CONFIG = {
    KEY: 'categories:all',
    TTL: 60 * 60 * 24 * 1000, // 24 hours in milliseconds
} as const;

/**
 * Utility function to refresh the all categories cache
 * This ensures cache consistency across all operations
 * 
 * @param cacheManager - The cache manager instance
 * @param categoriesDbService - The categories database service instance
 * @returns Promise<void>
 */
export async function refreshAllCategoriesCache(
    cacheManager: Cache,
    categoriesDbService: CategoriesDbService
): Promise<void> {
    const allCategories = await categoriesDbService.getAllCategories();
    await cacheManager.set(
        CATEGORIES_CACHE_CONFIG.KEY,
        allCategories,
        CATEGORIES_CACHE_CONFIG.TTL
    );
}

/**
 * Utility function to get a category by ID from cache
 * Falls back to fetching all categories and caching them if not found
 * 
 * @param cacheManager - The cache manager instance
 * @param id - The category ID to fetch
 * @returns Promise<CategoryResponseDto | null> - The category if found in cache, null otherwise
 */
export async function getCategoryFromCache(
    cacheManager: Cache,
    id: string
): Promise<CategoryResponseDto | null> {
    const cachedCategories = await cacheManager.get<CategoryResponseDto[]>(
        CATEGORIES_CACHE_CONFIG.KEY
    );
    
    if (cachedCategories) {
        const category = cachedCategories.find(cat => cat.id === id);
        if (category) {
            console.log(`Category ${id} fetched from cache`);
            return category;
        }
    }
    
    return null;
}
