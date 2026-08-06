"use client";


import {useState} from "react";


import StoreCategoryList from "../StoreCategoryList/StoreCategoryList";

import StoreSlider from "../StoreSlider/StoreSlider";

import "./StoreExplore.css";



export default function StoreExplorer(){


    const [categoryId,setCategoryId]=useState<number|null>(null);



    return (

        <section className="store-explorer">


            <StoreCategoryList

    onSelectCategory={(id)=>{


        if(categoryId === id){

   
            setCategoryId(null);

        }
        else{

        
            setCategoryId(id);

        }


    }}

/>



            {

                categoryId && (

                    <StoreSlider

                        categoryId={categoryId}

                    />

                )

            }


        </section>

    )


}