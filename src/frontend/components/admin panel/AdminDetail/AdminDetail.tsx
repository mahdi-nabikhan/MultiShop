"use client";

import { useEffect, useState } from "react";
import { updateShopAdmin, getShopAdmin, deleteShopAdmin, AdminDetailProp } from "@/services/shop-admin-panel.services";
import { useRouter } from "next/navigation";
import DeleteModal from "../DeleteModal/DeleteModal";
import UpdateAdminModal from "../UpdateAdminModal/UpdateAdminModal";

import "./AdminDetail.css";






interface Props {

    adminId: number | string;

}



export default function AdminDetail({ adminId }: Props) {


    const [admin, setAdmin] = useState<AdminDetailProp | null>(null);


    const [loading, setLoading] = useState(true);


    const [deleteLoading, setDeleteLoading] = useState(false);


    const [updateLoading, setUpdateLoading] = useState(false);


    const [showDelete, setShowDelete] = useState(false);


    const [showUpdate, setShowUpdate] = useState(false);



    const router = useRouter();





    async function getAdmin() {
        try {
            const data = await getShopAdmin(adminId);

            setAdmin(data);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    }





    async function deleteAdmin() {
        try {
            setDeleteLoading(true);

            await deleteShopAdmin(adminId);

            router.push("/shop-admin-panel/admin");

        } catch (error) {
            console.log(error);

        } finally {
            setDeleteLoading(false);
        }
    }






    async function updateAdmin(username: string) {
        try {
            setUpdateLoading(true);

            await updateShopAdmin(adminId, username);

            setAdmin(prev => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,
                    username,
                };
            });

            setShowUpdate(false);

        } catch (error) {
            console.log(error);

        } finally {
            setUpdateLoading(false);
        }
    }





    useEffect(() => {


        getAdmin();


    }, [adminId]);





    if (loading)

        return <h2>Loading...</h2>;




    if (!admin)

        return <h2>Admin Not Found</h2>;






    return (


        <div className="admin-detail-page">


            <div className="admin-detail-card">



                <div className="admin-avatar">


                    {
                        admin.user.email
                            .charAt(0)
                            .toUpperCase()
                    }


                </div>




                <h1>

                    {admin.username || "No Username"}

                </h1>





                <span className="role-badge">

                    Administrator

                </span>






                <div className="detail-grid">


                    <div>

                        <span>
                            Email
                        </span>


                        <strong>

                            {admin.user.email}

                        </strong>


                    </div>





                    <div>


                        <span>
                            Username
                        </span>


                        <strong>

                            {admin.username || "-"}

                        </strong>


                    </div>



                </div>








                <div className="button-group">


                    <button

                        className="update-btn"

                        onClick={() => setShowUpdate(true)}

                    >

                        Update Admin

                    </button>






                    <button className="password-btn">

                        Change Password

                    </button>






                    <button

                        className="delete-btn"

                        onClick={() => setShowDelete(true)}

                    >

                        Delete Admin

                    </button>



                </div>



            </div>







            <DeleteModal


                open={showDelete}


                loading={deleteLoading}


                title="Delete Admin"


                message="Are you sure you want to delete this admin?"


                onClose={() => setShowDelete(false)}


                onConfirm={deleteAdmin}


            />







            <UpdateAdminModal


                open={showUpdate}


                loading={updateLoading}


                username={admin.username}


                onClose={() => setShowUpdate(false)}


                onConfirm={updateAdmin}


            />






        </div>


    );


}