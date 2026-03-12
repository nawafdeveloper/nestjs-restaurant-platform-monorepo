import { IsString, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';

export class CreateStoreDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    descriptionAr?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsUrl()
    @IsOptional()
    logoUrl?: string;
}