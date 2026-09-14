"use client";

import type { ShopProductData } from "@/types/panel-admin";

import ProductActions from "./ProductActions";

import "./ProductInfo.css";

interface ProductInfoProps {
    product: ShopProductData;
    onEdit: () => void;
    onAddDiscount: () => void;
    onDelete: () => void;
    onAddImage: () => void;
}

function ProductInfo({
    product,
    onEdit,
    onAddDiscount,
    onDelete,
    onAddImage,
}: ProductInfoProps) {
    const stock = product.quantity_in_stock;

    return (
        <div className="info-card">
            <div className="card-header">
                <h2>
                    {product.name}
                </h2>

                <span
                    className={
                        stock > 0
                            ? "status in-stock"
                            : "status out-stock"
                    }
                >
                    {stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                </span>
            </div>

            <div className="info-grid">
                <div className="info-item">
                    <span>
                        Product ID
                    </span>

                    <strong>
                        #{product.id}
                    </strong>
                </div>

                <div className="info-item">
                    <span>
                        Category
                    </span>

                    <strong>
                        {product.category}
                    </strong>
                </div>

                <div className="info-item">
                    <span>
                        Price
                    </span>

                    <strong>
                        ${product.price}
                    </strong>
                </div>

                <div className="info-item">
                    <span>
                        Sale Price
                    </span>

                    <strong className="sale-price">
                        ${product.price_after}
                    </strong>
                </div>

                <div className="info-item">
                    <span>
                        Stock
                    </span>

                    <strong>
                        {product.quantity_in_stock}
                    </strong>
                </div>

                <div className="info-item">
                    <span>
                        Store
                    </span>

                    <strong>
                        {product.store}
                    </strong>
                </div>
            </div>

            <div className="description-box">
                <h3>
                    Description
                </h3>

                <p>
                    {product.description}
                </p>
            </div>

            <ProductActions
                onEdit={onEdit}
                onAddDiscount={onAddDiscount}
                onDelete={onDelete}
                onAddImage={onAddImage}
            />
        </div>
    );
}

export default ProductInfo;