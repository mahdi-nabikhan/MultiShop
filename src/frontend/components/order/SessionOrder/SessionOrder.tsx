"use client";

import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getSessionCart,
    getCustomerDetail,
    deleteSessionCartProduct,
    updateSessionCartQuantity,
} from "@/services/order.services";

import type {
    SessionCartResponse,
    SessionProduct,
} from "@/types/order";

import "./SessionOrder.css";


export default function SessionOrder() {

    const router = useRouter();

    const queryClient = useQueryClient();


    // ==========================================
    // Cart
    // ==========================================

    const {
        data: cart,
        isLoading: loading,
    } = useQuery<SessionCartResponse>({
        queryKey: ["session-cart"],
        queryFn: getSessionCart,
    });


    // ==========================================
    // Quantities
    // ==========================================

    const [quantities, setQuantities] =
        useState<Record<number, number>>({});


    // ==========================================
    // Delete
    // ==========================================

    const [openDelete, setOpenDelete] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<SessionProduct | null>(null);


    const deleteMutation = useMutation({

        mutationFn: (productId: number) =>
            deleteSessionCartProduct(productId),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["session-cart"],
            });

            setOpenDelete(false);

            setSelectedProduct(null);

        },

        onError: (error) => {

            console.error(
                "DELETE SESSION CART PRODUCT ERROR:",
                error
            );

        },

    });


    // ==========================================
    // Update Quantity
    // ==========================================

    const updateMutation = useMutation({

        mutationFn: ({
            productId,
            quantity,
        }: {
            productId: number;
            quantity: number;
        }) =>
            updateSessionCartQuantity(
                productId,
                quantity
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["session-cart"],
            });

        },

        onError: (error) => {

            console.error(
                "UPDATE SESSION CART QUANTITY ERROR:",
                error
            );

        },

    });


    // ==========================================
    // Checkout
    // ==========================================

    const [checkoutLoading, setCheckoutLoading] =
        useState(false);


    const checkout = async () => {

        try {

            setCheckoutLoading(true);

            const data =
                await getCustomerDetail();


            if (data) {

                router.push("/checkout");

            }

        } catch (error) {

            router.push("/login");

        } finally {

            setCheckoutLoading(false);

        }

    };


    // ==========================================
    // Delete Product
    // ==========================================

    const removeProduct = () => {

        if (!selectedProduct) {
            return;
        }

        deleteMutation.mutate(
            selectedProduct.id
        );

    };


    // ==========================================
    // Increase Quantity
    // ==========================================

    const increaseQuantity = (
        productId: number,
        currentQuantity: number
    ) => {

        setQuantities(prev => ({

            ...prev,

            [productId]:
                (prev[productId] ?? currentQuantity) + 1,

        }));

    };


    // ==========================================
    // Decrease Quantity
    // ==========================================

    const decreaseQuantity = (
        productId: number,
        currentQuantity: number
    ) => {

        setQuantities(prev => {

            const quantity =
                prev[productId] ?? currentQuantity;

            return {

                ...prev,

                [productId]:
                    quantity > 1
                        ? quantity - 1
                        : 1,

            };

        });

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <section className="session-cart-loading">

                <h2>
                    Loading Cart...
                </h2>

            </section>

        );

    }


    // ==========================================
    // Empty Cart
    // ==========================================

    if (!cart || cart.items.length === 0) {

        return (

            <section className="empty-cart">

                <h1>
                    Your Shopping Cart Is Empty
                </h1>

                <p>
                    Start shopping and add products
                    to your cart.
                </p>


                <button

                    className="continue-shopping-btn"

                    onClick={() =>
                        router.push("/")
                    }

                >

                    Continue Shopping

                </button>

            </section>

        );

    }


    // ==========================================
    // Calculate Totals
    // ==========================================

    const subtotal = cart.items.reduce(

        (sum, item) => {

            const quantity =
                quantities[item.product.id]
                ?? item.quantity;

            return (

                sum +

                item.product.price_after *
                quantity

            );

        },

        0

    );


    const shipping = 0;

    const grandTotal =
        subtotal + shipping;


    // ==========================================
    // UI
    // ==========================================

    return (

        <>

            <section className="session-cart">

                <div className="cart-container">


                    {/* Header */}

                    <div className="cart-header">

                        <h1>
                            Shopping Cart
                        </h1>

                        <span>
                            {cart.items.length} Items
                        </span>

                    </div>


                    <div className="cart-content">


                        {/* Products List */}

                        <div className="cart-items">


                            {cart.items.map(item => {

                                const quantity =
                                    quantities[
                                        item.product.id
                                    ]
                                    ?? item.quantity;


                                return (

                                    <div
                                        className="cart-item"
                                        key={item.product.id}
                                    >


                                        {/* Product Image */}

                                        <div className="cart-product-image">

                                            <img

                                                src={
                                                    item.product.product_image
                                                    ??
                                                    "/product.jpg"
                                                }

                                                alt={
                                                    item.product.name
                                                }

                                            />

                                        </div>


                                        {/* Product Info */}

                                        <div className="cart-product-info">

                                            <h3>
                                                {
                                                    item.product.name
                                                }
                                            </h3>


                                            <p>
                                                {
                                                    item.product.description
                                                }
                                            </p>


                                            <span className="product-price">

                                                $
                                                {
                                                    item.product.price_after
                                                }

                                            </span>


                                            <span className="stock">

                                                Stock:{" "}

                                                {
                                                    item.product
                                                        .quantity_in_stock
                                                }

                                            </span>

                                        </div>


                                        {/* Quantity */}

                                        <div className="quantity-control">


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.product.id,
                                                        item.quantity
                                                    )
                                                }

                                            >

                                                -

                                            </button>


                                            <input

                                                type="number"

                                                min={1}

                                                value={quantity}

                                                onChange={e => {

                                                    setQuantities(
                                                        prev => ({

                                                            ...prev,

                                                            [item.product.id]:
                                                                Number(
                                                                    e.target.value
                                                                ),

                                                        })
                                                    );

                                                }}

                                            />


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.product.id,
                                                        item.quantity
                                                    )
                                                }

                                            >

                                                +

                                            </button>


                                            <button

                                                type="button"

                                                className="update-btn"

                                                disabled={
                                                    updateMutation.isPending
                                                }

                                                onClick={() => {

                                                    updateMutation.mutate({

                                                        productId:
                                                            item.product.id,

                                                        quantity,

                                                    });

                                                }}

                                            >

                                                {
                                                    updateMutation.isPending
                                                        ? "Updating..."
                                                        : "Update"
                                                }

                                            </button>


                                        </div>


                                        {/* Actions */}

                                        <div className="cart-item-actions">


                                            <strong>

                                                $

                                                {

                                                    (
                                                        item.product.price_after
                                                        *
                                                        quantity
                                                    ).toFixed(2)

                                                }

                                            </strong>


                                            <button

                                                type="button"

                                                className="delete-btn"

                                                onClick={() => {

                                                    setSelectedProduct(
                                                        item.product
                                                    );

                                                    setOpenDelete(
                                                        true
                                                    );

                                                }}

                                            >

                                                Remove

                                            </button>


                                        </div>


                                    </div>

                                );

                            })}


                        </div>


                        {/* Order Summary */}

                        <aside className="cart-summary">


                            <h2>
                                Order Summary
                            </h2>


                            <div className="summary-row">

                                <span>
                                    Total Items
                                </span>

                                <strong>
                                    {cart.total_quantity}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ${subtotal.toFixed(2)}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Shipping
                                </span>

                                <strong>
                                    Free
                                </strong>

                            </div>


                            <hr />


                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ${grandTotal.toFixed(2)}
                                </strong>

                            </div>


                            <button

                                type="button"

                                className="checkout-btn"

                                onClick={checkout}

                                disabled={checkoutLoading}

                            >

                                {
                                    checkoutLoading
                                        ? "Loading..."
                                        : "Proceed To Checkout"
                                }

                            </button>


                            <button

                                type="button"

                                className="continue-shopping-btn"

                                onClick={() =>
                                    router.push("/")
                                }

                            >

                                Continue Shopping

                            </button>


                        </aside>


                    </div>

                </div>

            </section>


            {/* Delete Modal */}

            <DeleteOrderItemModal

                open={openDelete}

                loading={
                    deleteMutation.isPending
                }

                productName={
                    selectedProduct?.name ?? ""
                }

                onClose={() => {

                    setOpenDelete(false);

                    setSelectedProduct(null);

                }}

                onConfirm={removeProduct}

            />

        </>

    );

}