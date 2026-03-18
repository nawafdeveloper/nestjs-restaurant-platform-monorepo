"use client";

import React, { useState } from 'react';
import { Button, ConfigProvider, Empty, Form, Input, Modal, Skeleton, Space, Switch, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import Text from 'antd/es/typography/Text';
import { PlusOutlined } from '@ant-design/icons';
import { useBranches, type Branch } from '@/hooks/use-branches';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

type BranchRow = {
    key: string;
    id: string;
    name: string;
    nameAr: string | null;
    city: string;
    address: string;
    phone: string | null;
    isActive: boolean;
};

type LatLng = { lat: number; lng: number };

const DEFAULT_CENTER: LatLng = { lat: 24.7136, lng: 46.6753 }; // الرياض

function mapToRow(branch: Branch): BranchRow {
    return {
        key: branch.id,
        id: branch.id,
        name: branch.name,
        nameAr: branch.nameAr,
        city: branch.city,
        address: branch.address,
        phone: branch.phone,
        isActive: branch.isActive,
    };
}

// ========== Map Picker Component ==========

function MapPicker({
    value,
    onChange,
}: {
    value: LatLng | null;
    onChange: (val: LatLng) => void;
}) {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <div className="w-full h-56 overflow-hidden border border-gray-200 mb-2">
                <Map
                    defaultCenter={value ?? DEFAULT_CENTER}
                    defaultZoom={12}
                    gestureHandling="greedy"
                    disableDefaultUI
                    onClick={(e) => {
                        if (e.detail.latLng) {
                            onChange({
                                lat: e.detail.latLng.lat,
                                lng: e.detail.latLng.lng,
                            });
                        }
                    }}
                >
                    {value && <Marker position={value} />}
                </Map>
            </div>
            {value ? (
                <Typography.Text type="secondary" className="text-xs">
                    {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </Typography.Text>
            ) : (
                <Typography.Text type="secondary" className="text-xs">
                    اضغط على الخريطة لتحديد الموقع
                </Typography.Text>
            )}
        </APIProvider>
    );
}

// ========== Main Component ==========

export default function BranchesTable() {
    const t = useTranslations('Branches');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<BranchRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    // حالة الخريطة لكل modal
    const [editLatLng, setEditLatLng] = useState<LatLng | null>(null);
    const [addLatLng, setAddLatLng] = useState<LatLng | null>(null);

    const {
        contextHolder,
        fetchLoading,
        saveLoading,
        data,
        handleCreate,
        handleUpdate,
        handleDelete: deleteBranch,
    } = useBranches();

    const rows: BranchRow[] = data.map(mapToRow);

    const openDelete = (record: BranchRow) => {
        setSelectedBranch(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: BranchRow) => {
        setSelectedBranch(record);
        form.setFieldsValue({
            name: record.name,
            nameAr: record.nameAr,
            city: record.city,
            address: record.address,
            phone: record.phone,
        });
        // لو عنده lat/lng موجودين نحطهم
        const original = data.find((b) => b.id === record.id);
        setEditLatLng(
            original?.latitude && original?.longitude
                ? { lat: Number(original.latitude), lng: Number(original.longitude) }
                : null
        );
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => { setIsEditOpen(false); setEditLatLng(null); };
    const closeAdd = () => { setIsAddOpen(false); setAddLatLng(null); };

    const handleDelete = async () => {
        if (!selectedBranch) return;
        const ok = await deleteBranch(selectedBranch.id);
        if (ok) closeDelete();
    };

    const handleSave = async () => {
        if (!selectedBranch) return;
        const values = form.getFieldsValue();
        const ok = await handleUpdate(selectedBranch.id, {
            ...values,
            latitude: editLatLng ? String(editLatLng.lat) : undefined,
            longitude: editLatLng ? String(editLatLng.lng) : undefined,
        });
        if (ok) closeEdit();
    };

    const openAdd = () => {
        addForm.resetFields();
        setAddLatLng(null);
        setIsAddOpen(true);
    };

    const handleAdd = async () => {
        const values = addForm.getFieldsValue();
        const ok = await handleCreate({
            ...values,
            latitude: addLatLng ? String(addLatLng.lat) : undefined,
            longitude: addLatLng ? String(addLatLng.lng) : undefined,
        });
        if (ok) closeAdd();
    };

    const handleToggle = async (record: BranchRow, checked: boolean) => {
        await handleUpdate(record.id, { isActive: checked } as any);
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };

    const baseColumns: ColumnsType<BranchRow> = [
        { title: t('name'), dataIndex: 'name', key: 'name' },
        {
            title: t('nameAr'),
            dataIndex: 'nameAr',
            key: 'nameAr',
            render: (value: string | null) => value ?? '—'
        },
        { title: t('city'), dataIndex: 'city', key: 'city' },
        { title: t('address'), dataIndex: 'address', key: 'address' },
        {
            title: t('phone'),
            dataIndex: 'phone',
            key: 'phone',
            render: (value: string | null) => value ?? '—'
        },
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
                    onChange={(checked) => handleToggle(record, checked)}
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

    const columns: ColumnsType<BranchRow> = baseColumns.map((column) => ({
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
                            <Text className="px-3 text-white!">{t('addBranch')}</Text>
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
                            {t('addBranch')}
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
                        {selectedBranch
                            ? t('deleteConfirmWithName', { name: selectedBranch.name })
                            : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    title={t('editBranch')}
                    open={isEditOpen}
                    onCancel={closeEdit}
                    onOk={handleSave}
                    okText={t('save')}
                    cancelText={t('cancel')}
                    confirmLoading={saveLoading}
                    okButtonProps={{ className: 'bg-[#119F65]! h-10! border-0!' }}
                    cancelButtonProps={{ className: 'h-10! bg-[#D9E5F1]! border-0!', disabled: saveLoading }}
                >
                    <MapPicker value={editLatLng} onChange={setEditLatLng} />
                    <Form layout="vertical" form={form}>
                        <Form.Item label={t('name')} name="name">
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
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

                {/* Add Modal */}
                <Modal
                    title={t('addBranch')}
                    open={isAddOpen}
                    onCancel={closeAdd}
                    onOk={handleAdd}
                    okText={t('save')}
                    cancelText={t('cancel')}
                    confirmLoading={saveLoading}
                    okButtonProps={{ className: 'bg-[#119F65]! h-10! border-0!' }}
                    cancelButtonProps={{ className: 'h-10! bg-[#D9E5F1]! border-0!', disabled: saveLoading }}
                >
                    <MapPicker value={addLatLng} onChange={setAddLatLng} />
                    <Form layout="vertical" form={addForm}>
                        <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
                            <Input className="h-10" />
                        </Form.Item>
                        <Form.Item label={t('nameAr')} name="nameAr">
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