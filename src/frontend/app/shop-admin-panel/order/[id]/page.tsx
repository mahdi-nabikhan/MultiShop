import React from "react";
import OrderItemList from "@/components/admin panel/OrderItemList/OrderItemList";

interface Props {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function page({ params }: Props) {

    const { orderId } = await params;

    return (
        <OrderItemList
            orderId={Number(orderId)}
        />
    );
}