"use client";

import { useQuery } from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import { getShopProducts } from "@/services/shop-admin-panel.services";

import ProductRow from "../ProductRow/ProductRow";

import "./ShopProductList.css";


export default function ShopProductList() {

    const {
        data: products = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: shopAdminQueryKeys.products(),
        queryFn: getShopProducts,
    });


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

        </div>

    );

}