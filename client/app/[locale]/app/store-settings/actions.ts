'use server';

import { StoreActionResult } from '@/types';
import { cookies } from 'next/headers';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stores`;

type UpdateStorePayload = {
    name?: string;
    nameAr?: string;
    slug?: string;
    description?: string;
    descriptionAr?: string;
    phone?: string;
    logoUrl?: string;
};

export async function getStoreDetails(): Promise<StoreActionResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get('merchant_token')?.value;
    const storeId = cookieStore.get('store_id')?.value;

    if (!token) return { success: false as const, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false as const, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${API_URL}/${storeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const message = Array.isArray(data.message)
            ? data.message.join(', ')
            : typeof data.message === 'string'
                ? data.message
                : 'Failed to fetch store';

        return { success: false as const, error: 'FETCH_ERROR', message };
    }

    return { success: true as const, store: data };
}

export async function updateStoreDetails(payload: UpdateStorePayload): Promise<StoreActionResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get('merchant_token')?.value;
    const storeId = cookieStore.get('store_id')?.value;

    if (!token) return { success: false as const, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false as const, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${API_URL}/${storeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        const message = Array.isArray(data.message)
            ? data.message.join(', ')
            : typeof data.message === 'string'
                ? data.message
                : 'Failed to update store';

        return {
            success: false as const,
            error: res.status === 409 ? 'SLUG_TAKEN' : 'UPDATE_ERROR',
            message,
        };
    }

    return { success: true as const, store: data };
}