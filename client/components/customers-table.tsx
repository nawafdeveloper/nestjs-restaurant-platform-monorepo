"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Modal, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';

type CustomerRow = {
    key: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: string;
    status: 'Active' | 'Inactive';
};

const initialData: CustomerRow[] = [
    {
        key: '1',
        name: 'Ahmed Ali',
        email: 'ahmed@example.com',
        totalOrders: 18,
        totalSpent: '780.00',
        status: 'Active'
    },
    {
        key: '2',
        name: 'Sara N.',
        email: 'sara@example.com',
        totalOrders: 6,
        totalSpent: '210.00',
        status: 'Inactive'
    }
];

export default function CustomersTable() {
    const t = useTranslations('Customers');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<CustomerRow[]>(initialData);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
    const [form] = Form.useForm();

    const openView = (record: CustomerRow) => {
        setSelectedCustomer(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email
        });
        setIsViewOpen(true);
    };

    const closeView = () => setIsViewOpen(false);

    const handleSave = () => {
        if (selectedCustomer) {
            const values = form.getFieldsValue();
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedCustomer.key
                        ? { ...row, ...values }
                        : row
                )
            );
        }
        closeView();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<CustomerRow> = [
        { title: t('name'), dataIndex: 'name', key: 'name' },
        { title: t('email'), dataIndex: 'email', key: 'email' },
        { title: t('totalOrders'), dataIndex: 'totalOrders', key: 'totalOrders' },
        { title: t('totalSpent'), dataIndex: 'totalSpent', key: 'totalSpent' },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (value: CustomerRow['status']) => (
                <Tag color={value === 'Active' ? 'green' : 'default'}>
                    {value === 'Active' ? t('active') : t('inactive')}
                </Tag>
            )
        },
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
    const columns: ColumnsType<CustomerRow> = baseColumns.map((column) => ({
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
                <Table columns={columns} dataSource={rows} pagination={false} />
                <Modal
                    title={t('customerDetails')}
                    open={isViewOpen}
                    onCancel={closeView}
                    onOk={handleSave}
                    okText={t('save')}
                    cancelText={t('cancel')}
                    okButtonProps={{
                        className: 'bg-[#119F65]! h-10! border-0!'
                    }}
                    cancelButtonProps={{
                        className: 'h-10! bg-[#D9E5F1]! border-0!'
                    }}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('email')} name="email">
                            <Input className="h-10" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
}
