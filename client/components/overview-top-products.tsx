"use client";

import { Card, ConfigProvider, Progress } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

export default function OverviewTopProducts() {
    const t = useTranslations('Overview');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const products = [
        { name: t('productShawarma'), orders: 320, share: 72 },
        { name: t('productBurger'), orders: 245, share: 58 },
        { name: t('productFries'), orders: 198, share: 46 },
        { name: t('productJuice'), orders: 150, share: 35 }
    ];

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction}>
                <Card headStyle={{background: '#F6F9FC'}} title={t('topProducts')}>
                    <div className="space-y-4">
                        {products.map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-sm text-gray-500">
                                        {item.orders} {t('ordersUnit')}
                                    </span>
                                </div>
                                <Progress percent={item.share} showInfo={false} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </ConfigProvider>
    );
}
