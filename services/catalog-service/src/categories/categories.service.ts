import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) { }

    async create(storeId: string, dto: CreateCategoryDto): Promise<Category> {
        return this.categoryRepo.save({ ...dto, storeId });
    }

    async findByStore(storeId: string): Promise<Category[]> {
        return this.categoryRepo.find({
            where: { storeId, isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async findOne(id: string, storeId: string): Promise<Category> {
        const category = await this.categoryRepo.findOne({ where: { id, storeId } });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async update(id: string, storeId: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id, storeId);
        Object.assign(category, dto);
        return this.categoryRepo.save(category);
    }

    async remove(id: string, storeId: string): Promise<void> {
        await this.findOne(id, storeId);
        await this.categoryRepo.update(id, { isActive: false });
    }
}