import {
    IsString,
    IsOptional,
    IsEnum,
    IsNumber,
    IsDateString,
} from 'class-validator';
import { DiscountType } from '../../promotions/promotion.entity';

export class CreatePromoCodeDto {
    @IsString()
    code: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsNumber()
    discountValue: number;

    @IsNumber()
    @IsOptional()
    minOrderAmount?: number;

    @IsNumber()
    @IsOptional()
    maxDiscountAmount?: number;

    @IsNumber()
    @IsOptional()
    maxUsageCount?: number;

    @IsNumber()
    @IsOptional()
    maxUsagePerCustomer?: number;

    @IsDateString()
    startsAt: string;

    @IsDateString()
    endsAt: string;
}