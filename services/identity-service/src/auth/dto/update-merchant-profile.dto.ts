import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateMerchantProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}