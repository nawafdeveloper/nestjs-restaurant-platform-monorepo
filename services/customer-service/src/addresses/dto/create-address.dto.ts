import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
    @IsString()
    label: string;

    @IsString()
    address: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    district?: string;

    @IsString()
    @IsOptional()
    latitude?: string;

    @IsString()
    @IsOptional()
    longitude?: string;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}