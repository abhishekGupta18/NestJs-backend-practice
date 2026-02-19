import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, CreatedOrderApiResponseDto, GetAllOrdersApiResponseDto, GetOrdersApiResponseDto, UpdateOrderStatusDto, UpdatedOrderApiResponseDto } from "./dto/orders.dto";
import { Request } from "express";
import { ResponseUtil } from "@common/helpers/response.utils";
import { JwtAuthGuard } from "api/auth/guard/jwt-auth.guard";


@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() data: CreateOrderDto,
    @Req() req: Request,
  ): Promise<CreatedOrderApiResponseDto> {
    const userId = (req.user as any).userId;
    const order = await this.ordersService.createOrder(data, userId);
    return ResponseUtil.success(
      order,
      "Order created successfully",
      HttpStatus.CREATED,
    );
  }

  @Patch(":id/status")
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() data: UpdateOrderStatusDto,
  ): Promise<UpdatedOrderApiResponseDto> {
    const order = await this.ordersService.updateOrderStatus(id, data);
    return ResponseUtil.success(
      order,
      "Order status updated successfully",
      HttpStatus.OK,
    );
  }

@Get()
async getAllOrders(): Promise<GetAllOrdersApiResponseDto> {
  const orders = await this.ordersService.getAllOrders();
  return ResponseUtil.success(
    orders,
    "Orders fetched successfully",
    HttpStatus.OK,
  );
}

 @Get(":id")
 async getOrderById(
  @Param("id") id: string,
 ): Promise<GetOrdersApiResponseDto> {
  const order = await this.ordersService.getOrderById(id);
  return ResponseUtil.success(
    order,
    "Order fetched successfully",
    HttpStatus.OK,
  );
}

}
