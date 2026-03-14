"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';

type OrderRow = {
    key: string;
    id: string;
    branch: string;
    customer: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    subtotal: string;
    discountAmount: string;
    total: string;
    promoCode: string;
    notes: string;
    customerAddress: string;
    items: OrderItemRow[];
};

type OrderItemRow = {
    key: string;
    productName: string;
    variantOptionName: string;
    unitPrice: string;
    quantity: number;
    totalPrice: string;
};

const initialData: OrderRow[] = [
    {
        key: '1',
        id: '#1051',
        branch: 'Al Olaya Branch',
        customer: 'Ahmed Ali',
        status: 'preparing',
        subtotal: '125.00',
        discountAmount: '10.00',
        total: '115.00',
        promoCode: 'WELCOME10',
        notes: 'No onions',
        customerAddress: 'Olaya St, Riyadh',
        items: [
            {
                key: '1',
                productName: 'Chicken Shawarma',
                variantOptionName: 'Large',
                unitPrice: '18.00',
                quantity: 2,
                totalPrice: '36.00'
            },
            {
                key: '2',
                productName: 'Fries Combo',
                variantOptionName: 'Regular',
                unitPrice: '12.50',
                quantity: 1,
                totalPrice: '12.50'
            }
        ]
    },
    {
        key: '2',
        id: '#1050',
        branch: 'Al Malaz Branch',
        customer: 'Sara N.',
        status: 'delivered',
        subtotal: '89.00',
        discountAmount: '0.00',
        total: '89.00',
        promoCode: '',
        notes: '',
        customerAddress: 'Malaz, Riyadh',
        items: [
            {
                key: '1',
                productName: 'Beef Burger',
                variantOptionName: 'Single',
                unitPrice: '22.00',
                quantity: 1,
                totalPrice: '22.00'
            },
            {
                key: '2',
                productName: 'Fresh Juice',
                variantOptionName: 'Orange',
                unitPrice: '15.00',
                quantity: 2,
                totalPrice: '30.00'
            }
        ]
    }
];

export default function OrdersTable() {
    const t = useTranslations('Orders');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<OrderRow[]>(initialData);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
    const [form] = Form.useForm();

    const openView = (record: OrderRow) => {
        setSelectedOrder(record);
        form.setFieldsValue({
            status: record.status,
            notes: record.notes
        });
        setIsViewOpen(true);
    };

    const closeView = () => setIsViewOpen(false);

    const handleSave = () => {
        if (selectedOrder) {
            const values = form.getFieldsValue();
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedOrder.key
                        ? { ...row, ...values }
                        : row
                )
            );
        }
        closeView();
    };

    const statusColor = (status: OrderRow['status']) => {
        if (status === 'delivered') return 'green';
        if (status === 'preparing') return 'blue';
        if (status === 'confirmed') return 'cyan';
        if (status === 'ready') return 'gold';
        if (status === 'cancelled') return 'red';
        return 'default';
    };

    const statusLabel = (status: OrderRow['status']) => t(`status.${status}`);

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<OrderRow> = [
        { title: t('orderId'), dataIndex: 'id', key: 'id' },
        { title: t('branch'), dataIndex: 'branch', key: 'branch' },
        { title: t('customer'), dataIndex: 'customer', key: 'customer' },
        {
            title: t('statusLabel'),
            dataIndex: 'status',
            key: 'status',
            render: (value: OrderRow['status']) => (
                <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
            )
        },
        { title: t('subtotal'), dataIndex: 'subtotal', key: 'subtotal' },
        { title: t('discountAmount'), dataIndex: 'discountAmount', key: 'discountAmount' },
        { title: t('total'), dataIndex: 'total', key: 'total' },
        { title: t('promoCode'), dataIndex: 'promoCode', key: 'promoCode' },
        {
            title: t('actions'),
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" type="link" onClick={() => openView(record)}>
                        {t('view')}
                    </Button>
                </Space>
            )
        }
    ];
    const columns: ColumnsType<OrderRow> = baseColumns.map((column) => ({
        ...column,
        onHeaderCell: () => ({ style: headerCellStyle })
    }));

    const baseItemColumns: ColumnsType<OrderItemRow> = [
        { title: t('itemProduct'), dataIndex: 'productName', key: 'productName' },
        { title: t('itemVariant'), dataIndex: 'variantOptionName', key: 'variantOptionName' },
        { title: t('itemUnitPrice'), dataIndex: 'unitPrice', key: 'unitPrice' },
        { title: t('itemQuantity'), dataIndex: 'quantity', key: 'quantity' },
        { title: t('itemTotal'), dataIndex: 'totalPrice', key: 'totalPrice' }
    ];
    const itemColumns: ColumnsType<OrderItemRow> = baseItemColumns.map((column) => ({
        ...column,
        onHeaderCell: () => ({ style: headerCellStyle })
    }));

    return (
        <ConfigProvider direction={direction}>
            <div dir={direction} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Typography.Title level={3} className="mb-1!">
                            {t('title')}
                        </Typography.Title>
                        <Typography.Text>{t('subtitle')}</Typography.Text>
                    </div>
                </div>
                <Card>
                    <Table columns={columns} dataSource={rows} pagination={false} />
                </Card>

                <Modal
                    title={t('orderDetails')}
                    open={isViewOpen}
                    onCancel={closeView}
                    onOk={handleSave}
                    okText={t('save')}
                    cancelText={t('cancel')}
                >
                    <div className="space-y-3">
                        <div>
                            <Typography.Text type="secondary">{t('customerAddress')}</Typography.Text>
                            <div className="text-sm">{selectedOrder?.customerAddress || '-'}</div>
                        </div>
                        <div>
                            <Typography.Text type="secondary">{t('notes')}</Typography.Text>
                            <div className="text-sm">{selectedOrder?.notes || '-'}</div>
                        </div>
                        <Form layout="vertical" form={form}>
                            <Form.Item label={t('statusLabel')} name="status">
                                <Select
                                    options={[
                                        { value: 'pending', label: t('status.pending') },
                                        { value: 'confirmed', label: t('status.confirmed') },
                                        { value: 'preparing', label: t('status.preparing') },
                                        { value: 'ready', label: t('status.ready') },
                                        { value: 'delivered', label: t('status.delivered') },
                                        { value: 'cancelled', label: t('status.cancelled') }
                                    ]}
                                    className='h-10!'
                                />
                            </Form.Item>
                            <Form.Item label={t('notes')} name="notes">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Form>
                        <div className="pt-2">
                            <Typography.Text type="secondary">{t('items')}</Typography.Text>
                            <Table
                                columns={itemColumns}
                                dataSource={selectedOrder?.items || []}
                                pagination={false}
                                size="small"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </ConfigProvider>
    );
}
