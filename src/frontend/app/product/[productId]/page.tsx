import ProductDetail from "@/components/shop/ProductDetail/ProductDetail";

interface Props {
  params: Promise<{
    storeId: string;
    productId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { storeId, productId } = await params;

  return (
    <ProductDetail
      storeId={storeId}
      productId={productId}
    />
  );
}