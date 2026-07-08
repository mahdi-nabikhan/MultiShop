interface PageProps {

    params: Promise<{
        shopId: string;
    }>;

}

import ShopDetail from "@/components/shop/ShopDetail/ShopDetail";

export default async function ShopPage({
    params,
}: PageProps) {

    const { shopId } = await params;

    return (

        <>

            <ShopDetail shopId={shopId} />

            {/* اینجا بعداً Product Grid */}

        </>

    );

}