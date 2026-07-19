"use client";

import { useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./AddProduct.css";

export default function AddProduct() {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [priceAfter, setPriceAfter] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("price_after", priceAfter);
            formData.append("quantity_in_stock", stock);
            formData.append("category", category);

            if (image) {
                formData.append("product_image", image);
            }

            await axios.post(
                `${BACKEND_URLS}vendor/api/v1/add/product/`,
                formData,
                {
                    withCredentials: true,
                }
            );

            alert("Product created successfully.");

            setName("");
            setDescription("");
            setPrice("");
            setPriceAfter("");
            setStock("");
            setCategory("");
            setImage(null);

        } catch (err) {

            console.log(err);
            alert("Something went wrong.");

        } finally {

            setLoading(false);

        }

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
                    className="create-btn"
                    disabled={loading}
                >
                    {
                        loading
                            ? "Creating..."
                            : "Create Product"
                    }
                </button>

            </form>

        </div>

    );

}