"use client";

import {
  deleteProduct,
} from "@/services/shop-admin-panel.services";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DeleteModal from "../DeleteModal/DeleteModal";

interface ShopProductListData {
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
  product: ShopProductListData;
}

export default function ProductRow({ product }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },

    onError: (err) => {
      console.error(
        "Failed to delete product:",
        err
      );
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(product.id);
  };


  return (
    <>
      <tr>

        <td>
          <img
            src={product.product_image || "/no-image.png"}
            alt={product.name}
          />
        </td>

        <td>

          <div className="product-name">

            <strong>{product.name}</strong>

            <span>
              {product.description.slice(0, 40)}...
            </span>

          </div>

        </td>

        <td>${product.price}</td>

        <td>${product.price_after}</td>

        <td>{product.quantity_in_stock}</td>

        <td>

          <span
            className={
              product.quantity_in_stock > 0
                ? "badge success"
                : "badge danger"
            }
          >
            {product.quantity_in_stock > 0
              ? "In Stock"
              : "Out of Stock"}
          </span>

        </td>

        <td>

          <button
            className="edit-btn"
            onClick={() =>
              router.push(`/shop-admin-panel/product/${product.id}`)
            }
          >
            Detail
          </button>

          <button
            className="delete-btn"
            onClick={() => setOpen(true)}
          >
            Delete
          </button>

        </td>

      </tr>

      <DeleteModal
        open={open}
        loading={deleteMutation.isPending}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}