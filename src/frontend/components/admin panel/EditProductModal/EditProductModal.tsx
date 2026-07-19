"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./EditProductModal.css";

interface Product {
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

interface Props {
    open: boolean;
    onClose: () => void;
    product: Product;
    refreshProduct: () => Promise<void>;
}

export default function EditProductModal({
    open,
    onClose,
    product,
    refreshProduct,
}: Props) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [price, setPrice] = useState("");
    const [priceAfter, setPriceAfter] = useState("");

    const [stock, setStock] = useState("");

    const [category, setCategory] = useState("");

    const [image, setImage] = useState<File | null>(null);

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!product) return;

        setName(product.name);
        setDescription(product.description);

        setPrice(product.price.toString());
        setPriceAfter(product.price_after.toString());

        setStock(product.quantity_in_stock.toString());

        setCategory(product.category.toString());

        setPreview(product.product_image || "/no-image.png");

        setImage(null);

    }, [product]);


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

            await axios.patch(
                `${BACKEND_URLS}vendor/api/v1/detail/product/${product.id}/`,
                formData,
                {
                    withCredentials: true,
                }
            );

            await refreshProduct();

            onClose();

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

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
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h2>Edit Product</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <form className="edit-form" 
                onSubmit={submitHandler}>

                    <div className="image-preview">

                        <img
                            src={
                                image
                                    ? URL.createObjectURL(image)
                                    : preview
                            }
                            alt=""
                        />

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
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>

                    <div className="grid-2">

                        <div className="form-group">

                            <label>Price</label>

                            <input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>Sale Price</label>

                            <input
                                type="number"
                                value={priceAfter}
                                onChange={(e) =>
                                    setPriceAfter(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="grid-2">

                        <div className="form-group">

                            <label>Stock</label>

                            <input
                                type="number"
                                value={stock}
                                onChange={(e) =>
                                    setStock(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>Category</label>

                            <input
                                type="number"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Saving..."
                                    : "Save Changes"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}