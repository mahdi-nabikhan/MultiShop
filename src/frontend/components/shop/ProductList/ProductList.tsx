"use client";

import { useState } from "react";

import ProductCard from "../ProductCard/ProductCard";

import "./ProductList.css";

import useStoreProducts from "@/hooks/shop/useStoreProducts";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";


interface ProductListProps {
    shopId: string;
}


export default function ProductList({
    shopId,
}: ProductListProps) {

    const [page, setPage] = useState(1);

    const pageSize = 8;


    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useStoreProducts(
        shopId,
        page,
        pageSize
    );


    // ==========================
    // Loading
    // ==========================

    if (isLoading) {
        return (
            <Skeleton count={8} />
        );
    }


    // ==========================
    // Error
    // ==========================

    if (isError) {
        return (
            <ErrorState message="Error loading products." />
        );
    }


    const products = data?.results ?? [];


    // ==========================
    // Empty
    // ==========================

    if (products.length === 0) {
        return (
            <EmptyState message="No products found." />
        );
    }


    // ==========================
    // UI
    // ==========================

    return (
        <section className="product-list container">


            <div className="product-list-header">

                <div>

                    <h2>
                        Store Products
                    </h2>


                    <p>
                        Showing all products of this store
                    </p>

                </div>


                <span>
                    {data?.count ?? 0} Products
                </span>


            </div>



            <div className="products-grid">

                {products.map((product) => (

                    <ProductCard
                        key={product.id}
                        product={product}
                        shopId={shopId}
                    />

                ))}

            </div>



            <Pagination

                next={data?.links.next ?? null}

                previous={data?.links.previous ?? null}

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