"use client";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import BACKEND_URLS from "@/utils";


interface Props {
    filters?: Record<string, any>;
}


export default function ProductList({
    filters = {},
}: Props) {


    const {
        data: products,
        isLoading,
        isError,

    } = useQuery({

        queryKey: [
            "products",
            filters
        ],


        queryFn: async()=>{

            const response = await axios.get(
                `${BACKEND_URLS}website/api/v1/product/filtering/`,
                {
                    params: filters,
                    withCredentials:true,
                }
            );


            return response.data;

        }

    });



    if(isLoading)
        return (
            <div>
                Loading products...
            </div>
        );



    if(isError)
        return (
            <div>
                Error loading products
            </div>
        );



    return (

        <div className="product-grid">


            {
                products?.map((product:any)=>(

                    <div
                        key={product.id}
                        className="product-card"
                    >


                        <img
                            src={product.product_image}
                            alt={product.name}
                        />


                        <h3>
                            {product.name}
                        </h3>


                        <p>
                            {product.description}
                        </p>


                        <div>

                            {
                                product.price_after
                                ?
                                product.price_after
                                :
                                product.price
                            }

                        </div>


                    </div>

                ))
            }


        </div>

    );

}