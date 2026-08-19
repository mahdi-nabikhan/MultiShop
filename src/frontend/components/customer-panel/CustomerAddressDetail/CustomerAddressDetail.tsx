"use client";
import EditAddressModal from "../EditAddressModal/EditAddressModal";
import DeleteAddressModal from "../DeleteAddressModal/DeleteAddressModal";

import { useEffect, useState } from "react";



import {
    MapPin,
    Hash,
    User
} from "lucide-react";
import { getAddressDetail,Address } from "@/services/cutomer-panel.services";

import "./CustomerAddressDetail.css";










interface Props {

    addressId: number;

}




export default function CustomerAddressDetail({

    addressId

}: Props) {



    const [address, setAddress] = useState<Address | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const GetAddressDetail = async () => {
    try {
        const data = await getAddressDetail(addressId);

        setAddress(data);
    } catch (error) {
        console.log(error);
    }};









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
                <button

                    className="delete-address-btn"

                    onClick={() => setOpenDelete(true)}

                >

                    Delete Address

                </button>


            </div>



            <EditAddressModal

                open={openEdit}

                onClose={() => setOpenEdit(false)}

                address={address}

                refreshAddress={GetAddressDetail}


            />
            <DeleteAddressModal

                open={openDelete}

                onClose={() => setOpenDelete(false)}

                addressId={address.id}

            />
        </section>

    );


}