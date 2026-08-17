"use client";

import ProductRating from "@/components/shop/ProductRating/ProductRating";
import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import Link from "next/link";
import ProductOrderBox from "../ProductOrderBox/ProductOrderBox";
import useCheckMe from "@/hooks/Checkme";
import SessionProductOrderBox from "../SessionProductOrderBox/SessionProductOrderBox";

import {
  Star,
  ShieldCheck,
  Truck,
} from "lucide-react";

import "./ProductDetail.css";


interface Props {
  productId:string;
}



interface Product {

  id:number;

  name:string;

  description:string;

  quantity_in_stock:number;

  price:number;

  price_after:number;

  product_image:string | null;

  category:number;

  store:number;

}



interface ProductImage {

  id:number;

  product_image:string;

  title:string | null;

  description:string | null;

  product:number;

}





export default function ProductDetail({

  productId

}:Props){


  const [product,setProduct] = useState<Product | null>(null);


  const [images,setImages] = useState<string[]>([]);


  const [activeImage,setActiveImage] = useState<string | null>(null);


  const isAuthenticated = useCheckMe();





  function fixImageUrl(image:string | null){


    if(!image){

      return null;

    }


    if(image.startsWith("http")){

      return image;

    }


    return `http://localhost:8000${image}`;


  }






  useEffect(()=>{


    async function fetchData(){


      try{


        const {data:productData}=await axios.get<Product>(

          `${BACKEND_URLS}website/api/v1/product/detail/${productId}`,

          {
            withCredentials:true
          }

        );



        setProduct(productData);






        const {data:imageData}=await axios.get<ProductImage[]>(

          `${BACKEND_URLS}website/api/v1/list/image/product/${productId}/`

        );






        const galleryImages = [


          fixImageUrl(productData.product_image),


          ...imageData.map(

            item=>fixImageUrl(item.product_image)

          )


        ]

        .filter(Boolean) as string[];






        console.log("Gallery Images:",galleryImages);




        setImages(galleryImages);



        if(galleryImages.length > 0){

          setActiveImage(galleryImages[0]);

        }





      }

      catch(error){

        console.error(error);

      }


    }





    fetchData();



  },[productId]);







  if(!product){

    return (

      <h2>

        Loading...

      </h2>

    );

  }







  return (

    <section className="product-detail container">





      {/* Gallery */}

      <div className="gallery">



        <div className="thumbnail-list">


          {

            images.map((img,index)=>(


              <div


                key={index}


                className={

                  `thumbnail ${
                    activeImage === img
                    ?
                    "active"
                    :
                    ""
                  }`

                }



                onClick={()=>setActiveImage(img)}



              >


                <img

                  src={img}

                  alt={product.name}

                />


              </div>


            ))

          }



        </div>







        <div className="main-image">


          {

            activeImage &&

            (

              <img

                src={activeImage}

                alt={product.name}

              />

            )


          }



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

            0.0

          </span>


        </div>






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


          In Stock :

          {" "}

          {product.quantity_in_stock}



        </div>







        {

          isAuthenticated === null

          ?

          (

            <div>

              Loading...

            </div>

          )



          :

          isAuthenticated


          ?

          (<>
         

            <ProductOrderBox

              productId={product.id}

            />


    <Link
      href={`/chatbox/${product.store}`}
      className="chat-link"
    >
      Chat with seller
    </Link>
    </>
          )



          :



          (

            <SessionProductOrderBox

              productId={product.id}

            />

          )



        }








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








        <ProductRating


          productId={product.id}


          isAuthenticated={isAuthenticated??false}



        />





      </div>






    </section>

  );

}