"use client";

import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "@/services/product.services";
interface ProductListProps {

  shopId: string;

}







export default  function ProductList({

  shopId

}: ProductListProps) {


  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["store-products", shopId],
    queryFn: () => getStoreProducts(shopId),
  });





  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Error loading products.</p>;
  }







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
          products.map((product) => (

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