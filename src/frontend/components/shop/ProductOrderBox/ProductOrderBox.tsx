
"use client";

import { useState } from "react";

import {
    Plus,
    Minus,
    ShoppingCart,
} from "lucide-react";

import useAddOrderItem from "@/hooks/shop/useAddOrderItem";

import "./ProductOrderBox.css";


interface ProductOrderBoxProps {
    productId: number | string;
}


export default function ProductOrderBox({
    productId,
}: ProductOrderBoxProps) {

    const [quantity, setQuantity] = useState(0);

    const addToCartMutation = useAddOrderItem();


    const handleAddToCart = () => {

        if (quantity <= 0) {
            return;
        }

        addToCartMutation.mutate({
            productId,
            quantity,
        });

    };


    return (

        <div className="order-box">

            <div className="quantity-box">

                <button
                    type="button"
                    onClick={() => {
                        setQuantity(prev =>
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
                        setQuantity(prev => prev + 1);
                    }}
                    disabled={
                        addToCartMutation.isPending
                    }
                >
                    <Plus size={18} />
                </button>

            </div>


            <button
                type="button"
                className="cart-button"
                onClick={handleAddToCart}
                disabled={
                    addToCartMutation.isPending ||
                    quantity <= 0
                }
            >

                <ShoppingCart size={20} />

                {
                    addToCartMutation.isPending
                        ? "Adding..."
                        : "Add To Cart"
                }

            </button>

        </div>

    );
}
