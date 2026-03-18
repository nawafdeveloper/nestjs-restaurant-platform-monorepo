import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/app/[locale]/app/categories/actions';

export const useCategories = () => {
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('Categories');
    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [data, setData] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setFetchLoading(true);
            const result = await getCategories();
            if (!result.success) {
                api.error({ title: t('errorTitle'), description: t('fetchError') });
                setFetchLoading(false);
                return;
            }
            setData(result.categories);
            setFetchLoading(false);
        };
        fetchData();
    }, []);

    const handleCreate = async (input: CreateCategoryInput) => {
        setSaveLoading(true);
        const result = await createCategory(input);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('createError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => [...prev, result.category]);
        api.success({ title: t('successTitle'), description: t('createSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleUpdate = async (id: string, input: UpdateCategoryInput) => {
        setSaveLoading(true);
        const result = await updateCategory(id, input);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('updateError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.map((c) => c.id === id ? result.category : c));
        api.success({ title: t('successTitle'), description: t('updateSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleDelete = async (id: string) => {
        setSaveLoading(true);
        const result = await deleteCategory(id);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('deleteError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.filter((c) => c.id !== id));
        api.success({ title: t('successTitle'), description: t('deleteSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        setSaveLoading(true);
        const result = await updateCategory(id, { isActive } as any);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('updateError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.map((c) => c.id === id ? { ...c, isActive } : c));
        setSaveLoading(false);
        return true;
    };

    return {
        contextHolder,
        fetchLoading,
        saveLoading,
        data,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleToggle,
    };
};