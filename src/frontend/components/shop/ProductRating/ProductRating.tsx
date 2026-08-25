"use client";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys"; 
import { useState } from "react";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    canRateProduct,
    addProductRating,
} from "@/services/product.services";

import "./ProductRating.css";


interface ProductRatingProps {

    productId: number;

    isAuthenticated: boolean;

}


export default function ProductRating({

    productId,

    isAuthenticated,

}: ProductRatingProps) {


    const queryClient =
        useQueryClient();


    const [selectedRate, setSelectedRate] =
        useState(0);


    const [hoverRate, setHoverRate] =
        useState(0);


    const [message, setMessage] =
        useState("");


    // ==========================================
    // Check Can Rate
    // ==========================================

    const {data: canRate = false,isLoading: loading,isError} = useQuery({
        queryKey: shopQueryKeys.canRateProduct(productId),
        queryFn: () =>
            canRateProduct(productId),

        enabled:
            isAuthenticated,});


    // ==========================================
    // Add Rating
    // ==========================================

    const ratingMutation = useMutation({

        mutationFn: () =>
            addProductRating(
                productId,
                selectedRate
            ),

        onSuccess: () => {

            setMessage(
                "Rating submitted successfully"
            );

            setSelectedRate(0);

            queryClient.invalidateQueries({

                queryKey: [
                    "can-rate-product",
                    productId,
                ],

            });

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

        ratingMutation.mutate();

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