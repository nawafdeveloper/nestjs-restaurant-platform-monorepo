"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Modal, Select, Space, Table, Tag, Typography, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';

type ProductRow = {
    key: string;
    name: string;
    nameAr: string;
    category: string;
    basePrice: string;
    sortOrder: number;
    imageUrl: string;
    status: 'Active' | 'Inactive';
    availability: 'Available' | 'Unavailable';
};

const initialData: ProductRow[] = [
    {
        key: '1',
        name: 'Chicken Shawarma',
        nameAr: 'شاورما دجاج',
        category: 'Shawarma',
        basePrice: '12.00',
        sortOrder: 1,
        imageUrl: 'https://placehold.co/80x80',
        status: 'Active',
        availability: 'Available'
    },
    {
        key: '2',
        name: 'Beef Burger',
        nameAr: 'برجر لحم',
        category: 'Burgers',
        basePrice: '22.00',
        sortOrder: 2,
        imageUrl: 'https://placehold.co/80x80',
        status: 'Inactive',
        availability: 'Unavailable'
    }
];

export default function ProductsTable() {
    const t = useTranslations('Products');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const categoryOptions = [
        { value: 'Shawarma', label: t('categoryShawarma') },
        { value: 'Burgers', label: t('categoryBurgers') }
    ];
    const [rows, setRows] = useState<ProductRow[]>(initialData);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const openDelete = (record: ProductRow) => {
        setSelectedProduct(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: ProductRow) => {
        setSelectedProduct(record);
        form.setFieldsValue({
            name: record.name,
            nameAr: record.nameAr,
            category: record.category,
            basePrice: record.basePrice,
            sortOrder: record.sortOrder
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = () => {
        if (selectedProduct) {
            setRows((prev) => prev.filter((row) => row.key !== selectedProduct.key));
        }
        closeDelete();
    };

    const handleSave = () => {
        if (selectedProduct) {
            const values = form.getFieldsValue();
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedProduct.key
                        ? { ...row, ...values }
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
                name: values.name,
                nameAr: values.nameAr,
                category: values.category,
                basePrice: values.basePrice || '0.00',
                sortOrder: values.sortOrder || 0,
                imageUrl: 'https://placehold.co/80x80',
                status: 'Active',
                availability: 'Available'
            }
        ]);
        closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<ProductRow> = [
        { title: t('name'), dataIndex: 'name', key: 'name' },
        { title: t('nameAr'), dataIndex: 'nameAr', key: 'nameAr' },
        { title: t('category'), dataIndex: 'category', key: 'category' },
        { title: t('basePrice'), dataIndex: 'basePrice', key: 'basePrice' },
        { title: t('sortOrder'), dataIndex: 'sortOrder', key: 'sortOrder' },
        {
            title: t('image'),
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url: string) => (
                <img src={url} alt={t('imageAlt')} className="h-10 w-10 rounded object-cover" />
            )
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (value: ProductRow['status']) => (
                <Tag color={value === 'Active' ? 'green' : 'default'}>
                    {value === 'Active' ? t('active') : t('inactive')}
                </Tag>
            )
        },
        {
            title: t('availability'),
            dataIndex: 'availability',
            key: 'availability',
            render: (value: ProductRow['availability']) => (
                <Tag color={value === 'Available' ? 'blue' : 'default'}>
                    {value === 'Available' ? t('available') : t('unavailable')}
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
    const columns: ColumnsType<ProductRow> = baseColumns.map((column) => ({
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
                    <Button type="primary" onClick={openAdd}>{t('addProduct')}</Button>
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
                        {selectedProduct ? t('deleteConfirmWithName', { name: selectedProduct.name }) : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                <Modal
                    title={t('editProduct')}
                    open={isEditOpen}
                    onCancel={closeEdit}
                    onOk={handleSave}
                    okText={t('save')}
                    cancelText={t('cancel')}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('category')} name="category">
                            <Select options={categoryOptions} className='h-10!'/>
                        </Form.Item>
                        <Form.Item label={t('basePrice')} name="basePrice">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('sortOrder')} name="sortOrder">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('image')} name="imageFile" valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
                        >
                            <Upload beforeUpload={() => false} maxCount={1} showUploadList>
                                <Button icon={<UploadOutlined />}>{t('uploadImage')}</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title={t('addProduct')}
                    open={isAddOpen}
                    onCancel={closeAdd}
                    onOk={handleAdd}
                    okText={t('save')}
                    cancelText={t('cancel')}
                >
                    <Form layout="vertical" form={addForm}>
                        <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('category')} name="category">
                            <Select options={categoryOptions} className='h-10!'/>
                        </Form.Item>
                        <Form.Item label={t('basePrice')} name="basePrice">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('sortOrder')} name="sortOrder">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item label={t('image')} name="imageFile" valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
                        >
                            <Upload beforeUpload={() => false} maxCount={1} showUploadList>
                                <Button icon={<UploadOutlined />}>{t('uploadImage')}</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
}
