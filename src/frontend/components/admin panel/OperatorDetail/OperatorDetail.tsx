"use client";

import { useQuery } from "@tanstack/react-query";
import { getOperatorDetail } from "@/services/shop-admin-panel.services";

import "./OperatorDetail.css";


interface Props {
    operatorId: number | string;
}

export default function OperatorDetail({ operatorId }: Props) {
    const {
        data: operator,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["operator-detail", operatorId],
        queryFn: () => getOperatorDetail(operatorId),
    });

    if (isError) {
    return <h2>Failed to load operator.</h2>;
}





    if (isLoading) return <h2>Loading...</h2>;

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