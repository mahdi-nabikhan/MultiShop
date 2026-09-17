
import dynamic from "next/dynamic";

import ProductDetail from "@/components/shop/ProductDetail/ProductDetail";
import SectionHeader from "@/components/shop/SectionHeader/SectionHeader";

import "./page.css";

const CommentCreateBox = dynamic(
    () =>
        import(
            "@/components/shop/Comments/CommentCreateBox/CommentCreateBox"
        )
);

const CommentList = dynamic(
    () =>
        import(
            "@/components/shop/Comments/CommentList/CommentList"
        )
);

interface Props {
    params: Promise<{
        storeId: string;
        productId: string;
    }>;
}

export default async function Page({ params }: Props) {
    const { productId } = await params;

    return (
        <main className="product-page">
            <section className="product-detail-section">
                <ProductDetail productId={productId} />
            </section>

            <SectionHeader
                title="Add Comments"
                description="Add Comment for This Products"
            />

            <section className="comments-section">
                <CommentCreateBox productId={productId} />

                <SectionHeader
                    title="All Comments"
                    description="All Comment For This Product"
                />

                <CommentList productID={productId} />
            </section>
        </main>
    );
}
