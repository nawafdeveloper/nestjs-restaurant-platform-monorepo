"use server";

import { cookies } from "next/headers";
import type { StoreAppearance, UpdateAppearanceInput, ActionResult } from "@/types";

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('merchant_token')?.value;
    const storeId = cookieStore.get('store_id')?.value;
    return { token, storeId };
}

function parseErrorMessage(data: any, fallback: string): string {
    return Array.isArray(data.message)
        ? data.message.join(', ')
        : typeof data.message === 'string'
            ? data.message
            : fallback;
}

const baseUrl = () => process.env.NEXT_PUBLIC_API_URL;

export async function getAppearance(): Promise<ActionResult<{ appearance: StoreAppearance | null }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/appearance`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    // body فاضي أو 204
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return { success: true, appearance: null };
    }

    const text = await res.text();
    if (!text) return { success: true, appearance: null };

    const data = JSON.parse(text);

    if (res.status === 404) return { success: true, appearance: null };

    if (!res.ok) return {
        success: false,
        error: 'FETCH_ERROR',
        message: parseErrorMessage(data, 'Failed to fetch appearance'),
    };

    return { success: true, appearance: data };
}

export async function updateAppearance(
    input: UpdateAppearanceInput
): Promise<ActionResult<{ appearance: StoreAppearance }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/appearance`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) return {
        success: false,
        error: 'UPDATE_ERROR',
        message: parseErrorMessage(data, 'Failed to update appearance'),
    };

    return { success: true, appearance: data };
}