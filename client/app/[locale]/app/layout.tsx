import React from 'react'
import AppShell from '@/components/app-shell'

type Props = {
    children: React.ReactNode;
}

export default async function ApplicationLayout({ children }: Props) {
    return (
        <main className="min-h-screen">
            <AppShell>
                {children}
            </AppShell>
        </main>
    )
}
