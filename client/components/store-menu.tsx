"use client";
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { Carousel, Checkbox, ConfigProvider, Drawer, Radio } from 'antd';
import { MdClose } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { MenuCategory, MenuItem, StoreMenuHandle } from '@/types';

interface StoreMenuProps {
    ref: React.Ref<StoreMenuHandle>;
    categories: MenuCategory[];
    activeTab: string;
    onSectionVisible: (key: string) => void;
    primaryColor: string;
    secondaryColor: string;
    onAddToCart: (
        item: MenuItem,
        quantity: number,
        selectedVariants: {
            radio: Record<string, string>;
            checkbox: Record<string, string[]>;
        }
    ) => void;
}

export default function StoreMenu({
    ref,
    categories,
    activeTab,
    onSectionVisible,
    primaryColor,
    secondaryColor,
    onAddToCart,
}: StoreMenuProps) {
    const t = useTranslations('FoodMenu');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const scrollTriggeredByClick = useRef(false);

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
    const [checkboxSelections, setCheckboxSelections] = useState<Record<string, string[]>>({});

    useImperativeHandle(ref, () => ({
        flagClickScroll: () => { scrollTriggeredByClick.current = true; },
    }));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const key = entry.target.getAttribute('data-section');
                        if (key) onSectionVisible(key);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' }
        );
        categories.forEach(({ id }) => {
            const el = sectionRefs.current[id];
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [categories, onSectionVisible]);

    useEffect(() => {
        if (!scrollTriggeredByClick.current) return;
        scrollTriggeredByClick.current = false;
        const target = sectionRefs.current[activeTab];
        if (!target) return;
        const offset = 60;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }, [activeTab]);

    useEffect(() => {
        if (selectedItem) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [selectedItem]);

    const openDrawer = (item: MenuItem) => {
        setSelectedItem(item);
        setQuantity(1);
        const defaultRadios: Record<string, string> = {};
        item.variants?.forEach((v) => {
            if (v.type === 'radio' && v.options.length > 0) {
                defaultRadios[v.id] = v.options[0]?.label ?? '';
            }
        });
        setRadioSelections(defaultRadios);
        setCheckboxSelections({});
    };

    const closeDrawer = () => setSelectedItem(null);

    const getExtraPrice = () => {
        if (!selectedItem) return 0;
        let extra = 0;
        selectedItem.variants?.forEach((v) => {
            if (v.type === 'radio') {
                const sel = radioSelections[v.id];
                const opt = v.options.find((o) => o.label === sel);
                extra += opt?.price ?? 0;
            } else {
                const sels = checkboxSelections[v.id] ?? [];
                sels.forEach((label) => {
                    const opt = v.options.find((o) => o.label === label);
                    extra += opt?.price ?? 0;
                });
            }
        });
        return extra;
    };

    const totalPrice = selectedItem ? (selectedItem.price + getExtraPrice()) * quantity : 0;

    const getCarouselImages = (item: MenuItem) => [item.image, item.image, item.image];

    const isAddToCartEnabled = () => {
        if (!selectedItem) return false;
        const requiredVariants = selectedItem.variants?.filter((v) => v.required) || [];
        for (const variant of requiredVariants.filter((v) => v.type === 'radio')) {
            if (!radioSelections[variant.id]) return false;
        }
        for (const variant of requiredVariants.filter((v) => v.type === 'checkbox')) {
            if ((checkboxSelections[variant.id] || []).length === 0) return false;
        }
        return true;
    };

    const handleAddToCart = () => {
        if (!selectedItem || !isAddToCartEnabled()) return;
        onAddToCart(selectedItem, quantity, {
            radio: radioSelections,
            checkbox: checkboxSelections,
        });
        closeDrawer();
    };

    return (
        <ConfigProvider
            theme={{
                token: { colorPrimary: primaryColor },
                components: {
                    Radio: {
                        colorPrimary: primaryColor,
                        buttonSolidCheckedBg: primaryColor,
                        buttonSolidCheckedHoverBg: primaryColor,
                    },
                    Checkbox: {
                        colorPrimary: primaryColor,
                        colorPrimaryHover: primaryColor,
                    },
                },
            }}
        >
            <div className="px-4 pb-16 space-y-10">
                {categories.map((category) => (
                    <section
                        key={category.id}
                        ref={(el) => { sectionRefs.current[category.id] = el; }}
                        data-section={category.id}
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4 pt-6 border-b border-gray-100 pb-2">
                            {category.name}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {category.items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => openDrawer(item)}
                                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <div className="relative shrink-0 size-20 rounded-lg overflow-hidden bg-gray-100">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 gap-1">
                                        <span className="font-semibold text-sm text-gray-900 truncate">{item.name}</span>
                                        <span className="text-xs text-gray-400 line-clamp-2">{item.description}</span>
                                        <span className="text-sm font-bold mt-1" style={{ color: primaryColor }}>
                                            {item.price} {t('currency')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                                        className="shrink-0 size-8 rounded-full flex items-center justify-center text-white text-xl font-bold"
                                        style={{ background: primaryColor }}
                                        aria-label={t('addToCartAria', { name: item.name })}
                                    >
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <Drawer
                placement="bottom"
                open={!!selectedItem}
                onClose={closeDrawer}
                size="90%"
                closeIcon={null}
                destroyOnHidden
                title={null}
                footer={null}
                styles={{
                    section: {
                        width: '100%',
                        maxWidth: 600,
                        borderRadius: '20px 20px 0 0',
                        overflow: 'hidden',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        boxShadow: 'none',
                    },
                    body: {
                        padding: 0,
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 100px)',
                    },
                    wrapper: { boxShadow: 'none' },
                    mask: { boxShadow: 'none' },
                }}
                style={{ borderRadius: '20px 20px 0 0', boxShadow: 'none' }}
            >
                {selectedItem && (
                    <div className="flex flex-col">
                        <div className="relative w-full" style={{ height: 280 }}>
                            <Carousel autoplay={false} dotPlacement="bottom" dots={{ className: 'carousel-dots' }}>
                                {getCarouselImages(selectedItem).map((src, i) => (
                                    <div key={i}>
                                        <div className="relative w-full" style={{ height: 280 }}>
                                            <Image
                                                src={src}
                                                alt={`${selectedItem.name} view ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                priority={i === 0}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                            <button
                                onClick={closeDrawer}
                                className="absolute top-3 right-3 z-10 size-9 rounded-full flex items-center justify-center shadow-lg"
                                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
                                aria-label={t('close')}
                            >
                                <MdClose className="size-5 text-gray-700" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5 px-5 pt-5 pb-6 max-w-3xl mx-auto w-full">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-xl font-bold text-gray-900 flex-1 leading-snug">
                                    {selectedItem.name}
                                </h2>
                                <span className="text-xl font-bold shrink-0" style={{ color: primaryColor }}>
                                    {selectedItem.price} {t('currency')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed -mt-2">{selectedItem.description}</p>

                            {selectedItem.variants?.map((variant) => (
                                <div key={variant.id} className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-900 text-sm">{variant.name}</span>
                                        {variant.required && (
                                            <span
                                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                                style={{ background: secondaryColor, color: primaryColor }}
                                            >
                                                {t('required')}
                                            </span>
                                        )}
                                    </div>
                                    {variant.type === 'radio' && (
                                        <Radio.Group
                                            value={radioSelections[variant.id]}
                                            onChange={(e) =>
                                                setRadioSelections((prev) => ({ ...prev, [variant.id]: e.target.value }))
                                            }
                                            className="flex flex-col space-y-2"
                                        >
                                            {variant.options.map((opt) => (
                                                <label
                                                    key={opt.label}
                                                    className="flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-colors"
                                                    style={{
                                                        borderColor: radioSelections[variant.id] === opt.label ? primaryColor : '#E5E7EB',
                                                        background: radioSelections[variant.id] === opt.label ? secondaryColor : 'white',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Radio value={opt.label} />
                                                        <span className="text-sm text-gray-800">{opt.label}</span>
                                                    </div>
                                                    {opt.price != null && opt.price > 0 && (
                                                        <span className="text-sm font-semibold" style={{ color: primaryColor }}>
                                                            +{opt.price} {t('currency')}
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                        </Radio.Group>
                                    )}
                                    {variant.type === 'checkbox' && (
                                        <div className="flex flex-col gap-2">
                                            {variant.options.map((opt) => {
                                                const selected = (checkboxSelections[variant.id] ?? []).includes(opt.label);
                                                return (
                                                    <label
                                                        key={opt.label}
                                                        className="flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-colors"
                                                        style={{
                                                            borderColor: selected ? primaryColor : '#E5E7EB',
                                                            background: selected ? secondaryColor : 'white',
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                checked={selected}
                                                                onChange={(e) => {
                                                                    setCheckboxSelections((prev) => {
                                                                        const current = prev[variant.id] ?? [];
                                                                        return {
                                                                            ...prev,
                                                                            [variant.id]: e.target.checked
                                                                                ? [...current, opt.label]
                                                                                : current.filter((l) => l !== opt.label),
                                                                        };
                                                                    });
                                                                }}
                                                            />
                                                            <span className="text-sm text-gray-800">{opt.label}</span>
                                                        </div>
                                                        {opt.price != null && opt.price > 0 && (
                                                            <span className="text-sm font-semibold" style={{ color: primaryColor }}>
                                                                +{opt.price} {t('currency')}
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center gap-4 pt-2">
                                <div
                                    className="flex items-center rounded-full border-2"
                                    style={{ borderColor: secondaryColor }}
                                >
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="size-10 flex items-center justify-center text-xl font-bold"
                                        style={{ color: primaryColor }}
                                        aria-label={t('decreaseQuantityAria')}
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-semibold text-gray-900 select-none">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="size-10 flex items-center justify-center text-xl font-bold"
                                        style={{ color: primaryColor }}
                                        aria-label={t('increaseQuantityAria')}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className={`flex-1 h-11 rounded-full text-white font-semibold text-sm transition-opacity ${!isAddToCartEnabled() ? 'opacity-50 cursor-not-allowed' : 'active:opacity-80'
                                        }`}
                                    style={{ background: primaryColor }}
                                    disabled={!isAddToCartEnabled()}
                                    onClick={handleAddToCart}
                                >
                                    {t('addToCart')} · {totalPrice.toFixed(0)} {t('currency')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </ConfigProvider>
    );
}