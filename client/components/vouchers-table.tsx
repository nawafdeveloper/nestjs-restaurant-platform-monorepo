"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, DatePicker, Form, Input, Modal, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import dayjs from 'dayjs';

type VoucherRow = {
    key: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: string;
    minOrderAmount: string;
    maxDiscountAmount: string;
    maxUsageCount: number;
    usageCount: number;
    maxUsagePerCustomer: number;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
};

const initialData: VoucherRow[] = [
    {
        key: '1',
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: '10',
        minOrderAmount: '50',
        maxDiscountAmount: '30',
        maxUsageCount: 500,
        usageCount: 120,
        maxUsagePerCustomer: 1,
        startsAt: '2026-03-01',
        endsAt: '2026-04-01',
        isActive: true
    },
    {
        key: '2',
        code: 'SAVE20',
        discountType: 'fixed',
        discountValue: '20',
        minOrderAmount: '100',
        maxDiscountAmount: '',
        maxUsageCount: 200,
        usageCount: 40,
        maxUsagePerCustomer: 2,
        startsAt: '2026-02-15',
        endsAt: '2026-03-15',
        isActive: false
    }
];

export default function VouchersTable() {
    const t = useTranslations('Vouchers');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<VoucherRow[]>(initialData);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const openDelete = (record: VoucherRow) => {
        setSelectedVoucher(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: VoucherRow) => {
        setSelectedVoucher(record);
        form.setFieldsValue({
            code: record.code,
            discountType: record.discountType,
            discountValue: record.discountValue,
            minOrderAmount: record.minOrderAmount,
            maxDiscountAmount: record.maxDiscountAmount,
            maxUsageCount: record.maxUsageCount,
            maxUsagePerCustomer: record.maxUsagePerCustomer,
            dateRange: [dayjs(record.startsAt), dayjs(record.endsAt)],
            isActive: record.isActive
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = () => {
        if (selectedVoucher) {
            setRows((prev) => prev.filter((row) => row.key !== selectedVoucher.key));
        }
        closeDelete();
    };

    const handleSave = () => {
        if (selectedVoucher) {
            const values = form.getFieldsValue();
            const range = values.dateRange || [];
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedVoucher.key
                        ? {
                            ...row,
                            ...values,
                            startsAt: range[0] ? range[0].format('YYYY-MM-DD') : row.startsAt,
                            endsAt: range[1] ? range[1].format('YYYY-MM-DD') : row.endsAt
                        }
                        : row
                )
            );
        }
        closeEdit();
    };

    const openAdd = () => {
        addForm.resetFields();
        setIsAddOpen(true);
    };

    const handleAdd = () => {
        const values = addForm.getFieldsValue();
        const range = values.dateRange || [];
        const nextKey = String(Date.now());
        setRows((prev) => [
            ...prev,
            {
                key: nextKey,
                code: values.code,
                discountType: values.discountType,
                discountValue: values.discountValue || '0',
                minOrderAmount: values.minOrderAmount || '',
                maxDiscountAmount: values.maxDiscountAmount || '',
                maxUsageCount: values.maxUsageCount || 0,
                usageCount: 0,
                maxUsagePerCustomer: values.maxUsagePerCustomer || 1,
                startsAt: range[0] ? range[0].format('YYYY-MM-DD') : '',
                endsAt: range[1] ? range[1].format('YYYY-MM-DD') : '',
                isActive: !!values.isActive
            }
        ]);
        closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<VoucherRow> = [
        { title: t('code'), dataIndex: 'code', key: 'code' },
        {
            title: t('discount'),
            key: 'discount',
            render: (_, record) => (
                <Tag color={record.discountType === 'percentage' ? 'blue' : 'purple'}>
                    {record.discountType === 'percentage'
                        ? `${record.discountValue}%`
                        : `${record.discountValue} ${t('currency')}`}
                </Tag>
            )
        },
        {
            title: t('minOrderAmount'),
            dataIndex: 'minOrderAmount',
            key: 'minOrderAmount',
            render: (value: string) => (value ? `${value} ${t('currency')}` : '-')
        },
        {
            title: t('maxDiscountAmount'),
            dataIndex: 'maxDiscountAmount',
            key: 'maxDiscountAmount',
            render: (value: string) => (value ? `${value} ${t('currency')}` : '-')
        },
        { title: t('maxUsageCount'), dataIndex: 'maxUsageCount', key: 'maxUsageCount' },
        { title: t('usageCount'), dataIndex: 'usageCount', key: 'usageCount' },
        { title: t('maxUsagePerCustomer'), dataIndex: 'maxUsagePerCustomer', key: 'maxUsagePerCustomer' },
        { title: t('startsAt'), dataIndex: 'startsAt', key: 'startsAt' },
        { title: t('endsAt'), dataIndex: 'endsAt', key: 'endsAt' },
        {
            title: t('status'),
            dataIndex: 'isActive',
            key: 'isActive',
            render: (value: boolean) => (
                <Tag color={value ? 'green' : 'default'}>
                    {value ? t('active') : t('inactive')}
                </Tag>
            )
        },
        {
            title: t('actions'),
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" type="link" onClick={() => openEdit(record)}>
                        {t('edit')}
                    </Button>
                    <Button size="small" danger type="link" onClick={() => openDelete(record)}>
                        {t('delete')}
                    </Button>
                </Space>
            )
        }
    ];
    const columns: ColumnsType<VoucherRow> = baseColumns.map((column) => ({
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
                    <Button type="primary" onClick={openAdd}>{t('addVoucher')}</Button>
                </div>
                <Card>
                    <Table columns={columns} dataSource={rows} pagination={false} />
                </Card>

                <Modal
                    title={t('deleteTitle')}
                    open={isDeleteOpen}
                    onCancel={closeDelete}
                    onOk={handleDelete}
                    okText={t('deleteOk')}
                    cancelText={t('deleteCancel')}
                >
                    <Typography.Text>
                        {selectedVoucher ? t('deleteConfirmWithName', { code: selectedVoucher.code }) : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                <Modal
                    title={t('editVoucher')}
                    open={isEditOpen}
                    onCancel={closeEdit}
                    onOk={handleSave}
                    okText={t('save')}
                    cancelText={t('cancel')}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item label={t('code')} name="code">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('discountType')} name="discountType">
                            <Select
                                options={[
                                    { value: 'percentage', label: t('discountPercentage') },
                                    { value: 'fixed', label: t('discountFixed') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const isPercent = getFieldValue('discountType') === 'percentage';
                                return (
                                    <Form.Item label={t('discountValue')} name="discountValue">
                                        <Space.Compact className="w-full">
                                            <Input className="h-10" />
                                            <span className="inline-flex items-center px-3 border border-gray-200 border-l-0 bg-gray-50 text-sm">
                                                {isPercent ? '%' : t('currency')}
                                            </span>
                                        </Space.Compact>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                        <Form.Item label={t('minOrderAmount')} name="minOrderAmount">
                            <Space.Compact className="w-full">
                                <Input className="h-10" />
                                <span className="inline-flex items-center px-3 border border-gray-200 border-l-0 bg-gray-50 text-sm">
                                    {t('currency')}
                                </span>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('maxDiscountAmount')} name="maxDiscountAmount">
                            <Space.Compact className="w-full">
                                <Input className="h-10" />
                                <span className="inline-flex items-center px-3 border border-gray-200 border-l-0 bg-gray-50 text-sm">
                                    {t('currency')}
                                </span>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('maxUsageCount')} name="maxUsageCount">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('maxUsagePerCustomer')} name="maxUsagePerCustomer">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('dateRange')} name="dateRange">
                            <DatePicker.RangePicker className="w-full h-10!" />
                        </Form.Item>
                        <Form.Item label={t('status')} name="isActive" valuePropName="checked">
                            <Switch checkedChildren={t('active')} unCheckedChildren={t('inactive')} />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title={t('addVoucher')}
                    open={isAddOpen}
                    onCancel={closeAdd}
                    onOk={handleAdd}
                    okText={t('save')}
                    cancelText={t('cancel')}
                >
                    <Form layout="vertical" form={addForm}>
                        <Form.Item label={t('code')} name="code" rules={[{ required: true }]}>
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('discountType')} name="discountType" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { value: 'percentage', label: t('discountPercentage') },
                                    { value: 'fixed', label: t('discountFixed') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const isPercent = getFieldValue('discountType') === 'percentage';
                                return (
                                    <Form.Item label={t('discountValue')} name="discountValue">
                                        <Space.Compact className="w-full">
                                            <Input className="h-10" />
                                            <span className="inline-flex items-center px-3 border border-gray-200 border-l-0 bg-gray-50 text-sm">
                                                {isPercent ? '%' : t('currency')}
                                            </span>
                                        </Space.Compact>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                        <Form.Item label={t('minOrderAmount')} name="minOrderAmount">
                            <Space.Compact className="w-full">
                                <Input className="h-10" />
                                <span className="inline-flex items-center px-3 border border-gray-200 border-l-0 bg-gray-50 text-sm">
                                    {t('currency')}
                                </span>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('maxDiscountAmount')} name="maxDiscountAmount">
                            <Space.Compact className="w-full">
                                <Input className="h-10" />
                                <span className="inline-flex items-center px-3 border border-gray-200 border-l-0 bg-gray-50 text-sm">
                                    {t('currency')}
                                </span>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('maxUsageCount')} name="maxUsageCount">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('maxUsagePerCustomer')} name="maxUsagePerCustomer">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('dateRange')} name="dateRange">
                            <DatePicker.RangePicker className="w-full h-10!" />
                        </Form.Item>
                        <Form.Item label={t('status')} name="isActive" valuePropName="checked">
                            <Switch checkedChildren={t('active')} unCheckedChildren={t('inactive')} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
}
