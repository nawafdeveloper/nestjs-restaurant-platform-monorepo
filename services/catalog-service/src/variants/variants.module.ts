import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './variant.entity';
import { VariantOption } from './variant-option.entity';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductVariant, VariantOption])],
    controllers: [VariantsController],
    providers: [VariantsService],
    exports: [VariantsService],
})
export class VariantsModule { }