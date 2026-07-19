import ShopProductDetail from '@/components/admin panel/ShopProductDetail/ShopProductDetail'
import React from 'react'
interface Props {
  params: Promise<{
    productId: number
  }>;
}
async function page({params}:Props) {
    const { productId } = await params;
  return (
    <div><ShopProductDetail productId={productId}/></div>
  )
}

export default page