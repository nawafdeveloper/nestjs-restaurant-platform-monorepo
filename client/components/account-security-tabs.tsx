"use client";

import React from 'react';
import { Button, Card, ConfigProvider, Form, Input, Tabs, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Text from 'antd/es/typography/Text';
import { SaveOutlined } from '@ant-design/icons';
import { useMerchant } from '@/hooks/use-merchant';

export default function AccountSecurityTabs() {
    const { getMerchant } = useMerchant();
    const merchant = getMerchant();

    const t = useTranslations('AccountSecurity');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const onChange = () => { };

    const items = [
        {
            key: '1',
            label: t('tabs.profile'),
            children: (
                <Form
                    layout="vertical"
                    initialValues={{
                        name: merchant?.name ?? '',
                        email: merchant?.email ?? '',
                        phone: merchant?.phone ?? '',
                        isActive: merchant?.isActive ?? ''
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
                    <div className="flex justify-end gap-3">
                        <Button className='h-10! bg-[#D9E5F1]! border-0!'>{t('cancel')}</Button>
                        <Button
                            className='h-10! border-0! overflow-hidden p-0!'
                            type="primary"
                            style={{ backgroundColor: '#13B272' }}
                        >
                            <div className="flex items-center h-full">
                                <div className="h-full flex items-center justify-center px-4" style={{ backgroundColor: '#119F65' }}>
                                    <SaveOutlined />
                                </div>
                                <Text className="px-3 text-white!">{t('save')}</Text>
                            </div>
                        </Button>
                    </div>
                </Form>
            )
        },
        {
            key: '2',
            label: t('tabs.security'),
            children: (
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
                        <Button className='h-10! bg-[#D9E5F1]! border-0!'>{t('cancel')}</Button>
                        <Button
                            className='h-10! border-0! overflow-hidden p-0!'
                            type="primary"
                            style={{ backgroundColor: '#13B272' }}
                        >
                            <div className="flex items-center h-full">
                                <div className="h-full flex items-center justify-center px-4" style={{ backgroundColor: '#119F65' }}>
                                    <SaveOutlined />
                                </div>
                                <Text className="px-3 text-white!">{t('save')}</Text>
                            </div>
                        </Button>
                    </div>
                </Form>
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
                <Card className='border! border-gray-300'>
                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                </Card>
            </div>
        </ConfigProvider>
    );
}
