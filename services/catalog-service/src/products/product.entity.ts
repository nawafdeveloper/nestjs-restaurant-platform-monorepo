import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    storeId: string;

    @Column()
    categoryId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    descriptionAr: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    basePrice: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default: 0 })
    sortOrder: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}