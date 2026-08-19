"use client";


import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { searchProducts, ProductResult } from "@/services/product.services";
import { searchStores, StoreResult } from "@/services/shop.services";
import "./SearchBox.css";




interface SearchResponse<T> {
    success: boolean;
    count: number;
    results: T[];
}

export default function SearchBox() {
    const [query, setQuery] = useState("");
    const [stores, setStores] = useState<StoreResult[]>([]);
    const [products, setProducts] = useState<ProductResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setStores([]);
                setProducts([]);
                setShowResults(false);
                return;
            }

            setLoading(true);

            try {
                const [storeResponse, productResponse] = await Promise.all([
                    searchStores(query.trim()),
                    searchProducts(query.trim()),
                ]);

                setStores(storeResponse.results || []);
                setProducts(productResponse.results || []);

                setShowResults(true);
            } catch (error) {
                console.error("Search error:", error);

                setStores([]);
                setProducts([]);
                setShowResults(true);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(search, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!query.trim()) {
            return;
        }

        setShowResults(true);
    };

    const hasResults = stores.length > 0 || products.length > 0;

    return (
        <div className="search-container" ref={searchRef}>
            <form
                className="search-box"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => {
                        if (query.trim()) {
                            setShowResults(true);
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

                    {loading && (
                        <div className="search-loading">
                            Searching...
                        </div>
                    )}

                    {!loading && !hasResults && query.trim() && (
                        <div className="no-results">
                            No results found.
                        </div>
                    )}

                    {!loading && stores.length > 0 && (
                        <div className="result-section">

                            <div className="result-title">
                                Stores
                            </div>

                            {stores.map((store) => (
                                <Link
                                    key={`store-${store.id}`}
                                    href={`/store/${store.id}`}
                                    className="search-result-item"
                                    onClick={() => setShowResults(false)}
                                >
                                    <div className="result-icon">
                                        🏪
                                    </div>

                                    <div className="result-content">
                                        <span className="result-name">
                                            {store.name}
                                        </span>

                                        {store.description && (
                                            <small>
                                                {store.description}
                                            </small>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="result-section">

                            <div className="result-title">
                                Products
                            </div>

                            {products.map((product) => (
                                <Link
                                    key={`product-${product.id}`}
                                    href={`/product/${product.id}`}
                                    className="search-result-item"
                                    onClick={() => setShowResults(false)}
                                >
                                    <div className="result-icon">
                                        🛍️
                                    </div>

                                    <div className="result-content">
                                        <span className="result-name">
                                            {product.name}
                                        </span>

                                        {product.price !== undefined && (
                                            <small>
                                                {product.price.toLocaleString()} تومان
                                            </small>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    );


}
