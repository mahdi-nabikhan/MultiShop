"use client";

import { useEffect, useState } from "react";

import {
    getStoresByCategory,
    CategoryStore
} from "@/services/shop.services";

import "./StoreSlider.css";


interface Props {

    categoryId: number;

}


export default function StoreSlider({

    categoryId

}: Props) {


    const [stores, setStores] =
        useState<CategoryStore[]>([]);


    const GetStores = async () => {

        try {

            const data =
                await getStoresByCategory(categoryId);

            setStores(data);

        }

        catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        GetStores();

    }, [categoryId]);


    return (

        <section className="store-slider">


            <h2>

                Stores

            </h2>


            <div className="store-row">


                {

                    stores.map(store => (

                        <div

                            className="store-card"

                            key={store.id}

                        >


                            {

                                store.logo &&

                                <img

                                    src={store.logo}

                                    alt={store.name}

                                />

                            }


                            <h3>

                                {store.name}

                            </h3>


                            <button>

                                Visit Store

                            </button>


                        </div>

                    ))

                }


            </div>


        </section>

    );

}