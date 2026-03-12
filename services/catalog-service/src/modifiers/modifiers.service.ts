import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductModifier } from './modifier.entity';
import { CreateModifierDto } from './dto/create-modifier.dto';

@Injectable()
export class ModifiersService {
    constructor(
        @InjectRepository(ProductModifier)
        private modifierRepo: Repository<ProductModifier>,
    ) { }

    async create(productId: string, dto: CreateModifierDto): Promise<ProductModifier> {
        return this.modifierRepo.save({ ...dto, productId });
    }

    async findByProduct(productId: string): Promise<ProductModifier[]> {
        return this.modifierRepo.find({ where: { productId } });
    }

    async remove(id: string): Promise<void> {
        const modifier = await this.modifierRepo.findOne({ where: { id } });
        if (!modifier) throw new NotFoundException('Modifier not found');
        await this.modifierRepo.delete(id);
    }
}