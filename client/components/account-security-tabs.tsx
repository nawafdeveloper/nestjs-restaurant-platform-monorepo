"use client";

import React from 'react';
import { Button, Card, ConfigProvider, Form, Input, Switch, Tabs, Tag, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

type SessionItem = {
    id: string;
    device: string;
    ip: string;
    createdAt: string;
    isActive: boolean;
};

const sessions: SessionItem[] = [
    { id: '1', device: 'Chrome / Windows', ip: '188.45.22.11', createdAt: '2026-03-12 18:20', isActive: true },
    { id: '2', device: 'Safari / iPhone', ip: '82.18.3.90', createdAt: '2026-03-10 09:15', isActive: false }
];

export default function AccountSecurityTabs() {
    const t = useTranslations('AccountSecurity');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const onChange = () => { };

    const items = [
        {
            key: '1',
            label: t('tabs.profile'),
            children: (
                <Card>
                    <Form
                        layout="vertical"
                        initialValues={{
                            name: 'Nawaf Store',
                            email: 'owner@store.com',
                            phone: '512345678',
                            isActive: true
                        }}
                    >
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('email')} name="email">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('phone')} name="phone">
                            <Input className="h-10" prefix="+966" />
                        </Form.Item>
                        <Form.Item label={t('status')} name="isActive" valuePropName="checked">
                            <Switch checkedChildren={t('active')} unCheckedChildren={t('inactive')} />
                        </Form.Item>
                        <div className="flex justify-end gap-3">
                            <Button>{t('cancel')}</Button>
                            <Button type="primary">{t('save')}</Button>
                        </div>
                    </Form>
                </Card>
            )
        },
        {
            key: '2',
            label: t('tabs.security'),
            children: (
                <Card>
                    <Form layout="vertical">
                        <Form.Item label={t('currentPassword')} name="currentPassword">
                            <Input.Password className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('newPassword')} name="newPassword">
                            <Input.Password className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('confirmPassword')} name="confirmPassword">
                            <Input.Password className="h-10" />
                        </Form.Item>
                        <div className="flex justify-end gap-3">
                            <Button>{t('cancel')}</Button>
                            <Button type="primary">{t('updatePassword')}</Button>
                        </div>
                    </Form>
                </Card>
            )
        },
        {
            key: '3',
            label: t('tabs.sessions'),
            children: (
                <Card>
                    <div className="space-y-3">
                        {sessions.map((session, index) => (
                            <div
                                key={session.id}
                                className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
                            >
                                <div>
                                    <Typography.Text className="font-medium">{session.device}</Typography.Text>
                                    <div className="text-xs text-gray-500">{session.ip}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag color={session.isActive ? 'green' : 'default'}>
                                        {session.isActive ? t('active') : t('inactive')}
                                    </Tag>
                                    <div className="text-xs text-gray-500">{session.createdAt}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )
        }
    ];

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction} className="space-y-4">
                <div>
                    <Typography.Title level={3} className="mb-1!">
                        {t('title')}
                    </Typography.Title>
                    <Typography.Text>{t('subtitle')}</Typography.Text>
                </div>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
        </ConfigProvider>
    );
}
