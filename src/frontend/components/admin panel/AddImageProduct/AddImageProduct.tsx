"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductImage } from "@/services/shop-admin-panel.services";

import "./AddImageProduct.css";


interface Props {

    open: boolean;

    onClose: () => void;

    productId: number;

    refreshImages: () => void;

}



export default function AddProductImageModal({

    open,

    onClose,

    productId,

    refreshImages

}: Props) {


    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();

    const createImageMutation = useMutation({
        mutationFn: (formData: FormData) =>
            createProductImage(productId, formData),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["product-images", productId],
            });

            setImage(null);
            setTitle("");
            setDescription("");

            onClose();
        },

        onError: (error) => {

            console.error(
                "Image upload error:",
                error
            );

            alert("Failed to upload image.");
        },
    });
    const handleSubmit = () => {

        if (!image) {
            alert("Please select an image.");
            return;
        }

        if (!image.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (image.size > 5 * 1024 * 1024) {
            alert("Image size cannot exceed 5MB.");
            return;
        }

        if (!title.trim()) {
            alert("Title is required.");
            return;
        }

        if (title.trim().length < 3) {
            alert("Title must be at least 3 characters.");
            return;
        }

        if (title.trim().length > 200) {
            alert("Title cannot exceed 200 characters.");
            return;
        }

        if (description.trim().length > 1000) {
            alert(
                "Description cannot exceed 1000 characters."
            );
            return;
        }

        const formData = new FormData();

        formData.append(
            "product_image",
            image
        );

        formData.append(
            "title",
            title.trim()
        );

        formData.append(
            "description",
            description.trim()
        );

        createImageMutation.mutate(formData);
    };


    if (!open) {

        return null;

    }








    return (

        <div className="image-modal-overlay">


            <div className="image-modal">


                <h2>

                    Add Product Image

                </h2>



                <input

                    type="file"

                    accept="image/*"

                    onChange={(e) =>

                        setImage(
                            e.target.files?.[0] ?? null
                        )

                    }

                />



                <input

                    placeholder="Title"

                    value={title}

                    onChange={(e) =>

                        setTitle(e.target.value)

                    }

                />



                <textarea

                    placeholder="Description"

                    value={description}

                    onChange={(e) =>

                        setDescription(e.target.value)

                    }

                />



                <div>


                    <button
                        onClick={handleSubmit}
                        disabled={createImageMutation.isPending}
                    >
                        {createImageMutation.isPending
                            ? "Uploading..."
                            : "Upload"
                        }
                    </button>

                    <button

                        onClick={onClose}

                    >

                        Cancel

                    </button>


                </div>



            </div>


        </div>

    );

}