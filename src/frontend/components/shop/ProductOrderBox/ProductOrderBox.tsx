"use client";

import { useState } from "react";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

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


    const queryClient = useQueryClient();


    const [quantity, setQuantity] =
        useState(0);


    const addToCartMutation = useMutation({

        mutationFn: () =>
            addOrderItem(
                productId,
                quantity
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["order-items"],
            });

            queryClient.invalidateQueries({
                queryKey: ["session-cart"],
            });

            setQuantity(0);

        },

        onError: (error) => {

            console.error(
                "Add to cart error:",
                error
            );

        },

    });


    return (

        <div className="order-box">


            {/* ==========================================
                Quantity
            ========================================== */}

            <div className="quantity-box">


                <button

                    type="button"

                    onClick={() => {

                        setQuantity(
                            prev =>
                                prev > 1
                                    ? prev - 1
                                    : 0
                        );

                    }}

                    disabled={
                        addToCartMutation.isPending
                    }

                >

                    <Minus size={18} />

                </button>


                <span>

                    {quantity}

                </span>


                <button

                    type="button"

                    onClick={() => {

                        setQuantity(
                            prev => prev + 1
                        );

                    }}

                    disabled={
                        addToCartMutation.isPending
                    }

                >

                    <Plus size={18} />

                </button>


            </div>


            {/* ==========================================
                Add To Cart
            ========================================== */}

            <button

                type="button"

                className="cart-button"

                onClick={() => {

                    if (quantity <= 0) {
                        return;
                    }

                    addToCartMutation.mutate();

                }}

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


export default ProductOrderBox;