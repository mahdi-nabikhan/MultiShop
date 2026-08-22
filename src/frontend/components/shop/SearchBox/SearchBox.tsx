"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { searchProducts } from "@/services/product.services";
import {
    searchStores,
    StoreResult,
} from "@/services/shop.services";

import type { ProductResult } from "@/types/product";

import "./SearchBox.css";


export default function SearchBox() {

    const [query, setQuery] = useState("");

    const [searchQuery, setSearchQuery] =
        useState("");

    const [showResults, setShowResults] =
        useState(false);

    const searchRef =
        useRef<HTMLDivElement>(null);


    // ==========================================
    // Click Outside
    // ==========================================

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                searchRef.current &&
                !searchRef.current.contains(
                    event.target as Node
                )
            ) {

                setShowResults(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // ==========================================
    // Debounce Search
    // ==========================================

    useEffect(() => {

        const trimmedQuery =
            query.trim();


        if (!trimmedQuery) {

            setSearchQuery("");

            setShowResults(false);

            return;

        }


        const timeout = setTimeout(() => {

            setSearchQuery(
                trimmedQuery
            );

            setShowResults(true);

        }, 400);


        return () =>
            clearTimeout(timeout);

    }, [query]);


    // ==========================================
    // Search Query
    // ==========================================

    const {
        data,
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "search",
            searchQuery,
        ],

        queryFn: async () => {

            const [
                storeResponse,
                productResponse,
            ] = await Promise.all([

                searchStores(
                    searchQuery
                ),

                searchProducts(
                    searchQuery
                ),

            ]);


            return {

                stores:
                    storeResponse.results || [],

                products:
                    productResponse.results || [],

            };

        },

        enabled:
            Boolean(searchQuery),

        staleTime:
            30 * 1000,

    });


    const stores:
        StoreResult[] =
            data?.stores ?? [];


    const products:
        ProductResult[] =
            data?.products ?? [];


    const hasResults =
        stores.length > 0 ||
        products.length > 0;


    // ==========================================
    // Submit
    // ==========================================

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        if (!query.trim()) {

            return;

        }


        setSearchQuery(
            query.trim()
        );

        setShowResults(true);

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            className="search-container"
            ref={searchRef}
        >

            <form
                className="search-box"
                onSubmit={handleSubmit}
            >

                <input

                    type="text"

                    value={query}

                    onChange={(event) =>
                        setQuery(
                            event.target.value
                        )
                    }

                    onFocus={() => {

                        if (
                            query.trim()
                        ) {

                            setShowResults(
                                true
                            );

                        }

                    }}

                    placeholder="Search products or stores..."

                    autoComplete="off"

                />


                <button type="submit">

                    Search

                </button>

            </form>


            {showResults && (

                <div className="search-results">


                    {/* Loading */}

                    {isLoading && (

                        <div className="search-loading">

                            Searching...

                        </div>

                    )}


                    {/* Error */}

                    {isError && (

                        <div className="no-results">

                            Failed to search.

                        </div>

                    )}


                    {/* Empty */}

                    {!isLoading &&
                        !isError &&
                        !hasResults &&
                        searchQuery && (

                            <div className="no-results">

                                No results found.

                            </div>

                        )}


                    {/* Stores */}

                    {!isLoading &&
                        !isError &&
                        stores.length > 0 && (

                            <div className="result-section">

                                <div className="result-title">

                                    Stores

                                </div>


                                {stores.map(
                                    (store) => (

                                        <Link

                                            key={
                                                `store-${store.id}`
                                            }

                                            href={
                                                `/store/${store.id}`
                                            }

                                            className="search-result-item"

                                            onClick={() =>
                                                setShowResults(
                                                    false
                                                )
                                            }

                                        >

                                            <div className="result-icon">

                                                🏪

                                            </div>


                                            <div className="result-content">

                                                <span className="result-name">

                                                    {
                                                        store.name
                                                    }

                                                </span>


                                                {store.description && (

                                                    <small>

                                                        {
                                                            store.description
                                                        }

                                                    </small>

                                                )}

                                            </div>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}


                    {/* Products */}

                    {!isLoading &&
                        !isError &&
                        products.length > 0 && (

                            <div className="result-section">

                                <div className="result-title">

                                    Products

                                </div>


                                {products.map(
                                    (product) => (

                                        <Link

                                            key={
                                                `product-${product.id}`
                                            }

                                            href={
                                                `/product/${product.id}`
                                            }

                                            className="search-result-item"

                                            onClick={() =>
                                                setShowResults(
                                                    false
                                                )
                                            }

                                        >

                                            <div className="result-icon">

                                                🛍️

                                            </div>


                                            <div className="result-content">

                                                <span className="result-name">

                                                    {
                                                        product.name
                                                    }

                                                </span>


                                                {product.price !== undefined && (

                                                    <small>

                                                        {
                                                            product.price.toLocaleString()
                                                        }

                                                        {" "}
                                                        تومان

                                                    </small>

                                                )}

                                            </div>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                </div>

            )}

        </div>

    );

}