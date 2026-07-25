"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./AdminDetail.css";

interface AdminDetail {
    username: string;
    user: {
        email: string;
    };
}

interface Props {
    adminId: number | string;
}

export default function AdminDetail({ adminId }: Props) {

    const [admin, setAdmin] = useState<AdminDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getAdmin = async () => {

            try {

                const { data } = await axios.get<AdminDetail>(
                    `${BACKEND_URLS}vendor/api/v1/shop/admin/detail/${adminId}/`,
                    {
                        withCredentials: true,
                    }
                );

                setAdmin(data);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        getAdmin();

    }, [adminId]);

    if (loading) return <h2>Loading...</h2>;

    if (!admin) return <h2>Admin Not Found</h2>;

    return (

        <div className="admin-detail-page">

            <div className="admin-detail-card">

                <div className="admin-avatar">

                    {admin.user.email.charAt(0).toUpperCase()}

                </div>

                <h1>

                    {admin.username || "No Username"}

                </h1>

                <span className="role-badge">

                    Administrator

                </span>

                <div className="detail-grid">

                    <div>

                        <span>Email</span>

                        <strong>

                            {admin.user.email}

                        </strong>

                    </div>

                    <div>

                        <span>Username</span>

                        <strong>

                            {admin.username || "-"}

                        </strong>

                    </div>

                </div>

                <div className="button-group">

                    <button className="update-btn">

                        Update Admin

                    </button>

                    <button className="password-btn">

                        Change Password

                    </button>

                    <button className="delete-btn">

                        Delete Admin

                    </button>

                </div>

            </div>

        </div>

    );

}