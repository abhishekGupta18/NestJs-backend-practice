import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { CreateProductApiResponseDto, CreateProductDto, ProductListApiResponseDto, UpdateProductApiResponseDto, UpdateProductDto } from "../dto/products.dto";

export function CreateProductSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new product', description: 'Create a new product with the given details' }),
        ApiBody({ type: CreateProductDto }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Product created successfully',
            type: CreateProductApiResponseDto
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

export function UpdateProductSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Update a product', description: 'Update a product with the given details' }),
        ApiBody({ type: UpdateProductDto }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Product updated successfully',
            type: UpdateProductApiResponseDto
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
