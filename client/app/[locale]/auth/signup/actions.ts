'use server';

import { AuthActionResult } from '@/types';
import { cookies } from 'next/headers';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/merchant/register`;

export async function signupAction(payload: {
    name: string;
    phone: string;
    email: string;
    password: string;
}): Promise<AuthActionResult> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        return {
            success: false,
            error: data.statusCode === 409 ? 'EMAIL_TAKEN' : 'UNKNOWN',
            message: Array.isArray(data.message)
                ? data.message.join(', ')
                : typeof data.message === 'string'
                    ? data.message
                    : 'An error occurred',
        };
    }

    const cookieStore = await cookies();

    cookieStore.set('merchant_token', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/app',
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