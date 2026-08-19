"use client";

import { useEffect, useState } from "react";

import {
    getStoreCategories,
    StoreCategory
} from "@/services/shop.services";

import "./StoreCategoryList.css";


interface Props {

    onSelectCategory: (id: number) => void;

}


export default function StoreCategoryList({

    onSelectCategory

}: Props) {


    const [categories, setCategories] =
        useState<StoreCategory[]>([]);

    const [loading, setLoading] =
        useState(true);


    const GetCategories = async () => {

        try {

            const data =
                await getStoreCategories();

            setCategories(data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        GetCategories();

    }, []);


    if (loading) {

        return (
            <div>
                Loading Categories...
            </div>
        );

    }


    return (

        <section className="store-category-list">


            <h2>
                Store Categories
            </h2>


            <div className="category-grid">


                {

                    categories.map((category) => (

                        <div

                            key={category.id}

                            className="category-card"

                            onClick={() => {

                                onSelectCategory(
                                    category.id
                                );

                            }}

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