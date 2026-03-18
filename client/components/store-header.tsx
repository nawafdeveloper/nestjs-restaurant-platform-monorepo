"use client";
import Image from 'next/image';
import { Button, ConfigProvider, Drawer, FloatButton, Modal, Segmented, Divider, Radio } from 'antd';
import Text from 'antd/es/typography/Text';
import { MdDeliveryDining, MdHail, MdShareLocation, MdMenu, MdStar, MdAccessTime, MdHome, MdInfo, MdPhone, MdLogin, MdShoppingCart, MdClose, MdStore } from 'react-icons/md';
import { useCallback, useMemo, useState } from 'react';
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Branch, CartItem, MapConfig, StoreInfo } from '@/types';

interface StoreHeaderProps {
    storeInfo: StoreInfo;
    branches: Branch[];
    cartItems?: CartItem[];
    mapConfig?: MapConfig;
    googleMapsApiKey?: string;
    onCheckout?: (items: CartItem[]) => void;
    onBranchSelect?: (branchId: string) => void;
    onLocationSelect?: (location: { lat: number; lng: number }) => void;
    onRemoveCartItem?: (itemId: string) => void;
    primaryColor: string;
    secondaryColor: string;
}

export default function StoreHeader({
    storeInfo,
    branches,
    cartItems = [],
    mapConfig = { defaultCenter: { lat: 24.7136, lng: 46.6753 }, zoom: 13 },
    googleMapsApiKey = '',
    onCheckout,
    onBranchSelect,
    onLocationSelect,
    onRemoveCartItem,
    primaryColor = '#0E79EB',
    secondaryColor = '#DAECFF'
}: StoreHeaderProps) {
    const t = useTranslations('StoreHeader');
    const tCart = useTranslations('CartModal');
    const locale = useLocale();
    const isArabic = locale === 'ar';

    const [selectedSegment, setSelectedSegment] = useState<'delivery' | 'receipent'>('delivery');
    const [menuDrawer, setMenuDrawer] = useState(false);
    const [locationModal, setLocationModal] = useState(false);
    const [branchModal, setBranchModal] = useState(false);
    const [cartModal, setCartModal] = useState(false);
    const [mapCenter, setMapCenter] = useState(mapConfig.defaultCenter);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleUseMyLocation = useCallback(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setMapCenter(next);
            setSelectedLocation(next);
        });
    }, []);

    const handleConfirmLocation = () => {
        if (selectedLocation) onLocationSelect?.(selectedLocation);
        setLocationModal(false);
    };

    const handleConfirmBranch = () => {
        if (selectedBranch) onBranchSelect?.(selectedBranch);
        setBranchModal(false);
    };

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        zoomControl: true
    }), []);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Segmented: {
                        itemSelectedBg: primaryColor,
                        itemSelectedColor: secondaryColor,
                        itemHoverBg: 'transparent',
                        itemColor: primaryColor,
                        trackPadding: 3,
                        borderRadius: 99,
                        itemHoverColor: primaryColor,
                    },
                    Radio: {
                        buttonSolidCheckedBg: primaryColor,
                        buttonSolidCheckedHoverBg: primaryColor,
                        colorPrimary: primaryColor,
                        colorPrimaryHover: primaryColor
                    },
                },
            }}
        >
            {/* ── Float Cart Button ── */}
            <FloatButton
                icon={<MdShoppingCart className="size-6" style={{ color: secondaryColor }} />}
                type="primary"
                style={{ background: primaryColor, width: 60, height: 60 }}
                onClick={() => setCartModal(true)}
                badge={{ count: cartCount, color: '#E0E1FF', style: { color: primaryColor, fontWeight: 700 } }}
            />

            {/* ── Banner + Store Card ── */}
            <div className="relative w-full pb-16 p-2">
                <div
                    className="relative w-full min-h-50 lg:min-h-100 bg-cover bg-center overflow-visible rounded-t-2xl"
                    style={{ backgroundImage: `url(${storeInfo.banner})` }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-row items-center justify-between p-4">
                        <Segmented
                            value={selectedSegment}
                            size="large"
                            options={[
                                { label: <MdDeliveryDining className="size-6 mt-1.25 mr-0.75" />, value: 'delivery' },
                                { label: <MdHail className="size-6 mt-1.25 mr-0.75" />, value: 'receipent' },
                            ]}
                            onChange={(value) => setSelectedSegment(value as 'delivery' | 'receipent')}
                            className="rounded-full!"
                            style={{ background: secondaryColor }}
                        />
                        <div className="flex flex-row items-center gap-x-3">
                            {selectedSegment === 'delivery' ? (
                                <Button
                                    style={{ background: secondaryColor, color: primaryColor }}
                                    type="primary" shape="round"
                                    icon={<MdShareLocation className="size-6 mt-1.25" />}
                                    size="large"
                                    onClick={() => setLocationModal(true)}
                                >
                                    <Text className="font-semibold!" style={{ color: primaryColor }}>
                                        {t('selectLocation')}
                                    </Text>
                                </Button>
                            ) : (
                                <Button
                                    style={{ background: secondaryColor, color: primaryColor }}
                                    type="primary" shape="round"
                                    icon={<MdStore className="size-6 mt-1.25" />}
                                    size="large"
                                    onClick={() => setBranchModal(true)}
                                >
                                    <Text className="font-semibold!" style={{ color: primaryColor }}>
                                        {t('selectBranch')}
                                    </Text>
                                </Button>
                            )}
                            <Button
                                style={{ background: secondaryColor, color: primaryColor }}
                                type="primary" shape="circle"
                                icon={<MdMenu className="size-6 mt-1 mr-0.5" />}
                                size="large"
                                onClick={() => setMenuDrawer(true)}
                            />
                        </div>
                    </div>

                    {/* Store Info Card */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-20 w-[calc(100%-2rem)]">
                        <div className="bg-white rounded-2xl px-5 py-4 flex flex-row items-center gap-4 border border-gray-100 shadow-sm">
                            <div
                                className="relative shrink-0 size-16 lg:size-20 rounded-xl overflow-hidden border-2"
                                style={{ borderColor: secondaryColor }}
                            >
                                <Image src={storeInfo.logo} alt="Restaurant logo" fill className="object-cover" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Text className="font-bold text-base! text-gray-900 truncate">
                                        {storeInfo.name}
                                    </Text>
                                    <Text
                                        className="text-xs! font-semibold px-2 py-0.5 rounded-full"
                                        style={storeInfo.isOpen
                                            ? { background: '#E6F9ED', color: '#1A8C3F' }
                                            : { background: '#FEE2E2', color: '#DC2626' }
                                        }
                                    >
                                        {storeInfo.isOpen ? t('statusOpen') : t('statusClosed')}
                                    </Text>
                                </div>
                                <Text className="text-xs! text-gray-500 truncate">{storeInfo.categories}</Text>
                                <div className="flex items-center gap-3 flex-wrap mt-0.5">
                                    <div className="flex items-center gap-1">
                                        <MdStar className="size-4" style={{ color: '#F5A623' }} />
                                        <Text className="text-sm! font-semibold text-gray-800!">{storeInfo.rating}</Text>
                                        <Text className="text-xs! text-gray-400">({storeInfo.reviewCount})</Text>
                                    </div>
                                    <Text className="text-gray-200!">|</Text>
                                    <div className="flex items-center gap-1">
                                        <MdAccessTime className="size-4 text-gray-400" />
                                        <Text className="text-sm! text-gray-400!">{storeInfo.deliveryTime}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sidebar Drawer ── */}
            <Drawer
                title={t('drawerTitle')}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => setMenuDrawer(false)}
                open={menuDrawer}
                placement={isArabic ? 'left' : 'right'}
            >
                <div className="flex flex-col h-full">
                    <nav className="flex flex-col space-y-2 justify-end items-end w-full">
                        {[
                            { icon: <MdHome className="size-5" />, label: t('sidebarMenu.home') },
                            { icon: <MdInfo className="size-5" />, label: t('sidebarMenu.about') },
                            { icon: <MdPhone className="size-5" />, label: t('sidebarMenu.contact') },
                        ].map(({ icon, label }) => (
                            <Button
                                key={label}
                                type="text"
                                icon={icon}
                                className="flex items-center justify-start rounded-lg! hover:bg-gray-50"
                                style={{ color: primaryColor }}
                                onClick={() => setMenuDrawer(false)}
                            >
                                <span className="font-medium">{label}</span>
                            </Button>
                        ))}
                    </nav>
                    <Divider className="my-4" />
                    <div className="mt-auto">
                        <Button
                            type="primary"
                            icon={<MdLogin className="size-5" />}
                            className="w-full h-12! rounded-full! font-semibold"
                            style={{ background: primaryColor, color: secondaryColor, border: 'none' }}
                            onClick={() => setMenuDrawer(false)}
                        >
                            {t('loginButton')}
                        </Button>
                    </div>
                </div>
            </Drawer>

            {/* ── Location Modal ── */}
            <Modal
                title={t('selectYourLocation')}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={locationModal}
                onOk={() => setLocationModal(false)}
                onCancel={() => setLocationModal(false)}
                styles={{ container: { borderRadius: '1rem', padding: 0 }, title: { padding: 15 } }}
                footer={null}
            >
                <APIProvider apiKey={googleMapsApiKey}>
                    <Map
                        center={mapCenter}
                        zoom={mapConfig.zoom ?? 13}
                        style={{ height: 440, width: '100%' }}
                        gestureHandling="greedy"
                        options={mapOptions}
                        onClick={(e) => {
                            if (!e.detail?.latLng) return;
                            setSelectedLocation({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
                        }}
                    >
                        {selectedLocation && <Marker position={selectedLocation} />}
                    </Map>
                </APIProvider>
                <div className='flex flex-col space-y-4 mt-4 px-4 pb-4'>
                    <Button onClick={handleUseMyLocation} type='primary' className='h-10! rounded-full!' style={{ background: primaryColor, color: secondaryColor }}>
                        <Text className='text-white! font-semibold!'>{t('showMyLocation')}</Text>
                    </Button>
                    <Button onClick={handleConfirmLocation} type='default' className='h-10! rounded-full!' style={{ background: secondaryColor, color: primaryColor }}>
                        <Text className='font-semibold!'>{t('selectLocation')}</Text>
                    </Button>
                </div>
            </Modal>

            {/* ── Branch Modal ── */}
            <Modal
                title={t('modalTitle')}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={branchModal}
                onOk={() => setBranchModal(false)}
                onCancel={() => setBranchModal(false)}
                styles={{ container: { borderRadius: '1rem', padding: 15 }, title: { padding: 15 } }}
                footer={null}
            >
                <Radio.Group
                    className="w-full p-4"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                >
                    <div className="space-y-3">
                        {branches.map((branch) => (
                            <label
                                key={branch.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <Radio value={branch.id} className="shrink-0" />
                                <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                                    <Text className="font-semibold text-sm text-gray-900">{branch.name}</Text>
                                    <Text className="text-xs text-gray-500">{branch.address} • {branch.status}</Text>
                                </div>
                            </label>
                        ))}
                    </div>
                </Radio.Group>
                <div className='mt-4 px-4 pb-4'>
                    <Button
                        type='primary'
                        className='h-10! rounded-full! w-full!'
                        style={{ background: primaryColor, color: secondaryColor }}
                        disabled={!selectedBranch}
                        onClick={handleConfirmBranch}
                    >
                        <Text className='text-white! font-semibold!'>{t('saveChanges')}</Text>
                    </Button>
                </div>
            </Modal>

            {/* ── Cart Modal ── */}
            <Modal
                title={tCart('cartTitle')}
                closable={{ 'aria-label': 'Close Button' }}
                open={cartModal}
                onCancel={() => setCartModal(false)}
                styles={{
                    container: { borderRadius: '1rem', padding: 0 },
                    title: { padding: 15 },
                    body: { padding: 0, maxHeight: '70vh', overflowY: 'auto' }
                }}
                footer={null}
            >
                <div className="flex flex-col h-full">
                    <div className="flex flex-col space-y-4 p-5">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-gray-900">{tCart('cartTitle')}</h3>
                            <Text className="text-sm text-gray-500">{cartCount} {tCart('items')}</Text>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <MdShoppingCart className="size-12 text-gray-200" />
                                <Text className="text-gray-400 text-sm">{tCart('emptyCart')}</Text>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="relative shrink-0 size-16 rounded-lg overflow-hidden bg-white">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                                            <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                                            <Text className="text-xs text-gray-500">
                                                {item.size ? `${item.size} • ` : ''}x{item.quantity}
                                            </Text>
                                            <Text className="text-sm font-bold" style={{ color: primaryColor }}>
                                                SAR {(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </div>
                                        <button
                                            onClick={() => onRemoveCartItem?.(item.id)}
                                            className="shrink-0 size-6 rounded-full flex items-center justify-center text-white"
                                            style={{ background: primaryColor }}
                                            aria-label={tCart('removeItem')}
                                        >
                                            <MdClose className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex flex-col gap-1">
                                        <Text className="text-sm text-gray-500">{tCart('subtotal')}</Text>
                                        <Text className="text-lg font-bold text-gray-900">SAR {cartTotal.toFixed(2)}</Text>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <Text className="text-sm text-gray-500">{tCart('total')}</Text>
                                        <Text className="text-xl font-bold" style={{ color: primaryColor }}>SAR {cartTotal.toFixed(2)}</Text>
                                    </div>
                                </div>
                                <Button
                                    type="primary"
                                    className="w-full h-12! rounded-full! font-semibold!"
                                    style={{ background: primaryColor, color: secondaryColor, border: 'none' }}
                                    onClick={() => { onCheckout?.(cartItems); setCartModal(false); }}
                                >
                                    {tCart('checkout')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </ConfigProvider>
    );
}