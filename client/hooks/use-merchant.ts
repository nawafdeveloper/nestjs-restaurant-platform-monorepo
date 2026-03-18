'use client';

import { Merchant } from "@/types";

const MERCHANT_KEY = 'merchant_info';

export const useMerchant = () => {

    const setMerchant = (merchant: Merchant) => {
        localStorage.setItem(MERCHANT_KEY, JSON.stringify(merchant));
    };

    const getMerchant = (): Merchant | null => {
        if (typeof window === 'undefined') return null;
        
        const data = localStorage.getItem(MERCHANT_KEY);
        if (!data) return null;
        return JSON.parse(data) as Merchant;
    };

    const clearMerchant = () => {
        localStorage.removeItem(MERCHANT_KEY);
    };

    return { setMerchant, getMerchant, clearMerchant };
};