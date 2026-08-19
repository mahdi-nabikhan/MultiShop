
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

import { cookies } from "next/headers";
import { getStoreProducts,Product } from "@/services/product.services";

interface ProductListProps {

  shopId:string;

}







export default async function ProductList({

  shopId

}:ProductListProps){


  const cookieStore = await cookies();

  const token = cookieStore.get("access")?.value;



  const headers:Record<string,string> = {};



  if(token){

    headers.Authorization = `Bearer ${token}`;

  }



  const  products = await getStoreProducts(shopId, headers);



  return (

    <section className="product-list container">


      <div className="product-list-header">

        <div>

          <h2>
            Store Products
          </h2>


          <p>
            Showing all products of this store
          </p>


        </div>


        <span>
          {products.length} Products
        </span>


      </div>



      <div className="products-grid">


        {
          products.map((product)=>(

            <ProductCard

              key={product.id}

              product={product}

              shopId={shopId}

            />

          ))
        }


      </div>


    </section>

  );

}