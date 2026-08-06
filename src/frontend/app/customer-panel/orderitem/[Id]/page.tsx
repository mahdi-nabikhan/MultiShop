import CustomerOrderItemDetail from "@/components/customer-panel/CustomerOrderItemDetail/CustomerOrderItemDetail";


interface Props {

    params: Promise<{
        id: string;
    }>;

}



export default async function Page({ params }: Props) {


    const { id } = await params;


    return (

        <CustomerOrderItemDetail

            itemId={Number(id)}

        />

    );


}