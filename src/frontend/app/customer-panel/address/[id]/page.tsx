import CustomerAddressDetail from "@/components/customer panel/CustomerAddressDetail/CustomerAddressDetail";



interface Props {

    params:Promise<{
        id:string
    }>

}



export default async function Page({params}:Props){


    const {id}=await params;


    return (

        <CustomerAddressDetail

            addressId={Number(id)}

        />

    );


}