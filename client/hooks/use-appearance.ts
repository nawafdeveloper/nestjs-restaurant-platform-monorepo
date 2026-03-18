import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import type { StoreAppearance, UpdateAppearanceInput } from '@/types';
import { getAppearance, updateAppearance } from '@/app/[locale]/app/store-theme/actions';

export const useAppearance = () => {
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('StoreTheme');
    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [appearance, setAppearance] = useState<StoreAppearance | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setFetchLoading(true);
            const result = await getAppearance();
            if (!result.success) {
                api.error({ message: t('errorTitle'), description: t('fetchError') });
                setFetchLoading(false);
                return;
            }
            setAppearance(result.appearance);
            setFetchLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdate = async (input: UpdateAppearanceInput) => {
        setSaveLoading(true);
        const result = await updateAppearance(input);
        if (!result.success) {
            api.error({ message: t('errorTitle'), description: t('saveError') });
            setSaveLoading(false);
            return false;
        }
        setAppearance(result.appearance);
        api.success({ message: t('successTitle'), description: t('saveSuccess') });
        setSaveLoading(false);
        return true;
    };

    return {
        contextHolder,
        fetchLoading,
        saveLoading,
        appearance,
        handleUpdate,
    };
};