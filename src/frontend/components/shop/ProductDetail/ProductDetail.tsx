"use client";

import { useEffect, useState } from "react";

import useCheckMe from "@/hooks/Checkme";
import useProduct from "@/hooks/shop/useProduct";
import useProductImages from "@/hooks/shop/useProductImages";

import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

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
    } = useProduct(productId);

    const {
        data: productImages = [],
        isLoading: imagesLoading,
        isError: imagesError,
    } = useProductImages(productId);
    const {
        data: currentUser,
        isLoading: authLoading,
    } = useCheckMe();

    const isAuthenticated =
        authLoading
            ? null
            : !!currentUser;


    const [activeImage, setActiveImage] =
        useState<string | null>(null);

    function fixImageUrl(
        image: string | null
    ): string | null {
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
            fixImageUrl(
                product.product_image
            ),
            ...productImages.map(
                (item) =>
                    fixImageUrl(
                        item.product_image
                    )
            ),
        ].filter(Boolean) as string[]
        : [];

    useEffect(() => {
        setActiveImage(
            images.length > 0
                ? images[0]
                : null
        );
    }, [product, productImages]);

    if (
        productLoading ||
        imagesLoading
    ) {
        return <Skeleton count={6} />;
    }

    if (
        productError ||
        imagesError ||
        !product
    ) {
        return (
            <ErrorState
                message="Failed to load product."
            />
        );
    }

    return (
        <section className="product-detail container">
            <ProductGallery
                images={images}
                activeImage={activeImage}
                productName={product.name}
                onImageSelect={
                    setActiveImage
                }
            />

            <ProductInfo
                product={product}
                isAuthenticated={
                    isAuthenticated
                }
            />
        </section>
    );
}