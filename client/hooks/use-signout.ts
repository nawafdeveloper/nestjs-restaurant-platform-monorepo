'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { logoutAction } from '@/app/[locale]/app/actions';

export const useLogout = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logoutAction();
        router.push(`/auth/login`);
        router.refresh();
        setLoading(false);
    };

    return { handleLogout, loading };
};