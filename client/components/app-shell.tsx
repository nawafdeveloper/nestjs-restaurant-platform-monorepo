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
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
            <Layout style={{ height: '100vh', overflow: 'hidden' }}>
                <AppHeader
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
                <Content style={{ margin: '0', overflow: 'hidden' }}>
                    <main className="bg-[#E4EBF2] h-[calc(100vh-50px)] overflow-y-auto">
                        <div className="py-6 w-full lg:max-w-5xl lg:mx-auto">
                            {children}
                        </div>
                    </main>
                </Content>
            </Layout>
        </Layout>
    );
}
