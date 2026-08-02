import Image from "next/image";
import Link from "next/link";

import { Star, ShoppingCart } from "lucide-react";

import "./ProductCard.css";


export interface Product {

  id: number;

  name: string;

  description: string;

  quantity_in_stock: number;

  price: number;

  price_after: number;

  product_image: string | null;

  category: number;

  store: number;

}



interface Props {

  product: Product;

  shopId: string;

}



export default function ProductCard({

  product,

  shopId

}: Props) {


  return (

    <Link

      href={`/store/${shopId}/product/${product.id}`}

      className="product-card"

    >


      <div className="product-image">


        <img

          src={
            product.product_image
              ?
              product.product_image
              :
              "/images/no-image.png"
          }

          alt={product.name}

        />


        {
          product.quantity_in_stock === 0 && (

            <span className="out-stock">

              Out Of Stock

            </span>

          )
        }


      </div>



      <div className="product-content">


        <h3>

          {product.name}

        </h3>



        <div className="rating">


          <Star

            size={16}

            fill="#FFD700"

            stroke="#FFD700"

          />


          <span>

            4.9

          </span>


        </div>



        <div className="price">

          ${product.price_after}

        </div>



        <button>

          <ShoppingCart size={18} />

          Add To Cart

        </button>


      </div>


    </Link>

  );

}