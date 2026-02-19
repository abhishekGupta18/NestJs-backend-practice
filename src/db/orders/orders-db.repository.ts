import { DBService } from "@db/db.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { CreatedOrderResponseDto, CreateOrderDto, GetOrderResponseDto, UpdatedOrderResponseDto, UpdateOrderStatusDto } from "api/orders/dto/orders.dto";

@Injectable()
export class OrdersDBRepository {
  constructor(private readonly db: DBService) {}

  async createOrder(
    data: CreateOrderDto,
    userId: string,
  ): Promise<CreatedOrderResponseDto> {
    return await this.db.$transaction(async (tx) => {
      let total_price_cent = 0;
      const orderItemsToCreate = [];

      // 1. Validate all products and calculate total price
      for (const item of data.orderItems) {
        const product = await tx.products.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.product_name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          );
        }

        total_price_cent += product.price_cent * item.quantity;
        orderItemsToCreate.push({
          product_id: item.productId,
          quantity: item.quantity,
          price_at_purchase: product.price_cent,
        });
      }

      // 2. Create the order
      const order = await tx.orders.create({
        data: {
          user_id: userId,
          total_price_cent: total_price_cent,
        },
      });

      // 3. Update stock and create order items
      for (const item of orderItemsToCreate) {
        await tx.products.update({
          where: { id: item.product_id },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.order_items.create({
          data: {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
          },
        });
      }

      // 4. Map and return the response
      return {
        orderId: order.id,
        userId: order.user_id,
        orderDate: order.created_at.toString(),
        total_amount_cents: order.total_price_cent,
        orderStatus: order.order_status,
        orderItems: data.orderItems,
      };
    });
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<UpdatedOrderResponseDto> {
    const updateOrderStatus = await this.db.orders.update({
      where: { id: id },
      data: {
        order_status: data.orderStatus as unknown as OrderStatus,
      },
    });

    return {
      orderId: updateOrderStatus.id,
      orderStatus: updateOrderStatus.order_status,

    };
  }

  async getAllOrders(): Promise<GetOrderResponseDto[]> {
    const orders = await this.db.orders.findMany({
      include: {
        order_items: true,
      },
    });

    return orders.map((order) => ({
      orderId: order.id,
      userId: order.user_id,
      orderDate: order.created_at.toISOString(),
      total_amount_cents: order.total_price_cent,
      orderStatus: order.order_status,
      orderItems: order.order_items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
    }));
  }


async getOrderById(id:string):Promise<GetOrderResponseDto>{
  const order = await this.db.orders.findUnique({
    where: { id: id },
    include: {
      order_items: true,
    },
  });

  const orderItems = await Promise.all(order.order_items.map(async (item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      productName: (await this.db.products.findUnique({ where: { id: item.product_id } }))?.product_name,
    })));


  return {
    orderId: order.id,
    userId: order.user_id,
    orderDate: order.created_at.toISOString(),
    total_amount_cents: order.total_price_cent,
    orderStatus: order.order_status,
    orderItems: orderItems,
  };
}

}
