import React from 'react'
import ProductChart from '@/components/admin panel/Charts/Charts'
import ShopProductList from '@/components/admin panel/ShopProductList/ShopProductList'

export default function page() {
  return (
    <div>
      <ProductChart/>
      <ShopProductList/>
    </div>
  )
}
