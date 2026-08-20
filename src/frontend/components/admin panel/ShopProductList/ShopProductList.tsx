import React from 'react'
import './ShopProductList.css'
import { cookies } from 'next/headers'
import ProductRow from '../ProductRow/ProductRow'
import { getShopProducts } from '@/services/shop-admin-panel.services' 
async function ShopProductList() {

  const cookieStore = await cookies();
  const products = await getShopProducts(cookieStore.toString());

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