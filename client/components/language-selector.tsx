"use client";

import { Select } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

type LanguageSelectorProps = {
    variant?: 'floating' | 'inline';
    className?: string;
};

export default function LanguageSelector({ variant = 'floating', className }: LanguageSelectorProps) {
    const t = useTranslations('LanguageSelector');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const isArabic = locale === 'ar';
    const sideClass = isArabic ? 'left-4' : 'right-4';
    const isFloating = variant === 'floating';
    const containerClassName = [
        isFloating ? `absolute top-4 ${sideClass} z-10` : '',
        className ?? ''
    ]
        .filter(Boolean)
        .join(' ');

    const handleChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className={containerClassName}>
            <Select
                value={locale}
                onChange={handleChange}
                options={[
                    { value: 'en', label: t('english') },
                    { value: 'ar', label: t('arabic') }
                ]}
                aria-label={t('label')}
                disabled={isPending}
                size="middle"
                className='h-10!'
            />
        </div>
    );
}
