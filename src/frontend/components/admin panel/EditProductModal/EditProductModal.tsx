"use client";

import { useEffect, useState } from "react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateProduct } from "@/services/shop-admin-panel.services";
import type { ShopProductData } from "@/types/panel-admin";

import EditProductForm from "./EditProductForm";

import "./EditProductModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    product: ShopProductData;
}

export default function EditProductModal({
    open,
    onClose,
    product,
}: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    const [price, setPrice] = useState("");
    const [priceAfter, setPriceAfter] =
        useState("");

    const [stock, setStock] = useState("");
    const [category, setCategory] =
        useState("");

    const [image, setImage] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState("");

    const queryClient =
        useQueryClient();

    // ==========================================
    // Update Product
    // ==========================================

    const updateMutation = useMutation({
        mutationFn: ({
            productId,
            formData,
        }: {
            productId: number;
            formData: FormData;
        }) =>
            updateProduct(
                productId,
                formData
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "shop-admin",
                    "products",
                ],
            });

            onClose();
        },

        onError: (err) => {
            console.error(
                "Update product error:",
                err
            );
        },
    });

    // ==========================================
    // Set Product Data
    // ==========================================

    useEffect(() => {
        if (!product) {
            return;
        }

        setName(product.name);

        setDescription(
            product.description
        );

        setPrice(
            product.price.toString()
        );

        setPriceAfter(
            product.price_after.toString()
        );

        setStock(
            product.quantity_in_stock.toString()
        );

        setCategory(
            product.category.toString()
        );

        setPreview(
            product.product_image ||
                "/no-image.png"
        );

        setImage(null);
    }, [product]);

    // ==========================================
    // Submit
    // ==========================================

    const submitHandler = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const formData =
            new FormData();

        formData.append(
            "name",
            name
        );

        formData.append(
            "description",
            description
        );

        formData.append(
            "price",
            price
        );

        formData.append(
            "price_after",
            priceAfter
        );

        formData.append(
            "quantity_in_stock",
            stock
        );

        formData.append(
            "category",
            category
        );

        if (image) {
            formData.append(
                "product_image",
                image
            );
        }

        updateMutation.mutate({
            productId: product.id,
            formData,
        });
    };

    // ==========================================
    // Modal
    // ==========================================

    if (!open) {
        return null;
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="edit-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {/* Header */}

                <div className="modal-header">
                    <h2>
                        Edit Product
                    </h2>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}

                <EditProductForm
                    name={name}
                    description={description}
                    price={price}
                    priceAfter={priceAfter}
                    stock={stock}
                    category={category}
                    image={image}
                    preview={preview}
                    isPending={
                        updateMutation.isPending
                    }
                    onNameChange={setName}
                    onDescriptionChange={
                        setDescription
                    }
                    onPriceChange={setPrice}
                    onPriceAfterChange={
                        setPriceAfter
                    }
                    onStockChange={setStock}
                    onCategoryChange={
                        setCategory
                    }
                    onImageChange={setImage}
                    onSubmit={submitHandler}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}