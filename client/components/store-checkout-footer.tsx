"use client";

import { Button, Divider } from 'antd';
import Text from 'antd/es/typography/Text';
import { useTranslations } from 'next-intl';

interface CheckoutFooterProps {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    isLoading: boolean;
    onPlaceOrder: () => void;
    primaryColor: string;
    secondaryColor: string;
}

export default function CheckoutFooter({
    subtotal,
    deliveryFee,
    discount,
    total,
    isLoading,
    onPlaceOrder,
    primaryColor,
    secondaryColor,
}: CheckoutFooterProps) {
    const t = useTranslations('Checkout');

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 w-full shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-3 px-4 pt-4 pb-6 w-full lg:max-w-2xl lg:mx-auto">

                {/* Price breakdown */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Text className="text-sm! text-gray-500">{t('subtotal')}</Text>
                        <Text className="text-sm! text-gray-700 font-medium">SAR {subtotal.toFixed(2)}</Text>
                    </div>

                    <div className="flex items-center justify-between">
                        <Text className="text-sm! text-gray-500">{t('deliveryFee')}</Text>
                        {deliveryFee === 0 ? (
                            <Text className="text-sm! font-semibold" style={{ color: '#1A8C3F' }}>
                                {t('free')}
                            </Text>
                        ) : (
                            <Text className="text-sm! text-gray-700 font-medium">SAR {deliveryFee.toFixed(2)}</Text>
                        )}
                    </div>

                    {discount > 0 && (
                        <div className="flex items-center justify-between">
                            <Text className="text-sm! text-gray-500">{t('discount')}</Text>
                            <Text className="text-sm! font-semibold" style={{ color: '#1A8C3F' }}>
                                − SAR {discount.toFixed(2)}
                            </Text>
                        </div>
                    )}

                    <Divider className="my-0!" />

                    <div className="flex items-center justify-between">
                        <Text className="text-base! font-bold text-gray-900">{t('total')}</Text>
                        <Text className="text-lg! font-bold" style={{ color: primaryColor }}>
                            SAR {total.toFixed(2)}
                        </Text>
                    </div>
                </div>

                {/* Place order button */}
                <Button
                    type="primary"
                    size="large"
                    loading={isLoading}
                    className="w-full h-13! rounded-full! font-bold! text-base!"
                    style={{ background: primaryColor, color: secondaryColor, border: 'none' }}
                    onClick={onPlaceOrder}
                >
                    {t('placeOrder')} · SAR {total.toFixed(2)}
                </Button>
            </div>
        </div>
    );
}