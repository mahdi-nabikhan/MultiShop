import ShopDetail from "@/components/shop/ShopDetail/ShopDetail";
import ProductList from "@/components/shop/ProductList/ProductList";

interface Props {
  params: Promise<{
    shopId: string;
  }>;
}

export default async function StorePage({ params }: Props) {
  const { shopId } = await params;

  return (
    <>
      
      <ShopDetail shopId={shopId} />

     

        <ProductList shopId={shopId} />

  
    </>
  );
}