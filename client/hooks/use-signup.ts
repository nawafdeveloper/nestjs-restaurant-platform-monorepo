'use client';

import { useState } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/app/[locale]/auth/signup/actions';
import { useMerchant } from './use-merchant';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useSignup = () => {
    const { setMerchant } = useMerchant();
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('SignupForm');
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const openNotification = (type: NotificationType, title: string, desc: string) => {
        api[type]({ title: title, description: desc });
    };

    const handleSignup = async () => {
        setError(false);
        setErrorMsg('');
        setLoading(true);

        try {
            const result = await signupAction({ name, phone, email, password });

            if (!result.success) {
                const msg = result.error === 'EMAIL_TAKEN'
                    ? t('emailTaken')
                    : t('signupErrorDescription');

                setError(true);
                setErrorMsg(msg);
                openNotification('error', t('signupErrorTitle'), msg);
                return;
            }

            setMerchant(result.merchant);
            openNotification('success', t('signupSuccessTitle'), t('signupSuccessDescription'));
            router.push('/onboarding');
            router.refresh();
        } catch {
            openNotification('error', t('signupErrorTitle'), t('signupErrorDescription'));
            setError(true);
            setErrorMsg(t('signupErrorDescription'));
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
};