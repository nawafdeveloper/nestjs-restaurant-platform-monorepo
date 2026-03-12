import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateVariantDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsBoolean()
    @IsOptional()
    isRequired?: boolean;

    @IsBoolean()
    @IsOptional()
    allowMultiple?: boolean;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}