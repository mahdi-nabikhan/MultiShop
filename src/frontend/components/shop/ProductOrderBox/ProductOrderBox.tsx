"use client";

import { useState } from "react";

import {
    Plus,
    Minus,
    ShoppingCart,
} from "lucide-react";

import {
    addOrderItem,
} from "@/services/order.services";

import "./ProductOrderBox.css";


interface ProductOrderBoxProps {

    productId: number | string;

}


function ProductOrderBox({
    productId,
}: ProductOrderBoxProps) {


    const [quantity, setQuantity] =
        useState(0);


    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // Add Product To Cart
    // ==========================================

    const addToCart = async () => {

        if (quantity <= 0) {
            return;
        }


        try {

            setLoading(true);


            await addOrderItem(
                productId,
                quantity
            );


            console.log(
                "Product added to cart successfully."
            );

        }

        catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="order-box">


            {/* Quantity */}

            <div className="quantity-box">


                <button

                    type="button"

                    onClick={() =>
                        quantity > 1 &&
                        setQuantity(
                            quantity - 1
                        )
                    }

                >

                    <Minus size={18} />

                </button>


                <span>

                    {quantity}

                </span>


                <button

                    type="button"

                    onClick={() =>
                        setQuantity(
                            quantity + 1
                        )
                    }

                >

                    <Plus size={18} />

                </button>


            </div>


            {/* Add To Cart */}

            <button

                type="button"

                className="cart-button"

                onClick={addToCart}

                disabled={
                    loading ||
                    quantity <= 0
                }

            >

                <ShoppingCart size={20} />


                {loading
                    ? "Adding..."
                    : "Add To Cart"
                }


            </button>


        </div>

    );

}


export default ProductOrderBox;