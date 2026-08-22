"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { createProduct } from "@/services/shop-admin-panel.services";
import "./AddProduct.css";

export default function AddProduct() {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [priceAfter, setPriceAfter] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const createProductMutation = useMutation({
        mutationFn: (formData: FormData) =>
            createProduct(formData),

        onSuccess: () => {
            alert("Product created successfully.");

            setName("");
            setDescription("");
            setPrice("");
            setPriceAfter("");
            setStock("");
            setCategory("");
            setImage(null);
        },

        onError: (error) => {
            console.error("Create product error:", error);

            alert("Something went wrong.");
        },
    });

    const submitHandler = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        const productPrice = Number(price);
        const productPriceAfter = Number(priceAfter);
        const productStock = Number(stock);
        const productCategory = Number(category);

        // ==========================================
        // Validation
        // ==========================================

        if (!trimmedName) {
            alert("Product name is required.");
            return;
        }

        if (trimmedName.length < 3) {
            alert("Product name must be at least 3 characters.");
            return;
        }

        if (!trimmedDescription) {
            alert("Product description is required.");
            return;
        }

        if (Number.isNaN(productPrice) || productPrice <= 0) {
            alert("Price must be greater than 0.");
            return;
        }

        if (
            Number.isNaN(productPriceAfter) ||
            productPriceAfter <= 0
        ) {
            alert("Sale price must be greater than 0.");
            return;
        }

        if (productPriceAfter > productPrice) {
            alert(
                "Sale price cannot be greater than the original price."
            );
            return;
        }

        if (
            Number.isNaN(productStock) ||
            productStock < 0
        ) {
            alert("Stock cannot be negative.");
            return;
        }

        if (!Number.isInteger(productStock)) {
            alert("Stock must be a whole number.");
            return;
        }

        if (
            Number.isNaN(productCategory) ||
            productCategory <= 0
        ) {
            alert("Category is required.");
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

        createProductMutation.mutate(formData);
    };
    return (

        <div className="create-product">

            <div className="create-header">

                <h1>Create Product</h1>

                <p>Add a new product to your shop</p>

            </div>

            <form
                className="create-form"
                onSubmit={submitHandler}
            >

                <div className="form-group">

                    <label>Product Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                </div>

                <div className="form-group">

                    <label>Description</label>

                    <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </div>

                <div className="grid-2">

                    <div className="form-group">

                        <label>Price</label>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                    </div>

                    <div className="form-group">

                        <label>Sale Price</label>

                        <input
                            type="number"
                            value={priceAfter}
                            onChange={(e) => setPriceAfter(e.target.value)}
                        />

                    </div>

                </div>

                <div className="grid-2">

                    <div className="form-group">

                        <label>Stock</label>

                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />

                    </div>

                    <div className="form-group">

                        <label>Category</label>

                        <input
                            type="number"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />

                    </div>

                </div>

                <div className="form-group">

                    <label>Product Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {

                            if (!e.target.files) return;

                            setImage(e.target.files[0]);

                        }}
                    />

                </div>

                {
                    image &&
                    <div className="preview">

                        <img
                            src={URL.createObjectURL(image)}
                            alt=""
                        />

                    </div>
                }

                <button
                    type="submit"
                    className="create-btn"
                    disabled={createProductMutation.isPending}
                >
                    {createProductMutation.isPending
                        ? "Creating..."
                        : "Create Product"
                    }
                </button>

            </form>

        </div>

    );

}