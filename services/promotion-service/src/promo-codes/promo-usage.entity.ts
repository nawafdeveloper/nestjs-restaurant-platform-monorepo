import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('promo_usage_log')
export class PromoUsageLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    promoCodeId: string;

    @Column()
    customerId: string;

    @Column()
    orderId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountAmount: number;

    @CreateDateColumn()
    createdAt: Date;
}