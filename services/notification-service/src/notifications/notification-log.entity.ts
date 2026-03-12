import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { NotificationChannel, NotificationEvent } from '../templates/notification-template.entity';

export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
}

@Entity('notification_log')
export class NotificationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    storeId: string;

    @Column({ nullable: true })
    customerId: string;

    @Column()
    recipient: string;

    @Column({ type: 'enum', enum: NotificationEvent })
    event: NotificationEvent;

    @Column({ type: 'enum', enum: NotificationChannel })
    channel: NotificationChannel;

    @Column({ type: 'text' })
    body: string;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
    })
    status: NotificationStatus;

    @Column({ nullable: true })
    errorMessage: string;

    @Column({ nullable: true })
    referenceId: string;

    @CreateDateColumn()
    createdAt: Date;
}