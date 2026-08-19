"use client";

import { useEffect, useState } from "react";
import { getRandomProducts,Product } from "@/services/product.services";
import Image from "next/image";
import Link from "next/link";
import BACKEND_URLS from "@/utils";

import "./RandomProduct.css";



export default function RandomProducts() {


    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {


        async function fetchProducts() {


            try {


                const  data  = await getRandomProducts()

                setProducts(data);


            }
            catch (error) {

                console.log(error);

            }
            finally {

                setLoading(false);

            }


        }


        fetchProducts();


    }, []);



    if (loading) {

        return (

            <section className="random-products">

                <h2>Recommended Products</h2>

                <p>Loading...</p>

            </section>

        );

    }



    if (products.length === 0) {

        return null;

    }



    return (

        <section className="random-products">


            <div className="random-products-header">

                <h2>

                    Recommended Products

                </h2>

            </div>



            <div className="random-products-grid">


                {

                    products.map(product => (


                        <Link

                            href={`/product/${product.id}`}

                            className="random-product-card"

                            key={product.id}

                        >


                            <div className="random-product-image">


                                <img
                                    src={`${BACKEND_URLS}${product.product_image}`}
                                    alt={product.name}
                                    className="product-image"
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