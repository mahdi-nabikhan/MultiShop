"use client";

import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

import AddDiscountModal from "../AddDiscountModal/AddDiscountModal";
import EditProductModal from "../EditProductModal/EditProductModal";
import DiscountList from "../DiscountList/DiscountList";
import AddProductImageModal from "../AddImageProduct/AddImageProduct";
import DeleteImageModal from "../DeleteImageModal/DeleteImageModal";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

import BACKEND_URLS from "@/utils";

import {
    getShopProductDetail,
    getShopProductImages,
    deleteProductImage,
} from "@/services/shop-admin-panel.services";

import type { ProductImage } from "@/types/panel-admin";

import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import "./ShopProductDetail.css";


function ShopProductDetail({
    productId,
}: {
    productId: number;
}) {
    const queryClient = useQueryClient();


    // ==========================================
    // Modal States
    // ==========================================

    const [openImageModal, setOpenImageModal] =
        useState(false);

    const [openEditModal, setOpenEditModal] =
        useState(false);

    const [openDiscountModal, setOpenDiscountModal] =
        useState(false);

    const [openDeleteImageModal, setOpenDeleteImageModal] =
        useState(false);


    // ==========================================
    // Selected Image
    // ==========================================

    const [selectedImage, setSelectedImage] =
        useState<ProductImage | null>(null);


    // ==========================================
    // Product Query
    // ==========================================

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


    // ==========================================
    // Product Images Query
    // ==========================================

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


    // ==========================================
    // Delete Product Image Mutation
    // ==========================================

    const deleteImageMutation = useMutation({
        mutationFn: (imageId: number) =>
            deleteProductImage(imageId),

        onSuccess: async () => {
            setOpenDeleteImageModal(false);
            setSelectedImage(null);

            await queryClient.invalidateQueries({
                queryKey:
                    shopAdminQueryKeys.productImages(
                        productId
                    ),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    shopAdminQueryKeys.product(
                        productId
                    ),
            });
        },

        onError: (error) => {
            console.error(
                "Failed to delete product image:",
                error
            );
        },
    });


    // ==========================================
    // Delete Product Image Handler
    // ==========================================

    const deleteProductImageHandler = () => {
        if (!selectedImage) {
            return;
        }

        deleteImageMutation.mutate(
            selectedImage.id
        );
    };


    // ==========================================
    // Combine Main Product Image
    // + Additional Images
    // ==========================================

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


    // ==========================================
    // Loading
    // ==========================================

    if (
        productLoading ||
        imagesLoading
    ) {
        return (
            <div className="detail-body">
                <Skeleton count={6} />
            </div>
        );
    }


    // ==========================================
    // Error
    // ==========================================

    if (
        productError ||
        imagesError
    ) {
        return (
            <div className="detail-body">
                <ErrorState
                    message="Failed to load product."
                />
            </div>
        );
    }


    // ==========================================
    // Product Not Found
    // ==========================================

    if (!product) {
        return (
            <div className="detail-body">
                <EmptyState
                    message="Product not found."
                />
            </div>
        );
    }


    // ==========================================
    // Image URL
    // ==========================================

    const getImageUrl = (
        image: string
    ) => {
        if (image.startsWith("http")) {
            return image;
        }

        return `${BACKEND_URLS.replace(
            "/api/v1/",
            ""
        )}${image}`;
    };


    // ==========================================
    // Image Click Handler
    // ==========================================

    const handleImageClick = (
        image: ProductImage
    ) => {
        setSelectedImage(image);
        setOpenDeleteImageModal(true);
    };


    return (
        <>
            <div className="detail-body">

                {/* ========================================== */}
                {/* Product Gallery */}
                {/* ========================================== */}

                <ProductGallery
                    images={images}
                    getImageUrl={getImageUrl}
                    onImageClick={handleImageClick}
                />


                {/* ========================================== */}
                {/* Product Information */}
                {/* ========================================== */}

                <ProductInfo
                    product={product}

                    onEdit={() =>
                        setOpenEditModal(true)
                    }

                    onAddDiscount={() =>
                        setOpenDiscountModal(true)
                    }

                    /*
                     * Delete Product had no handler
                     * in the original component.
                     *
                     * Keep the same behavior for now.
                     */
                    onDelete={() => {}}

                    onAddImage={() =>
                        setOpenImageModal(true)
                    }
                />


                {/* ========================================== */}
                {/* Discounts */}
                {/* ========================================== */}

                <DiscountList
                    productId={Number(productId)}
                />

            </div>


            {/* ========================================== */}
            {/* Add Discount Modal */}
            {/* ========================================== */}

            <AddDiscountModal
                open={openDiscountModal}

                onClose={() =>
                    setOpenDiscountModal(false)
                }

                productId={product.id}
            />


            {/* ========================================== */}
            {/* Edit Product Modal */}
            {/* ========================================== */}

            <EditProductModal
                open={openEditModal}

                onClose={() =>
                    setOpenEditModal(false)
                }

                product={product}
            />


            {/* ========================================== */}
            {/* Add Product Image Modal */}
            {/* ========================================== */}

            <AddProductImageModal
                open={openImageModal}

                onClose={() =>
                    setOpenImageModal(false)
                }

                productId={product.id}

                refreshImages={async () => {
                    await queryClient.invalidateQueries({
                        queryKey:
                            shopAdminQueryKeys.productImages(
                                productId
                            ),
                    });
                }}
            />


            {/* ========================================== */}
            {/* Delete Image Modal */}
            {/* ========================================== */}

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
                    deleteProductImageHandler
                }
            />
        </>
    );
}


export default ShopProductDetail;