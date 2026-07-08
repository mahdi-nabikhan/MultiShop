import ShopDetail from "@/components/shop/ShopDetail/ShopDetail";
import ProductList from "@/components/shop/ProductList/ProductList";

interface Props {
  params: Promise<{
    storeId: string;
  }>;
}

export default async function StorePage({ params }: Props) {
  const { storeId } = await params;

  return (
    <>
      <ShopDetail shopId={storeId} />

      <ProductList shopId={storeId} />
    </>
  );
}