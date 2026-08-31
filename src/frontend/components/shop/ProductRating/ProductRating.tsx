"use client";

import { useState } from "react";

import useCanRateProduct from "@/hooks/shop/useCanRateProduct";
import useAddProductRating from "@/hooks/shop/useAddProductRating";

import "./ProductRating.css";


interface ProductRatingProps {

    productId: number;

    isAuthenticated: boolean;

}


export default function ProductRating({

    productId,

    isAuthenticated,

}: ProductRatingProps) {


    const [selectedRate, setSelectedRate] =
        useState(0);


    const [hoverRate, setHoverRate] =
        useState(0);


    const [message, setMessage] =
        useState("");


    // ==========================================
    // Check Can Rate
    // ==========================================

    const {
        data: canRate = false,
        isLoading: loading,
        isError,
    } = useCanRateProduct(
        productId,
        isAuthenticated
    );


    // ==========================================
    // Add Rating
    // ==========================================

    const ratingMutation =
        useAddProductRating();


    // ==========================================
    // Submit Rating
    // ==========================================

    const addRate = () => {

        if (
            selectedRate === 0 ||
            ratingMutation.isPending
        ) {

            return;

        }


        setMessage("");


        ratingMutation.mutate({

            productId,

            rate: selectedRate,

        }, {

            onSuccess: () => {

                setMessage(
                    "Rating submitted successfully"
                );

                setSelectedRate(0);

            },

            onError: (error) => {

                console.error(
                    "Product rating error:",
                    error
                );

                setMessage(
                    "Error submitting rating"
                );

            },

        });

    };


    // ==========================================
    // Guest User
    // ==========================================

    if (!isAuthenticated) {

        return null;

    }


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="rating-loading">

                Loading...

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError) {

        return (

            <div className="rating-loading">

                Failed to load rating status.

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="product-rating">


            <h3>

                Rate This Product

            </h3>


            {canRate ? (

                <>


                    {/* Rating Stars */}

                    <div className="rating-stars">

                        {[1, 2, 3, 4, 5].map(
                            (star) => (

                                <button

                                    key={star}

                                    type="button"

                                    onMouseEnter={() =>
                                        setHoverRate(star)
                                    }

                                    onMouseLeave={() =>
                                        setHoverRate(0)
                                    }

                                    onClick={() =>
                                        setSelectedRate(star)
                                    }

                                    disabled={
                                        ratingMutation.isPending
                                    }

                                    className={

                                        star <=
                                        (
                                            hoverRate ||
                                            selectedRate
                                        )

                                            ? "active"

                                            : ""

                                    }

                                >

                                    ★

                                </button>

                            )
                        )}

                    </div>


                    {/* Submit */}

                    <button

                        type="button"

                        className="rating-submit"

                        onClick={addRate}

                        disabled={

                            ratingMutation.isPending ||
                            selectedRate === 0

                        }

                    >

                        {ratingMutation.isPending

                            ? "Sending..."

                            : "Submit Rating"

                        }

                    </button>


                </>

            ) : (

                <p className="rated-text">

                    You already rated this product.

                </p>

            )}


            {/* Message */}

            {message && (

                <p className="success-message">

                    {message}

                </p>

            )}


        </div>

    );

}