"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useStores from "@/hooks/shop/useStores";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import BACKEND_URLS from "@/utils";

import "./ShopList.css";

interface Props {
    page: string;
}

export default function ShopList({ page }: Props) {
    const router = useRouter();

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
                <Skeleton count={8} />
            </section>
        );
    }


    // ==========================================
    // Error
    // ==========================================

    if (isError || !data) {
        return (
            <section className="shop-list container">
                <ErrorState message="Error loading shops." />
            </section>
        );
    }


    // ==========================================
    // Empty
    // ==========================================

    if (data.results.length === 0) {
        return (
            <section className="shop-list container">
                <EmptyState message="No shops found." />
            </section>
        );
    }


    // ==========================================
    // Pagination
    // ==========================================

    const goToPage = (url: string | null) => {
        if (!url) {
            return;
        }

        const urlObject = new URL(url);

        const pageNumber =
            urlObject.searchParams.get("page");

        if (pageNumber) {
            router.push(`/?page=${pageNumber}`);
        }
    };


    // ==========================================
    // UI
    // ==========================================

    return (
        <section className="shop-list container">

            <div className="shops-grid">

                {data.results.map((item) => (

                    <Link
                        href={`/shop/${item.pk}`}
                        className="shop-card"
                        key={item.pk}
                    >

                        <div className="shop-image">

                            <Image
                                src={
                                    item.image
                                        ? `${BACKEND_URLS.replace(/\/$/, "")}${item.image}`
                                        : "/images/banner-1.jpg"
                                }
                                alt={item.name}
                                width={300}
                                height={200}
                                loading="lazy"
                            />

                        </div>


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


            <Pagination

                next={data.links.next}

                previous={data.links.previous}

                loading={isLoading}

                onNext={() =>
                    goToPage(data.links.next)
                }

                onPrevious={() =>
                    goToPage(data.links.previous)
                }

            />

        </section>
    );
}