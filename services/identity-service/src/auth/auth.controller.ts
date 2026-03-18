import { Controller, Post, Body, Put, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MerchantRegisterDto } from './dto/merchant-register.dto';
import { MerchantLoginDto } from './dto/merchant-login.dto';
import { CustomerSendOtpDto, CustomerVerifyOtpDto } from './dto/customer-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateMerchantProfileDto } from './dto/update-merchant-profile.dto';
import { UpdateMerchantPasswordDto } from './dto/update-merchant-password.dto';
import { UpdateMerchantOnboardingDto } from './dto/update-merchant-onboarding.dto';
import { Request } from 'express';

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

    @Put('merchant/profile')
    @UseGuards(AuthGuard('jwt'))
    updateProfile(@Req() req: Request, @Body() dto: UpdateMerchantProfileDto) {
        const merchantId = (req.user as any)?.id;
        return this.authService.updateMerchantProfile(merchantId, dto);
    }

    @Put('merchant/password')
    @UseGuards(AuthGuard('jwt'))
    updatePassword(@Req() req: Request, @Body() dto: UpdateMerchantPasswordDto) {
        const merchantId = (req.user as any)?.id;
        return this.authService.updateMerchantPassword(merchantId, dto);
    }

    @Put('merchant/onboarding')
    @UseGuards(AuthGuard('jwt'))
    updateOnboarding(@Req() req: Request, @Body() dto: UpdateMerchantOnboardingDto) {
        const merchantId = (req.user as any)?.id;
        return this.authService.updateMerchantOnboarding(merchantId, dto);
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