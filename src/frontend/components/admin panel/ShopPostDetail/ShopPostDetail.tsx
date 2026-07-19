"use client";

import React from 'react'
import './ShopPostDetail.css'
import axios from 'axios'
import BACKEND_URLS from '@/utils'


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
interface ProductId {
    productId: number
}
interface ShopProductData {
    id: number,
    name: string,
    description: string,
    quantity_in_stock: number,
    price: number,
    price_after: number,
    product_image: string | null,
    category: number,
    store: number


}


async function ShopPostDetail({ productId }: ProductId) {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const { data: product } = await axios.get<ShopProductData>(

        `${BACKEND_URLS}vendor/api/v1/detail/product/${productId}/`, {
        withCredentials: true
    }

    )
    const images = [
        product.product_image,
        "/images/demo1.jpg",
        "/images/demo2.jpg",
        "/images/demo3.jpg",
    ];
    return (
        <div className="detail-body">

            <div className="gallery-card">

                <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    navigation
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper }}
                    className="main-swiper"
                >
                    {images.map((image, index) => (

                        <SwiperSlide key={index}>

                            <img src={image ?? "/no-image.png"} />

                        </SwiperSlide>

                    ))}
                </Swiper>

                <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    slidesPerView={4}
                    spaceBetween={12}
                    watchSlidesProgress
                    className="thumb-swiper"
                >
                    {images.map((image, index) => (

                        <SwiperSlide key={index}>

                            <img src={image ?? "/no-image.png"} />

                        </SwiperSlide>

                    ))}
                </Swiper>

            </div>

            <div className="info-card">

                <div className="card-header">
                    <h2>{product.name}</h2>

                    <span
                        className={
                            product.quantity_in_stock > 0
                                ? "status in-stock"
                                : "status out-stock"
                        }
                    >
                        {product.quantity_in_stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                    </span>
                </div>

                <div className="info-grid">

                    <div className="info-item">
                        <span>Product ID</span>
                        <strong>#{product.id}</strong>
                    </div>

                    <div className="info-item">
                        <span>Category</span>
                        <strong>{product.category}</strong>
                    </div>

                    <div className="info-item">
                        <span>Price</span>
                        <strong>${product.price}</strong>
                    </div>

                    <div className="info-item">
                        <span>Sale Price</span>
                        <strong className="sale-price">
                            ${product.price_after}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Stock</span>
                        <strong>{product.quantity_in_stock}</strong>
                    </div>

                    <div className="info-item">
                        <span>Store</span>
                        <strong>{product.store}</strong>
                    </div>

                </div>

                <div className="description-box">

                    <h3>Description</h3>

                    <p>
                        {product.description}
                    </p>

                </div>

                <div className="action-buttons">

                    <button className="edit-btn">
                        Edit Product
                    </button>

                    <button className="delete-btn">
                        Delete Product
                    </button>

                </div>

            </div>

        </div>
    )
}

export default ShopPostDetail