"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Modal, Space, Switch, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import Text from 'antd/es/typography/Text';
import { PlusOutlined } from '@ant-design/icons';

type BranchRow = {
    key: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    status: 'Active' | 'Inactive';
};

const initialData: BranchRow[] = [
    {
        key: '1',
        name: 'Al Olaya Branch',
        city: 'Riyadh',
        address: 'Olaya Street, Building 12',
        phone: '512345678',
        status: 'Active'
    },
    {
        key: '2',
        name: 'Al Malaz Branch',
        city: 'Riyadh',
        address: 'Malaz District, Street 7',
        phone: '598765432',
        status: 'Inactive'
    }
];

export default function BranchesTable() {
    const t = useTranslations('Branches');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<BranchRow[]>(initialData);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<BranchRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const openDelete = (record: BranchRow) => {
        setSelectedBranch(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: BranchRow) => {
        setSelectedBranch(record);
        form.setFieldsValue({
            name: record.name,
            city: record.city,
            address: record.address,
            phone: record.phone
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = () => {
        if (selectedBranch) {
            setRows((prev) => prev.filter((row) => row.key !== selectedBranch.key));
        }
        closeDelete();
    };

    const handleSave = () => {
        if (selectedBranch) {
            const values = form.getFieldsValue();
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedBranch.key
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
                city: values.city,
                address: values.address,
                phone: values.phone,
                status: 'Active'
            }
        ]);
        closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<BranchRow> = [
        { title: t('name'), dataIndex: 'name', key: 'name' },
        { title: t('city'), dataIndex: 'city', key: 'city' },
        { title: t('address'), dataIndex: 'address', key: 'address' },
        { title: t('phone'), dataIndex: 'phone', key: 'phone' },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (value: BranchRow['status']) => (
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
    const columns: ColumnsType<BranchRow> = baseColumns.map((column) => ({
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
                            <Text className="px-3 text-white!">{t('addBranch')}</Text>
                        </div>
                    </Button>
                </div>
                <Table className='border! border-gray-200' columns={columns} dataSource={rows} pagination={false} />
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
                        {selectedBranch ? t('deleteConfirmWithName', { name: selectedBranch.name }) : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>
                <Modal
                    title={t('editBranch')}
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
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('city')} name="city">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('address')} name="address">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('phone')} name="phone">
                            <Input className="h-10" />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={t('addBranch')}
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
                        <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('city')} name="city">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('address')} name="address">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('phone')} name="phone">
                            <Input className="h-10" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
}
