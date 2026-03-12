import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CustomerStoreProfile } from './customer-store-profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class CustomersService {
    private readonly identityServiceUrl: string;
    private readonly orderServiceUrl: string;

    constructor(
        @InjectRepository(CustomerStoreProfile)
        private profileRepo: Repository<CustomerStoreProfile>,
        private httpService: HttpService,
        private config: ConfigService,
    ) {
        this.identityServiceUrl = this.config.get<string>(
            'IDENTITY_SERVICE_URL',
            'http://localhost:3001',
        );
        this.orderServiceUrl = this.config.get<string>(
            'ORDER_SERVICE_URL',
            'http://localhost:3005',
        );
    }

    async getOrCreateProfile(customerId: string, storeId: string): Promise<CustomerStoreProfile> {
        let profile = await this.profileRepo.findOne({
            where: { customerId, storeId },
        });

        if (!profile) {
            profile = await this.profileRepo.save({ customerId, storeId });
        }

        return profile;
    }

    async updateProfile(
        customerId: string,
        storeId: string,
        dto: UpdateProfileDto,
    ): Promise<CustomerStoreProfile> {
        const profile = await this.getOrCreateProfile(customerId, storeId);
        Object.assign(profile, dto);
        return this.profileRepo.save(profile);
    }

    async getStoreCustomers(storeId: string): Promise<CustomerStoreProfile[]> {
        return this.profileRepo.find({
            where: { storeId },
            order: { totalSpent: 'DESC' },
        });
    }

    async getCustomerWithOrders(customerId: string, storeId: string, token: string): Promise<any> {
        const profile = await this.getOrCreateProfile(customerId, storeId);

        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.orderServiceUrl}/api/v1/orders/my/${storeId}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                ),
            );
            return { ...profile, orders: response.data.data };
        } catch {
            return { ...profile, orders: [] };
        }
    }

    async syncOrderStats(
        customerId: string,
        storeId: string,
        orderTotal: number,
    ): Promise<void> {
        const profile = await this.getOrCreateProfile(customerId, storeId);
        await this.profileRepo.update(profile.id, {
            totalOrders: profile.totalOrders + 1,
            totalSpent: Number(profile.totalSpent) + orderTotal,
        });
    }
}