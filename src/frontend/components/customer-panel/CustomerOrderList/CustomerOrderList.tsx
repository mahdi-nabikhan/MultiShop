"use client";

import { useState } from "react";
import Link from "next/link";

import useCustomerOrders from "@/hooks/customer/useCustomerOrders";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import {
    Package,
    Clock,
    CheckCircle,
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
    } = useCustomerOrders(
        page,
        pageSize
    );



    // ==========================
    // Loading
    // ==========================

    if (isLoading) {
        return (
            <div className="order-loading">
                <Skeleton count={8} />
            </div>
        );
    }



    // ==========================
    // Error
    // ==========================

    if (isError) {
        return (
            <div className="order-loading">
                <ErrorState message="Failed to load orders." />
            </div>
        );
    }



    // ==========================
    // Empty
    // ==========================

    if (!data || data.results.length === 0) {
        return (
            <div className="order-loading">
                <EmptyState message="You don't have any orders yet." />
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


                {orders.map((order) => (

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

                                {
                                    new Date(
                                        order.created
                                    ).toLocaleDateString()
                                }

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

                ))}


            </div>




            <Pagination

                next={data.links.next}

                previous={data.links.previous}

                loading={isFetching}

                onNext={() =>
                    setPage((prev) => prev + 1)
                }

                onPrevious={() =>
                    setPage((prev) =>
                        Math.max(1, prev - 1)
                    )
                }

            />



        </section>

    );
}