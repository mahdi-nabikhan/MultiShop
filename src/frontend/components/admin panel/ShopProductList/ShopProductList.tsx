"use client";

import { useState } from "react";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import useShopProducts from "@/hooks/admin-panel/useShopProducts";

import ProductRow from "../ProductRow/ProductRow";

import ProductListHeader from "./ProductListHeader";
import ProductListToolbar from "./ProductListToolbar";

import "./ShopProductList.css";

export default function ShopProductList() {
    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useShopProducts(
        page,
        pageSize
    );

    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {
        return (
            <div className="product-list">
                <Skeleton count={8} />
            </div>
        );
    }

    // ==========================================
    // Error
    // ==========================================

    if (isError) {
        return (
            <div className="product-list">
                <ErrorState
                    message="Failed to load products."
                />
            </div>
        );
    }

    const products = data?.results ?? [];

    // ==========================================
    // Empty
    // ==========================================

    if (products.length === 0) {
        return (
            <div className="product-list">
                <EmptyState
                    message="No products found."
                />
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="product-list">

            {/* ==========================================
                HEADER
            ========================================== */}

            <ProductListHeader />

            {/* ==========================================
                TOOLBAR
            ========================================== */}

            <ProductListToolbar />

            {/* ==========================================
                TABLE
            ========================================== */}

            <table className="product-table">

                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Sale Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <ProductRow
                            key={product.id}
                            product={product}
                        />
                    ))}
                </tbody>

            </table>

            {/* ==========================================
                PAGINATION
            ========================================== */}

            {data && (
                <Pagination
                    next={data.links.next}
                    previous={data.links.previous}
                    loading={isFetching}
                    onNext={() =>
                        setPage(
                            (prev) => prev + 1
                        )
                    }
                    onPrevious={() =>
                        setPage(
                            (prev) => prev - 1
                        )
                    }
                />
            )}

        </div>
    );
}