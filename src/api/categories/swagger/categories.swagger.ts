import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CategoryApiResponseDto, GetAllCategoriesApiResponseDto } from "../dto/categories.dto";

export function CreateCategory() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new category' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Category created successfully',
            type: CategoryApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Insufficient permissions',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function GetCategoryById() {
    return applyDecorators(
        ApiOperation({ summary: 'Get category by ID' }),
        ApiParam({
            name: 'id',
            description: 'Category ID',
            type: String,
            required: true
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Category fetched successfully',
            type: CategoryApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Category not found',
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Insufficient permissions',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function GetAllCategories() {
    return applyDecorators(
        ApiOperation({ summary: 'Get all categories' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Categories fetched successfully',
            type: GetAllCategoriesApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Insufficient permissions',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function UpdateCategory() {
    return applyDecorators(
        ApiOperation({ summary: 'Update category by ID' }),
        ApiParam({
            name: 'id',
            description: 'Category ID',
            type: String,
            required: true
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Category updated successfully',
            type: CategoryApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Category not found',
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Insufficient permissions',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function DeleteCategory() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete category by ID' }),
        ApiParam({
            name: 'id',
            description: 'Category ID',
            type: String,
            required: true
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Category deleted successfully',
            type: CategoryApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Category not found',
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Insufficient permissions',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}
