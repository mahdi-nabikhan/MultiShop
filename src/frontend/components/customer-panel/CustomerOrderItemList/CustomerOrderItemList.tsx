"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCustomerOrderItems } from "@/hooks/customer/useCustomerOrder";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import BACKEND_URLS from "@/utils";

import { Package } from "lucide-react";

import "./CustomerOrderOtemList.css";


interface Props {
    orderId: number;
}


export default function CustomerOrderItemList({
    orderId,
}: Props) {


    const [page, setPage] = useState(1);

    const pageSize = 8;


    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useCustomerOrderItems(
        orderId,
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
            <div className="order-error">
                <ErrorState message="Failed to load order items." />
            </div>
        );
    }



    // ==========================
    // Empty
    // ==========================

    if (!data || data.results.length === 0) {
        return (
            <div className="order-error">
                <EmptyState message="No order items found." />
            </div>
        );
    }



    const items = data.results;



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
                        {data.count} Items
                    </span>

                </div>


            </div>



            <div className="order-items-list">


                {items.map((item) => (

                    <Link

                        href={`/customer-panel/orderitem/${item.id}`}

                        className="order-item-link"

                        key={item.id}

                    >


                        <div className="order-item-card">



                            <div className="product-image">


                                <Image

                                    src={
                                        `${BACKEND_URLS.replace(
                                            "/api/v1/",
                                            ""
                                        )}${item.product.product_image}`
                                    }

                                    alt={item.product.name}

                                    width={120}

                                    height={120}


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