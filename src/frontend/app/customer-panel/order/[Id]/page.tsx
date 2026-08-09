import CustomerOrderItemList from "@/components/customer-panel/CustomerOrderItemList/CustomerOrderItemList";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: Props) {

    const resolvedParams = await params;

    console.log("PARAMS:", resolvedParams);
    console.log("ORDER ID FROM URL:", resolvedParams.id);

    const orderId = Number(resolvedParams.id);

    console.log("ORDER ID NUMBER:", orderId);

    if (!Number.isInteger(orderId) || orderId <= 0) {

        return (
            <div>
                Invalid order ID: {resolvedParams.id}
            </div>
        );

    }

    return (
        <CustomerOrderItemList
            orderId={orderId}
        />
    );
}