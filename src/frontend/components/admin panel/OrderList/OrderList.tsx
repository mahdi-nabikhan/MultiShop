"use client";

import { useState } from "react";

import useShopOrders from "@/hooks/admin-panel/useShopOrders";
import Pagination from "@/components/commen/Paginations";

import "./OrderList.css";


export default function OrderList() {

    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useShopOrders(
        page,
        pageSize
    );


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


    const orders = data?.results ?? [];


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
                orders.length === 0 ? (

                    <div className="empty-orders">

                        <h2>No Orders Found</h2>

                    </div>

                ) : (

                    <div className="orders-list">

                        {
                            orders.map((order) => (

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
                                                {
                                                    order.customer.username
                                                }
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

                            ))
                        }

                    </div>

                )
            }


            {
                data && (
                    <Pagination
                        next={data.links.next}
                        previous={data.links.previous}
                        loading={isFetching}
                        onNext={() =>
                            setPage(
                                (prev) => prev + 1
                            )
                        }
                        onPrevious={() =>
                            setPage(
                                (prev) => prev - 1
                            )
                        }
                    />
                )
            }

        </div>

    );
}