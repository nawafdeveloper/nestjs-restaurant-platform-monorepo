"use client";

import {
    EnvironmentOutlined,
    MenuOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import { Button, Drawer, Modal, Tabs, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import Image from "next/image";

export default function StoreHeader() {
    const t = useTranslations('StoreHeader');
    const [modalOpen, setModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('olaya');
    const headerColor = '#991b26';
    const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 });
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

    const branches = [
        { id: 'olaya', name: t('branches.olaya'), distance: t('branches.distance', { km: 3 }) },
        { id: 'malaz', name: t('branches.malaz'), distance: t('branches.distance', { km: 6 }) },
        { id: 'dammam', name: t('branches.dammam'), distance: t('branches.distance', { km: 18 }) }
    ];

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

    const handleUseMyLocation = useCallback(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setMapCenter(next);
            setSelectedLocation(next);
        });
    }, []);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        zoomControl: true
    }), []);

    return (
        <header className="relative overflow-hidden" style={{ backgroundColor: headerColor }}>
            <div className="relative">
                <div className="flex items-start gap-x-5 justify-between p-4 lg:p-8">
                    <Button
                        onClick={() => setMenuOpen(true)}
                        type="default"
                        shape="circle"
                        className="rounded-sm! h-10! w-10! border-0 shadow-sm"
                        icon={<MenuOutlined />}
                    />
                    <div className="flex flex-col items-center gap-3 w-full">
                        <Button
                            onClick={() => setModalOpen(true)}
                            icon={<EnvironmentOutlined />}
                            className="h-10! w-full rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm"
                        >
                            <Typography.Text>{t('chooseBranch')}</Typography.Text>
                        </Button>
                    </div>
                    <Button
                        onClick={() => setCartOpen(true)}
                        type="default"
                        shape="circle"
                        className="rounded-sm! h-10! w-10! border-0 shadow-sm"
                        icon={<ShoppingOutlined />}
                    />
                </div>
                <div className="relative -mx-4 lg:-mx-8 overflow-hidden lg:h-64 bg-gray-200">
                    <Image
                        src="https://media-files.tryordersystem.com/tenant/7gm/settings/68ecb43fb1622.png"
                        alt="Store banner"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="relative flex h-32 items-end px-12 pb-3 lg:px-24">
                        <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 overflow-hidden rounded-full justify-center items-center bg-gray-300 shadow-sm ring-1 ring-gray-200">
                                <Image
                                    src="https://media-files.tryordersystem.com/tenant/7gm/settings/684ecd5d6b62e.png"
                                    alt="Store logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="bg-black/30 px-3 py-1.5">
                                <Typography.Title level={4} className="mb-0! text-white!">
                                    {t('storeName')}
                                </Typography.Title>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
                                <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                                    <Typography.Text className="text-xs">{t('openNow')}</Typography.Text>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={t('modalTitle')}
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                okText={t('modalOk')}
                cancelText={t('modalCancel')}
            >
                <Tabs
                    defaultActiveKey="delivery"
                    items={[
                        {
                            key: 'delivery',
                            label: <span className="px-2">{t('tabs.delivery')}</span>,
                            children: (
                                <div className="space-y-3 w-full">
                                    <div className="border border-gray-200 overflow-hidden -mx-4 sm:-mx-6 -mt-2">
                                        <APIProvider apiKey={apiKey}>
                                            <Map
                                                center={mapCenter}
                                                zoom={13}
                                                style={{ height: 260, width: '100%' }}
                                                gestureHandling="greedy"
                                                options={mapOptions}
                                                onClick={(e) => {
                                                    if (!e.detail?.latLng) return;
                                                    const next = {
                                                        lat: e.detail.latLng.lat,
                                                        lng: e.detail.latLng.lng
                                                    };
                                                    setSelectedLocation(next);
                                                }}
                                            >
                                                {selectedLocation && <Marker position={selectedLocation} />}
                                            </Map>
                                        </APIProvider>
                                    </div>
                                    <Button onClick={handleUseMyLocation} type="primary" className="w-full">
                                        <Typography.Text className="text-white!">{t('useMyLocation')}</Typography.Text>
                                    </Button>
                                </div>
                            )
                        },
                        {
                            key: 'pickup',
                            label: <span className="px-2">{t('tabs.pickup')}</span>,
                            children: (
                                <div className="space-y-3">
                                    {branches.map((branch) => (
                                        <button
                                            key={branch.id}
                                            type="button"
                                            onClick={() => setSelectedBranch(branch.id)}
                                            className={`w-full rounded-xs border px-4 py-3 text-left transition ${selectedBranch === branch.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <Typography.Text className="font-medium">{branch.name}</Typography.Text>
                                                <Typography.Text className="text-xs text-gray-500">{branch.distance}</Typography.Text>
                                            </div>
                                            <Typography.Text className="mt-1 text-xs text-gray-500">{t('pickupEta')}</Typography.Text>
                                        </button>
                                    ))}
                                </div>
                            )
                        }
                    ]}
                    onChange={() => { }}
                />
            </Modal>

            <Drawer
                title={t('menuTitle')}
                closable
                onClose={() => setMenuOpen(false)}
                open={menuOpen}
                placement="left"
            >
                <div className="space-y-3">
                    <Typography.Text className="font-medium">{t('menu.shawarma')}</Typography.Text>
                    <Typography.Text className="text-sm text-gray-600">{t('menu.burgers')}</Typography.Text>
                    <Typography.Text className="text-sm text-gray-600">{t('menu.grills')}</Typography.Text>
                    <Typography.Text className="text-sm text-gray-600">{t('menu.sides')}</Typography.Text>
                    <Typography.Text className="text-sm text-gray-600">{t('menu.drinks')}</Typography.Text>
                </div>
            </Drawer>

            <Drawer
                title={t('cartTitle')}
                closable
                onClose={() => setCartOpen(false)}
                open={cartOpen}
                placement="right"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography.Text className="text-sm font-medium">{t('cart.item1')}</Typography.Text>
                            <Typography.Text className="text-xs text-gray-500">{t('cart.item1Meta')}</Typography.Text>
                        </div>
                        <Typography.Text className="text-sm font-semibold">{t('cart.item1Price')}</Typography.Text>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography.Text className="text-sm font-medium">{t('cart.item2')}</Typography.Text>
                            <Typography.Text className="text-xs text-gray-500">{t('cart.item2Meta')}</Typography.Text>
                        </div>
                        <Typography.Text className="text-sm font-semibold">{t('cart.item2Price')}</Typography.Text>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                        <Typography.Text className="text-sm text-gray-600">{t('cart.total')}</Typography.Text>
                        <Typography.Text className="text-base font-semibold">{t('cart.totalPrice')}</Typography.Text>
                    </div>
                    <Button type="primary" className="w-full h-10!">
                        <Typography.Text className="text-white">{t('cart.checkout')}</Typography.Text>
                    </Button>
                </div>
            </Drawer>
        </header>
    );
}
