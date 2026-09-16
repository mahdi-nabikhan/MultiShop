"use client";

import Link from "next/link";

import Skeleton from "@/components/commen/Skeleton";

import ProductOrderBox from "../ProductOrderBox/ProductOrderBox";
import SessionProductOrderBox from "../SessionProductOrderBox/SessionProductOrderBox";



interface ProductPurchaseProps {
    productId: number;
    storeId: number;
    isAuthenticated: boolean | null;
}



export default function ProductPurchase({

    productId,

    storeId,

    isAuthenticated,

}: ProductPurchaseProps) {



    if (isAuthenticated === null) {

        return (
            <Skeleton count={1} />
        );

    }




    if (!isAuthenticated) {

        return (

            <SessionProductOrderBox

                productId={productId}

            />

        );

    }





    return (

        <div className="product-purchase">


            <ProductOrderBox

                productId={productId}

            />



            <Link

                href={`/chatbox/${storeId}`}

                className="chat-link"

            >

                Chat with seller

            </Link>


        </div>

    );

}