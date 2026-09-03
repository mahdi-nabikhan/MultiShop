"use client";

import Link from "next/link";

import useStores from "@/hooks/shop/useStores";

import Pagination from "@/components/commen/Paginations";

import BACKEND_URLS from "@/utils";

import "./ShopList.css";

interface Props {
    page: string;
}

export default function ShopList({
    page,
}: Props) {

    const {
        data,
        isLoading,
        isError,
    } = useStores(page);


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

            <Pagination
                next={data.links.next}
                previous={data.links.previous}
                loading={isLoading}
                onNext={() => {
                    if (data.links.next) {
                        const url = new URL(data.links.next);
                        const nextPage =
                            url.searchParams.get("page");

                        if (nextPage) {
                            window.location.href = `/?page=${nextPage}`;
                        }
                    }
                }}
                onPrevious={() => {
                    if (data.links.previous) {
                        const url = new URL(data.links.previous);
                        const previousPage =
                            url.searchParams.get("page");

                        if (previousPage) {
                            window.location.href = `/?page=${previousPage}`;
                        }
                    }
                }}
            />

        </section>

    );

}