import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotion)
        private promotionRepo: Repository<Promotion>,
    ) { }

    async create(storeId: string, dto: CreatePromotionDto): Promise<Promotion> {
        return this.promotionRepo.save({ ...dto, storeId });
    }

    async findByStore(storeId: string): Promise<Promotion[]> {
        return this.promotionRepo.find({
            where: { storeId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, storeId: string): Promise<Promotion> {
        const promotion = await this.promotionRepo.findOne({ where: { id, storeId } });
        if (!promotion) throw new NotFoundException('Promotion not found');
        return promotion;
    }

    async update(id: string, storeId: string, dto: UpdatePromotionDto): Promise<Promotion> {
        const promotion = await this.findOne(id, storeId);
        Object.assign(promotion, dto);
        return this.promotionRepo.save(promotion);
    }

    async remove(id: string, storeId: string): Promise<void> {
        await this.findOne(id, storeId);
        await this.promotionRepo.update(id, { isActive: false });
    }

    async findActiveForStore(storeId: string): Promise<Promotion[]> {
        const now = new Date();
        return this.promotionRepo
            .createQueryBuilder('p')
            .where('p.storeId = :storeId', { storeId })
            .andWhere('p.isActive = true')
            .andWhere('p.startsAt <= :now', { now })
            .andWhere('p.endsAt >= :now', { now })
            .getMany();
    }
}