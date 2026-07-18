import ProductDetail from "@/components/shop/ProductDetail/ProductDetail";
import CommentCreateBox from "@/components/shop/Comments/CommentCreateBox/CommentCreateBox";
import CommentList from "@/components/shop/Comments/CommentList/CommentList";
import ProductOrderBox from "@/components/shop/ProductOrderBox/ProductOrderBox";
import SectionHeader from "@/components/shop/SectionHeader/SectionHeader";
import './page.css'
interface Props {
  params: Promise<{
    storeId: string;
    productId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { storeId, productId } = await params;

  return (
    <main className="product-page">


      <section className="product-detail-section">

        <ProductDetail
          productId={productId}
        />

      </section>



      <section className="order-box-section">


</section>
    <SectionHeader
            title='Add Comments'
            description="Add Comment for This Products"
          />

      <section className="comments-section">

        <CommentCreateBox
          productId={productId}
        />

          <SectionHeader
            title='All Comments'
            description="All Comment For This Product"
          />
        <CommentList
          productID={productId}
        />

      </section>


    </main>
  );
}