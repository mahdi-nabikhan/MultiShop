import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";
import BACKEND_URLS from "@/utils";

interface ProductListProps {
  shopId: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  quantity_in_stock: number;
  price: number;
  price_after: number;
  image: string | null;
  category: number;
  store: number;
  
}

export default async function ProductList({ shopId }: ProductListProps) {


  const { data: products } = await axios.get<Product[]>(
    `${BACKEND_URLS}website/api/v1/product/list/${shopId}`
  );
  return (
    <section className="product-list container">
      <div className="product-list-header">
        <div>
          <h2>Store Products</h2>
          <p>Showing all products of this store</p>
        </div>

        <span>{products.length} Products</span>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            shopId={shopId}
          />
        ))}
      </div>
    </section>
  );
}