"use client";

import React, { useState } from 'react';
import { Layout } from 'antd';
import AppSidebar from '@/components/app-sidebar';
import AppHeader from './app-header';

const { Content } = Layout;

type Props = {
    children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
            <Layout>
                <AppHeader
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
                <Content style={{ margin: '0' }}>
                    <main className="bg-[#E4EBF2] min-h-[calc(100vh-64px)] overflow-y-auto">
                        <div className="py-6 w-full lg:max-w-5xl lg:mx-auto">
                            {children}
                        </div>
                    </main>
                </Content>
            </Layout>
        </Layout>
    );
}
