import { Injectable } from "@nestjs/common";
import { OrdersDBRepository } from "./orders-db.repository";
import { CreatedOrderResponseDto, CreateOrderDto, GetOrderResponseDto, UpdatedOrderResponseDto, UpdateOrderStatusDto } from "api/orders/dto/orders.dto";

@Injectable()
export class OrdersDbService {
    constructor(private readonly ordersDBRepository: OrdersDBRepository) { }

    async createOrder(data: CreateOrderDto, userId: string): Promise<CreatedOrderResponseDto> {
        return await this.ordersDBRepository.createOrder(data, userId);
    }

    async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<UpdatedOrderResponseDto> {
        return await this.ordersDBRepository.updateOrderStatus(id, data);
    }
    
    async getAllOrders(): Promise<GetOrderResponseDto[]> {
        return await this.ordersDBRepository.getAllOrders();
    }

    async getOrderById(id:string):Promise<GetOrderResponseDto>{
        return await this.ordersDBRepository.getOrderById(id);
    }
}