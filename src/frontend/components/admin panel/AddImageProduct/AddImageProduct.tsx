"use client";

import { useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

import "./AddImageProduct.css";


interface Props {

    open:boolean;

    onClose:()=>void;

    productId:number;

    refreshImages:()=>void;

}



export default function AddProductImageModal({

    open,

    onClose,

    productId,

    refreshImages

}:Props){


    const [image,setImage] = useState<File | null>(null);

    const [title,setTitle] = useState("");

    const [description,setDescription] = useState("");

    const [loading,setLoading] = useState(false);



    if(!open){

        return null;

    }



    async function handleSubmit(){


        if(!image){

            return;

        }



        const formData = new FormData();


        formData.append(
            "product_image",
            image
        );


        formData.append(
            "title",
            title
        );


        formData.append(
            "description",
            description
        );



        try{


            setLoading(true);



            await axios.post(

                `${BACKEND_URLS}vendor/api/v1/add/image/product/${productId}/`,

                formData,

                {

                    withCredentials:true,

                    headers:{

                        "Content-Type":"multipart/form-data"

                    }

                }

            );



            refreshImages();

            onClose();



        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }



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

                    onChange={(e)=>

                        setImage(
                            e.target.files?.[0] ?? null
                        )

                    }

                />



                <input

                    placeholder="Title"

                    value={title}

                    onChange={(e)=>

                        setTitle(e.target.value)

                    }

                />



                <textarea

                    placeholder="Description"

                    value={description}

                    onChange={(e)=>

                        setDescription(e.target.value)

                    }

                />



                <div>


                    <button

                        onClick={handleSubmit}

                        disabled={loading}

                    >

                        {
                            loading
                            ?
                            "Uploading..."
                            :
                            "Upload"
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