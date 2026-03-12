import { IsString, IsOptional, IsNumber, IsUrl, IsUUID } from 'class-validator';

export class CreateProductDto {
    @IsUUID()
    categoryId: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    descriptionAr?: string;

    @IsNumber()
    basePrice: number;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}