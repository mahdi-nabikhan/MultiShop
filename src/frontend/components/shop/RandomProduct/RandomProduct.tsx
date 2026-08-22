"use client";

import { useQuery } from "@tanstack/react-query";

import { getRandomProducts } from "@/services/product.services";
import type { Product } from "@/types/product";

import Link from "next/link";
import BACKEND_URLS from "@/utils";

import "./RandomProduct.css";


export default function RandomProducts() {


    const {
        data: products = [],
        isLoading,
        isError,
    } = useQuery<Product[]>({

        queryKey: [
            "random-products",
        ],

        queryFn:
            getRandomProducts,

    });


    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {

        return (

            <section className="random-products">

                <h2>
                    Recommended Products
                </h2>

                <p>
                    Loading...
                </p>

            </section>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError) {

        return (

            <section className="random-products">

                <h2>
                    Recommended Products
                </h2>

                <p>
                    Failed to load products.
                </p>

            </section>

        );

    }


    // ==========================================
    // Empty
    // ==========================================

    if (products.length === 0) {

        return null;

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="random-products">


            <div className="random-products-header">

                <h2>
                    Recommended Products
                </h2>

            </div>


            <div className="random-products-grid">


                {products.map(product => (

                    <Link

                        href={`/product/${product.id}`}

                        className="random-product-card"

                        key={product.id}

                    >


                        <div className="random-product-image">

                            <img

                                src={
                                    `${BACKEND_URLS}${product.product_image}`
                                }

                                alt={product.name}

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


        </section>

    );

}