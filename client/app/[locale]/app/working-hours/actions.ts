"use server";

import { Branch, ActionResult, SetWorkingHoursInput, WorkingHours } from "@/types";
import { cookies } from "next/headers";

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

// جلب الفروع عشان نعرض الأسماء مع الـ IDs
export async function getBranches(): Promise<ActionResult<{ branches: Branch[] }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/branches`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) return {
        success: false,
        error: 'FETCH_ERROR',
        message: parseErrorMessage(data, 'Failed to fetch branches')
    };

    return {
        success: true,
        branches: data.map((b: any) => ({ id: b.id, name: b.name }))
    };
}

// جلب ساعات العمل لفرع معين
export async function getWorkingHours(branchId: string): Promise<ActionResult<{ workingHours: WorkingHours[] }>> {
    const { token } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };

    const res = await fetch(`${baseUrl()}/api/v1/branches/${branchId}/working-hours`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) return {
        success: false,
        error: 'FETCH_ERROR',
        message: parseErrorMessage(data, 'Failed to fetch working hours')
    };

    return { success: true, workingHours: data };
}

// إضافة أو تحديث ساعات العمل (الـ backend يعمل upsert تلقائياً)
export async function setWorkingHours(
    branchId: string,
    input: SetWorkingHoursInput
): Promise<ActionResult<{ workingHours: WorkingHours }>> {
    const { token } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };

    const res = await fetch(`${baseUrl()}/api/v1/branches/${branchId}/working-hours`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) return {
        success: false,
        error: 'SET_ERROR',
        message: parseErrorMessage(data, 'Failed to set working hours')
    };

    return { success: true, workingHours: data };
}