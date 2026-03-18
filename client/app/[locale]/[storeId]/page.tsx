"use client";

import { useRouter, useParams } from 'next/navigation';
import StoreClient from "@/components/store-client";
import StoreHeader from "@/components/store-header";
import { branches, dummyData, mapConfig, primaryColor, secondaryColor, storeInfo } from "@/dummy-data";
import { CartItem, MenuItem } from '@/types';
import { useStoreLogic } from '@/store/store-logic';

export default function StorePage() {
    const router = useRouter();
    const params = useParams();
    const storeId = params?.storeId as string;

    const {
        cartItems,
        addToCart,
        removeFromCart,
        setSelectedLocation,
        setSelectedBranch,
        clearCart,
        cartTotal,
    } = useStoreLogic();

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleAddToCart = (item: MenuItem, quantity: number, selectedVariants: {
        radio: Record<string, string>;
        checkbox: Record<string, string[]>;
    }) => {
        // Build a unique cart item id from item id + variant selections
        // so the same item with different variants becomes separate cart entries
        const variantKey = JSON.stringify(selectedVariants);
        const cartItemId = `${item.id}__${btoa(variantKey).slice(0, 8)}`;

        // Flatten selected variant labels into a readable size/note string
        const radioLabels = Object.values(selectedVariants.radio).join(', ');
        const checkboxLabels = Object.values(selectedVariants.checkbox).flat().join(', ');
        const size = [radioLabels, checkboxLabels].filter(Boolean).join(' · ') || undefined;

        // Recalculate price with extras
        let extraPrice = 0;
        item.variants?.forEach((v) => {
            if (v.type === 'radio') {
                const sel = selectedVariants.radio[v.id];
                const opt = v.options.find((o) => o.label === sel);
                extraPrice += opt?.price ?? 0;
            } else {
                const sels = selectedVariants.checkbox[v.id] ?? [];
                sels.forEach((label) => {
                    const opt = v.options.find((o) => o.label === label);
                    extraPrice += opt?.price ?? 0;
                });
            }
        });

        const cartItem: CartItem = {
            id: cartItemId,
            name: item.name,
            description: item.description,
            price: item.price + extraPrice,
            image: item.image,
            quantity,
            size,
        };

        addToCart(cartItem);
    };

    const handleRemoveFromCart = (itemId: string) => {
        removeFromCart(itemId);
    };

    const handleLocationSelect = (location: { lat: number; lng: number }) => {
        setSelectedLocation(location);
    };

    const handleBranchSelect = (branchId: string) => {
        setSelectedBranch(branchId);
    };

    const handleCheckout = () => {
        router.push(`/${storeId}/checkout`);
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col w-full lg:max-w-6xl lg:mx-auto">
            <StoreHeader
                storeInfo={storeInfo}
                branches={branches}
                cartItems={cartItems}
                mapConfig={mapConfig}
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onCheckout={handleCheckout}
                onBranchSelect={handleBranchSelect}
                onLocationSelect={handleLocationSelect}
                onRemoveCartItem={handleRemoveFromCart}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
            <StoreClient
                categories={dummyData}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}