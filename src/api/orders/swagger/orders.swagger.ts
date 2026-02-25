import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateOrderDto, CreatedOrderApiResponseDto, GetAllOrdersApiResponseDto, GetOrdersApiResponseDto, UpdatedOrderApiResponseDto, UpdateOrderStatusDto } from "../dto/orders.dto";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from "@common/helpers/swagger.utils";

export function CreateOrderSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Create a new order', description: 'Create a new order with multiple line items' }),
        ApiBody({ type: CreateOrderDto }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Order created successfully',
            type: CreatedOrderApiResponseDto
        }),
        ApiBadRequestResponse(),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiInternalServerErrorResponse()
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
        ApiBadRequestResponse('Invalid status provided'),
        ApiNotFoundResponse('Order not found'),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiInternalServerErrorResponse()
    );
}

export function GetAllOrdersSwagger() {
    return applyDecorators(
        ApiOperation({ 
            summary: 'Get all orders', 
            description: 'Retrieve a list of all orders. Supports filtering by order status, user ID, and date range (orderStartDate and orderEndDate).' 
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Orders fetched successfully',
            type: GetAllOrdersApiResponseDto
        }),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiInternalServerErrorResponse()
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
        ApiNotFoundResponse('Order not found'),
        ApiUnauthorizedResponse('Unauthorized - Invalid or missing JWT token'),
        ApiInternalServerErrorResponse()
    );
}

