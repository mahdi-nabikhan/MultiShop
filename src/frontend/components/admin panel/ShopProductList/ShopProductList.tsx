import React from 'react'
import './ShopProductList.css'
import BACKEND_URLS from '@/utils'
import { cookies } from 'next/headers'
import axios from 'axios'
import ProductRow from '../ProductRow/ProductRow'
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
  const cookieStore = await cookies();
  const { data: products } = await axios.get<ShopProductListData[]>(
    `${BACKEND_URLS}vendor/api/v1/all/product/shop/`,{
        headers:{
        Cookie: cookieStore.toString(),
        }
    }
    
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

          <ProductRow
            key={product.id}
            product={product}
          />

        ))}

      </tbody>

    </table>

  </div>
   
  )
}

export default ShopProductList