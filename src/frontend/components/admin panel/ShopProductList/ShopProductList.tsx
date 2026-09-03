"use client";

import { useState } from "react";

import Pagination from "@/components/commen/Paginations";
import useShopProducts from "@/hooks/admin-panel/useShopProducts";

import ProductRow from "../ProductRow/ProductRow";

import "./ShopProductList.css";

export default function ShopProductList() {
    const [page, setPage] = useState(1);
    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useShopProducts(page, pageSize);

    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {
        return (
            <div className="product-list">
                <div className="products-loading">
                    Loading products...
                </div>
            </div>
        );
    }

    // ==========================================
    // Error
    // ==========================================

    if (isError) {
        return (
            <div className="product-list">
                <div className="products-error">
                    Failed to load products.
                </div>
            </div>
        );
    }

    const products = data?.results ?? [];

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="product-list">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="product-header">

                <div>
                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage all products in your store
                    </p>
                </div>

                <button
                    className="add-product-btn"
                >
                    + Add Product
                </button>

            </div>


            {/* ==========================================
                TOOLBAR
            ========================================== */}

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search product..."
                />

                <select>
                    <option>
                        All Categories
                    </option>
                </select>

                <select>
                    <option>
                        All Stock
                    </option>
                </select>

            </div>


            {/* ==========================================
                EMPTY
            ========================================== */}

            {products.length === 0 ? (

                <div className="products-empty">

                    <h2>
                        No Products Found
                    </h2>

                    <p>
                        There are no products in your store.
                    </p>

                </div>

            ) : (

                /* ==========================================
                    TABLE
                ========================================== */

                <table className="product-table">

                    <thead>

                        <tr>

                            <th>
                                Image
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Sale Price
                            </th>

                            <th>
                                Stock
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

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

            )}


            {/* ==========================================
                PAGINATION
            ========================================== */}

            {data && (
                <Pagination
                    next={data.links.next}
                    previous={data.links.previous}
                    loading={isFetching}
                    onNext={() =>
                        setPage((prev) => prev + 1)
                    }
                    onPrevious={() =>
                        setPage((prev) => prev - 1)
                    }
                />
            )}

        </div>
    );
}