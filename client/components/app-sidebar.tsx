"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type RouteMap = Record<string, string>;

type ParentMap = Record<string, string>;

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label
    } as MenuItem;
}

type AppSidebarProps = {
    collapsed: boolean;
    onCollapsedChange: (collapsed: boolean) => void;
};

export default function AppSidebar({ collapsed, onCollapsedChange }: AppSidebarProps) {
    const t = useTranslations('AppSidebar');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const routeByKey: RouteMap = {
        home: '/app/overview',
        storeSettings: '/app/store-settings',
        branches: '/app/branches',
        workingHours: '/app/working-hours',
        appearance: '/app/store-theme',
        categories: '/app/categories',
        products: '/app/products',
        variantsAddons: '/app/variants',
        orders: '/app/orders',
        customers: '/app/customers',
        offersDiscounts: '/app/promotions',
        promoCodes: '/app/vouchers',
        notifications: '/app/notifications',
        accountSecurity: '/app/account-and-security'
    };

    const parentByKey: ParentMap = {
        home: 'dashboard',
        storeSettings: 'store',
        branches: 'store',
        workingHours: 'store',
        appearance: 'store',
        categories: 'menu',
        products: 'menu',
        variantsAddons: 'menu',
        orders: 'sales',
        customers: 'sales',
        offersDiscounts: 'marketing',
        promoCodes: 'marketing',
        accountSecurity: 'settings'
    };

    const normalizedPath = useMemo(() => {
        if (pathname.startsWith(`/${locale}`)) {
            const trimmed = pathname.slice(locale.length + 1);
            return trimmed.length ? trimmed : '/';
        }
        return pathname;
    }, [pathname, locale]);

    const selectedKey = useMemo(() => {
        let match = '';
        let longest = 0;
        Object.entries(routeByKey).forEach(([key, route]) => {
            if (normalizedPath === route || normalizedPath.startsWith(`${route}/`)) {
                if (route.length > longest) {
                    match = key;
                    longest = route.length;
                }
            }
        });
        return match;
    }, [normalizedPath]);

    useEffect(() => {
        if (collapsed) {
            setOpenKeys([]);
            return;
        }
        const parentKey = selectedKey ? parentByKey[selectedKey] : undefined;
        if (parentKey) {
            setOpenKeys((prev) => (prev.includes(parentKey) ? prev : [parentKey]));
        }
    }, [selectedKey, collapsed]);

    const items: MenuItem[] = [
        getItem(t('dashboard'), 'dashboard', <PieChartOutlined />, [
            getItem(t('home'), 'home')
        ]),
        getItem(t('store'), 'store', <DesktopOutlined />, [
            getItem(t('storeSettings'), 'storeSettings'),
            getItem(t('branches'), 'branches'),
            getItem(t('workingHours'), 'workingHours'),
            getItem(t('appearance'), 'appearance')
        ]),
        getItem(t('menu'), 'menu', <UserOutlined />, [
            getItem(t('categories'), 'categories'),
            getItem(t('products'), 'products'),
            getItem(t('variantsAddons'), 'variantsAddons')
        ]),
        getItem(t('sales'), 'sales', <TeamOutlined />, [
            getItem(t('orders'), 'orders'),
            getItem(t('customers'), 'customers')
        ]),
        getItem(t('marketing'), 'marketing', <DesktopOutlined />, [
            getItem(t('offersDiscounts'), 'offersDiscounts'),
            getItem(t('promoCodes'), 'promoCodes')
        ]),
        getItem(t('notifications'), 'notifications', <FileOutlined />),
        getItem(t('settings'), 'settings', <FileOutlined />, [
            getItem(t('accountSecurity'), 'accountSecurity')
        ])
    ];

    const handleClick: MenuProps['onClick'] = (info) => {
        const path = routeByKey[info.key as string];
        if (path) {
            router.push(path);
        }
    };

    return (
        <Sider
            collapsed={collapsed}
            breakpoint="lg"
            collapsedWidth={60}
            onBreakpoint={(broken) => onCollapsedChange(broken)}
            style={{ background: colorBgContainer }}
            width={260}
        >
            <div className="h-4" />
            <Menu
                mode="inline"
                items={items}
                selectedKeys={selectedKey ? [selectedKey] : []}
                openKeys={openKeys}
                onOpenChange={(keys) => setOpenKeys(keys as string[])}
                onClick={handleClick}
                className="border-0"
            />
        </Sider>
    );
}
