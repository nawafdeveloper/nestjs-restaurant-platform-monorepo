'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('merchant_token');
    cookieStore.delete('is_onboarded');
    cookieStore.delete('store_id');
    return { success: true };
}