"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./ListAdmin.css";

interface Admin {
    id:number
    username: string;
    user: {

        email: string;
    };
}

export default function AdminList() {
    const router = useRouter()
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getAdmins = async () => {

            try {

                const { data } = await axios.get<Admin[]>(
                    `${BACKEND_URLS}vendor/api/v1/shop/admin/list/`,
                    {
                        withCredentials: true,
                    }
                );

                setAdmins(data);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        getAdmins();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
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

                            <div className="admin-badge" onClick={() =>{
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