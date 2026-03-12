import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode } from './promo-code.entity';
import { PromoUsageLog } from './promo-usage.entity';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { ValidatePromoCodeDto } from './dto/validate-promo-code.dto';
import { DiscountType } from '../promotions/promotion.entity';

@Injectable()
export class PromoCodesService {
    constructor(
        @InjectRepository(PromoCode)
        private promoCodeRepo: Repository<PromoCode>,
        @InjectRepository(PromoUsageLog)
        private usageLogRepo: Repository<PromoUsageLog>,
    ) { }

    async create(storeId: string, dto: CreatePromoCodeDto): Promise<PromoCode> {
        const exists = await this.promoCodeRepo.findOne({ where: { code: dto.code } });
        if (exists) throw new ConflictException('Promo code already exists');
        return this.promoCodeRepo.save({ ...dto, storeId });
    }

    async findByStore(storeId: string): Promise<PromoCode[]> {
        return this.promoCodeRepo.find({
            where: { storeId },
            order: { createdAt: 'DESC' },
        });
    }

    async validate(dto: ValidatePromoCodeDto): Promise<{ discountAmount: number; promoCodeId: string }> {
        const now = new Date();

        const promoCode = await this.promoCodeRepo.findOne({
            where: { code: dto.code, storeId: dto.storeId, isActive: true },
        });

        if (!promoCode) throw new NotFoundException('Promo code not found');
        if (now < promoCode.startsAt) throw new BadRequestException('Promo code not started yet');
        if (now > promoCode.endsAt) throw new BadRequestException('Promo code expired');

        if (promoCode.maxUsageCount && promoCode.usageCount >= promoCode.maxUsageCount) {
            throw new BadRequestException('Promo code usage limit reached');
        }

        if (promoCode.minOrderAmount && dto.orderAmount < promoCode.minOrderAmount) {
            throw new BadRequestException(`Minimum order amount is ${promoCode.minOrderAmount}`);
        }

        if (promoCode.maxUsagePerCustomer) {
            const customerUsage = await this.usageLogRepo.count({
                where: { promoCodeId: promoCode.id, customerId: dto.customerId },
            });
            if (customerUsage >= promoCode.maxUsagePerCustomer) {
                throw new BadRequestException('You have reached the usage limit for this promo code');
            }
        }

        let discountAmount = 0;
        if (promoCode.discountType === DiscountType.PERCENTAGE) {
            discountAmount = (dto.orderAmount * Number(promoCode.discountValue)) / 100;
            if (promoCode.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, Number(promoCode.maxDiscountAmount));
            }
        } else {
            discountAmount = Number(promoCode.discountValue);
        }

        return { discountAmount, promoCodeId: promoCode.id };
    }

    async applyCode(promoCodeId: string, customerId: string, orderId: string, discountAmount: number): Promise<void> {
        await this.promoCodeRepo.increment({ id: promoCodeId }, 'usageCount', 1);
        await this.usageLogRepo.save({ promoCodeId, customerId, orderId, discountAmount });
    }

    async remove(id: string, storeId: string): Promise<void> {
        const code = await this.promoCodeRepo.findOne({ where: { id, storeId } });
        if (!code) throw new NotFoundException('Promo code not found');
        await this.promoCodeRepo.update(id, { isActive: false });
    }
}