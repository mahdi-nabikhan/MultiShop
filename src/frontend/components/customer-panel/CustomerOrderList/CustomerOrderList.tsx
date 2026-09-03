"use client";

import { useState } from "react";
import Link from "next/link";

import useCustomerOrders from "@/hooks/customer/useCustomerOrders";
import Pagination from "@/components/commen/Paginations";

import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

import "./CustomerOrderList.css";

export default function CustomerOrderList() {
    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useCustomerOrders(page, pageSize);

    if (isLoading) {
        return (
            <div className="order-loading">
                Loading Orders...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="order-loading">
                Failed to load orders.
            </div>
        );
    }

    if (!data) {
        return (
            <div className="order-loading">
                No orders found.
            </div>
        );
    }

    const orders = data.results;

    return (
        <section className="customer-orders">

            <div className="orders-header">

                <div>
                    <h2>
                        My Orders
                    </h2>

                    <p>
                        Track and manage your purchases
                    </p>
                </div>

            </div>

            <div className="orders-list">

                {orders.length > 0 ? (

                    orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.id}
                        >

                            <div className="order-icon">
                                <Package size={28} />
                            </div>

                            <div className="order-info">

                                <h3>
                                    Order #{order.id}
                                </h3>

                                <span>
                                    {new Date(
                                        order.created
                                    ).toLocaleDateString()}
                                </span>

                            </div>

                            <div
                                className={
                                    order.status
                                        ? "order-status completed"
                                        : "order-status pending"
                                }
                            >

                                {order.status ? (
                                    <>
                                        <CheckCircle size={18} />
                                        Completed
                                    </>
                                ) : (
                                    <>
                                        <Clock size={18} />
                                        Pending
                                    </>
                                )}

                            </div>

                            <Link
                                href={`/customer-panel/order/${order.id}`}
                                className="view-order-btn"
                            >
                                View Details
                            </Link>

                        </div>

                    ))

                ) : (

                    <div className="empty-orders">

                        <XCircle size={40} />

                        <p>
                            You don't have any orders yet
                        </p>

                    </div>

                )}

            </div>

            <Pagination
                next={data.links.next}
                previous={data.links.previous}
                loading={isFetching}
                onNext={() => setPage((prev) => prev + 1)}
                onPrevious={() => setPage((prev) => prev - 1)}
            />

        </section>
    );
}