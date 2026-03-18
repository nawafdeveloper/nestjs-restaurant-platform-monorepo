import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Merchant } from '../merchants/merchant.entity';
import { Customer } from '../customers/customer.entity';
import { OtpService } from '../otp/otp.service';
import { MerchantRegisterDto } from './dto/merchant-register.dto';
import { MerchantLoginDto } from './dto/merchant-login.dto';
import { CustomerSendOtpDto, CustomerVerifyOtpDto } from './dto/customer-auth.dto';
import { CustomerStoreSession } from './entities/customer-store-session.entity';
import { UpdateMerchantProfileDto } from './dto/update-merchant-profile.dto';
import { UpdateMerchantPasswordDto } from './dto/update-merchant-password.dto';
import { UpdateMerchantOnboardingDto } from './dto/update-merchant-onboarding.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Merchant)
        private merchantRepo: Repository<Merchant>,
        @InjectRepository(Customer)
        private customerRepo: Repository<Customer>,
        @InjectRepository(CustomerStoreSession)
        private sessionRepo: Repository<CustomerStoreSession>,
        private jwtService: JwtService,
        private otpService: OtpService,
    ) { }

    // ── Merchant ──────────────────────────────────────

    async merchantRegister(dto: MerchantRegisterDto) {
        const exists = await this.merchantRepo.findOne({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already taken');

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const merchant = await this.merchantRepo.save({ ...dto, passwordHash });

        return this.signMerchant(merchant);
    }

    async merchantLogin(dto: MerchantLoginDto) {
        const merchant = await this.merchantRepo.findOne({ where: { email: dto.email } });
        if (!merchant) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, merchant.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        return this.signMerchant(merchant);
    }

    private signMerchant(merchant: Merchant) {
        const payload = { sub: merchant.id, phone: merchant.phone, role: 'merchant' };
        return {
            accessToken: this.jwtService.sign(payload),
            merchant: {
                id: merchant.id,
                name: merchant.name,
                phone: merchant.phone,
                email: merchant.email,
                isActive: merchant.isActive,
                isOnboarded: merchant.isOnboarded
            },
        };
    }

    async updateMerchantProfile(merchantId: string, dto: UpdateMerchantProfileDto) {
        const merchant = await this.merchantRepo.findOne({ where: { id: merchantId } });
        if (!merchant) throw new UnauthorizedException('Merchant not found');

        if (dto.email && dto.email !== merchant.email) {
            const exists = await this.merchantRepo.findOne({ where: { email: dto.email } });
            if (exists) throw new ConflictException('Email already taken');
        }

        await this.merchantRepo.update(merchantId, { ...dto });
        const updated = await this.merchantRepo.findOne({ where: { id: merchantId } });
        return this.signMerchant(updated!);
    }

    async updateMerchantPassword(merchantId: string, dto: UpdateMerchantPasswordDto) {
        const merchant = await this.merchantRepo.findOne({ where: { id: merchantId } });
        if (!merchant) throw new UnauthorizedException('Merchant not found');

        const valid = await bcrypt.compare(dto.currentPassword, merchant.passwordHash);
        if (!valid) throw new UnauthorizedException('Current password is incorrect');

        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.merchantRepo.update(merchantId, { passwordHash });

        return { message: 'Password updated successfully' };
    }

    async updateMerchantOnboarding(merchantId: string, dto: UpdateMerchantOnboardingDto) {
        console.log('merchantId:', merchantId);

        if (!merchantId) throw new UnauthorizedException('Merchant ID is missing');
        const merchant = await this.merchantRepo.findOne({ where: { id: merchantId } });
        if (!merchant) throw new UnauthorizedException('Merchant not found');

        await this.merchantRepo.update(merchantId, { isOnboarded: dto.isOnboarded });
        const updated = await this.merchantRepo.findOne({ where: { id: merchantId } });
        return this.signMerchant(updated!);
    }

    // ── Customer ──────────────────────────────────────

    async customerSendOtp(dto: CustomerSendOtpDto) {
        await this.otpService.generate(dto.phone);
        return { message: 'OTP sent' };
    }

    async customerVerifyOtp(dto: CustomerVerifyOtpDto) {
        await this.otpService.verify(dto.phone, dto.code);

        let customer = await this.customerRepo.findOne({ where: { phone: dto.phone } });
        if (!customer) {
            customer = await this.customerRepo.save({ phone: dto.phone });
        }

        let session = await this.sessionRepo.findOne({
            where: { customerId: customer.id, storeId: dto.storeId },
        });
        if (!session) {
            session = await this.sessionRepo.save({ customerId: customer.id, storeId: dto.storeId });
        }

        const payload = {
            sub: customer.id,
            phone: customer.phone,
            storeId: dto.storeId,
            sessionId: session.id,
            role: 'customer',
        };

        return {
            accessToken: this.jwtService.sign(payload),
            customer: { id: customer.id, phone: customer.phone },
        };
    }
}