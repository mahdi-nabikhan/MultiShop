"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BACKEND_URLS from "@/utils";

import "./CustomerOrderOtemList.css";
import { getCustomerOrderItems, OrderItem } from "@/services/order.services";
import { Package } from "lucide-react";







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


    const fetchOrderItems = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCustomerOrderItems(orderId);

            setItems(data);

        } catch (error) {
            console.error(
                "GET CUSTOMER ORDER ITEMS ERROR:",
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

        fetchOrderItems();

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


                {
                    items.length === 0 ? (

                        <div className="empty-order-items">

                            <Package size={40} />

                            <p>
                                No products found in this order.
                            </p>

                        </div>


                    ) : (


                        items.map((item) => (


                            <Link

                                href={`/customer-panel/orderitem/${item.id}`}

                                className="order-item-link"

                                key={item.id}

                            >


                                <div className="order-item-card">



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

                                            {
                                                item.status === "P"
                                                    ? " Pending"
                                                    : ` ${item.status}`
                                            }


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



                            </Link>


                        ))


                    )

                }


            </div>


        </section>

    );

}