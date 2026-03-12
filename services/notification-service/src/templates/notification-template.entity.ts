import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum NotificationChannel {
    SMS = 'sms',
    WHATSAPP = 'whatsapp',
    PUSH = 'push',
}

export enum NotificationEvent {
    ORDER_CONFIRMED = 'order_confirmed',
    ORDER_PREPARING = 'order_preparing',
    ORDER_READY = 'order_ready',
    ORDER_DELIVERED = 'order_delivered',
    ORDER_CANCELLED = 'order_cancelled',
    OTP = 'otp',
}

@Entity('notification_templates')
export class NotificationTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    storeId: string;

    @Column({ type: 'enum', enum: NotificationEvent })
    event: NotificationEvent;

    @Column({ type: 'enum', enum: NotificationChannel })
    channel: NotificationChannel;

    @Column({ type: 'text' })
    bodyAr: string;

    @Column({ type: 'text' })
    bodyEn: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}