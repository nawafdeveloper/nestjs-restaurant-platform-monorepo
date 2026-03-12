import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private storeRepo: Repository<Store>,
    ) { }

    async create(merchantId: string, dto: CreateStoreDto): Promise<Store> {
        const exists = await this.storeRepo.findOne({ where: { slug: dto.slug } });
        if (exists) throw new ConflictException('Slug already taken');

        return this.storeRepo.save({ ...dto, merchantId });
    }

    async findByMerchant(merchantId: string): Promise<Store[]> {
        return this.storeRepo.find({ where: { merchantId } });
    }

    async findOne(id: string, merchantId: string): Promise<Store> {
        const store = await this.storeRepo.findOne({ where: { id, merchantId } });
        if (!store) throw new NotFoundException('Store not found');
        return store;
    }

    async findBySlug(slug: string): Promise<Store> {
        const store = await this.storeRepo.findOne({ where: { slug, isActive: true } });
        if (!store) throw new NotFoundException('Store not found');
        return store;
    }

    async update(id: string, merchantId: string, dto: UpdateStoreDto): Promise<Store> {
        const store = await this.findOne(id, merchantId);
        Object.assign(store, dto);
        return this.storeRepo.save(store);
    }

    async remove(id: string, merchantId: string): Promise<void> {
        const store = await this.findOne(id, merchantId);
        await this.storeRepo.update(store.id, { isActive: false });
    }
}