"use client"
import { useEffect,useState } from "react"
import axios from "axios"
import BACKEND_URLS from "@/utils"
import './OrderItemList.css'


interface Product {
    id:number;
    name:string;
    description:string;
    quantity_in_stock:string;
    price:number;
    price_after:number;
    product_image:string;
    category:number;
    store : number
}


interface OrderItem {
    id : number;
    quantity:number;
    status : string;
    created:string;
    total:string;
    order:number;
    product:Product
}

interface Props {
    orderId:number|string
}


export default function OrderItemList ({orderId}:Props){
    const[items,setItems] = useState<OrderItem[]>([])
    const [loading,setLoading]=useState(false)
    const getItems = async () =>{
        try{
            const {data}= await axios.get<OrderItem[]>(
                `${BACKEND_URLS}order/api/v1/order/item/list/${orderId}/`,
                {withCredentials:true}
            )
            setItems(data)

        }catch(err){
            console.log(err)

        }finally{
            setLoading(false)

        }
        useEffect(()=>{
            getItems()
        },[orderId])
    }
    if (loading){
        return <h2> loading</h2>
    }
    if (items.length ===0 ){
        return <h2>No Order Item found</h2>
    }
    return(
        <>
            <div className="order-item-page">

            <div className="page-header">

                <h1>
                    Order #{orderId}
                </h1>

                <p>
                    Products inside this order
                </p>

            </div>

            <div className="item-list">

                {items.map((item) => (

                    <div
                        className="item-card"
                        key={item.id}
                    >

                        <img
                            src={
                                item.product.product_image ??
                                "/no-image.png"
                            }
                            alt={item.product.name}
                        />

                        <div className="item-content">

                            <h2>
                                {item.product.name}
                            </h2>

                            <p>
                                {item.product.description}
                            </p>

                            <div className="item-grid">

                                <div>

                                    <span>Quantity</span>

                                    <strong>
                                        {item.quantity}
                                    </strong>

                                </div>

                                <div>

                                    <span>Price</span>

                                    <strong>
                                        ${item.product.price}
                                    </strong>

                                </div>

                                <div>

                                    <span>Sale Price</span>

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

                            <div className="bottom-row">

                                <span
                                    className={
                                        item.status === "P"
                                            ? "pending"
                                            : "confirmed"
                                    }
                                >
                                    {
                                        item.status === "P"
                                            ? "Pending"
                                            : "Confirmed"
                                    }
                                </span>

                                <button>
                                    View Product
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
        
        </>
    )

}