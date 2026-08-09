"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

import "./CustomerOrderOtemList.css";

import { Package } from "lucide-react";


interface Product {

    id: number;

    name: string;

    description: string;

    product_image: string;

    price: number;

}


interface OrderItem {

    id: number;

    quantity: number;

    status: string;

    created: string;

    total: string;

    order: number;

    product: Product;

}


interface Props {

    orderId: number;

}


export default function CustomerOrderItemList({
    orderId,
}: Props) {


    const [items, setItems] =
        useState<OrderItem[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const GetOrderItems = async () => {

        try {

            setLoading(true);

            setError("");


            const { data } =
                await axios.get<OrderItem[]>(

                    `${BACKEND_URLS}order/api/v1/order/item/list/${orderId}/`,

                    {
                        withCredentials: true,
                    }

                );


            setItems(data);


        } catch (error) {

            console.error(
                "GET ORDER ITEMS ERROR:",
                error
            );

            setError(
                "Failed to load order items."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (!orderId) {
            return;
        }

        GetOrderItems();

    }, [orderId]);


    if (loading) {

        return (

            <div className="order-loading">

                Loading...

            </div>

        );

    }


    if (error) {

        return (

            <div className="order-error">

                {error}

            </div>

        );

    }


    return (

        <section className="customer-order-items">


            <div className="order-items-header">

                <div>

                    <h2>
                        Order #{orderId}
                    </h2>

                    <p>
                        Products in this order
                    </p>

                </div>


                <div className="order-items-count">

                    <Package size={18} />

                    <span>
                        {items.length} Items
                    </span>

                </div>

            </div>



            <div className="order-items-list">


                {items.length === 0 ? (

                    <div className="empty-order-items">

                        <Package size={40} />

                        <p>
                            No products found in this order.
                        </p>

                    </div>

                ) : (

                    items.map((item) => (

                        <div
                            className="order-item-card"
                            key={item.id}
                        >


                            <div className="product-image">

                                <img
                                    src={
                                        `${BACKEND_URLS.replace(
                                            "/api/v1/",
                                            ""
                                        )}${item.product.product_image}`
                                    }
                                    alt={item.product.name}
                                />

                            </div>



                            <div className="product-info">

                                <h3>
                                    {item.product.name}
                                </h3>


                                <p>
                                    Quantity: {item.quantity}
                                </p>


                                <span>

                                    Status:

                                    {item.status === "P"
                                        ? " Pending"
                                        : ` ${item.status}`}

                                </span>

                            </div>



                            <div className="product-price">

                                <span>
                                    Unit Price
                                </span>

                                <strong>
                                    ${item.product.price}
                                </strong>

                            </div>



                            <div className="product-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ${item.total}
                                </strong>

                            </div>


                        </div>

                    ))

                )}

            </div>


        </section>

    );

}