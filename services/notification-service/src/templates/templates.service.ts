import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    NotificationTemplate,
    NotificationChannel,
    NotificationEvent,
} from './notification-template.entity';

@Injectable()
export class TemplatesService {
    constructor(
        @InjectRepository(NotificationTemplate)
        private templateRepo: Repository<NotificationTemplate>,
    ) { }

    async getTemplate(
        event: NotificationEvent,
        channel: NotificationChannel,
        storeId?: string,
    ): Promise<NotificationTemplate | null> {
        // ابحث عن template مخصص للمتجر أولاً
        if (storeId) {
            const storeTemplate = await this.templateRepo.findOne({
                where: { event, channel, storeId, isActive: true },
            });
            if (storeTemplate) return storeTemplate;
        }

        // ارجع للـ default template
        return this.templateRepo.findOne({
            where: { event, channel, isActive: true },
        });
    }

    renderTemplate(template: string, variables: Record<string, string>): string {
        return Object.entries(variables).reduce(
            (text, [key, value]) => text.replace(new RegExp(`{{${key}}}`, 'g'), value),
            template,
        );
    }

    async seedDefaultTemplates(): Promise<void> {
        const defaults = [
            {
                event: NotificationEvent.ORDER_CONFIRMED,
                channel: NotificationChannel.SMS,
                bodyAr: 'تم تأكيد طلبك رقم {{orderId}} بنجاح. المجموع: {{total}} ريال',
                bodyEn: 'Your order #{{orderId}} has been confirmed. Total: {{total}} SAR',
            },
            {
                event: NotificationEvent.ORDER_PREPARING,
                channel: NotificationChannel.SMS,
                bodyAr: 'طلبك رقم {{orderId}} قيد التحضير الآن',
                bodyEn: 'Your order #{{orderId}} is being prepared',
            },
            {
                event: NotificationEvent.ORDER_READY,
                channel: NotificationChannel.SMS,
                bodyAr: 'طلبك رقم {{orderId}} جاهز للاستلام',
                bodyEn: 'Your order #{{orderId}} is ready for pickup',
            },
            {
                event: NotificationEvent.ORDER_DELIVERED,
                channel: NotificationChannel.SMS,
                bodyAr: 'تم تسليم طلبك رقم {{orderId}} بنجاح. شكراً لك',
                bodyEn: 'Your order #{{orderId}} has been delivered. Thank you!',
            },
            {
                event: NotificationEvent.ORDER_CANCELLED,
                channel: NotificationChannel.SMS,
                bodyAr: 'تم إلغاء طلبك رقم {{orderId}}',
                bodyEn: 'Your order #{{orderId}} has been cancelled',
            },
            {
                event: NotificationEvent.OTP,
                channel: NotificationChannel.SMS,
                bodyAr: 'رمز التحقق الخاص بك هو: {{code}} صالح لمدة 5 دقائق',
                bodyEn: 'Your verification code is: {{code}} Valid for 5 minutes',
            },
        ];

        for (const template of defaults) {
            const exists = await this.templateRepo.findOne({
                where: {
                    event: template.event,
                    channel: template.channel,
                },
            });
            if (!exists) {
                await this.templateRepo.save(template);
            }
        }
    }
}