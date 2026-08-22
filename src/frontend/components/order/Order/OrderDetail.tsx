"use client";

import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";

import { useEffect, useState } from "react";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getOrderItems,
    getOrderAddresses,
    createBill,
    deleteOrderItem,
    updateOrderItem,
} from "@/services/order.services";

import BACKEND_URLS from "@/utils";

import "./OrderDetail.css";


interface OrderProduct {

    id: number;

    name: string;

    description: string;

    quantity_in_stock: number;

    price: number;

    price_after: number;

    product_image: string | null;

    category: number;

    store: number;

}


interface OrderItem {

    id: number;

    quantity: number;

    status: string;

    created: string;

    total: string;

    order: number;

    product: OrderProduct;

}


interface OrderAddress {

    id: number;

    state: string;

    city: string;

    postal_code: string;

    customer: {

        username: string;

    };

}


export default function OrderDetail() {


    // ==========================================
    // Order Items
    // ==========================================

    const {

        data: items = [],

        isLoading: loading,

    } = useQuery({

        queryKey: ["order-items"],

        queryFn: getOrderItems,

    });


    // ==========================================
    // Delete
    // ==========================================

    const [selectedItem, setSelectedItem] =
        useState<OrderItem | null>(null);


    const [openDelete, setOpenDelete] =
        useState(false);


    const queryClient = useQueryClient();


    const deleteMutation = useMutation({

        mutationFn: deleteOrderItem,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["order-items"],

            });

            setOpenDelete(false);

            setSelectedItem(null);

        },

        onError: (error) => {

            console.error(

                "Delete order item error:",

                error

            );

        },

    });


    // ==========================================
    // Quantity
    // ==========================================

    const [quantities, setQuantities] =
        useState<Record<number, number>>({});


    useEffect(() => {

        const qty: Record<number, number> = {};


        items.forEach(item => {

            qty[item.id] = item.quantity;

        });


        setQuantities(qty);

    }, [items]);


    // ==========================================
    // Addresses
    // ==========================================

    const [selectedAddress, setSelectedAddress] =
        useState<number | null>(null);


    const {

        data: addresses = [],

        isLoading: addressesLoading,

    } = useQuery({

        queryKey: ["order-addresses"],

        queryFn: getOrderAddresses,

    });


    useEffect(() => {

        if (
            addresses.length > 0 &&
            selectedAddress === null
        ) {

            setSelectedAddress(
                addresses[0].id
            );

        }

    }, [addresses, selectedAddress]);


    // ==========================================
    // Checkout
    // ==========================================

    const [checkoutLoading, setCheckoutLoading] =
        useState(false);


    const checkout = async () => {

        if (!selectedAddress) {

            alert(
                "Please select an address."
            );

            return;

        }


        try {

            setCheckoutLoading(true);


            const data =
                await createBill(
                    selectedAddress
                );


            console.log(data);


            alert(
                "Bill created successfully."
            );

        }
        catch (err) {

            console.error(
                "Checkout error:",
                err
            );


            alert(
                "Failed to create bill."
            );

        }
        finally {

            setCheckoutLoading(false);

        }

    };


    // ==========================================
    // Delete Order Item
    // ==========================================

    const handleDelete = () => {

        if (!selectedItem) return;

        deleteMutation.mutate(
            selectedItem.id
        );

    };


    // ==========================================
    // Update Quantity
    // ==========================================

    const updateMutation = useMutation({

        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: number;
            quantity: number;
        }) =>
            updateOrderItem(
                itemId,
                quantity
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["order-items"],

            });

        },

        onError: (error) => {

            console.error(

                "Update quantity error:",

                error

            );

        },

    });


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <h2>

                Loading...

            </h2>

        );

    }


    // ==========================================
    // Empty Cart
    // ==========================================

    if (items.length === 0) {

        return (

            <h2>

                No Items Found

            </h2>

        );

    }


    // ==========================================
    // Total
    // ==========================================

    const total = items.reduce(

        (sum, item) =>
            sum + Number(item.total),

        0

    );


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="order-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="order-banner">

                <div>

                    <h1>

                        🛒 My Shopping Cart

                    </h1>

                    <p>

                        Review your products
                        before checkout.

                    </p>

                </div>


                <button

                    className="checkout-top-btn"

                    disabled={
                        !selectedAddress ||
                        checkoutLoading
                    }

                    onClick={checkout}

                >

                    {
                        checkoutLoading
                            ? "Creating..."
                            : "Proceed To Checkout →"
                    }

                </button>

            </div>


            {/* ==================================
                STATISTICS
            ================================== */}

            <div className="order-stats">


                <div className="stat-card">

                    <h4>

                        Products

                    </h4>

                    <strong>

                        {items.length}

                    </strong>

                </div>


                <div className="stat-card">

                    <h4>

                        Created

                    </h4>

                    <strong>

                        {
                            new Date(
                                items[0].created
                            ).toLocaleDateString()
                        }

                    </strong>

                </div>


                <div className="stat-card">

                    <h4>

                        Total

                    </h4>

                    <strong>

                        $

                        {total.toFixed(2)}

                    </strong>

                </div>


            </div>


            {/* ==================================
                ORDER LAYOUT
            ================================== */}

            <div className="order-layout">


                {/* ==================================
                    LEFT
                ================================== */}

                <div className="left-section">


                    {/* ==================================
                        PRODUCTS
                    ================================== */}

                    <div className="cart-list">


                        {items.map(item => (

                            <div

                                className="cart-card"

                                key={item.id}

                            >


                                {/* Product Image */}

                                <div className="product-image">

                                    <img

                                        src={

                                            item.product.product_image

                                                ?

                                                `${BACKEND_URLS.replace(
                                                    /\/$/,
                                                    ""
                                                )}${item.product.product_image}`

                                                :

                                                "/no-image.png"

                                        }

                                        alt={
                                            item.product.name
                                        }

                                    />

                                </div>


                                {/* Product Info */}

                                <div className="product-info">


                                    <h2>

                                        {
                                            item.product.name
                                        }

                                    </h2>


                                    <p>

                                        {
                                            item.product.description
                                        }

                                    </p>


                                    {/* Product Grid */}

                                    <div className="product-grid">


                                        {/* Quantity */}

                                        <div>

                                            <span>

                                                Quantity

                                            </span>


                                            <input

                                                type="number"

                                                min={1}

                                                value={

                                                    quantities[
                                                        item.id
                                                    ]

                                                    ??

                                                    item.quantity

                                                }

                                                onChange={e => {

                                                    setQuantities(

                                                        prev => ({

                                                            ...prev,

                                                            [item.id]:
                                                                Number(
                                                                    e.target.value
                                                                ),

                                                        })

                                                    );

                                                }}

                                            />

                                        </div>


                                        {/* Price */}

                                        <div>

                                            <span>

                                                Price

                                            </span>


                                            <strong>

                                                $

                                                {
                                                    item.product.price
                                                }

                                            </strong>

                                        </div>


                                        {/* Discount */}

                                        <div>

                                            <span>

                                                Discount

                                            </span>


                                            <strong>

                                                $

                                                {
                                                    item.product.price_after
                                                }

                                            </strong>

                                        </div>


                                        {/* Total */}

                                        <div>

                                            <span>

                                                Total

                                            </span>


                                            <strong>

                                                $

                                                {(

                                                    (

                                                        quantities[
                                                            item.id
                                                        ]

                                                        ??

                                                        item.quantity

                                                    )

                                                    *

                                                    item.product.price_after

                                                ).toFixed(2)}

                                            </strong>

                                        </div>


                                    </div>


                                    {/* Actions */}

                                    <div className="product-actions">


                                        <span

                                            className={

                                                item.status === "P"

                                                    ?

                                                    "pending"

                                                    :

                                                    "paid"

                                            }

                                        >

                                            {

                                                item.status === "P"

                                                    ?

                                                    "Pending"

                                                    :

                                                    item.status

                                            }

                                        </span>


                                        <div>


                                            <button

                                                className="view-btn"

                                            >

                                                View Product

                                            </button>


                                            <button

                                                className="update-btn"

                                                disabled={
                                                    updateMutation.isPending
                                                }

                                                onClick={() => {

                                                    updateMutation.mutate({

                                                        itemId:
                                                            item.id,

                                                        quantity:
                                                            quantities[
                                                                item.id
                                                            ] ??
                                                            item.quantity,

                                                    });

                                                }}

                                            >

                                                {
                                                    updateMutation.isPending
                                                        ? "Updating..."
                                                        : "Update"
                                                }

                                            </button>


                                            <button

                                                className="remove-btn"

                                                onClick={() => {

                                                    setSelectedItem(
                                                        item
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


                                </div>


                            </div>

                        ))}


                    </div>


                    {/* ==================================
                        ADDRESS
                    ================================== */}

                    <div className="address-section">


                        <h2>

                            📍 Select Shipping Address

                        </h2>


                        <p>

                            Choose where your order
                            should be delivered.

                        </p>


                        <div className="address-list">


                            {addresses.map(address => (

                                <label

                                    key={address.id}

                                    className={

                                        `address-card ${
                                            selectedAddress ===
                                            address.id

                                                ?

                                                "active-address"

                                                :

                                                ""

                                        }`

                                    }

                                >


                                    <input

                                        type="radio"

                                        checked={

                                            selectedAddress ===
                                            address.id

                                        }

                                        onChange={() =>
                                            setSelectedAddress(
                                                address.id
                                            )
                                        }

                                    />


                                    <div>

                                        <h4>

                                            {
                                                address.state
                                            }

                                            {" / "}

                                            {
                                                address.city
                                            }

                                        </h4>


                                        <span>

                                            Postal Code:

                                            {" "}

                                            {
                                                address.postal_code
                                            }

                                        </span>

                                    </div>


                                </label>

                            ))}


                        </div>


                    </div>


                </div>


                {/* ==================================
                    RIGHT
                ================================== */}

                <div className="summary-card">


                    <h2>

                        Order Summary

                    </h2>


                    <div className="summary-row">

                        <span>

                            Products

                        </span>

                        <strong>

                            {items.length}

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


                    <div className="summary-row">

                        <span>

                            Discount

                        </span>

                        <strong>

                            $0.00

                        </strong>

                    </div>


                    <hr />


                    <div className="summary-total">

                        <span>

                            Total

                        </span>


                        <h2>

                            $

                            {total.toFixed(2)}

                        </h2>

                    </div>


                    <button

                        className="checkout-btn"

                        onClick={checkout}

                        disabled={

                            !selectedAddress ||
                            checkoutLoading

                        }

                    >

                        {

                            checkoutLoading

                                ?

                                "Creating..."

                                :

                                "Checkout"

                        }

                    </button>


                </div>


            </div>


            {/* ==================================
                DELETE MODAL
            ================================== */}

            <DeleteOrderItemModal

                open={openDelete}

                loading={
                    deleteMutation.isPending
                }

                productName={
                    selectedItem?.product.name ?? ""
                }

                onClose={() => {

                    setOpenDelete(false);

                    setSelectedItem(null);

                }}

                onConfirm={handleDelete}

            />


        </section>

    );

}