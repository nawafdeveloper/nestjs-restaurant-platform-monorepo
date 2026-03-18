"use client";
import { useRef, useState } from 'react';
import StoreTabs from './store-tabs';
import StoreMenu from './store-menu';
import { MenuCategory, MenuItem, StoreMenuHandle } from '@/types';

interface StoreClientProps {
    categories: MenuCategory[];
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

export default function StoreClient({
    categories,
    primaryColor = '#0E79EB',
    secondaryColor = '#DAECFF',
    onAddToCart,
}: StoreClientProps) {
    const [activeTab, setActiveTab] = useState<string>(categories[0]?.id ?? '');
    const menuRef = useRef<StoreMenuHandle>(null);

    return (
        <div className='w-full'>
            <StoreTabs
                categories={categories}
                activeKey={activeTab}
                onTabChange={setActiveTab}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
            <StoreMenu
                ref={menuRef}
                categories={categories}
                activeTab={activeTab}
                onSectionVisible={setActiveTab}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onAddToCart={onAddToCart}
            />
        </div>
    );
}