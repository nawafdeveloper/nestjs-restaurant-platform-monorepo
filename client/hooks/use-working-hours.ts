import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import { getBranches, getWorkingHours, setWorkingHours } from '@/app/[locale]/app/working-hours/actions';
import { BranchHours, DayKey, TimeSlot } from '@/types';

const ALL_DAYS: DayKey[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
];

function buildEmptyDays(): Record<DayKey, TimeSlot[]> {
    return ALL_DAYS.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {} as Record<DayKey, TimeSlot[]>);
}

export const useWorkingHours = () => {
    const [api, contextHolder] = notification.useNotification();
    const t = useTranslations('WorkingHours');
    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [branches, setBranches] = useState<BranchHours[]>([]);

    useEffect(() => {
        const fetchAll = async () => {
            setFetchLoading(true);

            // 1. جلب الفروع
            const branchesResult = await getBranches();
            if (!branchesResult.success) {
                api.error({ message: t('errorTitle'), description: t('fetchError') });
                setFetchLoading(false);
                return;
            }

            // 2. جلب ساعات العمل لكل فرع بالتوازي
            const results = await Promise.all(
                branchesResult.branches.map((branch) =>
                    getWorkingHours(branch.id).then((res) => ({ branch, res }))
                )
            );

            const mapped: BranchHours[] = results.map(({ branch, res }) => {
                const days = buildEmptyDays();
                if (res.success) {
                    res.workingHours.forEach((wh) => {
                        // الـ backend يرجع time كـ "HH:MM:SS" نقطعها لـ "HH:MM"
                        const open = wh.openTime.slice(0, 5);
                        const close = wh.closeTime.slice(0, 5);
                        days[wh.day] = [[open, close]];
                    });
                }
                return { branchId: branch.id, branchName: branch.name, days };
            });

            setBranches(mapped);
            setFetchLoading(false);
        };

        fetchAll();
    }, []);

    const handleSetHours = async (branchId: string, day: DayKey, slot: TimeSlot) => {
        setSaveLoading(true);
        const result = await setWorkingHours(branchId, {
            day,
            openTime: slot[0],
            closeTime: slot[1],
            isOpen: true,
        });
        if (!result.success) {
            api.error({ message: t('errorTitle'), description: t('saveError') });
            setSaveLoading(false);
            return false;
        }
        api.success({ message: t('successTitle'), description: t('saveSuccess') });
        setSaveLoading(false);
        return true;
    };

    const handleRemoveDay = async (branchId: string, day: DayKey) => {
        setSaveLoading(true);
        // soft remove: نرسل isOpen: false للـ backend
        const result = await setWorkingHours(branchId, {
            day,
            openTime: '00:00',
            closeTime: '00:00',
            isOpen: false,
        });
        if (!result.success) {
            api.error({ message: t('errorTitle'), description: t('saveError') });
            setSaveLoading(false);
            return false;
        }
        setSaveLoading(false);
        return true;
    };

    return {
        contextHolder,
        fetchLoading,
        saveLoading,
        branches,
        setBranches,
        handleSetHours,
        handleRemoveDay,
    };
};