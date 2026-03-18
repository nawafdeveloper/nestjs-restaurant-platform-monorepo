import { getBranches, createBranch, updateBranch, deleteBranch } from "@/app/[locale]/app/branches/actions";
import { Branch, CreateBranchInput, UpdateBranchInput } from "@/types";
import { notification } from "antd";
import { useTranslations } from "next-intl";
import { useState, useEffect } from 'react';

export const useBranches = () => {
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('Branches');
    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [data, setData] = useState<Branch[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setFetchLoading(true);
            const result = await getBranches();
            if (!result.success) {
                api.error({
                    title: t('errorTitle'),
                    description: t('fetchError'),
                });
                setFetchLoading(false);
                return;
            }
            setData(result.branches);
            setFetchLoading(false);
        };
        fetchData();
    }, []);

    const handleCreate = async (input: CreateBranchInput) => {
        setSaveLoading(true);
        const result = await createBranch(input);
        if (!result.success) {
            api.error({
                title: t('errorTitle'),
                description: t('createError'),
            });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => [...prev, result.branch]);
        api.success({
            title: t('successTitle'),
            description: t('createSuccess'),
        });
        setSaveLoading(false);
        return true;
    };

    const handleUpdate = async (id: string, input: UpdateBranchInput) => {
        setSaveLoading(true);
        const result = await updateBranch(id, input);
        if (!result.success) {
            api.error({
                title: t('errorTitle'),
                description: t('updateError'),
            });
            setSaveLoading(false);
            return false;
        }
        setData((prev) =>
            prev.map((b) => b.id === id ? result.branch : b)
        );
        api.success({
            title: t('successTitle'),
            description: t('updateSuccess'),
        });
        setSaveLoading(false);
        return true;
    };

    const handleDelete = async (id: string) => {
        setSaveLoading(true);
        const result = await deleteBranch(id);
        if (!result.success) {
            api.error({
                title: t('errorTitle'),
                description: t('deleteError'),
            });
            setSaveLoading(false);
            return false;
        }
        setData((prev) => prev.filter((b) => b.id !== id));
        api.success({
            title: t('successTitle'),
            description: t('deleteSuccess'),
        });
        setSaveLoading(false);
        return true;
    };

    return {
        contextHolder,
        fetchLoading,
        saveLoading,
        data,
        setData,
        handleCreate,
        handleUpdate,
        handleDelete,
    }
};