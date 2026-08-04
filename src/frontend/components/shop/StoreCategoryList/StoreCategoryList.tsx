"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import "./StoreCategoryList.css";

import BACKEND_URLS from "@/utils";


interface StoreCategory {

    id: number;

    name: string;

    slug: string;

    icon: string;

}



export default function StoreCategoryList() {


    const [categories, setCategories] = useState<StoreCategory[]>([]);


    const [loading, setLoading] = useState(true);



    const GetStoreCategories = async () => {


        try {


            const { data } = await axios.get<StoreCategory[]>(

                `${BACKEND_URLS}vendor/api/v1/store/category/`

            );


            setCategories(data);


        }


        catch(error) {


            console.log(error);


        }


        finally {


            setLoading(false);


        }


    };




    useEffect(()=>{


        GetStoreCategories();


    },[]);





    if(loading){


        return (

            <div className="category-loading">

                Loading Categories...

            </div>

        )

    }





    return (


        <section className="store-category-list">


            <h2 className="category-title">

                Store Categories

            </h2>




            <div className="category-grid">


                {

                    categories.map((category)=>(


                        <div

                            key={category.id}

                            className="category-card"

                        >


                            <div

                                className="category-icon"

                                dangerouslySetInnerHTML={{

                                    __html: category.icon

                                }}

                            />



                            <h3>

                                {category.name}

                            </h3>



                        </div>



                    ))

                }


            </div>



        </section>


    );


}