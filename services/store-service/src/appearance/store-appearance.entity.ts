import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('store_appearances')
export class StoreAppearance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    storeId: string;

    @Column({ nullable: true })
    primaryColor: string;

    @Column({ nullable: true })
    secondaryColor: string;

    @Column({ nullable: true })
    bannerUrl: string;

    @Column({ type: 'jsonb', nullable: true })
    layout: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}