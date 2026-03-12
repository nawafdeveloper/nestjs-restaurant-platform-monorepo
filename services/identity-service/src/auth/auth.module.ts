import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Merchant } from '../merchants/merchant.entity';
import { Customer } from '../customers/customer.entity';
import { OtpService } from '../otp/otp.service';
import { Otp } from '../otp/otp.entity';
import { CustomerStoreSession } from './entities/customer-store-session.entity';

@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([Merchant, Customer, CustomerStoreSession, Otp]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, OtpService],
    exports: [JwtStrategy, JwtModule],
})
export class AuthModule { }