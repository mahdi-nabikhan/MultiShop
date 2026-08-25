"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";
import ProductRating from "@/components/shop/ProductRating/ProductRating";

import {
    getProduct,
    getProductImages,
} from "@/services/product.services";

import Link from "next/link";

import ProductOrderBox from "../ProductOrderBox/ProductOrderBox";

import useCheckMe from "@/hooks/Checkme";

import SessionProductOrderBox from "../SessionProductOrderBox/SessionProductOrderBox";

import {
    Star,
    ShieldCheck,
    Truck,
} from "lucide-react";

import "./ProductDetail.css";


interface Props {
    productId: string;
}


export default function ProductDetail({
    productId,
}: Props) {

    const {
        data: product,
        isLoading: productLoading,
        isError: productError,
    } = useQuery({
        queryKey: shopQueryKeys.product(productId),
        queryFn: () => getProduct(productId),
    });


    const {
        data: productImages = [],
        isLoading: imagesLoading,
        isError: imagesError,
    } = useQuery({
        queryKey: shopQueryKeys.productImages(productId),
        queryFn: () => getProductImages(productId),
    });


    const [activeImage, setActiveImage] =
        useState<string | null>(null);


    const isAuthenticated =
        useCheckMe();


    function fixImageUrl(
        image: string | null
    ) {

        if (!image) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:8000${image}`;
    }


    const images = product
        ? [
            fixImageUrl(product.product_image),
            ...productImages.map(item =>
                fixImageUrl(item.product_image)
            ),
        ].filter(Boolean) as string[]
        : [];


    useEffect(() => {

        if (images.length > 0) {

            setActiveImage(images[0]);

        } else {

            setActiveImage(null);

        }

    }, [product, productImages]);


    if (productLoading || imagesLoading) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    if (productError || imagesError || !product) {

        return (
            <h2>
                Failed to load product.
            </h2>
        );

    }


    return (

        <section className="product-detail container">

            <div className="gallery">

                <div className="thumbnail-list">

                    {images.map((img, index) => (

                        <div
                            key={index}
                            className={
                                `thumbnail ${
                                    activeImage === img
                                        ? "active"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                setActiveImage(img)
                            }
                        >

                            <img
                                src={img}
                                alt={product.name}
                            />

                        </div>

                    ))}

                </div>


                <div className="main-image">

                    {activeImage && (

                        <img
                            src={activeImage}
                            alt={product.name}
                        />

                    )}

                </div>

            </div>


            <div className="info">

                <h1>
                    {product.name}
                </h1>


                <div className="rating">

                    <Star
                        fill="#FFD700"
                        stroke="#FFD700"
                        size={18}
                    />

                    <span>
                        0.0
                    </span>

                </div>


                <div className="price-box">

                    <span className="old-price">
                        ${product.price}
                    </span>

                    <span className="new-price">
                        ${product.price_after}
                    </span>

                </div>


                <p className="description">
                    {product.description}
                </p>


                <div className="stock">

                    In Stock:{" "}
                    {product.quantity_in_stock}

                </div>


                {
                    isAuthenticated === null

                        ?

                        <div>
                            Loading...
                        </div>

                        :

                        isAuthenticated

                            ?

                            <>

                                <ProductOrderBox
                                    productId={product.id}
                                />

                                <Link
                                    href={`/chatbox/${product.store}`}
                                    className="chat-link"
                                >
                                    Chat with seller
                                </Link>

                            </>

                            :

                            <SessionProductOrderBox
                                productId={product.id}
                            />
                }


                <div className="features">

                    <div>
                        <Truck size={18} />
                        Free Shipping
                    </div>

                    <div>
                        <ShieldCheck size={18} />
                        Warranty Included
                    </div>

                </div>


                <ProductRating
                    productId={product.id}
                    isAuthenticated={
                        isAuthenticated ?? false
                    }
                />

            </div>

        </section>

    );

}