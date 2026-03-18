'use server';
import { cookies } from 'next/headers';

const STORE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stores`;
const ONBOARDING_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/merchant/onboarding`;

type CreateStorePayload = {
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    phone: string;
};

type CreateBranchPayload = {
    name: string;
    city: string;
    address: string;
};

export async function createStoreAndBranchAction(
    store: CreateStorePayload,
    branch: CreateBranchPayload
) {
    const cookieStore = await cookies();
    const token = cookieStore.get('merchant_token')?.value;

    if (!token) {
        return { success: false as const, error: 'UNAUTHORIZED' };
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // ─── 1. إنشاء المتجر ─────────────────────────────────────
    const storeRes = await fetch(STORE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(store),
    });

    const storeData = await storeRes.json();

    if (!storeRes.ok) {
        const message = Array.isArray(storeData.message)
            ? storeData.message.join(', ')
            : typeof storeData.message === 'string'
                ? storeData.message
                : 'Failed to create store';
        return {
            success: false as const,
            error: storeRes.status === 409 ? 'SLUG_TAKEN' : 'STORE_ERROR',
            message,
        };
    }

    // ─── 2. إنشاء الفرع ──────────────────────────────────────
    const branchRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stores/${storeData.id}/branches`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(branch),
        }
    );

    const branchData = await branchRes.json();

    if (!branchRes.ok) {
        const message = Array.isArray(branchData.message)
            ? branchData.message.join(', ')
            : typeof branchData.message === 'string'
                ? branchData.message
                : 'Failed to create branch';
        return { success: false as const, error: 'BRANCH_ERROR', message };
    }

    // ─── 3. تحديث isOnboarded ────────────────────────────────
    const onboardingRes = await fetch(ONBOARDING_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isOnboarded: true }),
    });

    if (!onboardingRes.ok) {
        console.error('Failed to update onboarding status');
    } else {
        cookieStore.set('is_onboarded', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        cookieStore.set('store_id', storeData.id, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    // ─── 4. تهيئة المظهر الافتراضي ───────────────────────────
    const appearanceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stores/${storeData.id}/appearance`,
        {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                primaryColor: '#0e79eb',
                secondaryColor: '#dbecff',
                layout: { type: 'classic' },
            }),
        }
    );

    if (!appearanceRes.ok) {
        console.error('Failed to set default appearance');
    }

    return { success: true as const, store: storeData, branch: branchData };
}