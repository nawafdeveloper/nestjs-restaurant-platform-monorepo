"use client";

import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, notification, TimePicker, Typography, Upload } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslations } from 'next-intl';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useRouter } from '@/i18n/navigation';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

dayjs.extend(customParseFormat);

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default function OnboardingContent() {
    const [api, contextHolder] = notification.useNotification();
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
        updateWorkingHours,
        loading,
        submitOnboarding
    } = useOnboardingStore();
    const { Title, Text } = Typography;

    // ─── موقع الخريطة ─────────────────────────────────────────
    const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // الرياض default
    const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

    useEffect(() => {
        if (step !== 1) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setMapCenter({ lat: latitude, lng: longitude });
                setLocationGranted(true);
                updateBranchInfo({
                    latitude: String(latitude),
                    longitude: String(longitude),
                });
            },
            () => {
                setLocationGranted(false);
            }
        );
    }, [step]);

    const handleMapClick = (e: any) => {
        const lat = e.detail?.latLng?.lat;
        const lng = e.detail?.latLng?.lng;
        if (!lat || !lng) return;
        setMapCenter({ lat, lng });
        updateBranchInfo({
            latitude: String(lat),
            longitude: String(lng),
        });
    };

    // ─── Phone & Slug ─────────────────────────────────────────
    const handlePhoneChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
        updateStoreInfo({ phone: digitsOnly });
    };

    const handleSlugChange = (value: string) => {
        const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 50);
        updateStoreInfo({ slug });
    };

    // ─── Working Hours ────────────────────────────────────────
    const timeFormat = 'HH:mm';

    const parseRangeValue = (value: [string, string]) => ([
        value[0] ? dayjs(value[0], timeFormat) : null,
        value[1] ? dayjs(value[1], timeFormat) : null
    ]);

    const handleWorkingHoursChange = (
        day: keyof typeof branchInfo.workingHours,
        values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
    ) => {
        if (!values) { updateWorkingHours(day, ['', '']); return; }
        const [start, end] = values;
        updateWorkingHours(day, [
            start ? start.format(timeFormat) : '',
            end ? end.format(timeFormat) : ''
        ]);
    };

    const PickerWithType = ({ day, label }: { day: keyof typeof branchInfo.workingHours; label: string }) => (
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

    // ─── Submit ───────────────────────────────────────────────
    const handleStep1Next = async () => {
        const result = await submitOnboarding();

        if (!result.success) {
            const msg = result.error === 'SLUG_TAKEN'
                ? t('slugTaken')
                : result.message ?? t('onboardingError');
            api.error({ message: t('errorTitle'), description: msg });
            return;
        }

        nextStep();
    };

    // ─── Validation ───────────────────────────────────────────
    const isStep0Valid =
        storeInfo.nameAr.trim() !== '' &&
        storeInfo.nameEn.trim() !== '' &&
        storeInfo.slug.trim() !== '' &&
        storeInfo.descriptionAr.trim() !== '' &&
        storeInfo.descriptionEn.trim() !== '' &&
        storeInfo.type.trim() !== '' &&
        storeInfo.phone.length === 9;

    const isStep1Valid =
        branchInfo.name.trim() !== '' &&
        branchInfo.city.trim() !== '' &&
        branchInfo.address.trim() !== '' &&
        branchInfo.latitude !== '' &&
        branchInfo.longitude !== '';

    // ─── Step 2 ───────────────────────────────────────────────
    if (step === 2) {
        return (
            <div className="w-full max-w-2xl space-y-6">
                <div className="space-y-1">
                    <Title className="mb-1!" level={2}>{t('readyTitle')}</Title>
                    <Text>{t('readySubtitle')}</Text>
                </div>
                <div className="flex items-center gap-3">
                    <Button className='h-10!' onClick={prevStep}>{t('back')}</Button>
                    <Button className='h-10!' type="primary" onClick={() => router.push('/app')}>
                        {t('goDashboard')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <div className="w-full max-w-2xl space-y-6">
                {loading && (
                    <div className='absolute inset-0 h-screen z-20 bg-black/70 flex flex-row gap-x-2 justify-center items-center'>
                        <LoadingOutlined className='animate-spin text-white! text-lg!' />
                        <Text className='text-white! text-lg!'>{t('creatingStoreLoading')}</Text>
                    </div>
                )}

                {/* ─── Step 0 ─────────────────────────────────── */}
                {step === 0 && (
                    <>
                        <div className="space-y-1">
                            <Title className="mb-1!" level={2}>{t('storeInfoTitle')}</Title>
                            <Text>{t('storeInfoSubtitle')}</Text>
                        </div>
                        <div className="grid gap-4">
                            <Input placeholder={t('storeNameAr')} variant="filled" className="h-12" dir="rtl"
                                value={storeInfo.nameAr} onChange={(e) => updateStoreInfo({ nameAr: e.target.value })} />
                            <Input placeholder={t('storeNameEn')} variant="filled" className="h-12" dir="ltr"
                                value={storeInfo.nameEn} onChange={(e) => updateStoreInfo({ nameEn: e.target.value })} />
                            <Input placeholder={t('slug')} variant="filled" className="h-12" dir="ltr"
                                value={storeInfo.slug} onChange={(e) => handleSlugChange(e.target.value)}
                                prefix={<span className="text-gray-400 text-sm">momayaz.com/</span>} />
                            <Input.TextArea placeholder={t('descriptionAr')} variant="filled" rows={3} dir="rtl"
                                value={storeInfo.descriptionAr} onChange={(e) => updateStoreInfo({ descriptionAr: e.target.value })} />
                            <Input.TextArea placeholder={t('descriptionEn')} variant="filled" rows={3} dir="ltr"
                                value={storeInfo.descriptionEn} onChange={(e) => updateStoreInfo({ descriptionEn: e.target.value })} />
                            <Input placeholder={t('restaurantType')} variant="filled" className="h-12"
                                value={storeInfo.type} onChange={(e) => updateStoreInfo({ type: e.target.value })} />
                            <Input placeholder={t('phoneNumber')} variant="filled" className="h-12"
                                inputMode="numeric" maxLength={9} value={storeInfo.phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                suffix={<span className="text-gray-600">+966</span>} />
                            <Upload beforeUpload={(file) => { updateStoreInfo({ logoFile: file }); return false; }}
                                maxCount={1} showUploadList={!!storeInfo.logoFile}>
                                <Button className='h-10!' icon={<UploadOutlined />}>{t('logo')}</Button>
                            </Upload>
                        </div>
                        <div className="flex justify-end">
                            <Button type="primary" className='h-10!' onClick={nextStep} disabled={!isStep0Valid}>
                                {t('next')}
                            </Button>
                        </div>
                    </>
                )}

                {/* ─── Step 1 ─────────────────────────────────── */}
                {step === 1 && (
                    <>
                        <div className="space-y-1">
                            <Title className="mb-1!" level={2}>{t('branchTitle')}</Title>
                            <Text>{t('branchesubtitle')}</Text>
                        </div>
                        <div className="grid gap-4">

                            {/* الخريطة */}
                            <div className="space-y-2">
                                <Text className="font-semibold">{t('branchLocation')}</Text>
                                {locationGranted === false && (
                                    <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                        {t('locationDenied')}
                                    </div>
                                )}
                                <div className="overflow-hidden border border-gray-200" style={{ height: 280 }}>
                                    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                                        <Map
                                            center={mapCenter}
                                            zoom={15}
                                            gestureHandling="greedy"
                                            disableDefaultUI={false}
                                            onClick={handleMapClick}
                                        >
                                            {branchInfo.latitude && branchInfo.longitude && (
                                                <Marker position={{
                                                    lat: Number(branchInfo.latitude),
                                                    lng: Number(branchInfo.longitude)
                                                }} />
                                            )}
                                        </Map>
                                    </APIProvider>
                                </div>
                            </div>

                            <Input placeholder={t('branchName')} variant="filled" className="h-12"
                                value={branchInfo.name} onChange={(e) => updateBranchInfo({ name: e.target.value })} />
                            <Input placeholder={t('city')} variant="filled" className="h-12"
                                value={branchInfo.city} onChange={(e) => updateBranchInfo({ city: e.target.value })} />
                            <Input placeholder={t('address')} variant="filled" className="h-12"
                                value={branchInfo.address} onChange={(e) => updateBranchInfo({ address: e.target.value })} />

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
                            <Button className='h-10!' onClick={prevStep}>{t('back')}</Button>
                            <Button className='h-10!' type="primary" onClick={handleStep1Next}
                                loading={loading} disabled={!isStep1Valid || loading}>
                                {t('next')}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
