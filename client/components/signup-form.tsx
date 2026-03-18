"use client";

import { useSignup } from '@/hooks/use-signup';
import { LoadingOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Input, Typography, Alert } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function SignupForm() {
    const { Title, Text } = Typography;
    const t = useTranslations('SignupForm');
    const {
        name,
        setName,
        phone,
        setPhone,
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        errorMsg,
        handleSignup,
        contextHolder
    } = useSignup();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
        setPhone(digitsOnly);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        await handleSignup();
    };

    return (
        <>
            {contextHolder}
            <Card className='shadow-xl! rounded-sm!'>
                <form onSubmit={onSubmit} className='flex flex-col items-center justify-center space-y-8'>
                    <span className='flex flex-col items-start justify-start'>
                        <Title className='mb-1!' level={2}>{t('title')}</Title>
                        <Text>{t('description')}</Text>
                    </span>

                    {error && (
                        <Alert
                            title={errorMsg || t('signupError')}
                            type="error"
                            showIcon
                            className="w-full mb-4!"
                        />
                    )}

                    <div className='flex flex-col space-y-3 w-full'>
                        <Input
                            placeholder={t('fullNamePlaceholder')}
                            variant="filled"
                            suffix={<UserOutlined className='text-gray-500!' />}
                            className='h-12'
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <Input
                            placeholder={t('emailPlaceholder')}
                            variant="filled"
                            suffix={<MailOutlined className='text-gray-500!' />}
                            className='h-12'
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <Input.Password
                            placeholder={t('passwordPlaceholder')}
                            variant="filled"
                            suffix={<LockOutlined className='text-gray-500!' />}
                            className='h-12'
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <Input
                            placeholder={t('phonePlaceholder')}
                            variant="filled"
                            suffix={(
                                <span className='flex items-center gap-2 pr-1'>
                                    <span className='text-gray-700'>+966</span>
                                    <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_4_7275)">
                                            <path d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z" fill="#6DA544" />
                                            <path d="M144.696 306.087C144.696 324.528 159.646 339.478 178.087 339.478H278.261C278.261 354.846 290.719 367.304 306.087 367.304H339.478C354.846 367.304 367.304 354.846 367.304 339.478V306.087H144.696Z" fill="#F0F0F0" />
                                            <path d="M370.087 144.696V222.609C370.087 234.884 360.101 244.87 347.826 244.87V278.261C378.513 278.261 403.478 253.295 403.478 222.609V144.696H370.087Z" fill="#F0F0F0" />
                                            <path d="M130.783 222.609C130.783 234.884 120.797 244.87 108.522 244.87V278.261C139.209 278.261 164.174 253.295 164.174 222.609V144.696H130.783V222.609Z" fill="#F0F0F0" />
                                            <path d="M320 144.696H353.391V222.609H320V144.696Z" fill="#F0F0F0" />
                                            <path d="M269.913 189.217C269.913 192.286 267.416 194.782 264.348 194.782C261.28 194.782 258.783 192.285 258.783 189.217V144.695H225.392V189.217C225.392 192.286 222.895 194.782 219.827 194.782C216.759 194.782 214.262 192.285 214.262 189.217V144.695H180.87V189.217C180.87 210.698 198.346 228.174 219.827 228.174C228.1 228.174 235.772 225.574 242.088 221.158C248.403 225.573 256.076 228.174 264.349 228.174C266.015 228.174 267.653 228.057 269.264 227.852C266.898 237.601 258.118 244.869 247.653 244.869V278.26C278.34 278.26 303.305 253.294 303.305 222.608V189.217V144.695H269.914V189.217H269.913Z" fill="#F0F0F0" />
                                            <path d="M180.87 244.87H230.957V278.261H180.87V244.87Z" fill="#F0F0F0" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_4_7275">
                                                <rect width="512" height="512" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                            )}
                            className='h-12'
                            inputMode="numeric"
                            maxLength={9}
                            pattern="\d{9}"
                            value={phone}
                            onChange={handlePhoneChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className='flex flex-col space-y-3 w-full'>
                        <Button
                            type="primary"
                            className='w-full h-12!'
                            htmlType="submit"
                            disabled={loading || !email || !phone || !name || !password}
                        >
                            {loading ? (
                                <>
                                    <LoadingOutlined className='animate-spin' />
                                    {t('signupButtonLoading')}
                                </>
                            ) : (
                                t('signupButton')
                            )}
                        </Button>
                        <span className='flex flex-row items-center justify-start w-full'>
                            <Text>{t('alreadyHaveAccount')}</Text>
                            <Button
                                href='/auth/login'
                                className='px-1!'
                                type="link"
                                disabled={loading}
                            >
                                {t('loginNow')}
                            </Button>
                        </span>
                    </div>
                </form>
            </Card>
        </>
    );
}