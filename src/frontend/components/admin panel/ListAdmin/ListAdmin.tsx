"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import useAdmins from "@/hooks/admin-panel/useAdmins";
import Pagination from "@/components/commen/Paginations";

import "./ListAdmin.css";


export default function AdminList() {

    const router = useRouter();

    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useAdmins(
        page,
        pageSize
    );


    if (isLoading) {
        return <h2>Loading...</h2>;
    }


    if (isError) {
        return <h2>Failed to load admins.</h2>;
    }


    const admins = data?.results ?? [];


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
                    admins.map((admin) => (

                        <div
                            key={admin.id}
                            className="admin-card"
                        >

                            <div className="avatar">

                                {
                                    admin.user.email
                                        .charAt(0)
                                        .toUpperCase()
                                }

                            </div>


                            <div className="admin-info">

                                <h2>
                                    {
                                        admin.username ||
                                        "No Username"
                                    }
                                </h2>

                                <span>
                                    {admin.user.email}
                                </span>

                            </div>


                            <div
                                className="admin-badge"
                                onClick={() => {
                                    router.push(
                                        `admin/${admin.id}`
                                    );
                                }}
                            >
                                Detail
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