"use client";

import React, { useState } from 'react';
import { Button, ConfigProvider, Empty, Form, Input, Modal, Select, Skeleton, Space, Switch, Table, Tag, Typography, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';
import Text from 'antd/es/typography/Text';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/types';

type ProductRow = {
    key: string;
    id: string;
    name: string;
    nameAr: string | null;
    categoryId: string;
    categoryName: string;
    basePrice: number;
    sortOrder: number;
    imageUrl: string | null;
    isActive: boolean;
    isAvailable: boolean;
};

function mapToRow(product: Product, categoryName: string): ProductRow {
    return {
        key: product.id,
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        categoryId: product.categoryId,
        categoryName,
        basePrice: product.basePrice,
        sortOrder: product.sortOrder,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        isAvailable: product.isAvailable,
    };
}

export default function ProductsTable() {
    const t = useTranslations('Products');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const {
        contextHolder,
        fetchLoading,
        saveLoading,
        data,
        categories,
        handleCreate,
        handleUpdate,
        handleDelete: deleteProduct,
        handleToggleActive,
        handleToggleAvailable,
    } = useProducts();

    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
    const categoryOptions = categories.map((c) => ({ value: c.id, label: locale === 'ar' ? (c.nameAr ?? c.name) : c.name }));
    const rows: ProductRow[] = data.map((p) => mapToRow(p, categoryMap[p.categoryId] ?? '—'));

    const openDelete = (record: ProductRow) => {
        setSelectedProduct(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: ProductRow) => {
        setSelectedProduct(record);
        form.setFieldsValue({
            name: record.name,
            nameAr: record.nameAr,
            categoryId: record.categoryId,
            basePrice: record.basePrice,
            sortOrder: record.sortOrder,
            imageFile: [],
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = async () => {
        if (!selectedProduct) return;
        const ok = await deleteProduct(selectedProduct.id);
        if (ok) closeDelete();
    };

    const handleSave = async () => {
        if (!selectedProduct) return;
        const values = form.getFieldsValue();
        const ok = await handleUpdate(selectedProduct.id, {
            name: values.name,
            nameAr: values.nameAr,
            categoryId: values.categoryId,
            basePrice: values.basePrice ? Number(values.basePrice) : undefined,
            sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
        });
        if (ok) closeEdit();
    };

    const openAdd = () => {
        addForm.resetFields();
        setIsAddOpen(true);
    };

    const handleAdd = async () => {
        const values = addForm.getFieldsValue();
        const ok = await handleCreate({
            categoryId: values.categoryId,
            name: values.name,
            nameAr: values.nameAr,
            basePrice: Number(values.basePrice),
            sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
        });
        if (ok) closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };

    const baseColumns: ColumnsType<ProductRow> = [
        {
            title: t('image'),
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (value: string | null) =>
                value
                    ? <img src={value} alt="" className="w-10 h-10 rounded object-cover" />
                    : '—'
        },
        { title: t('name'), dataIndex: 'name', key: 'name' },
        {
            title: t('nameAr'),
            dataIndex: 'nameAr',
            key: 'nameAr',
            render: (value: string | null) => value ?? '—'
        },
        { title: t('category'), dataIndex: 'categoryName', key: 'categoryName' },
        {
            title: t('basePrice'),
            dataIndex: 'basePrice',
            key: 'basePrice',
            render: (value: number) => `${Number(value).toFixed(2)} SAR`
        },
        { title: t('sortOrder'), dataIndex: 'sortOrder', key: 'sortOrder' },
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
            title: t('availability'),
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            render: (value: boolean) => (
                <Tag color={value ? 'blue' : 'default'}>
                    {value ? t('available') : t('unavailable')}
                </Tag>
            )
        },
        {
            title: t('toggleActive'),
            key: 'toggleActive',
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    loading={saveLoading}
                    onChange={(checked) => handleToggleActive(record.id, checked)}
                />
            )
        },
        {
            title: t('toggleAvailable'),
            key: 'toggleAvailable',
            render: (_, record) => (
                <Switch
                    checked={record.isAvailable}
                    loading={saveLoading}
                    onChange={(checked) => handleToggleAvailable(record.id, checked)}
                />
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

    if (fetchLoading) return <Skeleton active paragraph={{ rows: 8 }} />;

    return (
        <ConfigProvider direction={direction}>
            {contextHolder}
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
                            <Text className="px-3 text-white!">{t('addProduct')}</Text>
                        </div>
                    </Button>
                </div>

                {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-16">
                        <Empty
                            description={
                                <Typography.Text className="text-gray-400">
                                    {t('emptyState')}
                                </Typography.Text>
                            }
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="mt-4 h-10! border-0!"
                            style={{ backgroundColor: '#13B272' }}
                            onClick={openAdd}
                        >
                            {t('addProduct')}
                        </Button>
                    </div>
                ) : (
                    <Table
                        className='border! border-gray-200'
                        columns={columns}
                        dataSource={rows}
                        pagination={false}
                        scroll={{ x: true }}
                    />
                )}

                {/* Delete Modal */}
                <Modal
                    title={t('deleteTitle')}
                    open={isDeleteOpen}
                    onCancel={closeDelete}
                    onOk={handleDelete}
                    okText={t('deleteOk')}
                    cancelText={t('deleteCancel')}
                    confirmLoading={saveLoading}
                    okButtonProps={{ className: 'bg-[#ff4d4f]! h-10! border-0!' }}
                    cancelButtonProps={{ className: 'h-10! bg-[#D9E5F1]! border-0!', disabled: saveLoading }}
                >
                    <Typography.Text>
                        {selectedProduct
                            ? t('deleteConfirmWithName', { name: selectedProduct.name })
                            : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    title={t('editProduct')}
                    open={isEditOpen}
                    onCancel={closeEdit}
                    onOk={handleSave}
                    okText={t('save')}
                    cancelText={t('cancel')}
                    confirmLoading={saveLoading}
                    okButtonProps={{ className: 'bg-[#119F65]! h-10! border-0!' }}
                    cancelButtonProps={{ className: 'h-10! bg-[#D9E5F1]! border-0!', disabled: saveLoading }}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('category')} name="categoryId">
                            <Select options={categoryOptions} className='h-10!' />
                        </Form.Item>
                        <Form.Item label={t('basePrice')} name="basePrice">
                            <Space.Compact className='w-full'>
                                <Input className="h-10" type="number" />
                                <Space.Addon>SAR</Space.Addon>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('sortOrder')} name="sortOrder">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item
                            label={t('image')}
                            name="imageFile"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
                        >
                            <Upload beforeUpload={() => false} maxCount={1} showUploadList>
                                <Button icon={<UploadOutlined />}>{t('uploadImage')}</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Add Modal */}
                <Modal
                    title={t('addProduct')}
                    open={isAddOpen}
                    onCancel={closeAdd}
                    onOk={handleAdd}
                    okText={t('save')}
                    cancelText={t('cancel')}
                    confirmLoading={saveLoading}
                    okButtonProps={{ className: 'bg-[#119F65]! h-10! border-0!' }}
                    cancelButtonProps={{ className: 'h-10! bg-[#D9E5F1]! border-0!', disabled: saveLoading }}
                >
                    <Form layout="vertical" form={addForm}>
                        <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('category')} name="categoryId" rules={[{ required: true }]}>
                            <Select options={categoryOptions} className='h-10!' />
                        </Form.Item>
                        <Form.Item label={t('basePrice')} name="basePrice" rules={[{ required: true }]}>
                            <Space.Compact className='w-full'>
                                <Input className="h-10" type="number" />
                                <Space.Addon>SAR</Space.Addon>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('sortOrder')} name="sortOrder">
                            <Input className="h-10" type="number" />
                        </Form.Item>
                        <Form.Item
                            label={t('image')}
                            name="imageFile"
                            valuePropName="fileList"
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