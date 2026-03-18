"use client";

import { useModifyStoreData } from '@/hooks/use-modify-store-data';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Skeleton, Switch, Typography, Upload } from 'antd';
import { useTranslations } from 'next-intl';

export default function StoreSettingsForm() {
    const t = useTranslations('StoreSettings');
    const { Title, Text } = Typography;
    const {
        form,
        updateField,
        fetchLoading,
        saveLoading,
        handleSave,
        contextHolder,
    } = useModifyStoreData();

    if (fetchLoading) return <Skeleton active paragraph={{ rows: 8 }} />;

    return (
        <div className="space-y-6 p-4 lg:p-0">
            {contextHolder}
            <div className="space-y-1">
                <Title level={3} className="mb-1!">{t('title')}</Title>
                <Text>{t('subtitle')}</Text>
            </div>

            <Card>
                <Form layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('name')}>
                                <Input
                                    className="h-12"
                                    value={form.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('nameAr')}>
                                <Input
                                    className="h-12"
                                    dir="rtl"
                                    value={form.nameAr}
                                    onChange={(e) => updateField('nameAr', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('slug')}>
                                <Input
                                    className="h-12"
                                    value={form.slug}
                                    onChange={(e) => updateField('slug', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('phone')}>
                                <Input
                                    className="h-12"
                                    dir='ltr'
                                    value={form.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label={t('description')}>
                                <Input.TextArea
                                    rows={3}
                                    dir="ltr"
                                    value={form.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label={t('descriptionAr')}>
                                <Input.TextArea
                                    rows={3}
                                    dir="rtl"
                                    value={form.descriptionAr}
                                    onChange={(e) => updateField('descriptionAr', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('logo')}>
                                <Upload
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    showUploadList
                                >
                                    <Button icon={<UploadOutlined />}>{t('uploadLogo')}</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end gap-3">
                        <Button className='h-10! bg-[#D9E5F1]! border-0!'>{t('cancel')}</Button>
                        <Button
                            className='h-10! border-0! overflow-hidden p-0!'
                            type="primary"
                            loading={saveLoading}
                            disabled={saveLoading}
                            onClick={handleSave}
                            style={{ backgroundColor: '#13B272' }}
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