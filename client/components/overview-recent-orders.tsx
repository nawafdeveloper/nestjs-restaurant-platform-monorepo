"use client";

import { Card, ConfigProvider, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';

type OrderRow = {
    key: string;
    id: string;
    customer: string;
    status: 'Completed' | 'Preparing' | 'Cancelled';
    total: string;
};

export default function OverviewRecentOrders() {
    const t = useTranslations('Overview');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const data: OrderRow[] = [
        { key: '1', id: '#1042', customer: t('customerAhmed'), status: 'Completed', total: 'SAR 145.00' },
        { key: '2', id: '#1041', customer: t('customerSara'), status: 'Preparing', total: 'SAR 89.00' },
        { key: '3', id: '#1040', customer: t('customerFahad'), status: 'Completed', total: 'SAR 220.00' },
        { key: '4', id: '#1039', customer: t('customerMaha'), status: 'Cancelled', total: 'SAR 55.00' }
    ];

    const statusLabel = (status: OrderRow['status']) => {
        if (status === 'Completed') return t('statusCompleted');
        if (status === 'Preparing') return t('statusPreparing');
        return t('statusCancelled');
    };

    const columns: ColumnsType<OrderRow> = [
        { title: t('orderId'), dataIndex: 'id', key: 'id', onHeaderCell: () => ({ style: { backgroundColor: '#F6F9FC' } }) },
        { title: t('customer'), dataIndex: 'customer', key: 'customer', onHeaderCell: () => ({ style: { backgroundColor: '#F6F9FC' } }) },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (value: OrderRow['status']) => {
                const color = value === 'Completed' ? 'green' : value === 'Preparing' ? 'blue' : 'red';
                return <Tag color={color}>{statusLabel(value)}</Tag>;
            },
            onHeaderCell: () => ({ style: { backgroundColor: '#F6F9FC' } })
        },
        { title: t('total'), dataIndex: 'total', key: 'total', onHeaderCell: () => ({ style: { backgroundColor: '#F6F9FC' } }) }
    ];

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction}>
                <Card
                    headStyle={{
                        background: '#F6F9FC',
                        borderBottom: '1px solid #dedfe0'
                    }}
                    bodyStyle={{ padding: '0' }}
                    title={t('recentOrders')}
                >
                    <Table columns={columns} dataSource={data} pagination={false} size="small" />
                </Card>
            </div>
        </ConfigProvider>
    );
}
