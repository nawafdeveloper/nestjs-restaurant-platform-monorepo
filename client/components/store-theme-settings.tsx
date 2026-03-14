"use client";

import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, ColorPicker, Form, Row, Segmented, Typography, Upload } from 'antd';
import { useTranslations } from 'next-intl';

type StoreThemeValues = {
    primaryColor: string;
    secondaryColor: string;
    bannerFile: any[];
    layout: string;
};

const initialValues: StoreThemeValues = {
    primaryColor: '#0E79EB',
    secondaryColor: '#FFB200',
    bannerFile: [],
    layout: 'classic'
};

export default function StoreThemeSettings() {
    const t = useTranslations('StoreTheme');
    const { Title, Text } = Typography;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <Title level={3} className="mb-1!">{t('title')}</Title>
                <Text>{t('subtitle')}</Text>
            </div>

            <Form className='h-10!' layout="vertical" initialValues={initialValues}>
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
                                    { label: t('layoutGrid'), value: 'grid' }
                                ]}
                                block
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-end gap-3">
                    <Button>{t('cancel')}</Button>
                    <Button type="primary">{t('save')}</Button>
                </div>
            </Form>
        </div>
    );
}
