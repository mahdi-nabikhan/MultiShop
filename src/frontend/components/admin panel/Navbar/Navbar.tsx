
"use client";

import Link from "next/link";

import useLogout from "@/hooks/auth/useLogout";

import "./Navbar.css";

export default function AdminNavbar() {
    const logoutMutation = useLogout();

    return (
        <header className="admin-navbar">

            <div className="admin-logo">
                <Link href="/admin-panel">
                    MultiShop Admin
                </Link>
            </div>

            <div className="admin-search">
                <input
                    type="text"
                    placeholder="Search..."
                />
            </div>

            <div className="admin-actions">

                <button className="notification">
                    🔔
                </button>

                <div className="admin-profile">

                    <div className="avatar">
                        A
                    </div>

                    <div className="profile-info">
                        <span>
                            Admin
                        </span>

                        <small>
                            Manager
                        </small>
                    </div>

                </div>

                <button
                    className="logout"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                >
                    {logoutMutation.isPending
                        ? "Logging out..."
                        : "Logout"}
                </button>

            </div>

        </header>
    );
}

