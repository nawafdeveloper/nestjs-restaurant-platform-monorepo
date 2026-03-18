"use client";

import React, { useState } from 'react';
import { Button, ConfigProvider, Empty, Form, Input, Modal, Skeleton, Space, Switch, Table, Tag, Typography, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';
import Text from 'antd/es/typography/Text';
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/types';

type CategoryRow = {
    key: string;
    id: string;
    name: string;
    nameAr: string | null;
    sortOrder: number;
    imageUrl: string | null;
    isActive: boolean;
};

function mapToRow(category: Category): CategoryRow {
    return {
        key: category.id,
        id: category.id,
        name: category.name,
        nameAr: category.nameAr,
        sortOrder: category.sortOrder,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
    };
}

export default function CategoriesTable() {
    const t = useTranslations('Categories');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const {
        contextHolder,
        fetchLoading,
        saveLoading,
        data,
        handleCreate,
        handleUpdate,
        handleDelete: deleteCategory,
        handleToggle,
    } = useCategories();

    const rows: CategoryRow[] = data.map(mapToRow);

    const openDelete = (record: CategoryRow) => {
        setSelectedCategory(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: CategoryRow) => {
        setSelectedCategory(record);
        form.setFieldsValue({
            name: record.name,
            nameAr: record.nameAr,
            sortOrder: record.sortOrder,
            imageFile: [],
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = async () => {
        if (!selectedCategory) return;
        const ok = await deleteCategory(selectedCategory.id);
        if (ok) closeDelete();
    };

    const handleSave = async () => {
        if (!selectedCategory) return;
        const values = form.getFieldsValue();
        const ok = await handleUpdate(selectedCategory.id, {
            name: values.name,
            nameAr: values.nameAr,
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
            name: values.name,
            nameAr: values.nameAr,
            sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
        });
        if (ok) closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };

    const baseColumns: ColumnsType<CategoryRow> = [
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
        { title: t('sortOrder'), dataIndex: 'sortOrder', key: 'sortOrder' },
        {
            title: t('status'),
            dataIndex: 'isActive',
            key: 'status',
            render: (value: boolean) => (
                <Tag color={value ? 'green' : 'default'}>
                    {value ? t('active') : t('inactive')}
                </Tag>
            )
        },
        {
            title: t('toggle'),
            key: 'toggle',
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    loading={saveLoading}
                    onChange={(checked) => handleToggle(record.id, checked)}
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

    const columns: ColumnsType<CategoryRow> = baseColumns.map((column) => ({
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
                            <Text className="px-3 text-white!">{t('addCategory')}</Text>
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
                            {t('addCategory')}
                        </Button>
                    </div>
                ) : (
                    <Table
                        className='border! border-gray-200'
                        columns={columns}
                        dataSource={rows}
                        pagination={false}
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
                        {selectedCategory
                            ? t('deleteConfirmWithName', { name: selectedCategory.name })
                            : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    title={t('editCategory')}
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
                    title={t('addCategory')}
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