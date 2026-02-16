import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoryApiResponseDto, CategoryDto, GetAllCategoriesApiResponseDto } from "./dto/categories.dto";
import { ResponseUtil } from "@common/helpers/response.utils";
import { HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "api/auth/guard/jwt-auth.guard";
import { PermissionsGuard } from "api/auth/guard/permissions.guard";
import { RequirePermission } from "api/auth/decorator/permissions.decorator";

@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    
    @Post('create')
    async createCategory(@Body() category: CategoryDto): Promise<CategoryApiResponseDto> {
        const newCategory = await this.categoriesService.createCategory(category);
        return ResponseUtil.success(newCategory, 'Category created successfully', HttpStatus.OK);
    }
    @Get('get/:id')
    async getCategoryById(@Param('id') id: string ): Promise<CategoryApiResponseDto> {
        const category = await this.categoriesService.getCategoryById(id);
        return ResponseUtil.success(category, 'Category fetched successfully', HttpStatus.OK);
    }
    @Get('get-all')
    async getAllCategories(): Promise<GetAllCategoriesApiResponseDto> {
        const categories = await this.categoriesService.getAllCategories();
        return ResponseUtil.success(categories, 'Categories fetched successfully', HttpStatus.OK);
    }

    @Patch('update/:id')
    async updateCategory(@Param('id') id: string, @Body() category: CategoryDto): Promise<CategoryApiResponseDto> {
        const updatedCategory = await this.categoriesService.updateCategory(id, category);
        return ResponseUtil.success(updatedCategory, 'Category updated successfully', HttpStatus.OK);
    }

    @Delete('delete/:id')
    async deleteCategory(@Param('id') id: string): Promise<CategoryApiResponseDto> {
        const deletedCategory = await this.categoriesService.deleteCategory(id);
        return ResponseUtil.success(deletedCategory, 'Category deleted successfully', HttpStatus.OK);
    }
}