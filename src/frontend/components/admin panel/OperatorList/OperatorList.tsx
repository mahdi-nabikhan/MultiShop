"use client";


import { getOperators } from "@/services/shop-admin-panel.services";
import { useQuery } from "@tanstack/react-query";
import "./OperatorList.css";


export default function OperatorList() {
    const {
        data: operators = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["operators"],
        queryFn: getOperators,
    });





    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (operators.length === 0) {
        return <h2>No Operator Found</h2>;
    }
    if (isError) {
        return <h2>Failed to load operators.</h2>;
    }

    return (

        <div className="operator-page">

            <div className="operator-header">

                <h1>Store Operators</h1>

                <p>
                    All operators of this store
                </p>

            </div>

            <div className="operator-list">

                {operators.map((operator, index) => (

                    <div
                        className="operator-card"
                        key={index}
                    >

                        <div className="avatar">

                            {
                                operator.user.email.charAt(0).toUpperCase()
                            }

                        </div>

                        <div className="operator-info">

                            <h2>

                                {
                                    operator.username || "No Username"
                                }

                            </h2>

                            <span>

                                {operator.user.email}

                            </span>

                        </div>

                        <div className="operator-badge">

                            Operator

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}