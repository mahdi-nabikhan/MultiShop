"use client";

import { useState } from "react";
import Image from "next/image";


import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Truck,
} from "lucide-react";

import "./ProductDetail.css";


interface Props {
  storeId: string;
  productId: string;
}


export default function ProductDetail({
  storeId,
  productId,
}: Props) {


  // بعداً از API دریافت میشه
  const product = {
    id: productId,
    storeId,

    name: "iPhone 16 Pro Max",

    originalPrice: 1299,
    finalPrice: 1199,

    rating: 4.9,

    stock: 18,

    description:
      "The latest Apple flagship with A18 Pro chip and advanced camera system.",


    images: [
      "/images/products/iphone1.jpg",
      "/images/products/iphone2.jpg",
      "/images/products/iphone3.jpg",
      "/images/products/iphone4.jpg",
    ],


    specifications: [
      {
        title: "Brand",
        value: "Apple",
      },

      {
        title: "Storage",
        value: "256 GB",
      },

      {
        title: "Color",
        value: "Natural Titanium",
      },

      {
        title: "Warranty",
        value: "18 Months",
      },
    ],
  };


  const [activeImage, setActiveImage] = useState(
    product.images[0]
  );


  const [quantity, setQuantity] = useState(1);



  return (

    <section className="product-detail container">


      {/* Gallery */}

      <div className="gallery">


        <div className="thumbnail-list">

          {product.images.map((img, index) => (

            <div
              key={index}
              className={
                `thumbnail ${
                  activeImage === img ? "active" : ""
                }`
              }

              onClick={() =>
                setActiveImage(img)
              }

            >

              <Image
                src={img}
                alt={product.name}
                width={90}
                height={90}
              />

            </div>

          ))}


        </div>



        <div className="main-image">


          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
          />


        </div>


      </div>




      {/* Product Info */}


      <div className="info">


        <h1>
          {product.name}
        </h1>



        <div className="rating">


          <Star
            fill="#FFD700"
            stroke="#FFD700"
            size={18}
          />


          <span>
            {product.rating}
          </span>


        </div>





        <div className="price-box">


          <span className="old-price">

            ${product.originalPrice}

          </span>



          <span className="new-price">

            ${product.finalPrice}

          </span>


        </div>






        <p className="description">

          {product.description}

        </p>






        <div className="stock">

          In Stock : {product.stock}

        </div>







        {/* Quantity */}


        <div className="quantity">


          <button
            onClick={() =>
              quantity > 1 &&
              setQuantity(quantity - 1)
            }
          >

            <Minus size={18}/>

          </button>





          <span>

            {quantity}

          </span>





          <button
            onClick={() =>
              quantity < product.stock &&
              setQuantity(quantity + 1)
            }
          >

            <Plus size={18}/>

          </button>



        </div>






        <button className="cart-btn">

          <ShoppingCart size={20}/>

          Add To Cart

        </button>







        {/* Features */}


        <div className="features">


          <div>

            <Truck size={18}/>

            Free Shipping

          </div>




          <div>

            <ShieldCheck size={18}/>

            Warranty Included

          </div>


        </div>







        {/* Specifications */}


        <div className="specifications">


          <h3>

            Specifications

          </h3>




          {product.specifications.map((item)=>(


            <div
              key={item.title}
              className="spec-row"
            >


              <span>

                {item.title}

              </span>



              <strong>

                {item.value}

              </strong>



            </div>


          ))}



        </div>



      </div>



    </section>

  );

}