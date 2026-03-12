import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { ModifiersModule } from './modifiers/modifiers.module';
import { JwtStrategy } from './jwt.strategy';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { ProductVariant } from './variants/variant.entity';
import { VariantOption } from './variants/variant-option.entity';
import { ProductModifier } from './modifiers/modifier.entity';

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
        entities: [Category, Product, ProductVariant, VariantOption, ProductModifier],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),
    PassportModule,
    CategoriesModule,
    ProductsModule,
    VariantsModule,
    ModifiersModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule { }