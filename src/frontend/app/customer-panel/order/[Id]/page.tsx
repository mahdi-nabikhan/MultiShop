import CustomerOrderItemList from "../../../../components/customer-panel/CustomerOrderItemList/CustomerOrderItemList";


interface Props {

    params: Promise<{
        id:string;
    }>;

}



export default async function Page({params}:Props){


    const {id} = await params;



    return (

        <CustomerOrderItemList
            orderId={Number(id)}
        />

    );


}