"use client";

import { useState } from "react";

import useCreateProduct from "@/hooks/admin-panel/useCreateProduct";

import ProductForm from "./ProductForm";

import "./AddProduct.css";

export default function AddProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");
    const [price, setPrice] = useState("");
    const [priceAfter, setPriceAfter] =
        useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] =
        useState<File | null>(null);

    const createProductMutation =
        useCreateProduct();

    const submitHandler = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const trimmedName =
            name.trim();

        const trimmedDescription =
            description.trim();

        const productPrice =
            Number(price);

        const productPriceAfter =
            Number(priceAfter);

        const productStock =
            Number(stock);

        const productCategory =
            Number(category);

        // ==========================================
        // Validation
        // ==========================================

        if (!trimmedName) {
            alert(
                "Product name is required."
            );
            return;
        }

        if (trimmedName.length < 3) {
            alert(
                "Product name must be at least 3 characters."
            );
            return;
        }

        if (!trimmedDescription) {
            alert(
                "Product description is required."
            );
            return;
        }

        if (
            Number.isNaN(productPrice) ||
            productPrice <= 0
        ) {
            alert(
                "Price must be greater than 0."
            );
            return;
        }

        if (
            Number.isNaN(productPriceAfter) ||
            productPriceAfter <= 0
        ) {
            alert(
                "Sale price must be greater than 0."
            );
            return;
        }

        if (
            productPriceAfter >
            productPrice
        ) {
            alert(
                "Sale price cannot be greater than the original price."
            );
            return;
        }

        if (
            Number.isNaN(productStock) ||
            productStock < 0
        ) {
            alert(
                "Stock cannot be negative."
            );
            return;
        }

        if (!Number.isInteger(productStock)) {
            alert(
                "Stock must be a whole number."
            );
            return;
        }

        if (
            Number.isNaN(productCategory) ||
            productCategory <= 0
        ) {
            alert(
                "Category is required."
            );
            return;
        }

        // ==========================================
        // Form Data
        // ==========================================

        const formData = new FormData();

        formData.append(
            "name",
            trimmedName
        );

        formData.append(
            "description",
            trimmedDescription
        );

        formData.append(
            "price",
            String(productPrice)
        );

        formData.append(
            "price_after",
            String(productPriceAfter)
        );

        formData.append(
            "quantity_in_stock",
            String(productStock)
        );

        formData.append(
            "category",
            String(productCategory)
        );

        if (image) {
            formData.append(
                "product_image",
                image
            );
        }

        // ==========================================
        // Mutation
        // ==========================================

        createProductMutation.mutate(
            formData
        );
    };

    return (
        <div className="create-product">
            <div className="create-header">
                <h1>Create Product</h1>

                <p>
                    Add a new product to your shop
                </p>
            </div>

            <ProductForm
                name={name}
                description={description}
                price={price}
                priceAfter={priceAfter}
                stock={stock}
                category={category}
                image={image}
                isPending={
                    createProductMutation.isPending
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
                onCategoryChange={setCategory}
                onImageChange={setImage}
                onSubmit={submitHandler}
            />
        </div>
    );
}