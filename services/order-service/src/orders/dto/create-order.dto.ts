import {
    IsString,
    IsOptional,
    IsUUID,
    IsArray,
    IsNumber,
    ValidateNested,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemModifierDto {
    @IsUUID()
    modifierId: string;

    @IsString()
    modifierName: string;

    @IsNumber()
    @IsOptional()
    extraPrice?: number;
}

export class OrderItemDto {
    @IsUUID()
    productId: string;

    @IsString()
    productName: string;

    @IsString()
    @IsOptional()
    productNameAr?: string;

    @IsUUID()
    @IsOptional()
    variantOptionId?: string;

    @IsString()
    @IsOptional()
    variantOptionName?: string;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => OrderItemModifierDto)
    modifiers?: OrderItemModifierDto[];
}

export class CreateOrderDto {
    @IsUUID()
    storeId: string;

    @IsUUID()
    branchId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsString()
    @IsOptional()
    promoCode?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    customerAddress?: string;
}