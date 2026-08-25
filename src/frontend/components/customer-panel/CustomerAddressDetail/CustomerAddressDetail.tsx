"use client";
import EditAddressModal from "../EditAddressModal/EditAddressModal";
import DeleteAddressModal from "../DeleteAddressModal/DeleteAddressModal";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {MapPin,} from "lucide-react";
import { getAddressDetail } from "@/services/cutomer-panel.services";
import "./CustomerAddressDetail.css";


interface Props {addressId: number;}


export default function CustomerAddressDetail({addressId}: Props) {

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const {
        data: address,
        isLoading,
        isError,
    } = useQuery({
        queryKey: customerQueryKeys.address(addressId),
        queryFn: () => getAddressDetail(addressId),
        enabled: !!addressId,
    });



    if (isError) {
        return (
            <div className="address-detail-loading">
                Failed to load address.
            </div>
        );
    }


    if (isLoading) {
        return (
            <div className="address-detail-loading">
                Loading Address...
            </div>
        );
    }
















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
            />
            <DeleteAddressModal

                open={openDelete}

                onClose={() => setOpenDelete(false)}

                addressId={address.id}

            />
        </section>

    );


}