import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private otpRepo: Repository<Otp>,
    ) { }

    async generate(phone: string): Promise<string> {
        // في الـ production راح نستخدم SMS provider
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await this.otpRepo.save({ phone, code, expiresAt });

        console.log(`OTP for ${phone}: ${code}`); // مؤقت للتطوير
        return code;
    }

    async verify(phone: string, code: string): Promise<boolean> {
        const otp = await this.otpRepo.findOne({
            where: { phone, code, isUsed: false },
            order: { createdAt: 'DESC' },
        });

        if (!otp) throw new BadRequestException('Invalid OTP');
        if (new Date() > otp.expiresAt) throw new BadRequestException('OTP expired');

        await this.otpRepo.update(otp.id, { isUsed: true });
        return true;
    }
}