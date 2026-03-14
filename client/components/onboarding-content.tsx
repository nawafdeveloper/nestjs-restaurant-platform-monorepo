"use client";

import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, TimePicker, Typography, Upload } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslations } from 'next-intl';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useRouter } from '@/i18n/navigation';

dayjs.extend(customParseFormat);

export default function OnboardingContent() {
    const t = useTranslations('Onboarding');
    const router = useRouter();
    const {
        step,
        nextStep,
        prevStep,
        storeInfo,
        branchInfo,
        updateStoreInfo,
        updateBranchInfo,
        updateWorkingHours
    } = useOnboardingStore();
    const { Title, Text } = Typography;

    const handlePhoneChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
        updateStoreInfo({ phone: digitsOnly });
    };

    const timeFormat = 'HH:mm';

    const parseRangeValue = (value: [string, string]) => ([
        value[0] ? dayjs(value[0], timeFormat) : null,
        value[1] ? dayjs(value[1], timeFormat) : null
    ]);

    const handleWorkingHoursChange = (
        day: keyof typeof branchInfo.workingHours,
        values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
    ) => {
        if (!values) {
            updateWorkingHours(day, ['', '']);
            return;
        }
        const [start, end] = values;
        updateWorkingHours(day, [
            start ? start.format(timeFormat) : '',
            end ? end.format(timeFormat) : ''
        ]);
    };

    const PickerWithType = ({
        day,
        label
    }: {
        day: keyof typeof branchInfo.workingHours;
        label: string;
    }) => (
        <div className="space-y-1">
            <Text className="text-xs text-gray-500">{label}</Text>
            <TimePicker.RangePicker
                value={parseRangeValue(branchInfo.workingHours[day]) as any}
                onChange={(values) => handleWorkingHoursChange(day, values as any)}
                format={timeFormat}
                className="w-full h-12"
            />
        </div>
    );

    if (step === 2) {
        return (
            <div className="w-full max-w-2xl space-y-6">
                <div className="space-y-1">
                    <Title className="mb-1!" level={2}>{t('readyTitle')}</Title>
                    <Text>{t('readySubtitle')}</Text>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={prevStep}>{t('back')}</Button>
                    <Button type="primary" onClick={() => router.push('/app/app')}>
                        {t('goDashboard')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl space-y-6">
            {step === 0 && (
                <>
                    <div className="space-y-1">
                        <Title className="mb-1!" level={2}>{t('storeInfoTitle')}</Title>
                        <Text>{t('storeInfoSubtitle')}</Text>
                    </div>
                    <div className="grid gap-4">
                        <Input
                            placeholder={t('restaurantName')}
                            variant="filled"
                            className="h-12"
                            value={storeInfo.name}
                            onChange={(e) => updateStoreInfo({ name: e.target.value })}
                        />
                        <Input
                            placeholder={t('restaurantType')}
                            variant="filled"
                            className="h-12"
                            value={storeInfo.type}
                            onChange={(e) => updateStoreInfo({ type: e.target.value })}
                        />
                        <Input
                            placeholder={t('phoneNumber')}
                            variant="filled"
                            className="h-12"
                            inputMode="numeric"
                            maxLength={9}
                            value={storeInfo.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            suffix={<span className="text-gray-600">+966</span>}
                        />
                        <Upload
                            beforeUpload={(file) => {
                                updateStoreInfo({ logoFile: file });
                                return false;
                            }}
                            maxCount={1}
                            showUploadList={!!storeInfo.logoFile}
                        >
                            <Button icon={<UploadOutlined />}>{t('logo')}</Button>
                        </Upload>
                    </div>
                    <div className="flex justify-end">
                        <Button type="primary" onClick={nextStep}>{t('next')}</Button>
                    </div>
                </>
            )}

            {step === 1 && (
                <>
                    <div className="space-y-1">
                        <Title className="mb-1!" level={2}>{t('branchTitle')}</Title>
                        <Text>{t('branchesubtitle')}</Text>
                    </div>
                    <div className="grid gap-4">
                        <Input
                            placeholder={t('branchName')}
                            variant="filled"
                            className="h-12"
                            value={branchInfo.name}
                            onChange={(e) => updateBranchInfo({ name: e.target.value })}
                        />
                        <Input
                            placeholder={t('city')}
                            variant="filled"
                            className="h-12"
                            value={branchInfo.city}
                            onChange={(e) => updateBranchInfo({ city: e.target.value })}
                        />
                        <Input
                            placeholder={t('address')}
                            variant="filled"
                            className="h-12"
                            value={branchInfo.address}
                            onChange={(e) => updateBranchInfo({ address: e.target.value })}
                        />
                        <div className="space-y-2">
                            <Text className="font-semibold">{t('workingHours')}</Text>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <PickerWithType day="sun" label={t('sun')} />
                                <PickerWithType day="mon" label={t('mon')} />
                                <PickerWithType day="tue" label={t('tue')} />
                                <PickerWithType day="wed" label={t('wed')} />
                                <PickerWithType day="thu" label={t('thu')} />
                                <PickerWithType day="fri" label={t('fri')} />
                                <PickerWithType day="sat" label={t('sat')} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button onClick={prevStep}>{t('back')}</Button>
                        <Button type="primary" onClick={nextStep}>{t('next')}</Button>
                    </div>
                </>
            )}
        </div>
    );
}
