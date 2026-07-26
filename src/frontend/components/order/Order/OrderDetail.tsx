"use client"
import DeleteOrderItemModal from "../DeleteOrderItemModal/DeleteOrderItemModal";
import { Calendar, CircleDollarSign, Package } from "lucide-react";
import BACKEND_URLS
    from "@/utils";
import "./OrderDetail.css";
import { useState, useEffect } from "react";
import axios
    from "axios";


interface Product {
    id: number,
    name: string,
    description: string
    quantity_in_stock: number
    price: number
    price_after: number
    product_image: string | null
    category: number,
    store: number
}
interface OrderItem {
    id: number,
    quantity: number
    status: string
    created: string
    total: string
    order: number
    product: Product
}
export default function OrderDetail() {
    const [items, setItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    useEffect(() => {
        const getOrderItem = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get<OrderItem[]>(
                    `${BACKEND_URLS}order/api/v1/order/item/`, {
                    withCredentials: true
                }
                )
                setItems(data)

            } catch (err) {
                alert(err)

            } finally {
                setLoading(false)
            }


        }
        getOrderItem()
    }, [])

    const handleDelete = async () => {
        console.log('delted cliekc')
        if (!selectedItem) {
            try {
                setDeleteLoading(true)
                await axios.delete(
                    `${BACKEND_URLS}order/api/v1/order/item/detail/${selectedItem!.id}/`,
                    { withCredentials: true }
                )
                setItems(perv => perv.filter(item => item.id !== selectedItem!.id))
                setOpenDelete(false)
                setSelectedItem(null)

            } catch (err) {
                console.log(err)

            } finally {
                setDeleteLoading(false)

            }
        }
    }


    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (items.length === 0) {

        return <h2>No Items Found</h2>;

    }

    const total = items.reduce(
        (sum, item) => sum + Number(item.total),
        0
    );

    return (
        <section className="order-page">

            {/* Header */}

            <div className="order-banner">

                <div>

                    <h1>🛒 My Shopping Cart</h1>

                    <p>
                        Manage all products before checkout
                    </p>

                </div>

                <div className="status-badge">

                    {items[0].status === "P"
                        ? "Pending"
                        : items[0].status}

                </div>

            </div>

            {/* Statistics */}

            <div className="order-stats">

                <div className="stat-card">

                    <h4>Products</h4>

                    <strong>{items.length}</strong>

                </div>

                <div className="stat-card">

                    <h4>Created</h4>

                    <strong>
                        {new Date(items[0].created).toLocaleDateString()}
                    </strong>

                </div>

                <div className="stat-card">

                    <h4>Total</h4>

                    <strong>${total.toFixed(2)}</strong>

                </div>

            </div>

            {/* Items */}

            <div className="cart-list">

                {items.map((item) => (

                    <div
                        className="cart-card"
                        key={item.id}
                    >

                        <div className="product-image">

                            <img
                                src={
                                    item.product.product_image
                                        ? `${BACKEND_URLS.replace(/\/$/, "")}${item.product.product_image}`
                                        : "/no-image.png"
                                }
                                alt={item.product.name}
                            />

                        </div>

                        <div className="product-info">

                            <h2>
                                {item.product.name}
                            </h2>

                            <p>
                                {item.product.description}
                            </p>

                            <div className="product-grid">

                                <div>

                                    <span>Quantity</span>

                                    <strong>{item.quantity}</strong>

                                </div>

                                <div>

                                    <span>Price</span>

                                    <strong>
                                        ${item.product.price}
                                    </strong>

                                </div>

                                <div>

                                    <span>Discount Price</span>

                                    <strong>
                                        ${item.product.price_after}
                                    </strong>

                                </div>

                                <div>

                                    <span>Total</span>

                                    <strong>
                                        ${item.total}
                                    </strong>

                                </div>

                            </div>

                            <div className="product-actions">

                                <span
                                    className={
                                        item.status === "P"
                                            ? "pending"
                                            : "paid"
                                    }
                                >
                                    {item.status === "P"
                                        ? "Pending"
                                        : item.status}
                                </span>

                                <div>

                                    <button className="view-btn">

                                        View Product

                                    </button>

                                    <button className="remove-btn" onClick={() => {
                                        setSelectedItem(item)
                                        setOpenDelete(true)

                                    }}>

                                        Remove

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {/* Summary */}

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

                    <span>Total</span>

                    <h2>

                        ${total.toFixed(2)}

                    </h2>

                </div>

                <div className="summary-buttons">

                    <button className="continue-btn">

                        Continue Shopping

                    </button>

                    <button className="checkout-btn">

                        Checkout

                    </button>

                </div>

            </div>
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