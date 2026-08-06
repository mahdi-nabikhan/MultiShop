"use client";
import EditAddressModal from "../EditAddressModal/EditAddressModal";

import { useEffect, useState } from "react";

import axios from "axios";

import {
    MapPin,
    Hash,
    User
} from "lucide-react";


import BACKEND_URLS from "@/utils";

import "./CustomerAddressDetail.css";




interface Customer {

    username: string;

}



interface Address {


    id: number;

    state: string;

    city: string;

    postal_code: string;

    customer: Customer;


}





interface Props {

    addressId: number;

}




export default function CustomerAddressDetail({

    addressId

}: Props) {



    const [address, setAddress] = useState<Address | null>(null);
    const [openEdit, setOpenEdit] = useState(false);




    const GetAddressDetail = async () => {


        try {


            const { data } = await axios.get<Address>(


                `${BACKEND_URLS}customer/api/v1/detail/address/${addressId}/`,

                {

                    withCredentials: true

                }


            );


            setAddress(data);


        }


        catch (error) {


            console.log(error);


        }


    };







    useEffect(() => {


        GetAddressDetail();


    }, [addressId]);








    if (!address) {


        return (

            <div className="address-detail-loading">

                Loading Address...

            </div>

        )


    }








    return (

        <section className="address-detail">





            <div className="address-detail-header">


                <h2>

                    Address Details

                </h2>


                <span>

                    #{address.id}

                </span>


            </div>








            <div className="address-detail-card">





                <div className="address-detail-icon">


                    <MapPin size={35} />


                </div>






                <div className="address-detail-info">



                    <h3>

                        {address.city}

                    </h3>





                    <div className="detail-row">


                        <span>

                            State

                        </span>


                        <strong>

                            {address.state}

                        </strong>


                    </div>







                    <div className="detail-row">


                        <span>

                            City

                        </span>


                        <strong>

                            {address.city}

                        </strong>


                    </div>







                    <div className="detail-row">


                        <span>

                            Postal Code

                        </span>


                        <strong>

                            {address.postal_code}

                        </strong>


                    </div>







                    <div className="detail-row">


                        <span>

                            Customer

                        </span>


                        <strong>

                            {address.customer.username}

                        </strong>


                    </div>




                </div>

                <button

                    className="edit-address-btn"

                    onClick={() => setOpenEdit(true)}

                >

                    Edit Address

                </button>


            </div>



            <EditAddressModal

                open={openEdit}

                onClose={() => setOpenEdit(false)}

                address={address}

                refreshAddress={GetAddressDetail}

            />
        </section>

    );


}