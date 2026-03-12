import { IsString, IsNumber, IsUUID } from 'class-validator';

export class ValidatePromoCodeDto {
    @IsString()
    code: string;

    @IsUUID()
    storeId: string;

    @IsUUID()
    customerId: string;

    @IsNumber()
    orderAmount: number;
}