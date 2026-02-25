import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CategoryApiResponseDto, GetAllCategoriesApiResponseDto } from "../dto/categories.dto";
import { 
    ApiBadRequestResponse, 
    ApiForbiddenResponse, 
    ApiInternalServerErrorResponse, 
    ApiNotFoundResponse, 
    ApiUnauthorizedResponse 
} from "@common/helpers/swagger.utils";

export function CreateCategory() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new category' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Category created successfully',
            type: CategoryApiResponseDto
        }),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
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
        ApiNotFoundResponse('Category not found'),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
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
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
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
        ApiNotFoundResponse('Category not found'),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
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
        ApiNotFoundResponse('Category not found'),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
    );
}

