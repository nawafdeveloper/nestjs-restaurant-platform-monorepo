'use server';

import { AuthActionResult } from '@/types';
import { cookies } from 'next/headers';

const API_URL_AUTH = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/merchant/login`;
const API_URL_STORES = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stores`;

export async function loginAction(payload: {
    email: string;
    password: string;
}): Promise<AuthActionResult> {
    const res = await fetch(API_URL_AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        return {
            success: false,
            error: data.statusCode === 401 ? 'INVALID_CREDENTIALS' : 'UNKNOWN',
            message: typeof data.message === 'string' ? data.message : 'An error occurred',
        };
    }

    const cookieStore = await cookies();

    const token = data.accessToken;

    const stores = await fetch(API_URL_STORES, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const storeData = await stores.json();

    if (storeData.length) {
        cookieStore.set('store_id', storeData[0].id, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    cookieStore.set('merchant_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('is_onboarded', String(data.merchant.isOnboarded), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, merchant: data.merchant };
}