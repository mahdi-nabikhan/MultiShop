"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import BACKEND_URLS from "@/utils";

import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

import "./CustomerOrderList.css";


interface Order {

    id: number;

    status: boolean;

    created: string;

    customer: number;

}


export default function CustomerOrderList() {

    const [orders, setOrders] =
        useState<Order[]>([]);

    const [loading, setLoading] =
        useState(true);


    const GetOrders = async () => {

        try {

            const { data } =
                await axios.get<Order[]>(

                    `${BACKEND_URLS}order/api/v1/orders/`,

                    {
                        withCredentials: true,
                    }

                );

            setOrders(data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        GetOrders();

    }, []);


    if (loading) {

        return (

            <div className="order-loading">

                Loading Orders...

            </div>

        );

    }


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

                                        <CheckCircle
                                            size={18}
                                        />

                                        Completed

                                    </>

                                ) : (

                                    <>

                                        <Clock
                                            size={18}
                                        />

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


        </section>

    );

}