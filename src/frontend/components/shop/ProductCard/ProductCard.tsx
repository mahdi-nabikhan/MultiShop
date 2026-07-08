import Image from "next/image";
import Link from "next/link";

import { Star, ShoppingCart } from "lucide-react";

import "./ProductCard.css";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  shopId: string;
}

export default function ProductCard({
  product,
  shopId,
}: ProductCardProps) {
  return (
    <Link
      href={`/store/${shopId}/product/${product.id}`}
      className="product-card"
    >
      <div className="product-image">

        <Image
          src={product.image}
          alt={product.name}
          fill
        />

        {product.stock === 0 && (
          <span className="out-stock">
            Out Of Stock
          </span>
        )}

      </div>

      <div className="product-content">

        <h3>{product.name}</h3>

        <div className="rating">

          <Star
            size={16}
            fill="#FFD700"
            stroke="#FFD700"
          />

          <span>4.9</span>

        </div>

        <div className="price">

          ${product.price}

        </div>

        <button>

          <ShoppingCart size={18} />

          Add To Cart

        </button>

      </div>
    </Link>
  );
}