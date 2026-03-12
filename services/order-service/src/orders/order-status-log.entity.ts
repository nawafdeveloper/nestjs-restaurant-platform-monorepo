import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order.entity';

@Entity('order_status_log')
export class OrderStatusLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderId: string;

    @Column({ type: 'enum', enum: OrderStatus })
    status: OrderStatus;

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn()
    createdAt: Date;
}