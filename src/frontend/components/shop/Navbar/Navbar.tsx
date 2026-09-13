
"use client";

import Link from "next/link";
import axios from "axios";
import SearchBox from "../SearchBox/SearchBox";
import { useEffect, useState } from "react";

import BACKEND_URLS from "@/utils";
import useLogout from "@/hooks/auth/useLogout";

import "./Navbar.css";

interface Customer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}

export default function Navbar() {
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<Customer | null>(null);

    const logoutMutation = useLogout();

    useEffect(() => {
        const getCustomer = async () => {
            try {
                const { data } = await axios.get<Customer>(
                    `${BACKEND_URLS}customer/api/v1/customer/detail/`,
                    {
                        withCredentials: true,
                    }
                );

                setCustomer(data);
            } catch {
                setCustomer(null);
            } finally {
                setLoading(false);
            }
        };

        getCustomer();
    }, []);

    return (
        <nav>
            <div className="container">
                {/* Logo */}
                <div className="logo">
                    <Link href="/">
                        MultiShop
                    </Link>
                </div>

                {/* Navigation */}
                <ul className="nav-links">
                    <li>
                        <Link href="/">
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link href="/about">
                            About Us
                        </Link>
                    </li>

                    <li>
                        <Link href="/contact">
                            Contact Us
                        </Link>
                    </li>
                </ul>

                {/* Search */}
                <SearchBox />

                {/* Authentication */}
                <div className="auth-buttons">
                    {loading ? (
                        <span className="loading-user">
                            Loading...
                        </span>
                    ) : customer ? (
                        <>
                            <div className="user-box">
                                <Link
                                    href="customer-panel"
                                    className="avatar"
                                >
                                    {customer.username[0].toUpperCase()}
                                </Link>

                                <div className="user-data">
                                    <small>
                                        Welcome Back
                                    </small>

                                    <span>
                                        {customer.username}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/order"
                                className="orders-btn"
                            >
                                Orders
                            </Link>

                            <button
                                className="logout-btn"
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                            >
                                {logoutMutation.isPending
                                    ? "Logging out..."
                                    : "Logout"}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="register-btn"
                            >
                                Register
                            </Link>

                            <Link
                                href="/session-order"
                                className="orders-btn"
                            >
                                Orders
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

