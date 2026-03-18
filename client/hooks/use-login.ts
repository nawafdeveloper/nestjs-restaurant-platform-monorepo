'use client';

import { useState } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/[locale]/auth/login/actions';
import { useMerchant } from './use-merchant';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useLogin = () => {
    const { setMerchant } = useMerchant();
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('LoginForm');
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const openNotification = (type: NotificationType, title: string, desc: string) => {
        api[type]({ title: title, description: desc });
    };

    const handleLogin = async () => {
        setError(false);
        setErrorMsg('');
        setLoading(true);

        try {
            const result = await loginAction({ email, password });

            if (!result.success) {
                const msg = result.error === 'INVALID_CREDENTIALS'
                    ? t('invalidCredentials')
                    : t('loginErrorDescription');

                setError(true);
                setErrorMsg(msg);
                openNotification('error', t('loginErrorTitle'), msg);
                return;
            }

            setMerchant(result.merchant);
            openNotification('success', t('loginSuccessTitle'), t('loginSuccessDescription'));
            router.push('/app');
            router.refresh();
        } catch {
            openNotification('error', t('loginErrorTitle'), t('loginErrorDescription'));
            setError(true);
            setErrorMsg(t('loginErrorDescription'));
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        errorMsg,
        handleLogin,
        contextHolder,
    };
};