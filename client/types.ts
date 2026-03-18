// ============================================================
// Utilities
// ============================================================

export type SuccessResult<T> = { success: true } & T;
export type ErrorResult = { success: false; error: string; message: string };
export type ActionResult<T> = SuccessResult<T> | ErrorResult;

// ============================================================
// Auth
// ============================================================

export type AuthActionError =
    | 'EMAIL_TAKEN'
    | 'INVALID_CREDENTIALS'
    | 'UNKNOWN';

export type AuthActionResult =
    | { success: true; merchant: Merchant }
    | { success: false; error: AuthActionError; message: string };

export type Merchant = {
    id: string;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    isOnboarded: boolean;
};

// ============================================================
// Store
// ============================================================

export type StoreActionResult = ActionResult<{ store?: any; merchant?: any }>;

export interface StoreInfo {
    name: string;
    logo: string;
    banner: string;
    categories: string;
    rating: number;
    reviewCount: string;
    deliveryTime: string;
    isOpen: boolean;
}

// ============================================================
// Branches
// ============================================================

export type Branch = {
    id: string;
    storeId: string;
    name: string;
    nameAr: string | null;
    address: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateBranchInput = {
    name: string;
    nameAr?: string;
    address?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
    phone?: string;
    isActive?: boolean;
};

export type UpdateBranchInput = Partial<CreateBranchInput>;

// ============================================================
// Working Hours
// ============================================================

export enum DayOfWeek {
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
}

export type DayKey = `${DayOfWeek}`;
export type TimeSlot = [string, string];

export type WorkingHours = {
    id: string;
    branchId: string;
    day: DayKey;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
    createdAt: string;
    updatedAt: string;
};

export type SetWorkingHoursInput = {
    day: DayKey;
    openTime: string;
    closeTime: string;
    isOpen?: boolean;
};

export type BranchHours = {
    branchId: string;
    branchName: string;
    days: Record<DayKey, TimeSlot[]>;
};

// ============================================================
// Menu / Storefront
// ============================================================

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    variants?: ItemVariant[];
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export type VariantOption = { label: string; price?: number };

export interface ItemVariant {
    id: string;
    name: string;
    type: 'radio' | 'checkbox';
    required?: boolean;
    options: VariantOption[];
}

export interface CartItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

export interface StoreMenuHandle {
    flagClickScroll: () => void;
}

export interface MapConfig {
    defaultCenter: { lat: number; lng: number };
    zoom?: number;
}

export type StoreAppearance = {
    id: string;
    storeId: string;
    primaryColor: string | null;
    secondaryColor: string | null;
    bannerUrl: string | null;
    layout: Record<string, any> | null;
    createdAt: string;
    updatedAt: string;
};

export type UpdateAppearanceInput = {
    primaryColor?: string;
    secondaryColor?: string;
    bannerUrl?: string;
    layout?: Record<string, any>;
};

export type StoreThemeValues = {
    primaryColor: string;
    secondaryColor: string;
    bannerFile: any[];
    layout: string;
};

export type Category = {
    id: string;
    storeId: string;
    name: string;
    nameAr: string | null;
    imageUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateCategoryInput = {
    name: string;
    nameAr?: string;
    imageUrl?: string;
    sortOrder?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type Product = {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    nameAr: string | null;
    description: string | null;
    descriptionAr: string | null;
    basePrice: number;
    imageUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateProductInput = {
    categoryId: string;
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    basePrice: number;
    imageUrl?: string;
    sortOrder?: number;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
    isAvailable?: boolean;
};