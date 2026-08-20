"use client";

import { useEffect, useState } from "react";
import {
    getShopOrders,
    Order,
} from "@/services/shop-admin-panel.services";
import BACKEND_URLS from "@/utils";
import "./OrderList.css";



export default function OrderList() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

   const getOrders = async () => {

    try {

        setLoading(true);

        const data = await getShopOrders();

        setOrders(data);

    } catch (err) {

        console.error(
            "Failed to load orders:",
            err
        );

    } finally {

        setLoading(false);

    }

};

    useEffect(() => {

        getOrders();

    }, []);

    if (loading) {

        return (
            <div className="orders-loading">
                Loading...
            </div>
        );

    }

    return (

        <div className="orders-page">

            <div className="orders-header">

                <div>

                    <h1>Orders</h1>

                    <p>
                        Manage all customer orders
                    </p>

                </div>

            </div>

            {
                orders.length === 0 ?

                    <div className="empty-orders">

                        <h2>No Orders Found</h2>

                    </div>

                    :

                    <div className="orders-list">

                        {orders.map((order) => (

                            <div
                                key={order.pk}
                                className="order-card"
                            >

                                <div className="order-top">

                                    <h2>
                                        Order #{order.pk}
                                    </h2>

                                    <span
                                        className={
                                            order.status
                                                ? "status completed"
                                                : "status pending"
                                        }
                                    >
                                        {
                                            order.status
                                                ? "Completed"
                                                : "Pending"
                                        }
                                    </span>

                                </div>

                                <div className="order-body">

                                    <div className="order-item">

                                        <span>
                                            Customer
                                        </span>

                                        <strong>
                                            {order.customer.username}
                                        </strong>

                                    </div>

                                    <div className="order-item">

                                        <span>
                                            Customer ID
                                        </span>

                                        <strong>
                                            #{order.customer.id}
                                        </strong>

                                    </div>

                                </div>

                                <div className="order-actions">

                                    <button
                                        className="view-btn"
                                    >
                                        View Details
                                    </button>

                                    {
                                        !order.status && (

                                            <button
                                                className="confirm-btn"
                                            >
                                                Confirm Order
                                            </button>

                                        )
                                    }

                                </div>

                            </div>

                        ))}

                    </div>

            }

        </div>

    );

}