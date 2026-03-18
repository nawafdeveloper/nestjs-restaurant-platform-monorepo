"use client";

import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, ColorPicker, Form, Row, Segmented, Skeleton, Typography, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { StoreThemeValues } from '@/types';

export default function StoreThemeSettings() {
    const t = useTranslations('StoreTheme');
    const { Title, Text } = Typography;
    const [form] = Form.useForm<StoreThemeValues>();

    const { contextHolder, fetchLoading, saveLoading, appearance, handleUpdate } = useAppearance();

    // لما تجي البيانات نحطها في الـ form
    useEffect(() => {
        if (!appearance) return;
        form.setFieldsValue({
            primaryColor: appearance.primaryColor ?? '#0E79EB',
            secondaryColor: appearance.secondaryColor ?? '#FFB200',
            layout: (appearance.layout?.type as string) ?? 'classic',
            bannerFile: [],
        });
    }, [appearance]);

    const handleSave = async () => {
        const values = form.getFieldsValue();

        // ColorPicker يرجع object أو string حسب الاستخدام
        const primaryColor = typeof values.primaryColor === 'string'
            ? values.primaryColor
            : (values.primaryColor as any)?.toHexString?.() ?? '';

        const secondaryColor = typeof values.secondaryColor === 'string'
            ? values.secondaryColor
            : (values.secondaryColor as any)?.toHexString?.() ?? '';

        await handleUpdate({
            primaryColor,
            secondaryColor,
            layout: { type: values.layout },
        });
    };

    const handleReset = () => {
        form.setFieldsValue({
            primaryColor: appearance?.primaryColor ?? '#0E79EB',
            secondaryColor: appearance?.secondaryColor ?? '#FFB200',
            layout: (appearance?.layout?.type as string) ?? 'classic',
            bannerFile: [],
        });
    };

    if (fetchLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

    return (
        <div className="space-y-6">
            {contextHolder}
            <div className="space-y-1">
                <Title level={3} className="mb-1!">{t('title')}</Title>
                <Text>{t('subtitle')}</Text>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        primaryColor: appearance?.primaryColor ?? '#0E79EB',
                        secondaryColor: appearance?.secondaryColor ?? '#FFB200',
                        layout: (appearance?.layout?.type as string) ?? 'classic',
                        bannerFile: [],
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('primaryColor')} name="primaryColor">
                                <ColorPicker showText allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('secondaryColor')} name="secondaryColor">
                                <ColorPicker showText allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={t('banner')}
                                name="bannerFile"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
                            >
                                <Upload beforeUpload={() => false} maxCount={1} showUploadList>
                                    <Button icon={<UploadOutlined />}>{t('uploadBanner')}</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('layout')} name="layout">
                                <Segmented
                                    options={[
                                        { label: t('layoutClassic'), value: 'classic' },
                                        { label: t('layoutCentered'), value: 'centered' },
                                        { label: t('layoutGrid'), value: 'grid' },
                                    ]}
                                    block
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            className='h-10! bg-[#D9E5F1]! border-0!'
                            onClick={handleReset}
                            disabled={saveLoading}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            className='h-10! border-0! overflow-hidden p-0!'
                            type="primary"
                            loading={saveLoading}
                            style={{ backgroundColor: '#13B272' }}
                            onClick={handleSave}
                        >
                            <div className="flex items-center h-full">
                                <div className="h-full flex items-center justify-center px-4" style={{ backgroundColor: '#119F65' }}>
                                    <SaveOutlined />
                                </div>
                                <Text className="px-3 text-white!">{t('save')}</Text>
                            </div>
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}