"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./OperatorDetail.css";

interface OperatorDetail {
    username: string;
    user: {
        email: string;
    };
}

interface Props {
    operatorId: number | string;
}

export default function OperatorDetail({ operatorId }: Props) {

    const [operator, setOperator] = useState<OperatorDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getOperator = async () => {

            try {

                const { data } = await axios.get<OperatorDetail>(
                    `${BACKEND_URLS}vendor/api/v1/shop/operator/detail/${operatorId}/`,
                    {
                        withCredentials: true,
                    }
                );

                setOperator(data);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        getOperator();

    }, [operatorId]);

    if (loading) return <h2>Loading...</h2>;

    if (!operator) return <h2>Operator Not Found</h2>;

    return (

        <div className="operator-detail-page">

            <div className="operator-detail-card">

                <div className="operator-avatar">

                    {operator.user.email.charAt(0).toUpperCase()}

                </div>

                <h1>

                    {operator.username || "No Username"}

                </h1>

                <span className="role-badge">

                    Operator

                </span>

                <div className="detail-grid">

                    <div>

                        <span>Email</span>

                        <strong>

                            {operator.user.email}

                        </strong>

                    </div>

                    <div>

                        <span>Username</span>

                        <strong>

                            {operator.username || "-"}

                        </strong>

                    </div>

                </div>

                <div className="button-group">

                    <button className="update-btn">

                        Update Operator

                    </button>

                    <button className="password-btn">

                        Change Password

                    </button>

                    <button className="delete-btn">

                        Delete Operator

                    </button>

                </div>

            </div>

        </div>

    );

}