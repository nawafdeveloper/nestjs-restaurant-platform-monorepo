"use client";

import Text from 'antd/es/typography/Text';
import { MdCreditCard, MdPayments, MdSmartphone } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { PaymentMethod } from '@/app/[locale]/[storeId]/checkout/page';
import CheckoutSection from './store-checkout-section';

interface PaymentOption {
    value: PaymentMethod;
    label: string;
    icon: React.ReactNode;
    description: string;
}

interface CheckoutPaymentMethodProps {
    selected: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
    primaryColor: string;
    secondaryColor: string;
}

export default function CheckoutPaymentMethod({
    selected,
    onChange,
    primaryColor,
    secondaryColor,
}: CheckoutPaymentMethodProps) {
    const t = useTranslations('Checkout');

    const options: PaymentOption[] = [
        {
            value: 'cash',
            label: t('paymentCash'),
            description: t('paymentCashDesc'),
            icon: <MdPayments className="size-5" />,
        },
        {
            value: 'card',
            label: t('paymentCard'),
            description: t('paymentCardDesc'),
            icon: <MdCreditCard className="size-5" />,
        },
        {
            value: 'apple_pay',
            label: t('paymentApplePay'),
            description: t('paymentApplePayDesc'),
            icon: <MdSmartphone className="size-5" />,
        },
    ];

    return (
        <CheckoutSection
            icon={<MdCreditCard className="size-5" style={{ color: primaryColor }} />}
            title={t('paymentMethod')}
        >
            <div className="flex flex-col gap-2">
                {options.map((opt) => {
                    const isSelected = selected === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left w-full"
                            style={{
                                borderColor: isSelected ? primaryColor : '#E5E7EB',
                                background: isSelected ? secondaryColor : 'white',
                            }}
                        >
                            {/* Icon circle */}
                            <div
                                className="shrink-0 size-9 rounded-full flex items-center justify-center"
                                style={{
                                    background: isSelected ? primaryColor : '#F3F4F6',
                                    color: isSelected ? secondaryColor : '#6B7280',
                                }}
                            >
                                {opt.icon}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <Text
                                    className="text-sm! font-semibold"
                                    style={{ color: isSelected ? primaryColor : '#111827' }}
                                >
                                    {opt.label}
                                </Text>
                                <Text className="text-xs! text-gray-400">{opt.description}</Text>
                            </div>
                            {/* Custom radio dot */}
                            <div
                                className="shrink-0 size-5 rounded-full border-2 flex items-center justify-center transition-all"
                                style={{ borderColor: isSelected ? primaryColor : '#D1D5DB' }}
                            >
                                {isSelected && (
                                    <div
                                        className="size-2.5 rounded-full"
                                        style={{ background: primaryColor }}
                                    />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </CheckoutSection>
    );
}