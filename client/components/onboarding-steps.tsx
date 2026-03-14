"use client";

import { Flex, Steps } from 'antd';
import { useTranslations } from 'next-intl';
import { useOnboardingStore } from '@/store/onboarding-store';

export default function OnboardingSteps() {
    const t = useTranslations('Onboarding');
    const step = useOnboardingStore((state) => state.step);

    const items = [
        { title: t('stepStoreInfo') },
        { title: t('stepFirstBranch') },
        { title: t('stepReady') }
    ];

    return (
        <Flex>
            <div style={{ flex: 1 }}>
                <Steps orientation="vertical" current={step} items={items} />
            </div>
        </Flex>
    )
}
