import { IsString, MinLength } from 'class-validator';

export class MerchantLoginDto {
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}