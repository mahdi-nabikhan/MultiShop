import OrderItemDetail from "@/components/admin panel/ShopOrderItemDetail/ShopOrderItemDetail";

interface Props {
    params: Promise<{
        orderItemId: string;
    }>;
}

export default async function Page({ params }: Props) {

    const { orderItemId } = await params;

    return (
        <OrderItemDetail
            orderItemId={Number(orderItemId)}
        />
    );
}


