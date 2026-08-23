"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

import AddDiscountModal from "../AddDiscountModal/AddDiscountModal";
import EditProductModal from "../EditProductModal/EditProductModal";
import DiscountList from "../DiscountList/DiscountList";
import AddProductImageModal from "../AddImageProduct/AddImageProduct";
import DeleteImageModal from "../DeleteImageModal/DeleteImageModal";

import BACKEND_URLS from "@/utils";

import {
    getShopProductDetail,
    getShopProductImages,
    deleteProductImage,
} from "@/services/shop-admin-panel.services";

import type { ProductImage } from "@/types/panel-admin";

import "./ShopProductDetail.css";

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

    const queryClient = useQueryClient();

    const [openImageModal, setOpenImageModal] =
        useState(false);

    const [thumbsSwiper, setThumbsSwiper] =
        useState<SwiperType | null>(null);

    const [openEditModal, setOpenEditModal] =
        useState(false);

    const [openDiscountModal, setOpenDiscountModal] =
        useState(false);

    const [selectedImage, setSelectedImage] =
        useState<ProductImage | null>(null);

    const [openDeleteImageModal, setOpenDeleteImageModal] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Product Query
    |--------------------------------------------------------------------------
    */

    const {
        data: product,
        isLoading: productLoading,
        isError: productError,
    } = useQuery({

        queryKey:
            shopAdminQueryKeys.product(productId),

        queryFn: () =>
            getShopProductDetail(productId),

    });


    /*
    |--------------------------------------------------------------------------
    | Product Images Query
    |--------------------------------------------------------------------------
    */

    const {
        data: productImages = [],
        isLoading: imagesLoading,
        isError: imagesError,
    } = useQuery({

        queryKey:
            shopAdminQueryKeys.productImages(productId),

        queryFn: () =>
            getShopProductImages(productId),

    });


    /*
    |--------------------------------------------------------------------------
    | Combine Main Product Image + Additional Images
    |--------------------------------------------------------------------------
    */

    const images: ProductImage[] = product
        ? [

            ...(product.product_image
                ? [

                    {
                        id: product.id,

                        product_image:
                            product.product_image,

                        title:
                            product.name,

                        description:
                            product.description,

                        product:
                            product.id,
                    },

                ]
                : []),

            ...productImages,

        ]
        : [];


    /*
    |--------------------------------------------------------------------------
    | Delete Product Image
    |--------------------------------------------------------------------------
    */

    const deleteProductImageHandler = async () => {

        if (!selectedImage) return;

        try {

            await deleteProductImage(
                selectedImage.id
            );

            setOpenDeleteImageModal(false);

            setSelectedImage(null);

            await Promise.all([

                queryClient.invalidateQueries({

                    queryKey:
                        shopAdminQueryKeys.productImages(
                            productId
                        ),

                }),

                queryClient.invalidateQueries({

                    queryKey:
                        shopAdminQueryKeys.product(
                            productId
                        ),

                }),

            ]);

        } catch (error) {

            console.error(
                "Failed to delete product image:",
                error
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        productLoading ||
        imagesLoading
    ) {

        return (

            <div>

                Loading...

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        productError ||
        imagesError
    ) {

        return (

            <div>

                Failed to load product.

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Product Not Found
    |--------------------------------------------------------------------------
    */

    if (!product) {

        return (

            <div>

                Product Not Found

            </div>

        );

    }


    return (

        <>


            <div className="detail-body">


                {/* ------------------------------------------------------ */}
                {/* Product Gallery */}
                {/* ------------------------------------------------------ */}

                <div className="gallery-card">


                    {/* Main Swiper */}

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
                            images.length > 0

                                ? (

                                    images.map(
                                        (
                                            image,
                                            index
                                        ) => (

                                            <SwiperSlide
                                                key={
                                                    image.id
                                                }
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

                                )

                                : (

                                    <SwiperSlide>

                                        <img
                                            src="/images/no-image.png"
                                            alt="No Image"
                                        />

                                    </SwiperSlide>

                                )
                        }

                    </Swiper>


                    {/* Thumbnail Swiper */}

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
                            images.length > 0

                                ? (

                                    images.map(
                                        (image) => (

                                            <SwiperSlide
                                                key={
                                                    image.id
                                                }
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

                                        )
                                    )

                                )

                                : (

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


                {/* ------------------------------------------------------ */}
                {/* Product Information */}
                {/* ------------------------------------------------------ */}

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


                {/* ------------------------------------------------------ */}
                {/* Discounts */}
                {/* ------------------------------------------------------ */}

                <DiscountList
                    productId={
                        Number(productId)
                    }
                />


            </div>


            {/* ------------------------------------------------------ */}
            {/* Add Discount Modal */}
            {/* ------------------------------------------------------ */}

            <AddDiscountModal

                open={
                    openDiscountModal
                }

                onClose={() =>
                    setOpenDiscountModal(false)
                }

                productId={
                    product.id
                }

            />


            {/* ------------------------------------------------------ */}
            {/* Edit Product Modal */}
            {/* ------------------------------------------------------ */}

            <EditProductModal

                open={
                    openEditModal
                }

                onClose={() =>
                    setOpenEditModal(false)
                }

                product={
                    product
                }

            />


            {/* ------------------------------------------------------ */}
            {/* Add Product Image Modal */}
            {/* ------------------------------------------------------ */}

            <AddProductImageModal

                open={
                    openImageModal
                }

                onClose={() =>
                    setOpenImageModal(false)
                }

                productId={
                    product.id
                }

                refreshImages={
                    async () => {

                        await queryClient.invalidateQueries({

                            queryKey:
                                shopAdminQueryKeys.productImages(
                                    productId
                                ),

                        });

                    }
                }

            />


            {/* ------------------------------------------------------ */}
            {/* Delete Image Modal */}
            {/* ------------------------------------------------------ */}

            <DeleteImageModal

                open={
                    openDeleteImageModal
                }

                onClose={() => {

                    setOpenDeleteImageModal(
                        false
                    );

                    setSelectedImage(
                        null
                    );

                }}

                onConfirm={
                    deleteProductImageHandler
                }

            />


        </>

    );

}


export default ShopProductDetail;