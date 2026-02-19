import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controllers';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
