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

    const [price, setPrice] =
        useState("");

    const [priceAfter, setPriceAfter] =
        useState("");

    const [stock, setStock] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [image, setImage] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState("");


    const queryClient =
        useQueryClient();



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


            queryClient.invalidateQueries({

                queryKey: [
                    "shop-admin",
                    "product",
                    product.id,
                ],

            });


            handleClose();

        },


        onError: (err) => {

            console.error(
                "Update product error:",
                err
            );

        },

    });




    useEffect(() => {

        if (!product) {
            return;
        }


        setName(
            product.name
        );


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





    const handleClose = () => {

        setImage(null);

        onClose();

    };





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




        if (!trimmedName) {

            alert(
                "Product name is required."
            );

            return;

        }



        if (!trimmedDescription) {

            alert(
                "Description is required."
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
                "Sale price cannot be greater than price."
            );

            return;

        }



        if (
            Number.isNaN(productStock) ||
            productStock < 0
        ) {

            alert(
                "Stock is invalid."
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




        const formData =
            new FormData();



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



        updateMutation.mutate({

            productId: product.id,

            formData,

        });

    };





    if (!open) {

        return null;

    }





    return (

        <div
            className="modal-overlay"
            onClick={handleClose}
        >

            <div

                className="edit-modal"

                onClick={(e) =>
                    e.stopPropagation()
                }

            >


                <div className="modal-header">

                    <h2>
                        Edit Product
                    </h2>


                    <button

                        type="button"

                        className="close-btn"

                        onClick={handleClose}

                    >
                        ✕
                    </button>


                </div>




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

                    onPriceChange={
                        setPrice
                    }

                    onPriceAfterChange={
                        setPriceAfter
                    }

                    onStockChange={
                        setStock
                    }

                    onCategoryChange={
                        setCategory
                    }

                    onImageChange={
                        setImage
                    }

                    onSubmit={
                        submitHandler
                    }

                    onCancel={
                        handleClose
                    }

                />


            </div>


        </div>

    );

}