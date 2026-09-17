"use client";

import Image from "next/image";

import BACKEND_URLS from "@/utils";

interface OrderProduct {
    id: number;
    name: string;
    description: string;
    quantity_in_stock: number;
    price: number;
    price_after: number;
    product_image: string | null;
    category: number;
    store: number;
}

interface OrderItem {
    id: number;
    quantity: number;
    status: string;
    created: string;
    total: string;
    order: number;
    product: OrderProduct;
}

interface OrderItemCardProps {
    item: OrderItem;
    quantity: number;
    updating: boolean;
    onQuantityChange: (
        quantity: number
    ) => void;
    onUpdate: () => void;
    onRemove: () => void;
}

function OrderItemCard({
    item,
    quantity,
    updating,
    onQuantityChange,
    onUpdate,
    onRemove,
}: OrderItemCardProps) {
    const imageUrl = item.product.product_image
        ? `${BACKEND_URLS.replace(
            /\/$/,
            ""
        )}${item.product.product_image}`
        : "/no-image.png";

    const itemTotal =
        quantity * item.product.price_after;

    return (
        <div className="cart-card">
            <div className="product-image">
                <Image
                    src={imageUrl}
                    alt={item.product.name}
                    width={120}
                    height={120}
                />
            </div>

            <div className="product-info">
                <h2>
                    {item.product.name}
                </h2>

                <p>
                    {item.product.description}
                </p>

                <div className="product-grid">
                    <div>
                        <span>
                            Quantity
                        </span>

                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) =>
                                onQuantityChange(
                                    Number(e.target.value)
                                )
                            }
                        />
                    </div>

                    <div>
                        <span>
                            Price
                        </span>

                        <strong>
                            ${item.product.price}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Discount
                        </span>

                        <strong>
                            ${item.product.price_after}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Total
                        </span>

                        <strong>
                            ${itemTotal.toFixed(2)}
                        </strong>
                    </div>
                </div>

                <div className="product-actions">
                    <span
                        className={
                            item.status === "P"
                                ? "pending"
                                : "paid"
                        }
                    >
                        {item.status === "P"
                            ? "Pending"
                            : item.status}
                    </span>

                    <div>
                        <button
                            type="button"
                            className="view-btn"
                        >
                            View Product
                        </button>

                        <button
                            type="button"
                            className="update-btn"
                            disabled={updating}
                            onClick={onUpdate}
                        >
                            {updating
                                ? "Updating..."
                                : "Update"}
                        </button>

                        <button
                            type="button"
                            className="remove-btn"
                            onClick={onRemove}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderItemCard;
