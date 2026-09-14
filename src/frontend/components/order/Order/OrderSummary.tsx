"use client";

interface OrderSummaryProps {
    itemCount: number;
    total: number;
    selectedAddress: number | null;
    checkoutLoading: boolean;
    onCheckout: () => void;
}

function OrderSummary({
    itemCount,
    total,
    selectedAddress,
    checkoutLoading,
    onCheckout,
}: OrderSummaryProps) {
    return (
        <div className="summary-card">

            <h2>
                Order Summary
            </h2>

            <div className="summary-row">
                <span>
                    Products
                </span>

                <strong>
                    {itemCount}
                </strong>
            </div>

            <div className="summary-row">
                <span>
                    Shipping
                </span>

                <strong>
                    Free
                </strong>
            </div>

            <div className="summary-row">
                <span>
                    Discount
                </span>

                <strong>
                    $0.00
                </strong>
            </div>

            <hr />

            <div className="summary-total">
                <span>
                    Total
                </span>

                <h2>
                    ${total.toFixed(2)}
                </h2>
            </div>

            <button
                type="button"
                className="checkout-btn"
                onClick={onCheckout}
                disabled={
                    !selectedAddress ||
                    checkoutLoading
                }
            >
                {checkoutLoading
                    ? "Creating..."
                    : "Checkout"}
            </button>

        </div>
    );
}

export default OrderSummary;