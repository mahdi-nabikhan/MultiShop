"use client";


import {useEffect,useState} from "react";

import axios from "axios";

import BACKEND_URLS from "@/utils";

import {
    Package,
    Clock
} from "lucide-react";


import "./CustomerOrderItemDetail.css";




interface Product {


    id:number;

    name:string;

    description:string;

    product_image:string;

    price:number;

    price_after:number;


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

    itemId:number;

}





export default function CustomerOrderItemDetail({

    itemId

}:Props){



    const [item,setItem]=useState<OrderItem|null>(null);





    const GetItemDetail=async()=>{


        try{


            const {data}=await axios.get<OrderItem>(


                `${BACKEND_URLS}order/api/v1/order/item/detail/${itemId}/`,

                {

                    withCredentials:true

                }

            );


            setItem(data);


        }


        catch(error){


            console.log(error);


        }


    };





    useEffect(()=>{


        GetItemDetail();


    },[itemId]);







    if(!item){


        return (

            <div className="order-detail-loading">

                Loading...

            </div>

        )


    }






    const imageUrl =

    `${BACKEND_URLS.replace("/api/v1/","")}${item.product.product_image}`;






    return (


        <section className="customer-order-detail">



            <div className="detail-header">


                <h2>

                    Order Item #{item.id}

                </h2>


                <span>

                    Order #{item.order}

                </span>


            </div>






            <div className="detail-card">



                <div className="detail-image">


                    <img

                        src={imageUrl}

                        alt={item.product.name}

                    />


                </div>






                <div className="detail-content">


                    <h1>

                        {item.product.name}

                    </h1>



                    <p className="description">

                        {item.product.description}

                    </p>





                    <div className="detail-grid">



                        <div>

                            <span>
                                Quantity
                            </span>

                            <strong>
                                {item.quantity}
                            </strong>

                        </div>




                        <div>

                            <span>
                                Price
                            </span>

                            <strong>
                                ${item.product.price}
                            </strong>

                        </div>





                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                ${item.total}
                            </strong>

                        </div>





                        <div>

                            <span>
                                Date
                            </span>

                            <strong>

                                {
                                new Date(item.created)
                                .toLocaleDateString()
                                }

                            </strong>

                        </div>



                    </div>






                    <div className="detail-status">


                        <Clock size={18}/>


                        {

                            item.status === "P"

                            ?

                            "Pending"

                            :

                            item.status

                        }


                    </div>



                </div>



            </div>



        </section>


    );


}