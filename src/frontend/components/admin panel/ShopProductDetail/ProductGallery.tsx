"use client";

import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Thumbs,
} from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";

import type { ProductImage } from "@/types/panel-admin";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import "./ProductGallery.css";

interface ProductGalleryProps {
    images: ProductImage[];
    getImageUrl: (image: string) => string;
    onImageClick: (image: ProductImage) => void;
}

function ProductGallery({
    images,
    getImageUrl,
    onImageClick,
}: ProductGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] =
        useState<SwiperType | null>(null);

    return (
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
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <SwiperSlide key={image.id}>
                            <img
                                src={getImageUrl(
                                    image.product_image
                                )}
                                alt={`Product Image ${
                                    index + 1
                                }`}
                                onClick={() =>
                                    onImageClick(image)
                                }
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
                )}
            </Swiper>

            {/* Thumbnail Swiper */}
            <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                slidesPerView={4}
                spaceBetween={12}
                watchSlidesProgress
                className="thumb-swiper"
            >
                {images.length > 0 ? (
                    images.map((image) => (
                        <SwiperSlide key={image.id}>
                            <img
                                src={getImageUrl(
                                    image.product_image
                                )}
                                alt={
                                    image.title ??
                                    "Product Image"
                                }
                                onClick={() =>
                                    onImageClick(image)
                                }
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
                )}
            </Swiper>
        </div>
    );
}

export default ProductGallery;