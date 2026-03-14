"use client";

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
    const { Title, Text } = Typography;
    const t = useTranslations('LoginForm');

    return (
        <div className='flex flex-col items-center justify-center space-y-8'>
            <span className='flex flex-col items-start justify-start'>
                <Title className='mb-1!' level={2}>{t('title')}</Title>
                <Text>{t('description')}</Text>
            </span>
            <div className='flex flex-col space-y-3 w-full'>
                <Input
                    placeholder={t('emialPlaceholder')}
                    variant="filled"
                    suffix={<MailOutlined className='text-gray-500!' />}
                    className='h-12'
                    type={"email"}
                />
                <Input.Password
                    placeholder={t('passwordPlaceholder')}
                    variant="filled"
                    suffix={<LockOutlined className='text-gray-500!' />}
                    className='h-12'
                />
            </div>
            <span className='flex flex-row items-center justify-start w-full'>
                <Text>{t('forgetPass')}</Text>
                <Button
                    href='/auth/forget-password'
                    className='px-1!'
                    type="link"
                >
                    {t('resetPass')}
                </Button>
            </span>
            <div className='flex flex-col space-y-3 w-full'>
                <Button type="primary" className='w-full h-12!'>{t('loginButton')}</Button>
                <span className='flex flex-row items-center justify-start w-full'>
                    <Text>{t('dontHaveAccount')}</Text>
                    <Button
                        href='/auth/signup'
                        className='px-1!'
                        type="link"
                    >
                        {t('signupNow')}
                    </Button>
                </span>
            </div>
        </div>
    )
}
