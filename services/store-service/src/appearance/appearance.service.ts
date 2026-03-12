import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreAppearance } from './store-appearance.entity';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';

@Injectable()
export class AppearanceService {
    constructor(
        @InjectRepository(StoreAppearance)
        private appearanceRepo: Repository<StoreAppearance>,
    ) { }

    async update(storeId: string, dto: UpdateAppearanceDto): Promise<StoreAppearance> {
        let appearance = await this.appearanceRepo.findOne({ where: { storeId } });

        if (!appearance) {
            appearance = await this.appearanceRepo.save({ storeId, ...dto });
        } else {
            Object.assign(appearance, dto);
            appearance = await this.appearanceRepo.save(appearance);
        }

        return appearance;
    }

    async findByStore(storeId: string): Promise<StoreAppearance> {
        return this.appearanceRepo.findOne({ where: { storeId } });
    }
}