"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getAdmins } from "@/services/shop-admin-panel.services";
import "./ListAdmin.css";



export default function AdminList() {
    const router = useRouter()
    const {
        data: admins = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["admins"],
        queryFn: getAdmins,
    });



    if (isLoading) {
        return <h2>Loading...</h2>;
    }
    if (isError) {
        return <h2>Failed to load admins.</h2>;
    }

    if (admins.length === 0) {
        return <h2>No Admin Found</h2>;
    }

    return (

        <div className="admin-page">

            <div className="admin-header">

                <h1>Store Admins</h1>

                <p>
                    All administrators of this store
                </p>

            </div>

            <div className="admin-list">

                {
                    admins.map((admin, index) => (

                        <div
                            key={index}
                            className="admin-card"
                        >

                            <div className="avatar">

                                {
                                    admin.user.email.charAt(0).toUpperCase()
                                }

                            </div>

                            <div className="admin-info">

                                <h2>

                                    {
                                        admin.username || "No Username"
                                    }

                                </h2>

                                <span>
                                    {admin.user.email}
                                </span>

                            </div>

                            <div className="admin-badge" onClick={() => {
                                router.push(`admin/${admin.id}`)
                            }}>

                                Detail

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>

    );

}