import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderType = 'delivery' | 'pickup';

export interface SelectedLocation {
    lat: number;
    lng: number;
}

interface StoreState {
    // Cart
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;

    // Order type
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;

    // Delivery location
    selectedLocation: SelectedLocation | null;
    setSelectedLocation: (location: SelectedLocation) => void;
    clearLocation: () => void;

    // Pickup branch
    selectedBranchId: string | null;
    setSelectedBranch: (branchId: string) => void;
    clearBranch: () => void;

    // Derived
    cartTotal: () => number;
    cartCount: () => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStoreLogic = create<StoreState>()(
    persist(
        (set, get) => ({
            // ── Cart ──────────────────────────────────────────────────────────
            cartItems: [],

            addToCart: (item) => {
                set((state) => {
                    const existing = state.cartItems.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            cartItems: state.cartItems.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { cartItems: [...state.cartItems, item] };
                });
            },

            removeFromCart: (itemId) => {
                set((state) => ({
                    cartItems: state.cartItems.filter((i) => i.id !== itemId),
                }));
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(itemId);
                    return;
                }
                set((state) => ({
                    cartItems: state.cartItems.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => set({ cartItems: [] }),

            // ── Order type ────────────────────────────────────────────────────
            orderType: 'delivery',
            setOrderType: (type) => set({ orderType: type }),

            // ── Delivery location ─────────────────────────────────────────────
            selectedLocation: null,
            setSelectedLocation: (location) => set({ selectedLocation: location }),
            clearLocation: () => set({ selectedLocation: null }),

            // ── Pickup branch ─────────────────────────────────────────────────
            selectedBranchId: null,
            setSelectedBranch: (branchId) => set({ selectedBranchId: branchId }),
            clearBranch: () => set({ selectedBranchId: null }),

            // ── Derived ───────────────────────────────────────────────────────
            cartTotal: () =>
                get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),

            cartCount: () =>
                get().cartItems.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: 'store-cart', // localStorage key
            partialize: (state) => ({
                cartItems: state.cartItems,
                selectedLocation: state.selectedLocation,
                selectedBranchId: state.selectedBranchId,
                orderType: state.orderType,
            }),
        }
    )
);