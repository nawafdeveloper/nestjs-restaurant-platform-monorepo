"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { primaryColor, secondaryColor } from '@/dummy-data';
import { useStoreLogic } from '@/store/store-logic';
import CheckoutHeader from '@/components/store-checkout-header';
import CheckoutOrderSummary from '@/components/store-checkout-summary';
import CheckoutDeliveryInfo from '@/components/store-checkout-delivery-info';
import CheckoutPaymentMethod from '@/components/store-checkout-payment-method';
import CheckoutPromoCode from '@/components/store-checkout-promo-code';
import CheckoutFooter from '@/components/store-checkout-footer';

export type PaymentMethod = 'card' | 'cash' | 'apple_pay';

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const storeId = params?.storeId as string;

    const {
        cartItems,
        orderType,
        selectedLocation,
        selectedBranchId,
        cartTotal,
        clearCart,
    } = useStoreLogic();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [notes, setNotes] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const deliveryFee = orderType === 'delivery' ? 10 : 0;
    const subtotal = cartTotal();
    const discount = promoDiscount;
    const total = subtotal + deliveryFee - discount;

    const handleApplyPromo = (code: string) => {
        // Dummy promo logic — replace with real API call
        if (code.toUpperCase() === 'SAVE10') {
            setPromoDiscount(subtotal * 0.1);
            setPromoError('');
        } else {
            setPromoDiscount(0);
            setPromoError('Invalid promo code');
        }
    };

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try {
            const payload = {
                items: cartItems,
                orderType,
                location: orderType === 'delivery' ? selectedLocation : null,
                branchId: orderType === 'pickup' ? selectedBranchId : null,
                paymentMethod,
                notes,
                promoCode: promoDiscount > 0 ? promoCode : null,
                subtotal,
                deliveryFee,
                discount,
                total,
            };
            console.log('Order payload:', payload);
            // await placeOrder(payload);
            clearCart();
            router.push(`/${storeId}/order-success`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <CheckoutHeader
                onBack={() => router.back()}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />

            <main className="flex flex-col gap-3 px-4 pt-4 pb-64 w-full max-w-2xl mx-auto">
                <CheckoutOrderSummary
                    cartItems={cartItems}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />

                <CheckoutDeliveryInfo
                    orderType={orderType}
                    selectedLocation={selectedLocation}
                    selectedBranchId={selectedBranchId}
                    notes={notes}
                    onNotesChange={setNotes}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />

                <CheckoutPaymentMethod
                    selected={paymentMethod}
                    onChange={setPaymentMethod}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />

                <CheckoutPromoCode
                    value={promoCode}
                    onChange={setPromoCode}
                    onApply={handleApplyPromo}
                    discount={promoDiscount}
                    error={promoError}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />
            </main>

            <CheckoutFooter
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
                isLoading={isPlacingOrder}
                onPlaceOrder={handlePlaceOrder}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
        </div>
    );
}