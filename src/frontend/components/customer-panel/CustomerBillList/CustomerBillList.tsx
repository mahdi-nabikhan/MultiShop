"use client";

import useBills from "@/hooks/customer/useBills";


import {
    ReceiptText,
    CalendarDays,
    MapPin,
    ShoppingCart,
    CheckCircle,
    XCircle
} from "lucide-react";

import "./CustomerBillList.css";


export default function CustomerBillList() {


    const {data: bills = [],isLoading,isError,} = useBills()

    if (isError) {
        return (
            <div className="bill-loading">
                Failed to load bills.
            </div>
        );
    }


    if (isLoading) {
        return (
            <div className="bill-loading">

                Loading Bills...

            </div>


        );


    }



    return (
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

                    bills.map((bill) => (

                        <div

                            className="bill-card"

                            key={bill.id}

                        >





                            <div className="bill-icon">


                                <ReceiptText size={32} />


                            </div>







                            <div className="bill-content">





                                <h3>

                                    Bill #{bill.id}

                                </h3>







                                <div className="bill-info">


                                    <div>


                                        <CalendarDays size={16} />


                                        {bill.created_at}


                                    </div>





                                    <div>


                                        <ShoppingCart size={16} />


                                        Cart #{bill.cart.id}


                                    </div>






                                    <div>


                                        <MapPin size={16} />


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

                                                <CheckCircle size={16} />

                                                Paid

                                            </>


                                            :


                                            <>

                                                <XCircle size={16} />

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