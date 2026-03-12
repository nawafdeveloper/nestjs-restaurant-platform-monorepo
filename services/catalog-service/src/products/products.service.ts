import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    async create(storeId: string, dto: CreateProductDto): Promise<Product> {
        return this.productRepo.save({ ...dto, storeId });
    }

    async findByStore(storeId: string): Promise<Product[]> {
        return this.productRepo.find({
            where: { storeId, isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async findByCategory(storeId: string, categoryId: string): Promise<Product[]> {
        return this.productRepo.find({
            where: { storeId, categoryId, isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async findOne(id: string, storeId: string): Promise<Product> {
        const product = await this.productRepo.findOne({ where: { id, storeId } });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(id: string, storeId: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id, storeId);
        Object.assign(product, dto);
        return this.productRepo.save(product);
    }

    async remove(id: string, storeId: string): Promise<void> {
        await this.findOne(id, storeId);
        await this.productRepo.update(id, { isActive: false });
    }
}