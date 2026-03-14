"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Modal, Space, Switch, Table, Tag, Typography, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';

type CategoryRow = {
    key: string;
    name: string;
    nameAr: string;
    sortOrder: number;
    imageUrl: string;
    status: 'Active' | 'Inactive';
};

const initialData: CategoryRow[] = [
    {
        key: '1',
        name: 'Shawarma',
        nameAr: 'شاورما',
        sortOrder: 1,
        imageUrl: 'https://placehold.co/80x80',
        status: 'Active'
    },
    {
        key: '2',
        name: 'Burgers',
        nameAr: 'برجر',
        sortOrder: 2,
        imageUrl: 'https://placehold.co/80x80',
        status: 'Inactive'
    }
];

export default function CategoriesTable() {
    const t = useTranslations('Categories');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<CategoryRow[]>(initialData);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const openDelete = (record: CategoryRow) => {
        setSelectedCategory(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: CategoryRow) => {
        setSelectedCategory(record);
        form.setFieldsValue({
            name: record.name,
            nameAr: record.nameAr,
            sortOrder: record.sortOrder
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = () => {
        if (selectedCategory) {
            setRows((prev) => prev.filter((row) => row.key !== selectedCategory.key));
        }
        closeDelete();
    };

    const handleSave = () => {
        if (selectedCategory) {
            const values = form.getFieldsValue();
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedCategory.key
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
                sortOrder: values.sortOrder || 0,
                imageUrl: 'https://placehold.co/80x80',
                status: 'Active'
            }
        ]);
        closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<CategoryRow> = [
        { title: t('name'), dataIndex: 'name', key: 'name' },
        { title: t('nameAr'), dataIndex: 'nameAr', key: 'nameAr' },
        { title: t('sortOrder'), dataIndex: 'sortOrder', key: 'sortOrder' },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (value: CategoryRow['status']) => (
                <Tag color={value === 'Active' ? 'green' : 'default'}>
                    {value === 'Active' ? t('active') : t('inactive')}
                </Tag>
            )
        },
        {
            title: t('toggle'),
            key: 'toggle',
            render: (_, record) => (
                <Switch checked={record.status === 'Active'} />
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
                    <Button type="primary" onClick={openAdd}>{t('addCategory')}</Button>
                </div>
                <Table columns={columns} dataSource={rows} pagination={false} />
                <Modal
                    title={t('deleteTitle')}
                    open={isDeleteOpen}
                    onCancel={closeDelete}
                    onOk={handleDelete}
                    okText={t('deleteOk')}
                    cancelText={t('deleteCancel')}
                >
                    <Typography.Text>
                        {selectedCategory ? t('deleteConfirmWithName', { name: selectedCategory.name }) : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                <Modal
                    title={t('editCategory')}
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
                    title={t('addCategory')}
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
