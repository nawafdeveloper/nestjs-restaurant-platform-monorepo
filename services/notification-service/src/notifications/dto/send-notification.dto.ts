import { IsString, IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { NotificationChannel, NotificationEvent } from '../../templates/notification-template.entity';

export class SendNotificationDto {
    @IsString()
    recipient: string;

    @IsEnum(NotificationEvent)
    event: NotificationEvent;

    @IsEnum(NotificationChannel)
    channel: NotificationChannel;

    @IsUUID()
    @IsOptional()
    storeId?: string;

    @IsUUID()
    @IsOptional()
    customerId?: string;

    @IsString()
    @IsOptional()
    referenceId?: string;

    @IsObject()
    @IsOptional()
    variables?: Record<string, string>;
}