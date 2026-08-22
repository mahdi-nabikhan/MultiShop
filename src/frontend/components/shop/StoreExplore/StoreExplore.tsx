"use client";

import { useState } from "react";

import StoreCategoryList from "../StoreCategoryList/StoreCategoryList";
import StoreSlider from "../StoreSlider/StoreSlider";

import "./StoreExplore.css";


export default function StoreExplorer() {

    const [categoryId, setCategoryId] =
        useState<number | null>(null);


    const handleCategorySelect = (
        id: number
    ) => {

        setCategoryId(
            prev =>
                prev === id
                    ? null
                    : id
        );

    };


    return (

        <section className="store-explorer">


            <StoreCategoryList

                onSelectCategory={
                    handleCategorySelect
                }

            />


            {categoryId !== null && (

                <StoreSlider

                    categoryId={categoryId}

                />

            )}


        </section>

    );

}