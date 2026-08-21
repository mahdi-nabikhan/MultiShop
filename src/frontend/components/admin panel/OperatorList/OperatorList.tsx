"use client";

import { useEffect, useState } from "react";
import { getOperators } from "@/services/shop-admin-panel.services";
import type { Operator } from "@/types/panel-admin"; 
import "./OperatorList.css";


export default function OperatorList() {

    const [operators, setOperators] = useState<Operator[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

    const loadOperators = async () => {

        try {

            setLoading(true);

            const data = await getOperators();

            setOperators(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    loadOperators();

}, []);

   

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (operators.length === 0) {
        return <h2>No Operator Found</h2>;
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