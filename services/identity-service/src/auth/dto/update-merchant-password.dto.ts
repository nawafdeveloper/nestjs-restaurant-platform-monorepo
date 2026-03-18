import { IsString, MinLength } from 'class-validator';

export class UpdateMerchantPasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(8)
    newPassword: string;
}