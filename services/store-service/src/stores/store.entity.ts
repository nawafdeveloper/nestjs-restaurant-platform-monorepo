import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    merchantId: string;

    @Column({ unique: true })
    slug: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    descriptionAr: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}