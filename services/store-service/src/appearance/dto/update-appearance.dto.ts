import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';

export class UpdateAppearanceDto {
    @IsString()
    @IsOptional()
    primaryColor?: string;

    @IsString()
    @IsOptional()
    secondaryColor?: string;

    @IsUrl()
    @IsOptional()
    bannerUrl?: string;

    @IsObject()
    @IsOptional()
    layout?: Record<string, any>;
}