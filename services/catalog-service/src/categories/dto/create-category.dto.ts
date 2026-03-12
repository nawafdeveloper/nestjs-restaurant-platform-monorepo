import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}