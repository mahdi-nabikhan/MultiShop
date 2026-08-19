"use client";

import { useEffect, useState } from "react";

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


    const [canRate, setCanRate] =
        useState(false);


    const [loading, setLoading] =
        useState(true);


    const [selectedRate, setSelectedRate] =
        useState(0);


    const [hoverRate, setHoverRate] =
        useState(0);


    const [sending, setSending] =
        useState(false);


    const [message, setMessage] =
        useState("");


    // ==========================================
    // Check Can Rate
    // ==========================================

    useEffect(() => {

        if (!isAuthenticated) {

            setLoading(false);

            return;

        }


        async function checkRate() {

            try {

                const canRate =
                    await canRateProduct(productId);

                setCanRate(canRate);

            }

            catch (error) {

                console.error(
                    "Check product rating error:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        }


        checkRate();

    }, [
        productId,
        isAuthenticated,
    ]);


    // ==========================================
    // Add Rating
    // ==========================================

    async function addRate() {

        if (selectedRate === 0) {
            return;
        }


        try {

            setSending(true);

            setMessage("");


            await addProductRating(
                productId,
                selectedRate
            );


            setCanRate(false);

            setMessage(
                "Rating submitted successfully"
            );

        }

        catch (error) {

            console.error(
                "Product rating error:",
                error
            );

            setMessage(
                "Error submitting rating"
            );

        }

        finally {

            setSending(false);

        }

    }


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

                        disabled={sending}

                    >

                        {sending
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