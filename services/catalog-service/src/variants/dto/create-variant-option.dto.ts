import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVariantOptionDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsNumber()
    @IsOptional()
    extraPrice?: number;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}