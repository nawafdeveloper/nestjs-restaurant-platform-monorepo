"use client";

import { useState } from 'react';
import { Button, Input } from 'antd';
import Text from 'antd/es/typography/Text';
import { MdLocalOffer, MdCheckCircle } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import CheckoutSection from './store-checkout-section';

interface CheckoutPromoCodeProps {
    value: string;
    onChange: (val: string) => void;
    onApply: (code: string) => void;
    discount: number;
    error: string;
    primaryColor: string;
    secondaryColor: string;
}

export default function CheckoutPromoCode({
    value,
    onChange,
    onApply,
    discount,
    error,
    primaryColor,
    secondaryColor,
}: CheckoutPromoCodeProps) {
    const t = useTranslations('Checkout');
    const [isLoading, setIsLoading] = useState(false);

    const handleApply = async () => {
        if (!value.trim()) return;
        setIsLoading(true);
        // Simulate async check
        await new Promise((r) => setTimeout(r, 600));
        onApply(value.trim());
        setIsLoading(false);
    };

    const isApplied = discount > 0 && !error;

    return (
        <CheckoutSection
            icon={<MdLocalOffer className="size-5" style={{ color: primaryColor }} />}
            title={t('promoCode')}
        >
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        placeholder={t('promoPlaceholder')}
                        className="rounded-xl! flex-1 uppercase font-semibold tracking-widest"
                        style={{
                            borderColor: isApplied ? '#1A8C3F' : error ? '#DC2626' : '#E5E7EB',
                        }}
                        disabled={isApplied}
                        onPressEnter={handleApply}
                        suffix={
                            isApplied
                                ? <MdCheckCircle className="size-4" style={{ color: '#1A8C3F' }} />
                                : null
                        }
                    />
                    <Button
                        type="primary"
                        className="h-10! rounded-xl! font-semibold! px-5!"
                        style={{
                            background: isApplied ? '#E6F9ED' : primaryColor,
                            color: isApplied ? '#1A8C3F' : secondaryColor,
                            border: 'none',
                        }}
                        loading={isLoading}
                        disabled={isApplied || !value.trim()}
                        onClick={handleApply}
                    >
                        {isApplied ? t('applied') : t('apply')}
                    </Button>
                </div>

                {error && (
                    <Text className="text-xs! font-medium" style={{ color: '#DC2626' }}>
                        {error}
                    </Text>
                )}

                {isApplied && (
                    <div
                        className="flex items-center gap-2 p-2.5 rounded-xl"
                        style={{ background: '#E6F9ED' }}
                    >
                        <MdCheckCircle className="size-4 shrink-0" style={{ color: '#1A8C3F' }} />
                        <Text className="text-sm! font-semibold" style={{ color: '#1A8C3F' }}>
                            {t('promoSaved', { amount: discount.toFixed(2) })}
                        </Text>
                    </div>
                )}
            </div>
        </CheckoutSection>
    );
}