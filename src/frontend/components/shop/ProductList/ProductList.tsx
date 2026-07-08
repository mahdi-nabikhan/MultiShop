import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

interface ProductListProps {
  shopId: string;
}

export default function ProductList({ shopId }: ProductListProps) {
  // بعداً از API دریافت می‌شود
  const products = [
    {
      id: 1,
      name: "iPhone 16 Pro",
      price: 1200,
      image: "/images/products/iphone.jpg",
      stock: 12,
    },
    {
      id: 2,
      name: "MacBook Pro M4",
      price: 2400,
      image: "/images/products/macbook.jpg",
      stock: 5,
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: 280,
      image: "/images/products/airpods.jpg",
      stock: 30,
    },
    {
      id: 4,
      name: "Apple Watch",
      price: 450,
      image: "/images/products/watch.jpg",
      stock: 8,
    },
  ];

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