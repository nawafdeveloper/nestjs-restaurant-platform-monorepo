import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
    constructor(
        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,
    ) { }

    async create(storeId: string, dto: CreateBranchDto): Promise<Branch> {
        return this.branchRepo.save({ ...dto, storeId });
    }

    async findByStore(storeId: string): Promise<Branch[]> {
        return this.branchRepo.find({ where: { storeId, isActive: true } });
    }

    async findOne(id: string, storeId: string): Promise<Branch> {
        const branch = await this.branchRepo.findOne({ where: { id, storeId } });
        if (!branch) throw new NotFoundException('Branch not found');
        return branch;
    }

    async update(id: string, storeId: string, dto: UpdateBranchDto): Promise<Branch> {
        const branch = await this.findOne(id, storeId);
        Object.assign(branch, dto);
        return this.branchRepo.save(branch);
    }

    async remove(id: string, storeId: string): Promise<void> {
        await this.findOne(id, storeId);
        await this.branchRepo.update(id, { isActive: false });
    }
}