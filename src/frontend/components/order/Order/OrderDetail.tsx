"use client";

import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";

import { useState, useEffect } from "react";

import { getOrderItems, getOrderAddresses, createBill, deleteOrderItem, updateOrderItem } from "@/services/order.services";

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

    const [items, setItems] =
        useState<OrderItem[]>([]);


    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // Delete
    // ==========================================

    const [selectedItem, setSelectedItem] =
        useState<OrderItem | null>(null);


    const [openDelete, setOpenDelete] =
        useState(false);


    const [deleteLoading, setDeleteLoading] =
        useState(false);


    // ==========================================
    // Quantity
    // ==========================================

    const [quantities, setQuantities] =
        useState<Record<number, number>>({});


    // ==========================================
    // Addresses
    // ==========================================

    const [addresses, setAddresses] =
        useState<OrderAddress[]>([]);


    const [selectedAddress, setSelectedAddress] =
        useState<number | null>(null);


    // ==========================================
    // Checkout
    // ==========================================

    const [checkoutLoading, setCheckoutLoading] =
        useState(false);


    // ==========================================
    // Get Order Items
    // ==========================================

    const getOrderItem = async () => {

        try {

            setLoading(true);

            const data = await getOrderItems();

            setItems(data);


            const qty: Record<number, number> = {};


            data.forEach(item => {

                qty[item.id] = item.quantity;

            });


            setQuantities(qty);

        }

        catch (err) {

            console.error(
                "Failed to load order items:",
                err
            );

            setItems([]);

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Get Addresses
    // ==========================================

    const getAddresses = async () => {

        try {

            const data =
                await getOrderAddresses();


            setAddresses(data);


            if (data.length > 0) {

                setSelectedAddress(
                    data[0].id
                );

            }

        }

        catch (err) {

            console.error(
                "Failed to load addresses:",
                err
            );

        }

    };


    // ==========================================
    // Load Data
    // ==========================================

    useEffect(() => {

        getOrderItem();

        getAddresses();

    }, []);


    // ==========================================
    // Checkout
    // ==========================================

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

    const handleDelete = async () => {

        if (!selectedItem) {

            return;

        }


        try {

            setDeleteLoading(true);


            await deleteOrderItem(
                selectedItem.id
            );


            setItems(prev =>
                prev.filter(
                    item =>
                        item.id !==
                        selectedItem.id
                )
            );


            setOpenDelete(false);

            setSelectedItem(null);

        }

        catch (err) {

            console.error(
                "Delete order item error:",
                err
            );

        }

        finally {

            setDeleteLoading(false);

        }

    };


    // ==========================================
    // Update Quantity
    // ==========================================

    const updateQuantity = async (
        item: OrderItem
    ) => {

        try {

            const quantity =
                quantities[item.id];


            await updateOrderItem(
                item.id,
                quantity
            );


            setItems(prev =>

                prev.map(orderItem =>

                    orderItem.id === item.id

                        ? {

                            ...orderItem,

                            quantity,

                            total: String(

                                quantity *
                                orderItem.product.price_after

                            ),

                        }

                        : orderItem

                )

            );

        }

        catch (err) {

            console.error(
                "Update quantity error:",
                err
            );

        }

    };


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

                    disabled={!selectedAddress}

                    onClick={checkout}

                >

                    Proceed To Checkout →

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
                                                    quantities[item.id]
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

                                                onClick={() =>
                                                    updateQuantity(item)
                                                }

                                            >

                                                Update

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

                                            Postal Code :
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

                loading={deleteLoading}

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