"use client";


import {
    useEffect,
    useState
} from "react";


import { getBills } from "@/services/order.services";


import {
    ReceiptText,
    CalendarDays,
    MapPin,
    ShoppingCart,
    CheckCircle,
    XCircle
} from "lucide-react";





import "./CustomerBillList.css";



interface Cart {


    id:number;

    status:boolean;

    created:string;

    customer:number;


}



interface Bill {


    id:number;

    created_at:string;

    status:boolean;

    cart:Cart;

    address:number;


}




export default function CustomerBillList(){



    const [bills,setBills]=useState<Bill[]>([]);

    const [loading,setLoading]=useState(true);







    const fetchBills = async () => {
    try {
        const data = await getBills();

        setBills(data);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};






    useEffect(()=>{


        fetchBills();


    },[]);









    if(loading){


        return(


            <div className="bill-loading">

                Loading Bills...

            </div>


        );


    }








    return(


        <section className="customer-bill-list">





            <div className="bill-header">


                <h2>

                    My Bills

                </h2>


                <span>

                    {bills.length} Bills

                </span>


            </div>







            <div className="bill-grid">





                {

                    bills.map((bill)=>(



                        <div

                            className="bill-card"

                            key={bill.id}

                        >





                            <div className="bill-icon">


                                <ReceiptText size={32}/>


                            </div>







                            <div className="bill-content">





                                <h3>

                                    Bill #{bill.id}

                                </h3>







                                <div className="bill-info">


                                    <div>


                                        <CalendarDays size={16}/>


                                        {bill.created_at}


                                    </div>





                                    <div>


                                        <ShoppingCart size={16}/>


                                        Cart #{bill.cart.id}


                                    </div>






                                    <div>


                                        <MapPin size={16}/>


                                        Address #{bill.address}


                                    </div>



                                </div>







                                <div

                                    className={

                                        bill.status

                                        ?

                                        "bill-status success"

                                        :

                                        "bill-status pending"

                                    }

                                >



                                    {

                                        bill.status

                                        ?

                                        <>

                                        <CheckCircle size={16}/>

                                        Paid

                                        </>


                                        :


                                        <>

                                        <XCircle size={16}/>

                                        Pending

                                        </>

                                    }



                                </div>







                            </div>






                        </div>



                    ))


                }






            </div>







        </section>


    );


}