import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { CreateProductApiResponseDto, CreateProductDto, ProductListApiResponseDto, UpdateProductApiResponseDto, UpdateProductDto } from "../dto/products.dto";
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from "@common/helpers/swagger.utils";

export function CreateProductSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new product', description: 'Create a new product with the given details' }),
        ApiBody({ type: CreateProductDto }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Product created successfully',
            type: CreateProductApiResponseDto
        }),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
    );
}

export function UpdateProductSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Update a product', description: 'Update a product with the given details' }),
        ApiBody({ type: UpdateProductDto }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Product updated successfully',
            type: UpdateProductApiResponseDto
        }),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
    );
}

export function ProductListSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Get all products', description: 'Get a list of all products with their categories' }),
        ApiQuery({ name: 'search', required: false, type: String, description: 'Search products by name' }),
        ApiQuery({ 
            name: 'category_id', 
            required: false, 
            type: [String], 
            description: 'Filter by category ID(s). Supports multiple values (?category_id=uuid1&category_id=uuid2), single value (?category_id=uuid1), or stringified JSON array (?category_id=["uuid1"]).' 
        }),
        ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 }),
        ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Products fetched successfully',
            type: ProductListApiResponseDto
        }),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiForbiddenResponse('Forbidden - Insufficient permissions'),
        ApiInternalServerErrorResponse()
    );
}

