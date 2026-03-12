import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationLog, NotificationStatus } from './notification-log.entity';
import { NotificationChannel } from '../templates/notification-template.entity';
import { TemplatesService } from '../templates/templates.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectRepository(NotificationLog)
        private logRepo: Repository<NotificationLog>,
        private templatesService: TemplatesService,
    ) { }

    async send(dto: SendNotificationDto): Promise<NotificationLog> {
        const template = await this.templatesService.getTemplate(
            dto.event,
            dto.channel,
            dto.storeId,
        );

        let body = '';
        if (template) {
            body = this.templatesService.renderTemplate(
                template.bodyAr,
                dto.variables || {},
            );
        }

        const log: NotificationLog = await this.logRepo.save({
            storeId: dto.storeId,
            customerId: dto.customerId,
            recipient: dto.recipient,
            event: dto.event,
            channel: dto.channel,
            body,
            referenceId: dto.referenceId,
            status: NotificationStatus.PENDING,
        });

        try {
            await this.dispatch(dto.channel, dto.recipient, body);
            await this.logRepo.update(log.id, { status: NotificationStatus.SENT });
            log.status = NotificationStatus.SENT;
        } catch (error) {
            await this.logRepo.update(log.id, {
                status: NotificationStatus.FAILED,
                errorMessage: error.message,
            });
            log.status = NotificationStatus.FAILED;
        }

        return log;
    }

    private async dispatch(
        channel: NotificationChannel,
        recipient: string,
        body: string,
    ): Promise<void> {
        switch (channel) {
            case NotificationChannel.SMS:
                // هنا تضيف SMS provider مثل Unifonic أو Taqnyat
                this.logger.log(`[SMS] To: ${recipient} | Body: ${body}`);
                break;
            case NotificationChannel.WHATSAPP:
                // هنا تضيف WhatsApp provider
                this.logger.log(`[WhatsApp] To: ${recipient} | Body: ${body}`);
                break;
            case NotificationChannel.PUSH:
                // هنا تضيف push notification provider مثل Firebase
                this.logger.log(`[Push] To: ${recipient} | Body: ${body}`);
                break;
        }
    }

    async findByCustomer(customerId: string): Promise<NotificationLog[]> {
        return this.logRepo.find({
            where: { customerId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }

    async findByStore(storeId: string): Promise<NotificationLog[]> {
        return this.logRepo.find({
            where: { storeId },
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
}