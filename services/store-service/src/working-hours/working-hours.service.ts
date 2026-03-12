import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingHours } from './working-hours.entity';
import { SetWorkingHoursDto } from './dto/set-working-hours.dto';

@Injectable()
export class WorkingHoursService {
    constructor(
        @InjectRepository(WorkingHours)
        private workingHoursRepo: Repository<WorkingHours>,
    ) { }

    async set(branchId: string, dto: SetWorkingHoursDto): Promise<WorkingHours> {
        const existing = await this.workingHoursRepo.findOne({
            where: { branchId, day: dto.day },
        });

        if (existing) {
            Object.assign(existing, dto);
            return this.workingHoursRepo.save(existing);
        }

        return this.workingHoursRepo.save({ ...dto, branchId });
    }

    async findByBranch(branchId: string): Promise<WorkingHours[]> {
        return this.workingHoursRepo.find({ where: { branchId } });
    }
}