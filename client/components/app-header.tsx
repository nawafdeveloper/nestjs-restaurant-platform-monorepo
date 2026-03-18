import { Avatar, Button, Dropdown, Layout } from 'antd';
import { LoadingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import LanguageSelector from './language-selector';
import Text from 'antd/es/typography/Text';
import type { MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { MdExitToApp } from 'react-icons/md';
import { useLogout } from '@/hooks/use-signout';
import { useMerchant } from '@/hooks/use-merchant';
import { Merchant } from '@/types';

const { Header } = Layout;

type Props = {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppHeader({ sidebarCollapsed, setSidebarCollapsed }: Props) {
    const t = useTranslations('AppHeader');
    const { handleLogout, loading } = useLogout();
    const { getMerchant } = useMerchant();

    const [merchant, setMerchant] = useState<Merchant | null>(null);

    useEffect(() => {
        setMerchant(getMerchant());
    }, []);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a href={'/app/account-and-security'}>
                    <Text>{t('accountSecurity')}</Text>
                </a>
            )
        },
        {
            key: '2',
            label: (
                <a className='flex flex-row items-center gap-x-2' onClick={handleLogout}>
                    {loading ? (
                        <>
                            <LoadingOutlined className='animate-spin' />
                            {t('signoutLoading')}
                        </>
                    ) : (
                        <>
                            <MdExitToApp className='size-5' />
                            <Text>{t('signout')}</Text>
                        </>
                    )}
                </a>
            )
        }
    ];

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
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Button
                        variant="text"
                        aria-label="User profile"
                        className='h-10! bg-transparent! border-0!'
                    >
                        <Avatar size="large" className='rounded-sm!' icon={<UserOutlined />} />
                        <span className="flex flex-col text-start">
                            <Text className="text-sm font-semibold text-white! m-0! leading-tight!">{merchant?.name}</Text>
                            <Text className="text-xs opacity-90 text-white! m-0! leading-tight!">{merchant?.email}</Text>
                        </span>
                    </Button>
                </Dropdown>
            </div>
        </Header>
    )
}
