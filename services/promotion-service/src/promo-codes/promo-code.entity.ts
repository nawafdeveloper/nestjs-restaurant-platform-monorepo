import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DiscountType } from '../promotions/promotion.entity';

@Entity('promo_codes')
export class PromoCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    storeId: string;

    @Column({ unique: true })
    code: string;

    @Column({ type: 'enum', enum: DiscountType })
    discountType: DiscountType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    minOrderAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    maxDiscountAmount: number;

    @Column({ nullable: true })
    maxUsageCount: number;

    @Column({ default: 0 })
    usageCount: number;

    @Column({ nullable: true })
    maxUsagePerCustomer: number;

    @Column({ type: 'timestamp' })
    startsAt: Date;

    @Column({ type: 'timestamp' })
    endsAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}