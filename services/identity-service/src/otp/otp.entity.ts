import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('otps')
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    phone: string;

    @Column()
    code: string;

    @Column({ default: false })
    isUsed: boolean;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}