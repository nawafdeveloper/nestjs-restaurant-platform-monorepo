import {
    IsString,
    IsOptional,
    IsEnum,
    IsNumber,
    IsDateString,
    IsUUID,
} from 'class-validator';
import { DiscountType, PromotionType } from '../promotion.entity';

export class CreatePromotionDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsNumber()
    discountValue: number;

    @IsEnum(PromotionType)
    @IsOptional()
    promotionType?: PromotionType;

    @IsUUID()
    @IsOptional()
    targetId?: string;

    @IsNumber()
    @IsOptional()
    minOrderAmount?: number;

    @IsNumber()
    @IsOptional()
    maxDiscountAmount?: number;

    @IsDateString()
    startsAt: string;

    @IsDateString()
    endsAt: string;
}