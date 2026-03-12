import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { OrdersModule } from './orders/orders.module';
import { JwtStrategy } from './jwt.strategy';
import { Order } from './orders/order.entity';
import { OrderStatusLog } from './orders/order-status-log.entity';
import { OrderItem } from './order-items/order-item.entity';
import { OrderItemModifier } from './order-items/order-item-modifier.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Order, OrderStatusLog, OrderItem, OrderItemModifier],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),
    PassportModule,
    OrdersModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule { }