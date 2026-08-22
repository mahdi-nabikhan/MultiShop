"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, Minus, ShoppingCart } from "lucide-react";

import {
    addProductToSessionCart,
} from "@/services/order.services";

import "./SessionProductOrderBox.css";


interface SessionProductOrderBoxProps {
    productId: number | string;
}


export default function SessionProductOrderBox({
    productId,
}: SessionProductOrderBoxProps) {


    const [quantity, setQuantity] =
        useState(0);


    const addToCartMutation = useMutation({

        mutationFn: () =>
            addProductToSessionCart(
                productId,
                quantity
            ),

        onSuccess: (response) => {

            console.log(
                "Product added to session cart:",
                response
            );

        },

        onError: (error) => {

            console.error(
                "Add to session cart error:",
                error
            );

        },

    });


    const increaseQuantity = () => {

        setQuantity(prev => prev + 1);

    };


    const decreaseQuantity = () => {

        setQuantity(prev =>
            prev > 1
                ? prev - 1
                : prev
        );

    };


    return (

        <div className="order-box">


            {/* Quantity */}

            <div className="quantity-box">


                <button

                    type="button"

                    onClick={
                        decreaseQuantity
                    }

                >

                    <Minus size={18} />

                </button>


                <span>

                    {quantity}

                </span>


                <button

                    type="button"

                    onClick={
                        increaseQuantity
                    }

                >

                    <Plus size={18} />

                </button>


            </div>


            {/* Add To Cart */}

            <button

                type="button"

                className="cart-button"

                onClick={() =>
                    addToCartMutation.mutate()
                }

                disabled={
                    addToCartMutation.isPending ||
                    quantity <= 0
                }

            >

                <ShoppingCart size={20} />


                {addToCartMutation.isPending

                    ? "Adding..."

                    : "Add To Cart"

                }

            </button>


        </div>

    );

}