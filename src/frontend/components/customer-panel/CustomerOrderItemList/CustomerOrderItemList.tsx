"use client";


import { useEffect, useState } from "react";

import axios from "axios";

import BACKEND_URLS from "@/utils";

import "./CustomerOrderItemList.css";

import {
    Package
} from "lucide-react";



interface Product {

    id:number;

    name:string;

    description:string;

    product_image:string;

    price:number;

}



interface OrderItem {

    id:number;

    quantity:number;

    status:string;

    created:string;

    total:string;

    order:number;

    product:Product;

}



interface Props {

    orderId:number;

}



export default function CustomerOrderItemList({

    orderId

}:Props){



    const [items,setItems] = useState<OrderItem[]>([]);

    const [loading,setLoading] = useState(true);





    const GetOrderItems = async()=>{


        try{


            const {data} = await axios.get<OrderItem[]>(

                `${BACKEND_URLS}order/item/list/${orderId}/`,

                {
                    withCredentials:true
                }

            );


            setItems(data);


        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    };






    useEffect(()=>{


        GetOrderItems();


    },[orderId]);







    if(loading){


        return (

            <div className="order-loading">

                Loading...

            </div>

        )

    }





    return (

        <section className="customer-order-items">



            <div className="order-items-header">


                <h2>

                    Order #{orderId}

                </h2>


                <p>

                    Products in this order

                </p>


            </div>





            <div className="order-items-list">



                {

                    items.map((item)=>(



                        <div

                            className="order-item-card"

                            key={item.id}

                        >



                            <div className="product-image">


                                <img

                                    src={

                                        `${BACKEND_URLS.replace(
                                            "/api/v1/",
                                            ""
                                        )}${item.product.product_image}`

                                    }

                                    alt={item.product.name}

                                />


                            </div>






                            <div className="product-info">


                                <h3>

                                    {item.product.name}

                                </h3>



                                <p>

                                    Quantity:
                                    {item.quantity}

                                </p>



                                <span>

                                    Status:
                                    {
                                        item.status === "P"
                                        ?
                                        " Pending"
                                        :
                                        item.status
                                    }

                                </span>



                            </div>






                            <div className="product-total">


                                ${item.total}


                            </div>




                        </div>


                    ))

                }



            </div>



        </section>

    );


}