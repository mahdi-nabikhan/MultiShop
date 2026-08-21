"use client";

import { useEffect, useState } from "react";
import { getOperatorDetail } from "@/services/shop-admin-panel.services";
import type { OperatorDetail } from "@/types/panel-admin";
import "./OperatorDetail.css";


interface Props {
    operatorId: number | string;
}

export default function OperatorDetail({ operatorId }: Props) {

    const [operator, setOperator] = useState<OperatorDetail | null>(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {

    const loadOperator = async () => {

        try {

            setLoading(true);

            const data = await getOperatorDetail(operatorId);

            setOperator(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    loadOperator();

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