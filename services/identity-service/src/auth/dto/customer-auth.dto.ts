import { IsString } from 'class-validator';

export class CustomerSendOtpDto {
    @IsString()
    phone: string;

    @IsString()
    storeId: string;
}

export class CustomerVerifyOtpDto {
    @IsString()
    phone: string;

    @IsString()
    code: string;

    @IsString()
    storeId: string;
}