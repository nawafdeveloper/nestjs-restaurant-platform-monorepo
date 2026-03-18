import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import type { Product, Category, CreateProductInput, UpdateProductInput } from '@/types';
import { createProduct, deleteProduct, getProducts, updateProduct } from '@/app/[locale]/app/products/actions';
import { getCategories } from '@/app/[locale]/app/categories/actions';

export const useProducts = () => {
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('Products');
    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [data, setData] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setFetchLoading(true);
            const [productsResult, categoriesResult] = await Promise.all([
                getProducts(),
                getCategories(),
            ]);

            if (!productsResult.success) {
                api.error({ title: t('errorTitle'), description: t('fetchError') });
                setFetchLoading(false);
                return;
            }

            if (categoriesResult.success) {
                setCategories(categoriesResult.categories);
            }

            setData(productsResult.products);
            setFetchLoading(false);
        };
        fetchData();
    }, []);

    const handleCreate = async (input: CreateProductInput) => {
        setSaveLoading(true);
        const result = await createProduct(input);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('createError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => [...prev, result.product]);
        api.success({ title: t('successTitle'), description: t('createSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleUpdate = async (id: string, input: UpdateProductInput) => {
        setSaveLoading(true);
        const result = await updateProduct(id, input);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('updateError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.map((p) => p.id === id ? result.product : p));
        api.success({ title: t('successTitle'), description: t('updateSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleDelete = async (id: string) => {
        setSaveLoading(true);
        const result = await deleteProduct(id);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('deleteError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.filter((p) => p.id !== id));
        api.success({ title: t('successTitle'), description: t('deleteSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        setSaveLoading(true);
        const result = await updateProduct(id, { isActive } as any);
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('updateError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.map((p) => p.id === id ? { ...p, isActive } : p));
        setSaveLoading(false);
        return true;
    };

    const handleToggleAvailable = async (id: string, isAvailable: boolean) => {
        setSaveLoading(true);
        const result = await updateProduct(id, { isAvailable });
        if (!result.success) {
            api.error({ title: t('errorTitle'), description: t('updateError') });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.map((p) => p.id === id ? { ...p, isAvailable } : p));
        setSaveLoading(false);
        return true;
    };

    return {
        contextHolder,
        fetchLoading,
        saveLoading,
        data,
        categories,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleToggleActive,
        handleToggleAvailable,
    };
};