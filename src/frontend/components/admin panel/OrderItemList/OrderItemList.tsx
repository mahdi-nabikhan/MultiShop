"use client";

import { useEffect, useState } from "react";
import { getOrderItems } from "@/services/shop-admin-panel.services";
import BACKEND_URLS from "@/utils";
import "./OrderItemList.css";
import type { OrderItem } from "@/types/panel-admin";



interface Props {
    orderId: number | string;
}

export default function OrderItemList({ orderId }: Props) {

    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    const getItems = async () => {

    try {

        setLoading(true);

        const data = await getOrderItems(orderId);

        setItems(data);

    } catch (err) {

        console.error(
            "Failed to load order items:",
            err
        );

    } finally {

        setLoading(false);

    }

};

    useEffect(() => {

        getItems();

    }, [orderId]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (items.length === 0) {
        return <h2>No Order Item Found</h2>;
    }

    return (

        <div className="order-item-page">

            <div className="page-header">

                <h1>
                    Order #{orderId}
                </h1>

                <p>
                    Products inside this order
                </p>

            </div>

            <div className="item-list">

                {items.map((item) => (

                    <div
                        className="item-card"
                        key={item.id}
                    >

                        <img
                            src={
                                item.product.product_image
                                    ? `${BACKEND_URLS}${item.product.product_image}`
                                    : "/no-image.png"
                            }
                            alt={item.product.name}
                        />

                        <div className="item-content">

                            <h2>{item.product.name}</h2>

                            <p>{item.product.description}</p>

                            <div className="item-grid">

                                <div>

                                    <span>Quantity</span>

                                    <strong>{item.quantity}</strong>

                                </div>

                                <div>

                                    <span>Price</span>

                                    <strong>${item.product.price}</strong>

                                </div>

                                <div>

                                    <span>Sale Price</span>

                                    <strong>${item.product.price_after}</strong>

                                </div>

                                <div>

                                    <span>Total</span>

                                    <strong>${item.total}</strong>

                                </div>

                            </div>

                            <div className="bottom-row">

                                <span
                                    className={
                                        item.status === "P"
                                            ? "pending"
                                            : "confirmed"
                                    }
                                >
                                    {item.status === "P"
                                        ? "Pending"
                                        : "Confirmed"}
                                </span>

                                <button>
                                    View Product
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}