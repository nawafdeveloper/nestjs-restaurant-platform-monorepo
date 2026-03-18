'use client';

import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import { getStoreDetails, updateStoreDetails } from '@/app/[locale]/app/store-settings/actions';

type StoreForm = {
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    phone: string;
    logoUrl: string;
};

export const useModifyStoreData = () => {
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('StoreSettings');

    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    const [form, setForm] = useState<StoreForm>({
        name: '',
        nameAr: '',
        slug: '',
        description: '',
        descriptionAr: '',
        phone: '',
        logoUrl: '',
    });

    // ─── جلب البيانات ────────────────────────────────────────
    useEffect(() => {
        const fetch = async () => {
            setFetchLoading(true);

            const result = await getStoreDetails();

            if (!result.success) {
                api.error({
                    message: t('errorTitle'),
                    description: t('fetchError'),
                });
                setFetchLoading(false);
                return;
            }

            const s = result.store;
            setForm({
                name: s.name ?? '',
                nameAr: s.nameAr ?? '',
                slug: s.slug ?? '',
                description: s.description ?? '',
                descriptionAr: s.descriptionAr ?? '',
                phone: s.phone ?? '',
                logoUrl: s.logoUrl ?? '',
            });

            setFetchLoading(false);
        };

        fetch();
    }, []);

    // ─── تحديث حقل واحد ──────────────────────────────────────
    const updateField = (field: keyof StoreForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // ─── حفظ التعديلات ───────────────────────────────────────
    const handleSave = async () => {
        setSaveLoading(true);

        const result = await updateStoreDetails({
            name: form.name,
            nameAr: form.nameAr,
            slug: form.slug,
            description: form.description,
            descriptionAr: form.descriptionAr,
            phone: form.phone,
            logoUrl: form.logoUrl || undefined,
        });

        if (!result.success) {
            const msg = result.error === 'SLUG_TAKEN'
                ? t('slugTaken')
                : result.message ?? t('saveError');

            api.error({ message: t('errorTitle'), description: msg });
            setSaveLoading(false);
            return;
        }

        api.success({ message: t('successTitle'), description: t('saveSuccess') });
        setSaveLoading(false);
    };

    return {
        form,
        updateField,
        fetchLoading,
        saveLoading,
        handleSave,
        contextHolder,
    };
};