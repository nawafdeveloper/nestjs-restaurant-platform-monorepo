import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

export enum PromotionType {
    STORE_WIDE = 'store_wide',
    CATEGORY = 'category',
    PRODUCT = 'product',
}

@Entity('promotions')
export class Promotion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    storeId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column({ type: 'enum', enum: DiscountType })
    discountType: DiscountType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ type: 'enum', enum: PromotionType, default: PromotionType.STORE_WIDE })
    promotionType: PromotionType;

    @Column({ nullable: true })
    targetId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    minOrderAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    maxDiscountAmount: number;

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