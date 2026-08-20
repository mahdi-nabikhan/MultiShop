"use client";

import AddDiscountModal from "../AddDiscountModal/AddDiscountModal";
import React, { useEffect, useState } from "react";
import BACKEND_URLS from "@/utils";
import "./ShopProductDetail.css";

import {
    getShopProductDetail,
    getShopProductImages,
    deleteProductImage,
    ShopProductData,
    ProductImage,
} from "@/services/shop-admin-panel.services";

import EditProductModal from "../EditProductModal/EditProductModal";
import DiscountList from "../DiscountList/DiscountList";
import AddProductImageModal from "../AddImageProduct/AddImageProduct";
import DeleteImageModal from "../DeleteImageModal/DeleteImageModal";

import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Thumbs,
} from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";


function ShopProductDetail({
    productId,
}: {
    productId: number;
}) {

    const [openImageModal, setOpenImageModal] =
        useState(false);

    const [thumbsSwiper, setThumbsSwiper] =
        useState<SwiperType | null>(null);

    const [product, setProduct] =
        useState<ShopProductData | null>(null);

    const [openEditModal, setOpenEditModal] =
        useState(false);

    const [openDiscountModal, setOpenDiscountModal] =
        useState(false);

    const [images, setImages] =
        useState<ProductImage[]>([]);

    const [selectedImage, setSelectedImage] =
        useState<ProductImage | null>(null);

    const [openDeleteImageModal, setOpenDeleteImageModal] =
        useState(false);


    const GetProductData = async () => {

        try {

            const productData =
                await getShopProductDetail(productId);

            setProduct(productData);

            const imageData =
                await getShopProductImages(productId);

            const allImages: ProductImage[] = [];

            if (productData.product_image) {

                allImages.push({

                    id: productData.id,

                    product_image:
                        productData.product_image,

                    title:
                        productData.name,

                    description:
                        productData.description,

                    product:
                        productData.id,

                });

            }

            imageData.forEach((item) => {

                allImages.push({

                    id: item.id,

                    product_image:
                        item.product_image,

                    title:
                        item.title,

                    description:
                        item.description,

                    product:
                        item.product,

                });

            });

            setImages(allImages);

        } catch (error) {

            console.error(
                "Failed to load product:",
                error
            );

        }

    };


    const DeleteProductImage = async () => {

        if (!selectedImage) return;

        try {

            await deleteProductImage(
                selectedImage.id
            );

            setOpenDeleteImageModal(false);

            setSelectedImage(null);

            await GetProductData();

        } catch (error) {

            console.error(
                "Failed to delete product image:",
                error
            );

        }

    };


    useEffect(() => {

        GetProductData();

    }, [productId]);


    if (!product) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    return (

        <>

            <div className="detail-body">

                <div className="gallery-card">

                    <Swiper
                        modules={[
                            Navigation,
                            Pagination,
                            Thumbs,
                        ]}
                        navigation
                        pagination={{
                            clickable: true,
                        }}
                        thumbs={{
                            swiper: thumbsSwiper,
                        }}
                        className="main-swiper"
                    >

                        {
                            images.length > 0 ? (

                                images.map(
                                    (image, index) => (

                                        <SwiperSlide
                                            key={image.id}
                                        >

                                            <img
                                                src={
                                                    image.product_image.startsWith(
                                                        "http"
                                                    )
                                                        ? image.product_image
                                                        : `${BACKEND_URLS.replace(
                                                            "/api/v1/",
                                                            ""
                                                        )}${image.product_image}`
                                                }
                                                alt={`Product Image ${
                                                    index + 1
                                                }`}
                                                onClick={() => {

                                                    setSelectedImage(
                                                        image
                                                    );

                                                    setOpenDeleteImageModal(
                                                        true
                                                    );

                                                }}
                                            />

                                        </SwiperSlide>

                                    )
                                )

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
                        onSwiper={
                            setThumbsSwiper
                        }
                        modules={[
                            Thumbs,
                        ]}
                        slidesPerView={4}
                        spaceBetween={12}
                        watchSlidesProgress
                        className="thumb-swiper"
                    >

                        {
                            images.length > 0 ? (

                                images.map((image) => (

                                    <SwiperSlide
                                        key={image.id}
                                    >

                                        <img
                                            src={
                                                image.product_image.startsWith(
                                                    "http"
                                                )
                                                    ? image.product_image
                                                    : `${BACKEND_URLS.replace(
                                                        "/api/v1/",
                                                        ""
                                                    )}${image.product_image}`
                                            }
                                            alt={
                                                image.title ??
                                                "Product Image"
                                            }
                                            onClick={() => {

                                                setSelectedImage(
                                                    image
                                                );

                                                setOpenDeleteImageModal(
                                                    true
                                                );

                                            }}
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

                        <h2>
                            {product.name}
                        </h2>

                        <span
                            className={
                                product.quantity_in_stock > 0
                                    ? "status in-stock"
                                    : "status out-stock"
                            }
                        >
                            {
                                product.quantity_in_stock > 0
                                    ? "In Stock"
                                    : "Out of Stock"
                            }
                        </span>

                    </div>


                    <div className="info-grid">

                        <div className="info-item">

                            <span>
                                Product ID
                            </span>

                            <strong>
                                #{product.id}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Category
                            </span>

                            <strong>
                                {product.category}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Price
                            </span>

                            <strong>
                                ${product.price}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Sale Price
                            </span>

                            <strong className="sale-price">
                                ${product.price_after}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Stock
                            </span>

                            <strong>
                                {product.quantity_in_stock}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Store
                            </span>

                            <strong>
                                {product.store}
                            </strong>

                        </div>

                    </div>


                    <div className="description-box">

                        <h3>
                            Description
                        </h3>

                        <p>
                            {product.description}
                        </p>

                    </div>


                    <div className="action-buttons">

                        <button
                            className="edit-btn"
                            onClick={() =>
                                setOpenEditModal(true)
                            }
                        >
                            Edit Product
                        </button>


                        <button
                            className="primary-btn"
                            onClick={() =>
                                setOpenDiscountModal(true)
                            }
                        >
                            Add Discount
                        </button>


                        <button className="delete-btn">
                            Delete Product
                        </button>


                        <button
                            className="primary-btn"
                            onClick={() =>
                                setOpenImageModal(true)
                            }
                        >
                            Add Product Image
                        </button>

                    </div>

                </div>


                <DiscountList
                    productId={Number(productId)}
                />

            </div>


            <AddDiscountModal
                open={openDiscountModal}
                onClose={() =>
                    setOpenDiscountModal(false)
                }
                productId={product.id}
                refreshDiscounts={() => {}}
            />


            <EditProductModal
                open={openEditModal}
                onClose={() =>
                    setOpenEditModal(false)
                }
                product={product}
                refreshProduct={
                    GetProductData
                }
            />


            <AddProductImageModal
                open={openImageModal}
                onClose={() =>
                    setOpenImageModal(false)
                }
                productId={product.id}
                refreshImages={
                    GetProductData
                }
            />


            <DeleteImageModal
                open={openDeleteImageModal}
                onClose={() => {

                    setOpenDeleteImageModal(
                        false
                    );

                    setSelectedImage(
                        null
                    );

                }}
                onConfirm={
                    DeleteProductImage
                }
            />

        </>

    );

}


export default ShopProductDetail;