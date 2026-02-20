import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, CreatedOrderApiResponseDto, FilterOrdersListDto, GetAllOrdersApiResponseDto, GetOrdersApiResponseDto, UpdateOrderStatusDto, UpdatedOrderApiResponseDto } from "./dto/orders.dto";
import { Request } from "express";
import { ResponseUtil } from "@common/helpers/response.utils";
import { JwtAuthGuard } from "api/auth/guard/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { CreateOrderSwagger, GetAllOrdersSwagger, GetOrderByIdSwagger, UpdateOrderStatusSwagger } from "./swagger/orders.swagger";


@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @CreateOrderSwagger()
  async createOrder(
    @Body() data: CreateOrderDto,
    @Req() req: Request,
  ): Promise<CreatedOrderApiResponseDto> {
    const user = req.user as any;
    if (!user || !user.userId) {
      throw new BadRequestException("User identification failed");
    }
    const userId = user.userId;
    const order = await this.ordersService.createOrder(data, userId);
    return ResponseUtil.success(
      order,
      "Order created successfully",
      HttpStatus.CREATED,
    );
  }

  @Patch(":id/status")
  @UpdateOrderStatusSwagger()
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
@GetAllOrdersSwagger()
async getAllOrders(@Query() filterlist:FilterOrdersListDto): Promise<GetAllOrdersApiResponseDto> {
  const orders = await this.ordersService.getAllOrders(filterlist);
  return ResponseUtil.success(
    orders,
    "Orders fetched successfully",
    HttpStatus.OK,
  );
}

 @Get(":id")
 @GetOrderByIdSwagger()
 async getOrderById(
  @Param("id") id: string,
 ): Promise<GetOrdersApiResponseDto> {
  if(!id){
    throw new BadRequestException("Order ID is required");
  }
  const order = await this.ordersService.getOrderById(id);
  return ResponseUtil.success(
    order,
    "Order fetched successfully",
    HttpStatus.OK,
  );
}

}
