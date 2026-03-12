import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MerchantRegisterDto } from './dto/merchant-register.dto';
import { MerchantLoginDto } from './dto/merchant-login.dto';
import { CustomerSendOtpDto, CustomerVerifyOtpDto } from './dto/customer-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('merchant/register')
    @ApiOperation({ summary: 'Register a new merchant' })
    merchantRegister(@Body() dto: MerchantRegisterDto) {
        return this.authService.merchantRegister(dto);
    }

    @ApiOperation({ summary: 'Merchant login' })
    @Post('merchant/login')
    merchantLogin(@Body() dto: MerchantLoginDto) {
        return this.authService.merchantLogin(dto);
    }

    @Post('customer/send-otp')
    @ApiOperation({ summary: 'Send OTP to customer phone' })
    customerSendOtp(@Body() dto: CustomerSendOtpDto) {
        return this.authService.customerSendOtp(dto);
    }

    @Post('customer/verify-otp')
    @ApiOperation({ summary: 'Verify OTP and get token' })
    customerVerifyOtp(@Body() dto: CustomerVerifyOtpDto) {
        return this.authService.customerVerifyOtp(dto);
    }
}