"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

import "./ProductImageGallery.css";


interface ProductImage {

    id:number;

    product_image:string;

    title:string | null;

    description:string | null;

    product:number;

}



interface Props {

    productId:number;

}



export default function ProductImageGallery({

    productId

}:Props){


    const [images,setImages] = useState<ProductImage[]>([]);


    const [loading,setLoading] = useState(true);



    useEffect(()=>{


        fetchImages();


    },[productId]);



    async function fetchImages(){


        try{


            const {data}=await axios.get<ProductImage[]>(

                `${BACKEND_URLS}website/api/v1/list/image/product/${productId}/`

            );


            setImages(data);


        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }


    }





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