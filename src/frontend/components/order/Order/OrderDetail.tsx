"use client"

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

        <section className="order">

            <div className="order-header">

                <div>

                    <h2>

                        Your Shopping Cart

                    </h2>

                    <span>

                        <Calendar size={15} />

                        {new Date(items[0].created).toLocaleDateString()}

                    </span>

                </div>

                <div className="paid">

                    {items[0].status === "P"
                        ? "Pending"
                        : items[0].status}

                </div>

            </div>

            <div className="order-items">

                {

                    items.map(item => (

                        <div
                            key={item.id}
                            className="order-item"
                        >

                            <div className="left">

                                <img
                                    src={
                                        item.product.product_image
                                            ? `${BACKEND_URLS.replace(/\/$/, "")}${item.product.product_image}`
                                            : "/no-image.png"
                                    }
                                    alt={item.product.name}
                                    width={70}
                                    height={70}
                                />

                                <div>

                                    <h4>

                                        {item.product.name}

                                    </h4>

                                    <p>

                                        <Package size={14} />

                                        Qty : {item.quantity}

                                    </p>

                                    <small>

                                        ${item.product.price_after} each

                                    </small>

                                </div>

                            </div>

                            <strong>

                                ${item.total}

                            </strong>

                        </div>

                    ))

                }

            </div>

            <div className="order-footer">

                <span>

                    <CircleDollarSign size={18} />

                    Total

                </span>

                <h2>

                    ${total.toFixed(2)}

                </h2>

            </div>

        </section>

    );

}