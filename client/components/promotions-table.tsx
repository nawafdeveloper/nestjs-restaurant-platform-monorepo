"use client";

import React, { useState } from 'react';
import { Button, Card, ConfigProvider, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import Text from 'antd/es/typography/Text';
import { PlusOutlined } from '@ant-design/icons';

type PromotionRow = {
    key: string;
    name: string;
    nameAr: string;
    discountType: 'percentage' | 'fixed';
    discountValue: string;
    promotionType: 'store_wide' | 'category' | 'product';
    targetId: string;
    minOrderAmount: string;
    maxDiscountAmount: string;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
};

const initialData: PromotionRow[] = [
    {
        key: '1',
        name: 'Weekend Sale',
        nameAr: 'تخفيضات نهاية الأسبوع',
        discountType: 'percentage',
        discountValue: '15',
        promotionType: 'store_wide',
        targetId: '',
        minOrderAmount: '50',
        maxDiscountAmount: '30',
        startsAt: '2026-03-10',
        endsAt: '2026-03-20',
        isActive: true
    },
    {
        key: '2',
        name: 'Burger Deal',
        nameAr: 'عرض البرجر',
        discountType: 'fixed',
        discountValue: '10',
        promotionType: 'product',
        targetId: 'Beef Burger',
        minOrderAmount: '',
        maxDiscountAmount: '',
        startsAt: '2026-03-01',
        endsAt: '2026-03-30',
        isActive: false
    }
];

export default function PromotionsTable() {
    const t = useTranslations('Promotions');
    const locale = useLocale();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const [rows, setRows] = useState<PromotionRow[]>(initialData);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionRow | null>(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const productOptions = [
        { value: 'Chicken Shawarma', label: t('productShawarma') },
        { value: 'Beef Burger', label: t('productBurger') }
    ];
    const categoryOptions = [
        { value: 'Shawarma', label: t('categoryShawarma') },
        { value: 'Burgers', label: t('categoryBurgers') }
    ];

    const openDelete = (record: PromotionRow) => {
        setSelectedPromotion(record);
        setIsDeleteOpen(true);
    };

    const openEdit = (record: PromotionRow) => {
        setSelectedPromotion(record);
        form.setFieldsValue({
            name: record.name,
            nameAr: record.nameAr,
            discountType: record.discountType,
            discountValue: record.discountValue,
            promotionType: record.promotionType,
            targetId: record.targetId,
            minOrderAmount: record.minOrderAmount,
            maxDiscountAmount: record.maxDiscountAmount,
            dateRange: [dayjs(record.startsAt), dayjs(record.endsAt)],
            isActive: record.isActive
        });
        setIsEditOpen(true);
    };

    const closeDelete = () => setIsDeleteOpen(false);
    const closeEdit = () => setIsEditOpen(false);
    const closeAdd = () => setIsAddOpen(false);

    const handleDelete = () => {
        if (selectedPromotion) {
            setRows((prev) => prev.filter((row) => row.key !== selectedPromotion.key));
        }
        closeDelete();
    };

    const handleSave = () => {
        if (selectedPromotion) {
            const values = form.getFieldsValue();
            const range = values.dateRange || [];
            setRows((prev) =>
                prev.map((row) =>
                    row.key === selectedPromotion.key
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
                name: values.name,
                nameAr: values.nameAr,
                discountType: values.discountType,
                discountValue: values.discountValue || '0',
                promotionType: values.promotionType,
                targetId: values.targetId || '',
                minOrderAmount: values.minOrderAmount || '',
                maxDiscountAmount: values.maxDiscountAmount || '',
                startsAt: range[0] ? range[0].format('YYYY-MM-DD') : '',
                endsAt: range[1] ? range[1].format('YYYY-MM-DD') : '',
                isActive: !!values.isActive
            }
        ]);
        closeAdd();
    };

    const headerCellStyle = { backgroundColor: '#F6F9FC' };
    const baseColumns: ColumnsType<PromotionRow> = [
        { title: t('name'), dataIndex: 'name', key: 'name' },
        { title: t('nameAr'), dataIndex: 'nameAr', key: 'nameAr' },
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
            title: t('promotionType'),
            dataIndex: 'promotionType',
            key: 'promotionType',
            render: (value: PromotionRow['promotionType']) => t(`type.${value}`)
        },
        { title: t('minOrderAmount'), dataIndex: 'minOrderAmount', key: 'minOrderAmount' },
        { title: t('maxDiscountAmount'), dataIndex: 'maxDiscountAmount', key: 'maxDiscountAmount' },
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
    const columns: ColumnsType<PromotionRow> = baseColumns.map((column) => ({
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
                            <Text className="px-3 text-white!">{t('addPromotion')}</Text>
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
                        {selectedPromotion ? t('deleteConfirmWithName', { name: selectedPromotion.name }) : t('deleteConfirm')}
                    </Typography.Text>
                </Modal>

                <Modal
                    title={t('editPromotion')}
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
                        <Form.Item label={t('nameAr')} name="nameAr">
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
                        <Form.Item label={t('discountValue')} name="discountValue">
                            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.discountType !== curr.discountType}>
                                {({ getFieldValue }) => {
                                    const type = getFieldValue('discountType');
                                    const isPercentage = type === 'percentage';

                                    return (
                                        <Space.Compact className='w-full'>
                                            <Form.Item name="discountValue" noStyle>
                                                {isPercentage ? (
                                                    <InputNumber
                                                        className="w-full h-10"
                                                        min={0}
                                                        max={100}
                                                        precision={2}
                                                        step={0.01}
                                                        placeholder="0.00"
                                                        controls={false}
                                                        style={{ width: 'calc(100% - 40px)' }}
                                                    />
                                                ) : (
                                                    <InputNumber
                                                        className="w-full h-10"
                                                        min={0}
                                                        precision={2}
                                                        step={0.01}
                                                        placeholder="0.00"
                                                        controls={false}
                                                        style={{ width: 'calc(100% - 40px)' }}
                                                    />
                                                )}
                                            </Form.Item>
                                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-300">
                                                {isPercentage ? '%' : t('currency')}
                                            </div>
                                        </Space.Compact>
                                    );
                                }}
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={t('promotionType')} name="promotionType">
                            <Select
                                options={[
                                    { value: 'store_wide', label: t('typeStoreWide') },
                                    { value: 'category', label: t('typeCategory') },
                                    { value: 'product', label: t('typeProduct') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const type = getFieldValue('promotionType');
                                if (type === 'category') {
                                    return (
                                        <Form.Item label={t('targetCategory')} name="targetId">
                                            <Select options={categoryOptions} className='h-10!' />
                                        </Form.Item>
                                    );
                                }
                                if (type === 'product') {
                                    return (
                                        <Form.Item label={t('targetProduct')} name="targetId">
                                            <Select options={productOptions} className='h-10!' />
                                        </Form.Item>
                                    );
                                }
                                return null;
                            }}
                        </Form.Item>
                        <Form.Item label={t('minOrderAmount')} name="minOrderAmount">
                            <Space.Compact className='w-full'>
                                <Form.Item name="minOrderAmount" noStyle>
                                    <InputNumber
                                        className="w-full h-10"
                                        min={0}
                                        precision={2}
                                        step={0.01}
                                        placeholder="0.00"
                                        controls={false}
                                        style={{ width: 'calc(100% - 40px)' }}
                                    />
                                </Form.Item>
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-300">
                                    {t('currency')}
                                </div>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('maxDiscountAmount')} name="maxDiscountAmount">
                            <Space.Compact className='w-full'>
                                <Form.Item name="maxDiscountAmount" noStyle>
                                    <InputNumber
                                        className="w-full h-10"
                                        min={0}
                                        precision={2}
                                        step={0.01}
                                        placeholder="0.00"
                                        controls={false}
                                        style={{ width: 'calc(100% - 40px)' }}
                                    />
                                </Form.Item>
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-300">
                                    {t('currency')}
                                </div>
                            </Space.Compact>
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
                    title={t('addPromotion')}
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
                        <Form.Item label={t('nameAr')} name="nameAr">
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
                        <Form.Item label={t('discountValue')} name="discountValue" rules={[{ required: true }]}>
                            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.discountType !== curr.discountType}>
                                {({ getFieldValue }) => {
                                    const type = getFieldValue('discountType');
                                    const isPercentage = type === 'percentage';

                                    return (
                                        <Space.Compact className='w-full'>
                                            <Form.Item name="discountValue" noStyle>
                                                {isPercentage ? (
                                                    <InputNumber
                                                        className="w-full h-10"
                                                        min={0}
                                                        max={100}
                                                        precision={2}
                                                        step={0.01}
                                                        placeholder="0.00"
                                                        controls={false}
                                                        style={{ width: 'calc(100% - 40px)' }}
                                                    />
                                                ) : (
                                                    <InputNumber
                                                        className="w-full h-10"
                                                        min={0}
                                                        precision={2}
                                                        step={0.01}
                                                        placeholder="0.00"
                                                        controls={false}
                                                        style={{ width: 'calc(100% - 40px)' }}
                                                    />
                                                )}
                                            </Form.Item>
                                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-300">
                                                {isPercentage ? '%' : t('currency')}
                                            </div>
                                        </Space.Compact>
                                    );
                                }}
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={t('promotionType')} name="promotionType" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { value: 'store_wide', label: t('typeStoreWide') },
                                    { value: 'category', label: t('typeCategory') },
                                    { value: 'product', label: t('typeProduct') }
                                ]}
                                className='h-10!'
                            />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const type = getFieldValue('promotionType');
                                if (type === 'category') {
                                    return (
                                        <Form.Item label={t('targetCategory')} name="targetId" rules={[{ required: true }]}>
                                            <Select options={categoryOptions} className='h-10!' />
                                        </Form.Item>
                                    );
                                }
                                if (type === 'product') {
                                    return (
                                        <Form.Item label={t('targetProduct')} name="targetId" rules={[{ required: true }]}>
                                            <Select options={productOptions} className='h-10!' />
                                        </Form.Item>
                                    );
                                }
                                return null;
                            }}
                        </Form.Item>
                        <Form.Item label={t('minOrderAmount')} name="minOrderAmount">
                            <Space.Compact className='w-full'>
                                <Form.Item name="minOrderAmount" noStyle>
                                    <InputNumber
                                        className="w-full h-10"
                                        min={0}
                                        precision={2}
                                        step={0.01}
                                        placeholder="0.00"
                                        controls={false}
                                        style={{ width: 'calc(100% - 40px)' }}
                                    />
                                </Form.Item>
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-300">
                                    {t('currency')}
                                </div>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label={t('maxDiscountAmount')} name="maxDiscountAmount">
                            <Space.Compact className='w-full'>
                                <Form.Item name="maxDiscountAmount" noStyle>
                                    <InputNumber
                                        className="w-full h-10"
                                        min={0}
                                        precision={2}
                                        step={0.01}
                                        placeholder="0.00"
                                        controls={false}
                                        style={{ width: 'calc(100% - 40px)' }}
                                    />
                                </Form.Item>
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-300">
                                    {t('currency')}
                                </div>
                            </Space.Compact>
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
