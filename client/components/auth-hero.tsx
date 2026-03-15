"use client";

import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import React from 'react'

export default function AuthHeros() {
    const t = useTranslations('AuthHero');

    return (
        <div className="space-y-6 max-w-md">
            <Title className="text-3xl font-bold text-gray-900 leading-tight">
                {t('title')}
            </Title>
            <Title level={5} className="text-lg text-gray-600">
                {t('subtitle')}
            </Title>
            <div className="space-y-3 mt-5">
                <div className="flex items-center gap-2">
                    <Text className="text-green-500 text-xl">🚀</Text>
                    <Text className="text-gray-700">{t('feature1')}</Text>
                </div>
                <div className="flex items-center gap-2">
                    <Text className="text-green-500 text-xl">🚀</Text>
                    <Text className="text-gray-700">{t('feature2')}</Text>
                </div>
                <div className="flex items-center gap-2">
                    <Text className="text-green-500 text-xl">🚀</Text>
                    <Text className="text-gray-700">{t('feature3')}</Text>
                </div>
                <div className="flex items-center gap-2">
                    <Text className="text-green-500 text-xl">🚀</Text>
                    <Text className="text-gray-700">{t('feature4')}</Text>
                </div>
            </div>
            <Text type='secondary' className="text-sm text-gray-500 mt-4">
                {t('footer')}
            </Text>
        </div>
    )
}