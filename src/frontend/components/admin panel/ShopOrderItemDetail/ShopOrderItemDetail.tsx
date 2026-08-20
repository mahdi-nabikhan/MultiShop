"use client";

import { useEffect, useState } from "react";
import {
    getOrderItemDetail,
    OrderItem,
} from "@/services/shop-admin-panel.services";
import "./ShopOrderItemDetail.css";
import BACKEND_URLS from "@/utils";





interface Props {
    orderItemId: number | string;
}

export default function OrderItemDetail({ orderItemId }: Props) {

    const [item, setItem] = useState<OrderItem | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

    const getOrderItem = async () => {

        try {

            setLoading(true);

            const data = await getOrderItemDetail(
                orderItemId
            );

            setItem(data);

        } catch (err) {

            console.error(
                "Failed to load order item:",
                err
            );

        } finally {

            setLoading(false);

        }

    };

    getOrderItem();

}, [orderItemId]);

    

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!item) {
        return <h2>Order Item Not Found</h2>;
    }

    return (

        <div className="order-item-detail">

            <div className="detail-header">

                <h1>
                    Order Item #{item.id}
                </h1>

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

            </div>

            <div className="detail-card">

                <div className="image-box">

                    <img
                        src={
                            item.product.product_image
                                ? `${BACKEND_URLS}${item.product.product_image}`
                                : "/no-image.png"
                        }
                        alt={item.product.name}
                    />

                </div>

                <div className="info-box">

                    <h2>{item.product.name}</h2>

                    <p>{item.product.description}</p>

                    <div className="info-grid">

                        <div>
                            <span>Product ID</span>
                            <strong>{item.product.id}</strong>
                        </div>

                        <div>
                            <span>Order ID</span>
                            <strong>{item.order}</strong>
                        </div>

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

                        <div>
                            <span>Stock</span>
                            <strong>{item.product.quantity_in_stock}</strong>
                        </div>

                        <div>
                            <span>Category</span>
                            <strong>{item.product.category}</strong>
                        </div>

                        <div>
                            <span>Store</span>
                            <strong>{item.product.store}</strong>
                        </div>

                        <div>
                            <span>Created</span>
                            <strong>
                                {new Date(item.created).toLocaleString()}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}