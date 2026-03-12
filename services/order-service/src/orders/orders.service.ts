import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Order, OrderStatus } from './order.entity';
import { OrderStatusLog } from './order-status-log.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { OrderItemModifier } from '../order-items/order-item-modifier.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
    private readonly promotionServiceUrl: string;

    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(OrderStatusLog)
        private statusLogRepo: Repository<OrderStatusLog>,
        @InjectRepository(OrderItem)
        private orderItemRepo: Repository<OrderItem>,
        @InjectRepository(OrderItemModifier)
        private modifierRepo: Repository<OrderItemModifier>,
        private httpService: HttpService,
        private config: ConfigService,
    ) {
        this.promotionServiceUrl = this.config.get<string>(
            'PROMOTION_SERVICE_URL',
            'http://localhost:3004',
        );
    }

    async create(customerId: string, dto: CreateOrderDto): Promise<Order> {
        // احسب الـ subtotal
        let subtotal = 0;
        for (const item of dto.items) {
            let itemTotal = item.unitPrice * item.quantity;
            if (item.modifiers) {
                for (const mod of item.modifiers) {
                    itemTotal += (mod.extraPrice || 0) * item.quantity;
                }
            }
            subtotal += itemTotal;
        }

        // تحقق من الـ promo code لو موجود
        let discountAmount = 0;
        let promoCodeId: string | null = null;

        if (dto.promoCode) {
            try {
                const response = await firstValueFrom(
                    this.httpService.post(`${this.promotionServiceUrl}/api/v1/stores/${dto.storeId}/promo-codes/validate`, {
                        code: dto.promoCode,
                        storeId: dto.storeId,
                        customerId,
                        orderAmount: subtotal,
                    }),
                );
                discountAmount = response.data.data.discountAmount;
                promoCodeId = response.data.data.promoCodeId;
            } catch {
                throw new BadRequestException('Invalid or expired promo code');
            }
        }

        const total = subtotal - discountAmount;

        // أنشئ الأوردر
        const order = await this.orderRepo.save({
            storeId: dto.storeId,
            branchId: dto.branchId,
            customerId,
            subtotal,
            discountAmount,
            total,
            promoCodeId,
            promoCode: dto.promoCode,
            notes: dto.notes,
            customerAddress: dto.customerAddress,
        });

        // أنشئ الـ items
        for (const item of dto.items) {
            let itemTotal = item.unitPrice * item.quantity;
            if (item.modifiers) {
                for (const mod of item.modifiers) {
                    itemTotal += (mod.extraPrice || 0) * item.quantity;
                }
            }

            const orderItem = await this.orderItemRepo.save({
                orderId: order.id,
                productId: item.productId,
                productName: item.productName,
                productNameAr: item.productNameAr,
                variantOptionId: item.variantOptionId,
                variantOptionName: item.variantOptionName,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: itemTotal,
            });

            if (item.modifiers?.length) {
                await this.modifierRepo.save(
                    item.modifiers.map((mod) => ({
                        orderItemId: orderItem.id,
                        modifierId: mod.modifierId,
                        modifierName: mod.modifierName,
                        extraPrice: mod.extraPrice || 0,
                    })),
                );
            }
        }

        // سجّل الـ status log
        await this.statusLogRepo.save({ orderId: order.id, status: OrderStatus.PENDING });

        // طبّق الـ promo code لو استخدمناه
        if (promoCodeId && dto.promoCode) {
            try {
                await firstValueFrom(
                    this.httpService.post(`${this.promotionServiceUrl}/api/v1/promo-codes/apply`, {
                        promoCodeId,
                        customerId,
                        orderId: order.id,
                        discountAmount,
                    }),
                );
            } catch {
                // لا نوقف الأوردر لو فشل التطبيق
            }
        }

        return order;
    }

    async findByStore(storeId: string): Promise<Order[]> {
        return this.orderRepo.find({
            where: { storeId },
            order: { createdAt: 'DESC' },
        });
    }

    async findByCustomer(customerId: string, storeId: string): Promise<Order[]> {
        return this.orderRepo.find({
            where: { customerId, storeId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async findOneWithItems(id: string): Promise<any> {
        const order = await this.findOne(id);
        const items = await this.orderItemRepo.find({ where: { orderId: id } });

        const itemsWithModifiers = await Promise.all(
            items.map(async (item) => {
                const modifiers = await this.modifierRepo.find({
                    where: { orderItemId: item.id },
                });
                return { ...item, modifiers };
            }),
        );

        const statusLog = await this.statusLogRepo.find({
            where: { orderId: id },
            order: { createdAt: 'ASC' },
        });

        return { ...order, items: itemsWithModifiers, statusLog };
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
        const order = await this.findOne(id);

        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
            [OrderStatus.PREPARING]: [OrderStatus.READY],
            [OrderStatus.READY]: [OrderStatus.DELIVERED],
            [OrderStatus.DELIVERED]: [],
            [OrderStatus.CANCELLED]: [],
        };

        if (!validTransitions[order.status].includes(dto.status)) {
            throw new BadRequestException(
                `Cannot transition from ${order.status} to ${dto.status}`,
            );
        }

        await this.orderRepo.update(id, { status: dto.status });
        await this.statusLogRepo.save({ orderId: id, status: dto.status, note: dto.note });

        return this.findOne(id);
    }
}