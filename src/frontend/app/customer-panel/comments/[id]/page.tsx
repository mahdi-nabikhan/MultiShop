import CustomerCommentDetail from "@/components/customer panel/CustomerCommentDetail/CustomerCommentDetail";


interface Props {

    params:Promise<{
        id:string
    }>

}



export default async function Page({params}:Props){


    const {id}=await params;


    return (

        <CustomerCommentDetail

            commentId={Number(id)}

        />

    );


}