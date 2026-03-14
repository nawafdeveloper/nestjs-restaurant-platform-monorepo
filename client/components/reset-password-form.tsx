"use client";

import { LockOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import { useTranslations } from 'next-intl';

export default function ResetPasswordForm() {
    const { Title, Text } = Typography;
    const t = useTranslations('ResetPasswordForm');

    return (
        <div className='flex flex-col items-center justify-center space-y-8'>
            <span className='flex flex-col items-start justify-start'>
                <Title className='mb-1!' level={2}>{t('title')}</Title>
                <Text>{t('description')}</Text>
            </span>
            <div className='flex flex-col space-y-3 w-full'>
                <Input.Password
                    placeholder={t('newPasswordPlaceholder')}
                    variant="filled"
                    suffix={<LockOutlined className='text-gray-500!' />}
                    className='h-12'
                />
                <Input.Password
                    placeholder={t('confirmPasswordPlaceholder')}
                    variant="filled"
                    suffix={<LockOutlined className='text-gray-500!' />}
                    className='h-12'
                />
                <Button type="primary" className='w-full h-12!'>{t('submitButton')}</Button>
            </div>
        </div>
    );
}
