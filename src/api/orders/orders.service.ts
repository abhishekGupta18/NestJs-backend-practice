import { BadRequestException, Injectable } from "@nestjs/common";
import { OrdersDbService } from "db/orders/orders-db.service";
import { CreatedOrderResponseDto, CreateOrderDto, FilterOrdersListDto, GetOrderResponseDto, UpdatedOrderResponseDto, UpdateOrderStatusDto } from "./dto/orders.dto";


@Injectable()
export class OrdersService{
    
    constructor(private readonly ordersDBService:OrdersDbService) {}

    async createOrder(data: CreateOrderDto, userId: string): Promise<CreatedOrderResponseDto> {

        if(!userId){
            throw new BadRequestException("User ID is required");
        }

        return await this.ordersDBService.createOrder(data, userId);
    }

    async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<UpdatedOrderResponseDto> {
        return await this.ordersDBService.updateOrderStatus(id, data);
    }

    async getAllOrders(filterlist:FilterOrdersListDto): Promise<GetOrderResponseDto[]> {
        return await this.ordersDBService.getAllOrders(filterlist);
    }

    async getOrderById(id:string):Promise<GetOrderResponseDto>{
        return await this.ordersDBService.getOrderById(id);
    }
}