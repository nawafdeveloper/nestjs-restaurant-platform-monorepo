import React from 'react'
import LanguageSelector from '@/components/language-selector'

type Props = {
    children: React.ReactNode;
}

export default function AuthenticationLayout({ children }: Props) {
    return (
        <main className="relative min-h-screen">
            <LanguageSelector />
            {children}
        </main>
    )
}
