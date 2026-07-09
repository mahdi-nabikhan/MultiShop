import Image from "next/image";
import { Calendar, CircleDollarSign, Package } from "lucide-react";

import "./OrderDetail.css";

export default function OrderDetail() {

    const order = {

        id: 1245,

        status: "Paid",

        createdAt: "2026 / 07 / 09",

        total: 2450,

        items: [

            {

                id:1,

                quantity:2,

                price:1200,

                product:{

                    title:"iPhone 16 Pro",

                    image:"/images/products/iphone.jpg"

                }

            },

            {

                id:2,

                quantity:1,

                price:50,

                product:{

                    title:"Apple Charger",

                    image:"/images/products/charger.jpg"

                }

            }

        ]

    }

    return(

        <section className="order">

            <div className="order-header">

                <div>

                    <h2>

                        Order #{order.id}

                    </h2>

                    <span>

                        <Calendar size={15}/>

                        {order.createdAt}

                    </span>

                </div>

                <div className="paid">

                    {order.status}

                </div>

            </div>

            <div className="order-items">

                {

                    order.items.map(item=>(

                        <div
                            key={item.id}
                            className="order-item"
                        >

                            <div className="left">

                                <Image

                                    src={item.product.image}

                                    alt={item.product.title}

                                    width={70}

                                    height={70}

                                />

                                <div>

                                    <h4>

                                        {item.product.title}

                                    </h4>

                                    <p>

                                        <Package size={14}/>

                                        Qty : {item.quantity}

                                    </p>

                                </div>

                            </div>

                            <strong>

                                ${item.price}

                            </strong>

                        </div>

                    ))

                }

            </div>

            <div className="order-footer">

                <span>

                    <CircleDollarSign size={18}/>

                    Total

                </span>

                <h2>

                    ${order.total}

                </h2>

            </div>

        </section>

    )

}