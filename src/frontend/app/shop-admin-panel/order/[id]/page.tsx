import React from "react";
import OrderItemList from "@/components/admin panel/OrderItemList/OrderItemList";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    return <OrderItemList orderId={Number(id)} />;
}