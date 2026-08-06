"use client";


import {useEffect,useState} from "react";

import axios from "axios";


import BACKEND_URLS from "@/utils";


import "./StoreSlider.css";


interface Store {


    id:number;

    name:string;

    slug:string;

    logo:string|null;


}



interface Props{

    categoryId:number;

}



export default function StoreSlider({

    categoryId

}:Props){



    const [stores,setStores]=useState<Store[]>([]);



    const GetStores=async()=>{


        try{


            const {data}=await axios.get<Store[]>(

                `${BACKEND_URLS}vendor/api/v1/list/category/store/${categoryId}/`

            );


            setStores(data);


        }
        catch(error){

            console.log(error);

        }


    };




    useEffect(()=>{


        GetStores();


    },[categoryId]);





    return (

        <section className="store-slider">


            <h2>

                Stores

            </h2>



            <div className="store-row">


                {

                    stores.map(store=>(


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

    )


}