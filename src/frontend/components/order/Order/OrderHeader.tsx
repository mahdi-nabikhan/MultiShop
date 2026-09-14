"use client";

interface OrderHeaderProps {
    selectedAddress: number | null;
    checkoutLoading: boolean;
    onCheckout: () => void;
}

function OrderHeader({
    selectedAddress,
    checkoutLoading,
    onCheckout,
}: OrderHeaderProps) {
    return (
        <div className="order-banner">
            <div>
                <h1>
                    🛒 My Shopping Cart
                </h1>

                <p>
                    Review your products
                    before checkout.
                </p>
            </div>

            <button
                type="button"
                className="checkout-top-btn"
                disabled={
                    !selectedAddress ||
                    checkoutLoading
                }
                onClick={onCheckout}
            >
                {checkoutLoading
                    ? "Creating..."
                    : "Proceed To Checkout →"}
            </button>
        </div>
    );
}

export default OrderHeader;