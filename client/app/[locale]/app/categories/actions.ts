"use server";

import { cookies } from "next/headers";
import type { Category, CreateCategoryInput, UpdateCategoryInput, ActionResult } from "@/types";

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

export async function getCategories(): Promise<ActionResult<{ categories: Category[] }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/categories`, {
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
        message: parseErrorMessage(data, 'Failed to fetch categories'),
    };

    return { success: true, categories: data };
}

export async function createCategory(
    input: CreateCategoryInput
): Promise<ActionResult<{ category: Category }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/categories`, {
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
        error: 'CREATE_ERROR',
        message: parseErrorMessage(data, 'Failed to create category'),
    };

    return { success: true, category: data };
}

export async function updateCategory(
    id: string,
    input: UpdateCategoryInput
): Promise<ActionResult<{ category: Category }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/categories/${id}`, {
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
        message: parseErrorMessage(data, 'Failed to update category'),
    };

    return { success: true, category: data };
}

export async function deleteCategory(id: string): Promise<ActionResult<{}>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const data = await res.json();
        return {
            success: false,
            error: 'DELETE_ERROR',
            message: parseErrorMessage(data, 'Failed to delete category'),
        };
    }

    return { success: true };
}