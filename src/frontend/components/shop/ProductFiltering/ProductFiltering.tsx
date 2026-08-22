"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getFilteredProducts } from "@/services/product.services";

import type { Product } from "@/types/product";

import "./ProductFiltering.css";


const filters = [
    {
        title: "Lowest Price",
        value: "price_asc",
    },
    {
        title: "Highest Price",
        value: "price_dsc",
    },
];


export default function ProductFilterList() {

    const [order, setOrder] = useState("");


    const {
        data: products = [],
        isLoading,
        isError,
    } = useQuery<Product[]>({

        queryKey: [
            "products",
            "filter",
            order,
        ],

        queryFn: () =>
            getFilteredProducts(order),

    });


    if (isError) {

        return (
            <p>
                Error loading products
            </p>
        );

    }


    return (

        <div>

            {/* Filter Buttons */}

            <div className="filter-buttons">

                {filters.map((filter) => (

                    <button
                        key={filter.value}
                        onClick={() =>
                            setOrder(filter.value)
                        }
                        className={
                            order === filter.value
                                ? "active"
                                : ""
                        }
                    >

                        {filter.title}

                    </button>

                ))}

            </div>


            {/* Products */}

            {isLoading ? (

                <p>
                    Loading products...
                </p>

            ) : (

                <div className="product-grid">

                    {products.map((product) => (

                        <div
                            key={product.id}
                            className="product-card"
                        >

                            <img
                                src={product.product_image ?? "/product.jpg"}
                                alt={product.name}
                            />

                            <h3>
                                {product.name}
                            </h3>

                            <p>
                                ${product.price_after}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}