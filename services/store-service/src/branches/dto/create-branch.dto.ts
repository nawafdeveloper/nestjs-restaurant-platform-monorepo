import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBranchDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    latitude?: string;

    @IsString()
    @IsOptional()
    longitude?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}