"use client";
import AddDiscountModal from "../AddDiscountModal/AddDiscountModal";
import React, { useEffect, useState } from "react";
import "./ShopProductDetail.css";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import EditProductModal from "../EditProductModal/EditProductModal";
import DiscountList from "../DiscountList/DiscountList";
import AddProductImageModal from "../AddImageProduct/AddImageProduct";
import ProductImageGallery from "../ProductImageGallery/ProductImageGallery";



import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
interface ProductImage {
    id: number;
    product_image: string;
    title: string | null;
    description: string | null;
    product: number;
}



interface ShopProductData {
    id: number;
    name: string;
    description: string;
    quantity_in_stock: number;
    price: number;
    price_after: number;
    product_image: string | null;
    category: number;
    store: number;
}

function ShopProductDetail({ productId }: { productId: number }) {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [product, setProduct] = useState<ShopProductData | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDiscountModal, setOpenDiscountModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [images, setImages] = useState<string[]>([]);



    const GetProductData = async () => {

        try {

            // Product Detail
            const { data: productData } = await axios.get<ShopProductData>(
                `${BACKEND_URLS}vendor/api/v1/detail/product/${productId}/`,
                {
                    withCredentials: true,
                }
            );

            setProduct(productData);

            // Product Images
            const { data: imageData } = await axios.get<ProductImage[]>(
                `${BACKEND_URLS}website/api/v1/list/image/product/${productId}/`
            );

            const backendUrl = BACKEND_URLS.replace("/api/v1/", "");

            const allImages: string[] = [];

            // Main Product Image
            if (productData.product_image) {

                if (productData.product_image.startsWith("http")) {

                    allImages.push(productData.product_image);

                } else {

                    allImages.push(
                        `${backendUrl}${productData.product_image}`
                    );

                }

            }

            // Extra Images
            imageData.forEach((item) => {

                if (item.product_image.startsWith("http")) {

                    allImages.push(item.product_image);

                } else {

                    allImages.push(
                        `${backendUrl}${item.product_image}`
                    );

                }

            });

            setImages(allImages);

        }

        catch (err) {

            console.log(err);

        }

    };
    useEffect(() => {

        GetProductData();

    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }



    return (


        <>
            <div className="detail-body">

                <div className="gallery-card">

                    <Swiper
                        modules={[Navigation, Pagination, Thumbs]}
                        navigation
                        pagination={{ clickable: true }}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="main-swiper"
                    >

                        {
                            images.length > 0 ? (

                                images.map((image, index) => (

                                    <SwiperSlide key={index}>

                                        <img
                                            src={image}
                                            alt={`Product Image ${index + 1}`}
                                        />

                                    </SwiperSlide>

                                ))

                            ) : (

                                <SwiperSlide>

                                    <img
                                        src="/images/no-image.png"
                                        alt="No Image"
                                    />

                                </SwiperSlide>

                            )
                        }

                    </Swiper>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        modules={[Thumbs]}
                        slidesPerView={4}
                        spaceBetween={12}
                        watchSlidesProgress
                        className="thumb-swiper"
                    >

                        {
                            images.length > 0 ? (

                                images.map((image, index) => (

                                    <SwiperSlide key={index}>

                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                        />

                                    </SwiperSlide>

                                ))

                            ) : (

                                <SwiperSlide>

                                    <img
                                        src="/images/no-image.png"
                                        alt="No Image"
                                    />

                                </SwiperSlide>

                            )
                        }

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

                        <p>{product.description}</p>

                    </div>

                    <div className="action-buttons">

                        <button
                            className="edit-btn"
                            onClick={() => setOpenEditModal(true)}
                        >
                            Edit Product
                        </button>
                        <button
                            className="primary-btn"
                            onClick={() => setOpenDiscountModal(true)}
                        >
                            Add Discount
                        </button>

                        <button className="delete-btn">
                            Delete Product
                        </button>
                        <button

                            className="primary-btn"

                            onClick={() => setOpenImageModal(true)}

                        >

                            Add Product Image

                        </button>

                    </div>

                </div>
                <DiscountList productId={Number(productId)} />
            </div>
            <AddDiscountModal
                open={openDiscountModal}
                onClose={() => setOpenDiscountModal(false)}
                productId={product.id}
                refreshDiscounts={() => {

                }}
            />
            <EditProductModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                product={product}
                refreshProduct={GetProductData}
            />
            <AddProductImageModal

                open={openImageModal}

                onClose={() => setOpenImageModal(false)}

                productId={product.id}

                refreshImages={() => {
                    GetProductData();
                }}

            />
           
        </>

    );
}

export default ShopProductDetail;