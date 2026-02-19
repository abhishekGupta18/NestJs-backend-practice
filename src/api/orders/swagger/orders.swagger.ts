import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateOrderDto, CreatedOrderApiResponseDto, GetAllOrdersApiResponseDto, GetOrdersApiResponseDto, UpdatedOrderApiResponseDto, UpdateOrderStatusDto } from "../dto/orders.dto";

export function CreateOrderSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new order', description: 'Create a new order with multiple line items' }),
        ApiBody({ type: CreateOrderDto }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Order created successfully',
            type: CreatedOrderApiResponseDto
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
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function UpdateOrderStatusSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Update order status', description: 'Update the status of an existing order' }),
        ApiParam({ name: 'id', description: 'The unique identifier of the order' }),
        ApiBody({ type: UpdateOrderStatusDto }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Order status updated successfully',
            type: UpdatedOrderApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid status provided',
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Order not found',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function GetAllOrdersSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Get all orders', description: 'Retrieve a list of all orders' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Orders fetched successfully',
            type: GetAllOrdersApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}

export function GetOrderByIdSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Get order details', description: 'Retrieve detailed information about a specific order' }),
        ApiParam({ name: 'id', description: 'The unique identifier of the order' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Order fetched successfully',
            type: GetOrdersApiResponseDto
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Order not found',
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized - Invalid or missing JWT token',
        }),
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
    );
}
