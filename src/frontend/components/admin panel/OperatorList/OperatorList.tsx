"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./OperatorList.css";

interface Operator {
    username: string;
    user: {
        email: string;
    };
}

export default function OperatorList() {

    const [operators, setOperators] = useState<Operator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getOperators = async () => {

            try {

                const { data } = await axios.get<Operator[]>(
                    `${BACKEND_URLS}vendor/api/v1/shop/operator/list/`,
                    {
                        withCredentials: true,
                    }
                );

                setOperators(data);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        getOperators();

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