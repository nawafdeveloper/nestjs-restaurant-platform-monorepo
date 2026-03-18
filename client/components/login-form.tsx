"use client";

import { useLogin } from '@/hooks/use-login';
import { LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Input, Typography, Alert } from 'antd';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
    const { Title, Text } = Typography;
    const t = useTranslations('LoginForm');
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        errorMsg,
        handleLogin,
        contextHolder
    } = useLogin();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        await handleLogin();
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
                            title={errorMsg}
                            type="error"
                            showIcon
                            className="w-full mb-4!"
                        />
                    )}

                    <div className='flex flex-col space-y-3 w-full'>
                        <Input
                            placeholder={t('emialPlaceholder')}
                            variant="filled"
                            suffix={<MailOutlined className='text-gray-500!' />}
                            className='h-12'
                            type={"email"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <Input.Password
                            placeholder={t('passwordPlaceholder')}
                            variant="filled"
                            suffix={<LockOutlined className='text-gray-500!' />}
                            className='h-12'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <span className='flex flex-row items-center justify-start w-full'>
                        <Text>{t('forgetPass')}</Text>
                        <Button
                            href='/auth/forget-password'
                            className='px-1!'
                            type="link"
                            disabled={loading}
                        >
                            {t('resetPass')}
                        </Button>
                    </span>

                    <div className='flex flex-col space-y-3 w-full'>
                        <Button
                            type="primary"
                            className='w-full h-12!'
                            htmlType="submit"
                            disabled={loading || !email || !password}
                        >
                            {loading ? (
                                <>
                                    <LoadingOutlined className='animate-spin' />
                                    {t('loginButtonLoading')}
                                </>
                            ) : (
                                t('loginButton')
                            )}
                        </Button>

                        <span className='flex flex-row items-center justify-start w-full'>
                            <Text>{t('dontHaveAccount')}</Text>
                            <Button
                                href='/auth/signup'
                                className='px-1!'
                                type="link"
                                disabled={loading}
                            >
                                {t('signupNow')}
                            </Button>
                        </span>
                    </div>
                </form>
            </Card>
        </>
    )
}