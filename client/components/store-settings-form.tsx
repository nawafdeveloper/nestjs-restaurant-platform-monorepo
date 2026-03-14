"use client";

import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Switch, Typography, Upload } from 'antd';
import { useTranslations } from 'next-intl';

type StoreSettingsValues = {
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    phone: string;
    logoFile: File | null;
    isActive: boolean;
};

const initialValues: StoreSettingsValues = {
    name: 'Shawarma House',
    nameAr: 'بيت الشاورما',
    slug: 'shawarma-house',
    description: 'Fast casual shawarma and grill.',
    descriptionAr: 'مطعم شاورما وجريل سريع.',
    phone: '512345678',
    logoFile: null,
    isActive: true
};

export default function StoreSettingsForm() {
    const t = useTranslations('StoreSettings');
    const { Title, Text } = Typography;

    return (
        <div className="space-y-6 p-4 lg:p-0">
            <div className="space-y-1">
                <Title level={3} className="mb-1!">{t('title')}</Title>
                <Text>{t('subtitle')}</Text>
            </div>

            <Card>
                <Form layout="vertical" initialValues={initialValues}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('name')} name="name">
                                <Input className="h-12" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('nameAr')} name="nameAr">
                                <Input className="h-12" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('slug')} name="slug">
                                <Input className="h-12" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('phone')} name="phone">
                                <Input className="h-12" prefix="+966" />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label={t('description')} name="description">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label={t('descriptionAr')} name="descriptionAr">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('logo')} name="logoFile" valuePropName="fileList">
                                <Upload
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    showUploadList
                                >
                                    <Button icon={<UploadOutlined />}>{t('uploadLogo')}</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} className="flex items-center">
                            <Form.Item label={t('status')} name="isActive" valuePropName="checked">
                                <Switch checkedChildren={t('active')} unCheckedChildren={t('inactive')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end gap-3">
                        <Button className='h-10! bg-[#D9E5F1]! border-0!'>{t('cancel')}</Button>
                        <Button
                            className='h-10! border-0! overflow-hidden p-0!'
                            type="primary"
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
