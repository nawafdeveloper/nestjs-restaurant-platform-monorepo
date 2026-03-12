import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCode } from './promo-code.entity';
import { PromoUsageLog } from './promo-usage.entity';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodesController } from './promo-codes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PromoCode, PromoUsageLog])],
    controllers: [PromoCodesController],
    providers: [PromoCodesService],
    exports: [PromoCodesService],
})
export class PromoCodesModule { }