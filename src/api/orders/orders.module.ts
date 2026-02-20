import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controllers';
import { OrdersService } from './orders.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports:[EventEmitterModule.forRoot()],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}