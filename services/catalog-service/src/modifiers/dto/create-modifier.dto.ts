import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateModifierDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    nameAr?: string;

    @IsNumber()
    @IsOptional()
    extraPrice?: number;
}