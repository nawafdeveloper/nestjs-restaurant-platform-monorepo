"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Modal, Space, Table, Tag, Typography, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import Text from 'antd/es/typography/Text';
import { PlusOutlined } from '@ant-design/icons';

type VariantRow = {
    key: string;
    product: string;
    name: string;
    nameAr: string;
    isRequired: boolean;
    allowMultiple: boolean;
    sortOrder: number;
};

const initialData: VariantRow[] = [
    {
        key: '1',
        product: 'Chicken Shawarma',
        name: 'Size',
        nameAr: 'الحجم',
        isRequired: true,
        allowMultiple: false,
        sortOrder: 1
    },
    {
        key: '2',
        product: 'Beef Burger',
        name: 'Add-ons',
        nameAr: 'إضافات',
        isRequired: false,
        allowMultiple: true,
        sortOrder: 2
    }
];

export default function VariantsTable() {
    const t = useTranslations('Variants');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<VariantRow[]>(initialData);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<VariantRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const productOptions = [
        { value: 'Chicken Shawarma', label: t('productShawarma') },
        { value: 'Beef Burger', label: t('productBurger') }
    ];

    const openDelete = (record: VariantRow) => {
        setSelectedVariant(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: VariantRow) => {
        setSelectedVariant(record);
        form.setFieldsValue({
            product: record.product,
            name: record.name,
            nameAr: record.nameAr,
            sortOrder: record.sortOrder,
            isRequired: record.isRequired,
            allowMultiple: record.allowMultiple
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = () => {
        if (selectedVariant) {
            setRows((prev) => prev.filter((row) => row.key !== selectedVariant.key));
        }
        closeDelete();
    };

    const handleSave = () => {
        if (selectedVariant) {
            const values = form.getFieldsValue();
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedVariant.key
                        ? {
                            ...row,
                            ...values,
                            isRequired: !!values.isRequired,
                            allowMultiple: !!values.allowMultiple
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
        const nextKey = String(Date.now());
        setRows((prev) => [
            ...prev,
            {
                key: nextKey,
                product: values.product,
                name: values.name,
                nameAr: values.nameAr,
                isRequired: !!values.isRequired,
                allowMultiple: !!values.allowMultiple,
                sortOrder: values.sortOrder || 0
            }
        ]);
        closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<VariantRow> = [
        { title: t('product'), dataIndex: 'product', key: 'product' },
        { title: t('name'), dataIndex: 'name', key: 'name' },
        { title: t('nameAr'), dataIndex: 'nameAr', key: 'nameAr' },
        {
            title: t('required'),
            dataIndex: 'isRequired',
            key: 'isRequired',
            render: (value: boolean) => (
                <Tag color={value ? 'green' : 'default'}>
                    {value ? t('yes') : t('no')}
                </Tag>
            )
        },
        {
            title: t('allowMultiple'),
            dataIndex: 'allowMultiple',
            key: 'allowMultiple',
            render: (value: boolean) => (
                <Tag color={value ? 'blue' : 'default'}>
                    {value ? t('yes') : t('no')}
                </Tag>
            )
        },
        { title: t('sortOrder'), dataIndex: 'sortOrder', key: 'sortOrder' },
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
    const columns: ColumnsType<VariantRow> = baseColumns.map((column) => ({
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
                    <Button
                        className='h-10! border-0! overflow-hidden p-0!'
                        type="primary"
                        style={{ backgroundColor: '#13B272' }}
                        onClick={openAdd}
                    >
                        <div className="flex items-center h-full">
                            <div className="h-full flex items-center justify-center px-4" style={{ backgroundColor: '#119F65' }}>
                                <PlusOutlined />
                            </div>
                            <Text className="px-3 text-white!">{t('addVariant')}</Text>
                        </div>
                    </Button>
                </div>
                <Table columns={columns} dataSource={rows} pagination={false} />
                <Modal
                    title={t('deleteTitle')}
                    open={isDeleteOpen}
                    onCancel={closeDelete}
                    onOk={handleDelete}
                    okText={t('deleteOk')}
                    cancelText={t('deleteCancel')}
                    okButtonProps={{
                        className: 'bg-[#ff4d4f]! h-10! border-0!'
                    }}
                    cancelButtonProps={{
                        className: 'h-10! bg-[#D9E5F1]! border-0!'
                    }}
                >
                    <Typography.Text>
                        {selectedVariant ? t('deleteConfirmWithName', { name: selectedVariant.name }) : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>
                <Modal
                    title={t('editVariant')}
                    open={isEditOpen}
                    onCancel={closeEdit}
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
                        <Form.Item label={t('product')} name="product">
                            <Select options={productOptions} className='h-10!' />
                        </Form.Item>
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('sortOrder')} name="sortOrder">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('required')} name="isRequired" valuePropName="checked">
                            <Select
                                options={[
                                    { value: true, label: t('yes') },
                                    { value: false, label: t('no') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                        <Form.Item label={t('allowMultiple')} name="allowMultiple" valuePropName="checked">
                            <Select
                                options={[
                                    { value: true, label: t('yes') },
                                    { value: false, label: t('no') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={t('addVariant')}
                    open={isAddOpen}
                    onCancel={closeAdd}
                    onOk={handleAdd}
                    okText={t('save')}
                    cancelText={t('cancel')}
                    okButtonProps={{
                        className: 'bg-[#119F65]! h-10! border-0!'
                    }}
                    cancelButtonProps={{
                        className: 'h-10! bg-[#D9E5F1]! border-0!'
                    }}
                >
                    <Form layout="vertical" form={addForm}>
                        <Form.Item label={t('product')} name="product" rules={[{ required: true }]}>
                            <Select options={productOptions} className='h-10!' />
                        </Form.Item>
                        <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('sortOrder')} name="sortOrder">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('required')} name="isRequired">
                            <Select
                                options={[
                                    { value: true, label: t('yes') },
                                    { value: false, label: t('no') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                        <Form.Item label={t('allowMultiple')} name="allowMultiple">
                            <Select
                                options={[
                                    { value: true, label: t('yes') },
                                    { value: false, label: t('no') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
}
