import ProductDetail from "@/components/shop/ProductDetail/ProductDetail";
import CommentCreateBox from "@/components/shop/Comments/CommentCreateBox/CommentCreateBox";
import CommentList from "@/components/shop/Comments/CommentList/CommentList";
interface Props {
  params: Promise<{
    storeId: string;
    productId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { storeId, productId } = await params;

  return (
    <>
    
    <ProductDetail
      storeId={storeId}
      productId={productId}
    />
    <CommentCreateBox productId={productId}/>
    <CommentList productID={productId}/>
    
    </>
  );
}