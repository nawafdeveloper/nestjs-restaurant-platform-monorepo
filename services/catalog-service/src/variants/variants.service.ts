import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './variant.entity';
import { VariantOption } from './variant-option.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { CreateVariantOptionDto } from './dto/create-variant-option.dto';

@Injectable()
export class VariantsService {
    constructor(
        @InjectRepository(ProductVariant)
        private variantRepo: Repository<ProductVariant>,
        @InjectRepository(VariantOption)
        private optionRepo: Repository<VariantOption>,
    ) { }

    async createVariant(productId: string, dto: CreateVariantDto): Promise<ProductVariant> {
        return this.variantRepo.save({ ...dto, productId });
    }

    async findByProduct(productId: string): Promise<ProductVariant[]> {
        return this.variantRepo.find({ where: { productId }, order: { sortOrder: 'ASC' } });
    }

    async addOption(variantId: string, dto: CreateVariantOptionDto): Promise<VariantOption> {
        return this.optionRepo.save({ ...dto, variantId });
    }

    async findOptions(variantId: string): Promise<VariantOption[]> {
        return this.optionRepo.find({ where: { variantId }, order: { sortOrder: 'ASC' } });
    }

    async removeVariant(id: string): Promise<void> {
        const variant = await this.variantRepo.findOne({ where: { id } });
        if (!variant) throw new NotFoundException('Variant not found');
        await this.variantRepo.delete(id);
    }

    async removeOption(id: string): Promise<void> {
        const option = await this.optionRepo.findOne({ where: { id } });
        if (!option) throw new NotFoundException('Option not found');
        await this.optionRepo.delete(id);
    }
}