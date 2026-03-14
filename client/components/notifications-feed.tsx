"use client";

import React from 'react';
import { ConfigProvider, Tag, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

type NotificationItem = {
    id: string;
    recipient: string;
    event: 'order_confirmed' | 'order_preparing' | 'order_ready' | 'order_delivered' | 'order_cancelled' | 'otp';
    channel: 'sms' | 'whatsapp' | 'push';
    body: string;
    status: 'pending' | 'sent' | 'failed';
    createdAt: string;
    errorMessage?: string;
};

const items: NotificationItem[] = [
    {
        id: '1',
        recipient: '+966512345678',
        event: 'order_confirmed',
        channel: 'sms',
        body: 'Your order #1051 has been confirmed.',
        status: 'sent',
        createdAt: '2026-03-14 10:25'
    },
    {
        id: '2',
        recipient: '+966598765432',
        event: 'order_preparing',
        channel: 'whatsapp',
        body: 'We are preparing your order #1050.',
        status: 'pending',
        createdAt: '2026-03-14 10:40'
    },
    {
        id: '3',
        recipient: 'Device: 8F-22-AB',
        event: 'order_ready',
        channel: 'push',
        body: 'Order #1049 is ready for pickup.',
        status: 'failed',
        createdAt: '2026-03-14 11:05',
        errorMessage: 'Push token expired'
    }
];

export default function NotificationsFeed() {
    const t = useTranslations('Notifications');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const statusColor = (status: NotificationItem['status']) => {
        if (status === 'sent') return 'green';
        if (status === 'failed') return 'red';
        return 'gold';
    };

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction} className="space-y-4">
                <div>
                    <Typography.Title level={3} className="mb-1!">
                        {t('title')}
                    </Typography.Title>
                    <Typography.Text>{t('subtitle')}</Typography.Text>
                </div>

                <div className="flex flex-col">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="border-b border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <Typography.Text type="secondary">{t(`event.${item.event}`)}</Typography.Text>
                                    <div className="text-sm">{item.body}</div>
                                    <div className="text-xs text-gray-500">
                                        {t('recipient')}: {item.recipient}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Tag color={statusColor(item.status)}>
                                        {t(`status.${item.status}`)}
                                    </Tag>
                                    <Tag>{t(`channel.${item.channel}`)}</Tag>
                                    <div className="text-xs text-gray-500">{item.createdAt}</div>
                                </div>
                            </div>
                            {item.errorMessage && (
                                <div className="mt-3 text-xs text-red-600">
                                    {t('error')}: {item.errorMessage}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </ConfigProvider>
    );
}
