import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Order } from './order.entity';
import { OrderStatusLog } from './order-status-log.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { OrderItemModifier } from '../order-items/order-item-modifier.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderStatusLog, OrderItem, OrderItemModifier]),
        HttpModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }