"use client";

import Text from 'antd/es/typography/Text';

interface CheckoutSectionProps {
    icon: React.ReactNode;
    title: string;
    badge?: string;
    children: React.ReactNode;
}

export default function CheckoutSection({
    icon,
    title,
    badge,
    children,
}: CheckoutSectionProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
                {icon}
                <Text className="text-sm! font-bold text-gray-900 flex-1">{title}</Text>
                {badge && (
                    <Text className="text-xs! font-semibold text-gray-400">{badge}</Text>
                )}
            </div>
            {/* Section body */}
            <div className="px-4 py-4">
                {children}
            </div>
        </div>
    );
}