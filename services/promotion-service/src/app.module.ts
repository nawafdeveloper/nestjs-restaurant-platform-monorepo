import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { PromotionsModule } from './promotions/promotions.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { JwtStrategy } from './jwt.strategy';
import { Promotion } from './promotions/promotion.entity';
import { PromoCode } from './promo-codes/promo-code.entity';
import { PromoUsageLog } from './promo-codes/promo-usage.entity';

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
        entities: [Promotion, PromoCode, PromoUsageLog],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),
    PassportModule,
    PromotionsModule,
    PromoCodesModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule { }