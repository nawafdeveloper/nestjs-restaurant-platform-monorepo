"use client";

import { MenuCategory } from '@/types';
import { ConfigProvider, Tabs } from 'antd';

const primaryColor = '#3F4093';

export type StoreTabKey = string;

interface StoreTabsProps {
    categories: MenuCategory[];
    onTabChange: (key: StoreTabKey) => void;
    activeKey: StoreTabKey;
    primaryColor: string;
    secondaryColor: string;
}

export default function StoreTabs({ 
    categories, 
    onTabChange, 
    activeKey,
    primaryColor,
    secondaryColor
}: StoreTabsProps) {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Tabs: {
                        inkBarColor: primaryColor,
                        itemActiveColor: primaryColor,
                        itemSelectedColor: primaryColor,
                        itemHoverColor: primaryColor,
                        titleFontSize: 15,
                    },
                },
            }}
        >
            <div className="sticky top-0 z-30 w-full bg-white border-gray-100">
                <div className="px-4">
                    <Tabs
                        activeKey={activeKey}
                        onChange={onTabChange}
                        tabBarStyle={{ margin: 0 }}
                        items={categories.map(({ id, name }) => ({
                            key: id,
                            label: (
                                <span
                                    className="font-semibold text-sm px-1"
                                    style={{ color: activeKey === id ? primaryColor : '#6B7280' }}
                                >
                                    {name}
                                </span>
                            ),
                        }))}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
}