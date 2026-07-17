"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import BACKEND_URLS from "@/utils";

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
  productId: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  quantity_in_stock: number;
  price: number;
  price_after: number;
  image_product: string | null;
  category: number;
  store: number;
}

export default function ProductDetail({ productId }: Props) {
  const [product, setProduct] = useState<Product | null>(null);

  // فعلاً تصاویر ثابت
  const images = [
    "/images/products/iphone1.jpg",
    "/images/products/iphone2.jpg",
    "/images/products/iphone3.jpg",
    "/images/products/iphone4.jpg",
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URLS}website/api/v1/product/detail/${productId}`,
          {
            withCredentials: true,
          }
        );

        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <section className="product-detail container">

      {/* Gallery */}
      <div className="gallery">
        <div className="thumbnail-list">
          {images.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${
                activeImage === img ? "active" : ""
              }`}
              onClick={() => setActiveImage(img)}
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
            sizes="(max-width:768px) 100vw, 500px"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="info">

        <h1>{product.name}</h1>

        <div className="rating">
          <Star
            fill="#FFD700"
            stroke="#FFD700"
            size={18}
          />
          <span>0.0</span>
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
          In Stock : {product.quantity_in_stock}
        </div>

        <div className="quantity">
          <button
            onClick={() =>
              quantity > 1 &&
              setQuantity(quantity - 1)
            }
          >
            <Minus size={18} />
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              quantity < product.quantity_in_stock &&
              setQuantity(quantity + 1)
            }
          >
            <Plus size={18} />
          </button>
        </div>

        <button className="cart-btn">
          <ShoppingCart size={20} />
          Add To Cart
        </button>

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

      </div>
    </section>
  );
}