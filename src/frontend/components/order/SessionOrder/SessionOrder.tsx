"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    getSessionCart,
    getCustomerDetail,
    deleteSessionCartProduct,
    updateSessionCartQuantity,SessionCartResponse,SessionProduct
} from "@/services/order.services";

import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";

import "./SessionOrder.css";


export default function SessionOrder() {

    const router = useRouter();


    const [cart, setCart] = useState<SessionCartResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<SessionProduct | null>(null);

    const [quantities, setQuantities] =
        useState<Record<number, number>>({});


    // ==========================================
    // Get Cart
    // ==========================================

    const getCart = async () => {

        try {

            setLoading(true);

            const data = await getSessionCart();

            setCart(data);


            const quantityMap: Record<number, number> = {};


            data.items.forEach(item => {

                quantityMap[item.product.id] =
                    item.quantity;

            });


            setQuantities(quantityMap);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        getCart();

    }, []);


    // ==========================================
    // Checkout
    // ==========================================

    const checkout = async () => {

        try {

            setCheckoutLoading(true);

            const data = await getCustomerDetail();


            if (data) {

                router.push("/checkout");

            }

        }

        catch (err) {

            router.push("/login");

        }

        finally {

            setCheckoutLoading(false);

        }

    };


    // ==========================================
    // Remove Product
    // ==========================================

    const removeProduct = async () => {

        if (!selectedProduct) {

            return;

        }


        try {

            setDeleteLoading(true);


            await deleteSessionCartProduct(
                selectedProduct.id
            );


            setCart(prev => {

                if (!prev) {

                    return prev;

                }


                return {

                    ...prev,

                    items: prev.items.filter(

                        item =>
                            item.product.id !==
                            selectedProduct.id

                    )

                };

            });


            setOpenDelete(false);

            setSelectedProduct(null);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setDeleteLoading(false);

        }

    };


    // ==========================================
    // Update Quantity
    // ==========================================

    const updateQuantity = async (
        productId: number
    ) => {

        try {

            await updateSessionCartQuantity(

                productId,

                quantities[productId]

            );


            await getCart();

        }

        catch (err) {

            console.log(err);

        }

    };


    // ==========================================
    // Increase Quantity
    // ==========================================

    const increaseQuantity = (
        productId: number
    ) => {

        setQuantities(prev => ({

            ...prev,

            [productId]:
                (prev[productId] ?? 1) + 1

        }));

    };


    // ==========================================
    // Decrease Quantity
    // ==========================================

    const decreaseQuantity = (
        productId: number
    ) => {

        setQuantities(prev => ({

            ...prev,

            [productId]:

                prev[productId] > 1

                    ? prev[productId] - 1

                    : 1

        }));

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

        (sum, item) =>

            sum +

            item.product.price_after *

            (
                quantities[item.product.id]
                ??
                item.quantity
            ),

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


                            {cart.items.map(
                                (item) => (

                                    <div

                                        className="cart-item"

                                        key={
                                            item.product.id
                                        }

                                    >


                                        {/* Product Image */}

                                        <div className="cart-product-image">

                                            <img

                                                src={
                                                    item.product
                                                        .product_image
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
                                                    item.product
                                                        .name
                                                }

                                            </h3>


                                            <p>

                                                {
                                                    item.product
                                                        .description
                                                }

                                            </p>


                                            <span className="product-price">

                                                $

                                                {
                                                    item.product
                                                        .price_after
                                                }

                                            </span>


                                            <span className="stock">

                                                Stock :

                                                {" "}

                                                {
                                                    item.product
                                                        .quantity_in_stock
                                                }

                                            </span>

                                        </div>



                                        {/* Quantity */}

                                        <div className="quantity-control">


                                            <button

                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.product.id
                                                    )
                                                }

                                            >

                                                -

                                            </button>



                                            <input

                                                type="number"

                                                value={
                                                    quantities[
                                                        item.product.id
                                                    ]
                                                }

                                                onChange={(
                                                    e
                                                ) =>

                                                    setQuantities(
                                                        prev => ({

                                                            ...prev,

                                                            [item.product.id]:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )

                                                        })
                                                    )

                                                }

                                                min={1}

                                            />



                                            <button

                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.product.id
                                                    )
                                                }

                                            >

                                                +

                                            </button>



                                            <button

                                                className="update-btn"

                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product.id
                                                    )
                                                }

                                            >

                                                Update

                                            </button>


                                        </div>



                                        {/* Actions */}

                                        <div className="cart-item-actions">


                                            <strong>

                                                $

                                                {
                                                    (
                                                        item.product
                                                            .price_after
                                                        *
                                                        (
                                                            quantities[
                                                                item.product
                                                                    .id
                                                            ]
                                                            ??
                                                            item.quantity
                                                        )
                                                    ).toFixed(2)
                                                }

                                            </strong>



                                            <button

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

                                )
                            )}

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

                                    {
                                        cart.total_quantity
                                    }

                                </strong>

                            </div>



                            <div className="summary-row">

                                <span>

                                    Subtotal

                                </span>


                                <strong>

                                    $
                                    {
                                        subtotal.toFixed(2)
                                    }

                                </strong>

                            </div>



                            <div className="summary-row">

                                <span>

                                    Shipping

                                </span>


                                <strong>

                                    {
                                        shipping === 0
                                            ? "Free"
                                            : `$${shipping}`
                                    }

                                </strong>

                            </div>



                            <hr />



                            <div className="summary-total">

                                <span>

                                    Total

                                </span>


                                <strong>

                                    $
                                    {
                                        grandTotal.toFixed(2)
                                    }

                                </strong>

                            </div>



                            <button

                                className="checkout-btn"

                                onClick={checkout}

                                disabled={
                                    checkoutLoading
                                }

                            >

                                {
                                    checkoutLoading

                                        ? "Loading..."

                                        : "Proceed To Checkout"
                                }

                            </button>



                            <button

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

                loading={deleteLoading}

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