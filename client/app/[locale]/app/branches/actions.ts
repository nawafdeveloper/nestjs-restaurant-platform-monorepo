"use server";

import { Branch, ActionResult, CreateBranchInput, UpdateBranchInput } from "@/types";
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

    return { success: true, branches: data };
}

export async function createBranch(input: CreateBranchInput): Promise<ActionResult<{ branch: Branch }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/branches`, {
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
        message: parseErrorMessage(data, 'Failed to create branch')
    };

    return { success: true, branch: data };
}

export async function updateBranch(id: string, input: UpdateBranchInput): Promise<ActionResult<{ branch: Branch }>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/branches/${id}`, {
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
        message: parseErrorMessage(data, 'Failed to update branch')
    };

    return { success: true, branch: data };
}

export async function deleteBranch(id: string): Promise<ActionResult<{}>> {
    const { token, storeId } = await getAuthHeaders();

    if (!token) return { success: false, error: 'UNAUTHORIZED', message: 'No token' };
    if (!storeId) return { success: false, error: 'NO_STORE', message: 'No store ID' };

    const res = await fetch(`${baseUrl()}/api/v1/stores/${storeId}/branches/${id}`, {
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
            message: parseErrorMessage(data, 'Failed to delete branch')
        };
    }

    return { success: true };
}