"use client";

import { MailOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import { useTranslations } from 'next-intl';

export default function ForgetPasswordForm() {
    const { Title, Text } = Typography;
    const t = useTranslations('ForgetPasswordForm');

    return (
        <div className='flex flex-col items-center justify-center space-y-8'>
            <span className='flex flex-col items-start justify-start'>
                <Title className='mb-1!' level={2}>{t('title')}</Title>
                <Text>{t('description')}</Text>
            </span>
            <div className='flex flex-col space-y-3 w-full'>
                <Input
                    placeholder={t('emailPlaceholder')}
                    variant="filled"
                    suffix={<MailOutlined className='text-gray-500!' />}
                    className='h-12'
                    type="email"
                />
                <Button type="primary" className='w-full h-12!'>{t('submitButton')}</Button>
            </div>
        </div>
    );
}
