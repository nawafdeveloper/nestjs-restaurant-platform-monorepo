"use client";

import React, { useState } from 'react';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, ConfigProvider, Divider, Select, Skeleton, Space, TimePicker, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Text from 'antd/es/typography/Text';
import { useWorkingHours } from '@/hooks/use-working-hours';
import { BranchHours, DayKey, TimeSlot } from '@/types';

dayjs.extend(customParseFormat);

const ALL_DAYS: DayKey[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
];

export default function WorkingHoursManager() {
    const t = useTranslations('WorkingHours');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [addDaySelection, setAddDaySelection] = useState<Record<string, DayKey | undefined>>({});

    const {
        contextHolder,
        fetchLoading,
        saveLoading,
        branches,
        setBranches,
        handleSetHours,
        handleRemoveDay,
    } = useWorkingHours();

    const dayLabel = (day: DayKey) => t(`day.${day}`);

    const parseRange = (slot: TimeSlot) => ([
        slot[0] ? dayjs(slot[0], 'HH:mm') : null,
        slot[1] ? dayjs(slot[1], 'HH:mm') : null,
    ]);

    const updateSlotLocal = (branchId: string, day: DayKey, index: number, slot: TimeSlot) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? { ...branch, days: { ...branch.days, [day]: branch.days[day].map((s, i) => (i === index ? slot : s)) } }
                    : branch
            )
        );
    };

    const addSlotLocal = (branchId: string, day: DayKey) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? { ...branch, days: { ...branch.days, [day]: [...branch.days[day], ['', '']] } }
                    : branch
            )
        );
    };

    const deleteSlotLocal = (branchId: string, day: DayKey, index: number) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? { ...branch, days: { ...branch.days, [day]: branch.days[day].filter((_, i) => i !== index) } }
                    : branch
            )
        );
    };

    const addDayLocal = (branchId: string) => {
        const day = addDaySelection[branchId];
        if (!day) return;
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? { ...branch, days: { ...branch.days, [day]: [['', '']] } }
                    : branch
            )
        );
        setAddDaySelection((prev) => ({ ...prev, [branchId]: undefined }));
    };

    const handleDeleteDay = async (branchId: string, day: DayKey) => {
        const ok = await handleRemoveDay(branchId, day);
        if (ok) {
            setBranches((prev) =>
                prev.map((branch) =>
                    branch.branchId === branchId
                        ? { ...branch, days: { ...branch.days, [day]: [] } }
                        : branch
                )
            );
        }
    };

    const handleSave = async (branch: BranchHours) => {
        const activeDays = ALL_DAYS.filter((day) => branch.days[day].length > 0);
        for (const day of activeDays) {
            const slot = branch.days[day][0];
            if (!slot[0] || !slot[1]) continue;
            await handleSetHours(branch.branchId, day, slot);
        }
    };

    if (fetchLoading) return <Skeleton active paragraph={{ rows: 10 }} />;

    return (
        <ConfigProvider direction={direction}>
            {contextHolder}
            <div dir={direction} className="space-y-6">
                <div className="space-y-1">
                    <Typography.Title level={3} className="mb-1!">
                        {t('title')}
                    </Typography.Title>
                    <Typography.Text>{t('subtitle')}</Typography.Text>
                </div>

                <div className="space-y-6">
                    {branches.map((branch) => {
                        const availableDays = ALL_DAYS.filter((day) => branch.days[day].length === 0);

                        return (
                            <Card key={branch.branchId} bodyStyle={{ padding: '0px' }}>
                                <div className="flex flex-wrap items-center bg-[#F6F9FC] justify-between gap-3 p-6 mb-4">
                                    <Typography.Title level={4} className="mb-0!">
                                        {branch.branchName}
                                    </Typography.Title>
                                    <Space>
                                        <Select
                                            placeholder={t('selectDay')}
                                            value={addDaySelection[branch.branchId]}
                                            onChange={(value) =>
                                                setAddDaySelection((prev) => ({ ...prev, [branch.branchId]: value as DayKey }))
                                            }
                                            options={availableDays.map((day) => ({ value: day, label: dayLabel(day) }))}
                                            style={{ minWidth: 180 }}
                                            className='h-10!'
                                        />
                                        <Button
                                            className='h-10! border-0! overflow-hidden p-0!'
                                            type="primary"
                                            style={{ backgroundColor: '#13B272' }}
                                            onClick={() => addDayLocal(branch.branchId)}
                                            disabled={!addDaySelection[branch.branchId]}
                                        >
                                            <div className="flex items-center h-full">
                                                <div className="h-full flex items-center justify-center px-4" style={{ backgroundColor: '#119F65' }}>
                                                    <PlusOutlined />
                                                </div>
                                                <Text className="px-3 text-white!">{t('addDay')}</Text>
                                            </div>
                                        </Button>
                                        <Button
                                            className='h-10! border-0! overflow-hidden p-0!'
                                            type="primary"
                                            loading={saveLoading}
                                            style={{ backgroundColor: '#13B272' }}
                                            onClick={() => handleSave(branch)}
                                        >
                                            <div className="flex items-center h-full">
                                                <div className="h-full flex items-center justify-center px-4" style={{ backgroundColor: '#119F65' }}>
                                                    <SaveOutlined />
                                                </div>
                                                <Text className="px-3 text-white!">{t('save')}</Text>
                                            </div>
                                        </Button>
                                    </Space>
                                </div>

                                <div className="space-y-4 p-6">
                                    {ALL_DAYS.filter((day) => branch.days[day].length > 0).map((day, index, list) => (
                                        <div key={day} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Typography.Text strong>{dayLabel(day)}</Typography.Text>
                                                <Space>
                                                    <Button
                                                        className='h-10! border-0! overflow-hidden p-0! px-3!'
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => addSlotLocal(branch.branchId, day)}
                                                    >
                                                        {t('addTime')}
                                                    </Button>
                                                    <Button
                                                        className='h-10!'
                                                        size="small"
                                                        type="primary"
                                                        danger
                                                        loading={saveLoading}
                                                        onClick={() => handleDeleteDay(branch.branchId, day)}
                                                    >
                                                        {t('deleteDay')}
                                                    </Button>
                                                </Space>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {branch.days[day].map((slot, slotIndex) => (
                                                    <div key={`${day}-${slotIndex}`} className="flex items-center gap-2">
                                                        <TimePicker.RangePicker
                                                            value={parseRange(slot) as any}
                                                            onChange={(values) => {
                                                                const [start, end] = values || [];
                                                                updateSlotLocal(branch.branchId, day, slotIndex, [
                                                                    start ? start.format('HH:mm') : '',
                                                                    end ? end.format('HH:mm') : '',
                                                                ]);
                                                            }}
                                                            format="HH:mm"
                                                            className="w-full h-10!"
                                                        />
                                                        <Button
                                                            size="small"
                                                            danger
                                                            className='h-10! w-14!'
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => deleteSlotLocal(branch.branchId, day, slotIndex)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {index < list.length - 1 && <Divider className="my-4" />}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </ConfigProvider>
    );
}