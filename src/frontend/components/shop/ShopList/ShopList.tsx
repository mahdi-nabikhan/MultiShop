"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys"; 
import { getStores } from "@/services/shop.services";
import ShopPagination from "./ShopPagination";

import BACKEND_URLS from "@/utils";

import "./ShopList.css";


interface Props {
    page: string;
}


export default function ShopList({
    page,
}: Props) {


    const {data,isLoading,isError,} = useQuery({

        queryKey: shopQueryKeys.stores(page),
        queryFn: () =>
            getStores(page),

    });


    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {

        return (

            <section className="shop-list container">

                <p>
                    Loading shops...
                </p>

            </section>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError || !data) {

        return (

            <section className="shop-list container">

                <p>
                    Error loading shops.
                </p>

            </section>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="shop-list container">


            {/* Shops */}

            <div className="shops-grid">

                {data.results.map((item) => (

                    <Link

                        href={`/shop/${item.pk}`}

                        className="shop-card"

                        key={item.pk}

                    >

                        {/* Image */}

                        <div className="shop-image">

                            <img

                                src={
                                    item.image
                                        ? `${BACKEND_URLS.replace(/\/$/, "")}${item.image}`
                                        : "/images/banner-1.jpg"
                                }

                                alt={item.name}

                            />

                        </div>


                        {/* Content */}

                        <div className="shop-content">

                            <h3>

                                {item.name}

                            </h3>


                            <p>

                                {item.description}

                            </p>

                        </div>


                    </Link>

                ))}

            </div>


            {/* Pagination */}

            <ShopPagination

                next={data.links.next}

                previous={data.links.previous}

            />


        </section>

    );

}