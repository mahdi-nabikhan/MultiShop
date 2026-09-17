
"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

import BACKEND_URLS from "@/utils";

import useRandomProducts from "@/hooks/shop/useRandomProducts";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";

import Pagination from "@/components/commen/Paginations";

import "./RandomProduct.css";

export default function RandomProducts() {
    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useRandomProducts(page, pageSize);

    if (isLoading) {
        return (
            <section className="random-products">
                <h2>
                    Recommended Products
                </h2>

                <Skeleton count={8} />
            </section>
        );
    }

    if (isError) {
        return (
            <section className="random-products">
                <h2>
                    Recommended Products
                </h2>

                <ErrorState message="Failed to load products." />
            </section>
        );
    }

    const products = data?.results ?? [];

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="random-products">
            <div className="random-products-header">
                <h2>
                    Recommended Products
                </h2>
            </div>

            <div className="random-products-grid">
                {products.map((product) => (
                    <Link
                        href={`/product/${product.id}`}
                        className="random-product-card"
                        key={product.id}
                    >
                        <div className="random-product-image">
                            <Image
                                src={`${BACKEND_URLS}${product.product_image}`}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="product-image"
                            />
                        </div>

                        <div className="random-product-content">
                            <h3>
                                {product.name}
                            </h3>

                            <p>
                                {product.description}
                            </p>

                            <div className="random-product-footer">
                                <span className="old-price">
                                    ${product.price}
                                </span>

                                <span className="new-price">
                                    ${product.price_after}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Pagination
                next={data?.links.next ?? null}
                previous={data?.links.previous ?? null}
                loading={isFetching}
                onNext={() => setPage((prev) => prev + 1)}
                onPrevious={() =>
                    setPage((prev) => Math.max(1, prev - 1))
                }
            />
        </section>
    );
}
