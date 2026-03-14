"use client";

import { Card, Col, ConfigProvider, Row, Statistic } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

export default function OverviewStats() {
    const t = useTranslations('Overview');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const stats = [
        { title: t('statsTotalOrders'), value: 1245 },
        { title: t('statsRevenue'), value: 84250 },
        { title: t('statsActiveCustomers'), value: 312 },
        { title: t('statsAvgOrderValue'), value: 67.8 }
    ];

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction}>
                <Row gutter={[16, 16]}>
                    {stats.map((stat) => (
                        <Col key={stat.title} xs={24} sm={12} lg={6}>
                            <Card className='bg-[#F6F9FC]!'>
                                <Statistic title={stat.title} value={stat.value} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </ConfigProvider>
    );
}
