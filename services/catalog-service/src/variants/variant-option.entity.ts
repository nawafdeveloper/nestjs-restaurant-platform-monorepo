import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('variant_options')
export class VariantOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    variantId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    extraPrice: number;

    @Column({ default: true })
    isAvailable: boolean;

    @Column({ default: 0 })
    sortOrder: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}