import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const MERCHANT_COOKIE = 'merchant_token';
const ONBOARDED_COOKIE = 'is_onboarded';
const CUSTOMER_COOKIE = 'customer_token';

const MERCHANT_AUTH_ROUTES = [
    '/auth/login',
    '/auth/signup',
    '/auth/forget-password',
    '/auth/reset-password',
];

const CUSTOMER_PROTECTED = /^\/[^/]+\/(orders|profile|checkout)(\/.*)?$/;

const intlMiddleware = createIntlMiddleware(routing);

function isMerchantAppRoute(pathname: string) {
    return pathname.startsWith('/app');
}

function isMerchantAuthRoute(pathname: string) {
    return MERCHANT_AUTH_ROUTES.some((p) => pathname.startsWith(p));
}

function isOnboardingRoute(pathname: string) {
    return pathname.startsWith('/onboarding');
}

function isCustomerProtected(pathname: string) {
    return CUSTOMER_PROTECTED.test(pathname);
}

function stripLocale(pathname: string, locales: string[]) {
    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
            return pathname.slice(locale.length + 1) || '/';
        }
    }
    return pathname;
}

export async function proxy(request: NextRequest) {
    const rawPathname = request.nextUrl.pathname;
    const locales = routing.locales as unknown as string[];
    const pathname = stripLocale(rawPathname, locales);

    const merchantToken = request.cookies.get(MERCHANT_COOKIE)?.value;
    const isOnboarded = request.cookies.get(ONBOARDED_COOKIE)?.value === 'true';

    if (isMerchantAuthRoute(pathname)) {
        if (merchantToken) {
            const dest = isOnboarded ? '/app' : '/onboarding';
            return NextResponse.redirect(new URL(dest, request.url));
        }
    }

    if (isMerchantAppRoute(pathname)) {
        if (!merchantToken) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('redirect', rawPathname);
            return NextResponse.redirect(loginUrl);
        }

        if (!isOnboarded) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }

    if (isOnboardingRoute(pathname)) {
        if (!merchantToken) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        if (isOnboarded) {
            return NextResponse.redirect(new URL('/app', request.url));
        }
    }

    if (isCustomerProtected(pathname)) {
        const customerToken = request.cookies.get(CUSTOMER_COOKIE)?.value;

        if (!customerToken) {
            const storeId = pathname.split('/')[1];
            const loginUrl = new URL(`/${storeId}/login`, request.url);
            loginUrl.searchParams.set('redirect', rawPathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};