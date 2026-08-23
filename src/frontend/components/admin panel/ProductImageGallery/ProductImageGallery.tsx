"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductImages } from "@/services/shop-admin-panel.services";

import "./ProductImageGallery.css";


interface Props {

    productId: number;

}



export default function ProductImageGallery({ productId }: Props) {
    const { data: images = [], isLoading, isError, } = useQuery({
        queryKey: ["product-images", productId],
        queryFn: () => getProductImages(productId),
    });

    if (isError) {
        return (
            <div className="gallery-error">
                Failed to load product images.
            </div>
        );
    }






    if (isLoading) {

        return (

            <div className="gallery-loading">

                Loading Images...

            </div>

        );

    }




    if (images.length === 0) {

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
                    images.map((image) => (

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