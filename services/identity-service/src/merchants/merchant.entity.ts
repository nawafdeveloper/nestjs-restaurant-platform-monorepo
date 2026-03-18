import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('merchants')
export class Merchant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    passwordHash: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({default: false})
    isOnboarded: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}