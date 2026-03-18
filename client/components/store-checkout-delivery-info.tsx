"use client";

import { Input } from 'antd';
import Text from 'antd/es/typography/Text';
import { MdDeliveryDining, MdStore, MdLocationOn, MdEditNote } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { OrderType, SelectedLocation } from '@/store/store-logic';
import CheckoutSection from './store-checkout-section';

interface CheckoutDeliveryInfoProps {
    orderType: OrderType;
    selectedLocation: SelectedLocation | null;
    selectedBranchId: string | null;
    notes: string;
    onNotesChange: (val: string) => void;
    primaryColor: string;
    secondaryColor: string;
}

export default function CheckoutDeliveryInfo({
    orderType,
    selectedLocation,
    selectedBranchId,
    notes,
    onNotesChange,
    primaryColor,
    secondaryColor,
}: CheckoutDeliveryInfoProps) {
    const t = useTranslations('Checkout');

    const icon = orderType === 'delivery'
        ? <MdDeliveryDining className="size-5" style={{ color: primaryColor }} />
        : <MdStore className="size-5" style={{ color: primaryColor }} />;

    const title = orderType === 'delivery' ? t('deliveryDetails') : t('pickupDetails');

    return (
        <CheckoutSection icon={icon} title={title}>
            <div className="flex flex-col gap-3">
                {/* Location / Branch row */}
                <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: secondaryColor }}
                >
                    <MdLocationOn className="size-5 shrink-0" style={{ color: primaryColor }} />
                    <div className="flex flex-col flex-1 min-w-0">
                        <Text className="text-xs! font-semibold" style={{ color: primaryColor }}>
                            {orderType === 'delivery' ? t('deliveryAddress') : t('branch')}
                        </Text>
                        {orderType === 'delivery' ? (
                            selectedLocation ? (
                                <Text className="text-sm! text-gray-700 truncate">
                                    {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                                </Text>
                            ) : (
                                <Text className="text-sm! text-gray-400">{t('noLocationSelected')}</Text>
                            )
                        ) : (
                            selectedBranchId ? (
                                <Text className="text-sm! text-gray-700">{selectedBranchId}</Text>
                            ) : (
                                <Text className="text-sm! text-gray-400">{t('noBranchSelected')}</Text>
                            )
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <MdEditNote className="size-4 text-gray-400" />
                        <Text className="text-xs! font-semibold text-gray-500">{t('orderNotes')}</Text>
                    </div>
                    <Input.TextArea
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder={t('notesPlaceholder')}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        className="rounded-xl! text-sm! resize-none"
                        style={{ borderColor: '#E5E7EB' }}
                    />
                </div>
            </div>
        </CheckoutSection>
    );
}