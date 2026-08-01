"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import BACKEND_URLS from "@/utils";

import "./RandomProduct.css";

interface Product {

    id:number;

    name:string;

    description:string;

    quantity_in_stock:number;

    price:number;

    price_after:number;

    product_image:string | null;

    category:number;

    store:number;

}

export default function RandomProducts(){


    const [products,setProducts] = useState<Product[]>([]);

    const [loading,setLoading] = useState(true);



    useEffect(()=>{


        async function fetchProducts(){


            try{


                const {data} = await axios.get(

                    `${BACKEND_URLS}website/api/v1/products/random/`

                );


                setProducts(data);


            }
            catch(error){

                console.log(error);

            }
            finally{

                setLoading(false);

            }


        }


        fetchProducts();


    },[]);



    if(loading){

        return (

            <section className="random-products">

                <h2>Recommended Products</h2>

                <p>Loading...</p>

            </section>

        );

    }



    if(products.length===0){

        return null;

    }



    return(

        <section className="random-products">


            <div className="random-products-header">

                <h2>

                    Recommended Products

                </h2>

            </div>



            <div className="random-products-grid">


                {

                    products.map(product=>(


                        <Link

                            href={`/product/${product.id}`}

                            className="random-product-card"

                            key={product.id}

                        >


                            <div className="random-product-image">


                                <Image

                                    src={
                                        product.product_image
                                        ?
                                        `${BACKEND_URLS}${product.product_image}`
                                        :
                                        "/product.jpg"
                                    }

                                    alt={product.name}

                                    fill

                                />


                            </div>



                            <div className="random-product-content">


                                <h3>

                                    {product.name}

                                </h3>



                                <p>

                                    {product.description}

                                </p>



                                <div className="random-product-footer">


                                    <span className="old-price">

                                        ${product.price}

                                    </span>



                                    <span className="new-price">

                                        ${product.price_after}

                                    </span>


                                </div>



                            </div>


                        </Link>


                    ))

                }


            </div>


        </section>

    );

}