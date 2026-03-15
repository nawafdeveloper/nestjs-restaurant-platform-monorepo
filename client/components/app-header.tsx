import { Avatar, Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react'
import LanguageSelector from './language-selector';
import Text from 'antd/es/typography/Text';

const { Header } = Layout;

type Props = {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppHeader({ sidebarCollapsed, setSidebarCollapsed }: Props) {
    return (
        <Header
            className="flex items-center justify-between"
            style={{
                background: '#0E79EB',
                height: 50,
                padding: 0,
                lineHeight: '50px',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}
        >
            <Button
                variant="text"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className='h-12! w-12! bg-[#0D6DD3]! border-0! rounded-none!'
                aria-label="Toggle sidebar"
            >
                {sidebarCollapsed ? <MenuUnfoldOutlined className='text-white!' /> : <MenuFoldOutlined className='text-white!' />}
            </Button>
            <div className="flex items-center gap-4">
                <LanguageSelector variant="inline" />
                <Button
                    variant="text"
                    aria-label="User profile"
                    className='h-10! bg-transparent! border-0!'
                >
                    <Avatar size="large" className='rounded-sm!' icon={<UserOutlined />} />
                    <span className="flex flex-col text-start">
                        <Text className="text-sm font-semibold text-white! m-0! leading-tight!">User Name</Text>
                        <Text className="text-xs opacity-90 text-white! m-0! leading-tight!">user@example.com</Text>
                    </span>
                </Button>
            </div>
        </Header>
    )
}
