import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(CustomerAddress)
        private addressRepo: Repository<CustomerAddress>,
    ) { }

    async create(customerId: string, storeId: string, dto: CreateAddressDto): Promise<CustomerAddress> {
        if (dto.isDefault) {
            await this.addressRepo.update(
                { customerId, storeId },
                { isDefault: false },
            );
        }
        return this.addressRepo.save({ ...dto, customerId, storeId });
    }

    async findByCustomer(customerId: string, storeId: string): Promise<CustomerAddress[]> {
        return this.addressRepo.find({
            where: { customerId, storeId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: string, customerId: string): Promise<CustomerAddress> {
        const address = await this.addressRepo.findOne({ where: { id, customerId } });
        if (!address) throw new NotFoundException('Address not found');
        return address;
    }

    async update(id: string, customerId: string, storeId: string, dto: UpdateAddressDto): Promise<CustomerAddress> {
        const address = await this.findOne(id, customerId);
        if (dto.isDefault) {
            await this.addressRepo.update({ customerId, storeId }, { isDefault: false });
        }
        Object.assign(address, dto);
        return this.addressRepo.save(address);
    }

    async remove(id: string, customerId: string): Promise<void> {
        await this.findOne(id, customerId);
        await this.addressRepo.delete(id);
    }

    async setDefault(id: string, customerId: string, storeId: string): Promise<CustomerAddress> {
        await this.addressRepo.update({ customerId, storeId }, { isDefault: false });
        await this.addressRepo.update(id, { isDefault: true });
        return this.findOne(id, customerId);
    }
}