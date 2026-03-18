"use client";

import Image from 'next/image';
import Text from 'antd/es/typography/Text';
import { MdShoppingBag } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { CartItem } from '@/types';
import CheckoutSection from './store-checkout-section';

interface CheckoutOrderSummaryProps {
    cartItems: CartItem[];
    primaryColor: string;
    secondaryColor: string;
}

export default function CheckoutOrderSummary({
    cartItems,
    primaryColor,
    secondaryColor,
}: CheckoutOrderSummaryProps) {
    const t = useTranslations('Checkout');

    return (
        <CheckoutSection
            icon={<MdShoppingBag className="size-5" style={{ color: primaryColor }} />}
            title={t('orderSummary')}
            badge={`${cartItems.reduce((s, i) => s + i.quantity, 0)} ${t('items')}`}
        >
            <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div className="relative shrink-0 size-14 rounded-xl overflow-hidden bg-gray-100">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                            <span className="font-semibold text-sm text-gray-900 truncate">{item.name}</span>
                            {item.size && (
                                <Text className="text-xs! text-gray-400 truncate">{item.size}</Text>
                            )}
                            <Text className="text-xs! text-gray-400">x{item.quantity}</Text>
                        </div>
                        <Text className="text-sm font-bold shrink-0" style={{ color: primaryColor }}>
                            SAR {(item.price * item.quantity).toFixed(2)}
                        </Text>
                    </div>
                ))}
            </div>
        </CheckoutSection>
    );
}