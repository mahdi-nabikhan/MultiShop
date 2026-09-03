"use client";

import { useState } from "react";

import useOperators from "@/hooks/admin-panel/useOperator";
import Pagination from "@/components/commen/Paginations";

import "./OperatorList.css";


export default function OperatorList() {

    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useOperators(
        page,
        pageSize
    );


    if (isLoading) {
        return <h2>Loading...</h2>;
    }


    if (isError) {
        return <h2>Failed to load operators.</h2>;
    }


    const operators = data?.results ?? [];


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

                {
                    operators.map((operator) => (

                        <div
                            className="operator-card"
                            key={operator.id}
                        >

                            <div className="avatar">

                                {
                                    operator.user.email
                                        .charAt(0)
                                        .toUpperCase()
                                }

                            </div>


                            <div className="operator-info">

                                <h2>
                                    {
                                        operator.username ||
                                        "No Username"
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

                    ))
                }

            </div>


            {
                data && (
                    <Pagination
                        next={data.links.next}
                        previous={data.links.previous}
                        loading={isFetching}
                        onNext={() =>
                            setPage(
                                (prev) => prev + 1
                            )
                        }
                        onPrevious={() =>
                            setPage(
                                (prev) => prev - 1
                            )
                        }
                    />
                )
            }

        </div>

    );
}