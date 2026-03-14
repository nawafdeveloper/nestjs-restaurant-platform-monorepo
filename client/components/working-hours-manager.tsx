"use client";

import React, { useMemo, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, ConfigProvider, Divider, Select, Space, TimePicker, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type DayKey =
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday';

type TimeSlot = [string, string];

type BranchHours = {
    branchId: string;
    branchName: string;
    days: Record<DayKey, TimeSlot[]>;
};

const ALL_DAYS: DayKey[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
];

const initialBranches: BranchHours[] = [
    {
        branchId: '1',
        branchName: 'Al Olaya Branch',
        days: {
            sunday: [['09:00', '18:00']],
            monday: [['09:00', '18:00']],
            tuesday: [['09:00', '18:00']],
            wednesday: [['10:00', '22:00']],
            thursday: [['10:00', '22:00']],
            friday: [['14:00', '23:00']],
            saturday: []
        }
    },
    {
        branchId: '2',
        branchName: 'Al Malaz Branch',
        days: {
            sunday: [['10:00', '20:00']],
            monday: [['10:00', '20:00']],
            tuesday: [['10:00', '20:00']],
            wednesday: [],
            thursday: [['12:00', '22:00']],
            friday: [['14:00', '23:00']],
            saturday: []
        }
    }
];

export default function WorkingHoursManager() {
    const t = useTranslations('WorkingHours');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [branches, setBranches] = useState<BranchHours[]>(initialBranches);
    const [addDaySelection, setAddDaySelection] = useState<Record<string, DayKey | undefined>>({});

    const dayLabel = (day: DayKey) => t(`day.${day}`);

    const parseRange = (slot: TimeSlot) => ([
        slot[0] ? dayjs(slot[0], 'HH:mm') : null,
        slot[1] ? dayjs(slot[1], 'HH:mm') : null
    ]);

    const updateSlot = (branchId: string, day: DayKey, index: number, slot: TimeSlot) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? {
                        ...branch,
                        days: {
                            ...branch.days,
                            [day]: branch.days[day].map((s, i) => (i === index ? slot : s))
                        }
                    }
                    : branch
            )
        );
    };

    const addSlot = (branchId: string, day: DayKey) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? {
                        ...branch,
                        days: {
                            ...branch.days,
                            [day]: [...branch.days[day], ['', '']]
                        }
                    }
                    : branch
            )
        );
    };

    const deleteSlot = (branchId: string, day: DayKey, index: number) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? {
                        ...branch,
                        days: {
                            ...branch.days,
                            [day]: branch.days[day].filter((_, i) => i !== index)
                        }
                    }
                    : branch
            )
        );
    };

    const addDay = (branchId: string) => {
        const day = addDaySelection[branchId];
        if (!day) return;
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? {
                        ...branch,
                        days: {
                            ...branch.days,
                            [day]: [['', '']]
                        }
                    }
                    : branch
            )
        );
        setAddDaySelection((prev) => ({ ...prev, [branchId]: undefined }));
    };

    const deleteDay = (branchId: string, day: DayKey) => {
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === branchId
                    ? {
                        ...branch,
                        days: {
                            ...branch.days,
                            [day]: []
                        }
                    }
                    : branch
            )
        );
    };

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction} className="space-y-6">
                <div className="space-y-1">
                    <Typography.Title level={3} className="mb-1!">
                        {t('title')}
                    </Typography.Title>
                    <Typography.Text>{t('subtitle')}</Typography.Text>
                </div>

                <div className="space-y-6">
                    {branches.map((branch) => {
                        const availableDays = ALL_DAYS.filter(
                            (day) => branch.days[day].length === 0
                        );

                        return (
                            <Card key={branch.branchId} bodyStyle={{padding: '0px'}}>
                                <div className="flex flex-wrap items-center bg-gray-100 justify-between gap-3 p-6 mb-4">
                                    <Typography.Title level={4} className="mb-0!">
                                        {branch.branchName}
                                    </Typography.Title>
                                    <Space>
                                        <Select
                                            placeholder={t('selectDay')}
                                            value={addDaySelection[branch.branchId]}
                                            onChange={(value) =>
                                                setAddDaySelection((prev) => ({
                                                    ...prev,
                                                    [branch.branchId]: value as DayKey
                                                }))
                                            }
                                            options={availableDays.map((day) => ({
                                                value: day,
                                                label: dayLabel(day)
                                            }))}
                                            style={{ minWidth: 180 }}
                                            className='h-10!'
                                        />
                                        <Button className='h-10!' onClick={() => addDay(branch.branchId)} disabled={availableDays.length === 0}>
                                            {t('addDay')}
                                        </Button>
                                    </Space>
                                </div>

                                <div className="space-y-4 p-6">
                                    {ALL_DAYS.filter((day) => branch.days[day].length > 0).map((day, index, list) => (
                                        <div key={day} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Typography.Text strong>{dayLabel(day)}</Typography.Text>
                                                <Space>
                                                    <Button className='h-10!' size="small" onClick={() => addSlot(branch.branchId, day)}>
                                                        {t('addTime')}
                                                    </Button>
                                                    <Button className='h-10!' size="small" danger onClick={() => deleteDay(branch.branchId, day)}>
                                                        {t('deleteDay')}
                                                    </Button>
                                                </Space>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {branch.days[day].map((slot, index) => (
                                                    <div key={`${day}-${index}`} className="flex items-center gap-2">
                                                        <TimePicker.RangePicker
                                                            value={parseRange(slot) as any}
                                                            onChange={(values) => {
                                                                const [start, end] = values || [];
                                                                updateSlot(branch.branchId, day, index, [
                                                                    start ? start.format('HH:mm') : '',
                                                                    end ? end.format('HH:mm') : ''
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
                                                            onClick={() => deleteSlot(branch.branchId, day, index)}
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
