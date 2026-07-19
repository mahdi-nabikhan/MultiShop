import React from 'react'
import './ShopProductList.css'
import BACKEND_URLS from '@/utils'
import axios from 'axios'
interface ShopProductListData {
  id: number,
  name: string,
  description: string,
  quantity_in_stock: number,
  price: number,
  price_after: number,
  product_image: string | null,
  category: number,
  store: number


}

async function ShopProductList() {
  const { data: products } = await axios.get<ShopProductListData[]>(
    `${BACKEND_URLS}vendor/api/v1/all/product/shop/`,
    { withCredentials: true }
  )

  return (
    <div className="product-list">

    <div className="product-header">

        <div>
            <h1>Products</h1>
            <p>Manage all products in your store</p>
        </div>

        <button className="add-product-btn">
            + Add Product
        </button>

    </div>

    <div className="toolbar">

        <input
            type="text"
            placeholder="Search product..."
        />

        <select>
            <option>All Categories</option>
        </select>

        <select>
            <option>All Stock</option>
        </select>

    </div>

    <table className="product-table">

        <thead>

            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
            </tr>

        </thead>

        <tbody>

            {products.map((product) => (

                <tr key={product.id}>

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

                        <button className="edit-btn">
                            Edit
                        </button>

                        <button className="delete-btn">
                            Delete
                        </button>

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>
  )
}

export default ShopProductList