"use client";

import { useQuery } from "@tanstack/react-query";
import { getShopOrders } from "@/services/shop-admin-panel.services";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import "./OrderList.css";



export default function OrderList() {
    const {data: orders = [],isLoading,isError,} = useQuery({
        queryKey: shopAdminQueryKeys.orders(),
        queryFn: getShopOrders});


    if (isError) {
        return (
            <div className="orders-error">
                Failed to load orders.
            </div>
        );
    }


    if (isLoading) {

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