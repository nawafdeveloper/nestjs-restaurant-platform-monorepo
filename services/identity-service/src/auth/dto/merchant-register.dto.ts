import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class MerchantRegisterDto {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(8)
    password: string;
}