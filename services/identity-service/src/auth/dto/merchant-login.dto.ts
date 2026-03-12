import { IsString, MinLength } from 'class-validator';

export class MerchantLoginDto {
    @IsString()
    phone: string;

    @IsString()
    @MinLength(8)
    password: string;
}