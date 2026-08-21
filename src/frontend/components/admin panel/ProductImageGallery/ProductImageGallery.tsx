"use client";

import { useEffect, useState } from "react";
import {getProductImages} from "@/services/shop-admin-panel.services";
import { ProductImage } from "@/types/panel-admin";
import "./ProductImageGallery.css";


interface Props {

    productId:number;

}



export default function ProductImageGallery({

    productId

}:Props){


    const [images,setImages] = useState<ProductImage[]>([]);


    const [loading,setLoading] = useState(true);
    async function fetchImages() {

    try {

        setLoading(true);

        const data = await getProductImages(productId);

        setImages(data);

    } catch (error) {

        console.error(
            "Failed to load product images:",
            error
        );

    } finally {

        setLoading(false);

    }

}



    useEffect(()=>{


        fetchImages();


    },[productId]);



   




    if(loading){

        return (

            <div className="gallery-loading">

                Loading Images...

            </div>

        );

    }




    if(images.length === 0){

        return (

            <div className="gallery-empty">

                No Additional Images Found

            </div>

        );

    }





    return (

        <div className="product-images-section">


            <div className="section-header">


                <h3>

                    Product Gallery

                </h3>


                <span>

                    {images.length} Images

                </span>


            </div>





            <div className="product-images-grid">


                {
                    images.map((image)=>(

                        <div

                            key={image.id}

                            className="image-card"

                        >


                            <div className="image-wrapper">


                                <img

                                    src={`http://localhost:8000${image.product_image}`}

                                    alt={image.title ?? "Product Image"}

                                />


                            </div>





                            <div className="image-info">


                                <h4>

                                    {
                                        image.title ?? "Untitled Image"
                                    }

                                </h4>


                                <p>

                                    {
                                        image.description ?? "No Description"
                                    }

                                </p>


                            </div>





                            <div className="image-actions">


                                <button className="delete-image-btn">

                                    Delete

                                </button>


                            </div>



                        </div>

                    ))
                }


            </div>



        </div>

    );

}