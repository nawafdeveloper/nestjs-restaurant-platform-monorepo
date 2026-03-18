"use client";

import { Button } from 'antd';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { useLocale, useTranslations } from 'next-intl';
import Title from 'antd/es/typography/Title';

interface CheckoutHeaderProps {
    onBack: () => void;
    primaryColor: string;
    secondaryColor: string;
}

export default function CheckoutHeader({ onBack, primaryColor, secondaryColor }: CheckoutHeaderProps) {
    const t = useTranslations('Checkout');
    const locale = useLocale();
    const isArabic = locale === 'ar';

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 w-full max-w-2xl mx-auto">
                <Button
                    type="text"
                    shape="circle"
                    icon={isArabic ? <MdArrowForward className="size-5" /> : <MdArrowBack className="size-5" />}
                    style={{ color: primaryColor }}
                    onClick={onBack}
                    aria-label={t('back')}
                />
                <Title level={5} className="text-lg font-bold text-gray-900 flex-1">{t('title')}</Title>
            </div>
        </header>
    );
}