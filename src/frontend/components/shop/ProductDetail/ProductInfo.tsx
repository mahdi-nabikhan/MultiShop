"use client";

import {
    ShieldCheck,
    Star,
    Truck,
} from "lucide-react";

import ProductRating from "@/components/shop/ProductRating/ProductRating";

import ProductPurchase from "./ProductPurchase";


interface ProductInfoProps {
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        price_after: number;
        quantity_in_stock: number;
        store: number;
    };

    isAuthenticated: boolean | null;
}



export default function ProductInfo({
    product,
    isAuthenticated,
}: ProductInfoProps) {


    return (

        <div className="info">


            <h1>
                {product.name}
            </h1>




            <div className="price-box">

                <span className="old-price">
                    ${product.price}
                </span>


                <span className="new-price">
                    ${product.price_after}
                </span>


            </div>





            <p className="description">

                {product.description}

            </p>




            <div className="stock">

                In Stock:{" "}
                {product.quantity_in_stock}

            </div>





            <ProductPurchase

                productId={product.id}

                storeId={product.store}

                isAuthenticated={
                    isAuthenticated
                }

            />





            <div className="features">


                <div>

                    <Truck size={18} />

                    Free Shipping

                </div>



                <div>

                    <ShieldCheck size={18} />

                    Warranty Included

                </div>


            </div>





            <ProductRating

                productId={product.id}

                isAuthenticated={
                    isAuthenticated ?? false
                }

            />


        </div>

    );
}