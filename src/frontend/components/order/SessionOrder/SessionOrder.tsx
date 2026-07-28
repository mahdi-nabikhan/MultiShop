"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import BACKEND_URLS from "@/utils";

import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";

import "./SessionOrder.css";

interface Product {

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

interface CartItem {

    product: Product;

    quantity: number;

    total_price: number;

}

interface CartResponse {

    items: CartItem[];

    total_quantity: number;

    total_price: number;

}

export default function SessionOrder() {

    const router = useRouter();
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const getCart = async () => {

        try {

            setLoading(true);

            const { data } = await axios.get<CartResponse>(

                `${BACKEND_URLS}order/api/v1/sessions/cart/`,

                {

                    withCredentials: true

                }

            );

            setCart(data);

            const quantityMap: Record<number, number> = {};

            data.items.forEach(item => {

                quantityMap[item.product.id] = item.quantity;

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
    useEffect(() => {

        getCart();

    }, []);
    if (loading) {

        return (

            <section className="session-cart-loading">

                <h2>

                    Loading Cart...

                </h2>

            </section>

        );

    }
    if (!cart || cart.items.length === 0) {

        return (
            <section className="empty-cart">
                <h1>
                    Your Shopping Cart Is Empty
                </h1>
                <p>
                    Start shopping and add products to your cart.
                </p>
                <button
                    className="continue-shopping-btn"
                    onClick={() => router.push("/")}>
                    Continue Shopping
                </button>
            </section>

        );

    }

    const total = Number(cart.total_price);
    const checkout = async () => {

        try {

            setCheckoutLoading(true);

            const { data } = await axios.get(

                `${BACKEND_URLS}customer/api/v1/customer/detail/`,

                {

                    withCredentials: true,

                }

            );

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
    const removeProduct = async () => {

        if (!selectedProduct) {

            return;

        }

        try {

            setDeleteLoading(true);

            await axios.delete(

                `${BACKEND_URLS}order/api/v1/session/cart/delete/${selectedProduct.id}/`,

                {

                    withCredentials: true,

                }

            );

            setCart(prev => {

                if (!prev) return prev;

                return {

                    ...prev,

                    items: prev.items.filter(

                        item => item.product.id !== selectedProduct.id

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
    const updateQuantity = async (

        productId: number

    ) => {

        try {

            await axios.put(

                `${BACKEND_URLS}order/api/v1/session/cart/update/${productId}/`,

                {

                    quantity: quantities[productId],

                },

                {

                    withCredentials: true,

                }

            );

            getCart();

        }

        catch (err) {

            console.log(err);

        }

    };
    const increaseQuantity = (

        productId: number

    ) => {

        setQuantities(prev => ({

            ...prev,

            [productId]: (prev[productId] ?? 1) + 1

        }));

    };
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
    const subtotal = cart.items.reduce(

        (sum, item) =>

            sum +

            item.product.price_after *

            (quantities[item.product.id] ?? item.quantity),

        0

    );
    const shipping = 0;
    const grandTotal = subtotal + shipping;

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
                            3 Items
                        </span>

                    </div>




                    <div className="cart-content">



                        {/* Products List */}

                        <div className="cart-items">



                            <div className="cart-item">



                                {/* Product Image */}

                                <div className="cart-product-image">

                                    <img
                                        src="/product.jpg"
                                        alt="Product"
                                    />

                                </div>




                                {/* Product Info */}

                                <div className="cart-product-info">

                                    <h3>
                                        Gaming Keyboard
                                    </h3>


                                    <p>
                                        Mechanical keyboard with RGB lighting
                                    </p>


                                    <span className="product-price">
                                        $120
                                    </span>


                                </div>





                                {/* Quantity */}

                                <div className="quantity-control">


                                    <button>
                                        -
                                    </button>


                                    <input
                                        type="number"
                                        value="1"
                                    />


                                    <button>
                                        +
                                    </button>


                                    <button className="update-btn">

                                        Update

                                    </button>


                                </div>






                                {/* Actions */}

                                <div className="cart-item-actions">


                                    <strong>
                                        $120
                                    </strong>



                                    <button className="delete-btn">

                                        Remove

                                    </button>


                                </div>



                            </div>




                        </div>







                        {/* Order Summary */}

                        <aside className="cart-summary">


                            <h2>
                                Order Summary
                            </h2>



                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>


                                <strong>
                                    $120
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
                                    $120
                                </strong>


                            </div>




                            <button className="checkout-btn">

                                Proceed To Checkout

                            </button>




                            <button className="continue-shopping-btn">

                                Continue Shopping

                            </button>



                        </aside>




                    </div>


                </div>


            </section>




        </>
    )
}