"use client";

import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";

import {
    useEffect,
    useState,
} from "react";

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

import OrderHeader from "./OrderHeader";
import OrderItemCard from "./OrderItemCard";
import OrderAddressSelector from "./OrderAddressSelector";
import OrderSummary from "./OrderSummary";

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
    } = useQuery<OrderItem[]>({
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

    const queryClient =
        useQueryClient();


    const deleteMutation =
        useMutation({
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

        items.forEach((item) => {
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
    } = useQuery<OrderAddress[]>({
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
    }, [
        addresses,
        selectedAddress,
    ]);


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

        if (!selectedItem) {
            return;
        }

        deleteMutation.mutate(
            selectedItem.id
        );
    };


    // ==========================================
    // Update Quantity
    // ==========================================

    const updateMutation =
        useMutation({
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

            <OrderHeader
                selectedAddress={selectedAddress}
                checkoutLoading={checkoutLoading}
                onCheckout={checkout}
            />


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
                        {new Date(
                            items[0].created
                        ).toLocaleDateString()}
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

                        {items.map((item) => {

                            const quantity =
                                quantities[item.id]
                                ?? item.quantity;

                            return (
                                <OrderItemCard
                                    key={item.id}
                                    item={item}
                                    quantity={quantity}
                                    updating={
                                        updateMutation.isPending
                                    }
                                    onQuantityChange={(
                                        newQuantity
                                    ) => {
                                        setQuantities(
                                            (prev) => ({
                                                ...prev,
                                                [item.id]:
                                                    newQuantity,
                                            })
                                        );
                                    }}
                                    onUpdate={() => {
                                        updateMutation.mutate({
                                            itemId:
                                                item.id,
                                            quantity,
                                        });
                                    }}
                                    onRemove={() => {
                                        setSelectedItem(
                                            item
                                        );

                                        setOpenDelete(
                                            true
                                        );
                                    }}
                                />
                            );
                        })}

                    </div>


                    {/* ==================================
                        ADDRESS
                    ================================== */}

                    <OrderAddressSelector
                        addresses={addresses}
                        selectedAddress={
                            selectedAddress
                        }
                        onSelect={
                            setSelectedAddress
                        }
                    />

                </div>


                {/* ==================================
                    RIGHT
                ================================== */}

                <OrderSummary
                    itemCount={items.length}
                    total={total}
                    selectedAddress={
                        selectedAddress
                    }
                    checkoutLoading={
                        checkoutLoading
                    }
                    onCheckout={checkout}
                />

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
                    selectedItem
                        ?.product.name ?? ""
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