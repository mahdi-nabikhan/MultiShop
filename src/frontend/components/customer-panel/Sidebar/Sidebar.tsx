
"use client";

import Link from "next/link";

import {
    User,
    MessageCircle,
    MapPin,
    CreditCard,
    ShoppingBag,
    Package,
    FileText,
    Ticket,
    LogOut,
} from "lucide-react";

import useLogout from "@/hooks/auth/useLogout";
import useCustomerProfile from "@/hooks/customer/useCustomerProfile";

import "./Sidebar.css";

const menuGroups = [
    {
        title: "Shopping",

        items: [
            {
                title: "My Orders",
                href: "/customer-panel/order",
                icon: ShoppingBag,
            },
            {
                title: "Order Items",
                href: "/customer-panel/orderitem",
                icon: Package,
            },
            {
                title: "Bills",
                href: "/customer-panel/bill",
                icon: CreditCard,
            },
        ],
    },

    {
        title: "Communication",

        items: [
            {
                title: "Messages",
                href: "/customer-panel/chat",
                icon: MessageCircle,
            },
            {
                title: "Comments",
                href: "/customer-panel/comments",
                icon: FileText,
            },
            {
                title: "Tickets",
                href: "/customer-panel/ticket",
                icon: Ticket,
            },
        ],
    },

    {
        title: "Account",

        items: [
            {
                title: "Profile",
                href: "/customer-panel/profile",
                icon: User,
            },
            {
                title: "Addresses",
                href: "/customer-panel/address",
                icon: MapPin,
            },
        ],
    },
];

export default function CustomerSidebar() {
    const logoutMutation = useLogout();

    const {
        profile: customer,
        isLoading,
    } = useCustomerProfile();

    const username = customer?.username ?? "User";

    const avatar = username
        .charAt(0)
        .toUpperCase();

    return (
        <aside className="customer-sidebar">

            {/* =========================
                USER CARD
            ========================= */}

            <div className="sidebar-user-card">

                <div className="sidebar-avatar">

                    {isLoading
                        ? "..."
                        : avatar}

                </div>

                <div className="sidebar-user-info">

                    <h3>
                        {isLoading
                            ? "Loading..."
                            : username}
                    </h3>

                    <p>
                        Customer
                    </p>

                </div>

            </div>


            {/* =========================
                MENU
            ========================= */}

            <nav className="sidebar-menu">

                {menuGroups.map((group) => (

                    <div
                        className="sidebar-group"
                        key={group.title}
                    >

                        <span className="group-title">
                            {group.title}
                        </span>

                        {group.items.map((item) => {

                            const Icon = item.icon;

                            return (

                                <Link
                                    href={item.href}
                                    className="sidebar-item"
                                    key={item.title}
                                >

                                    <Icon size={20} />

                                    <span>
                                        {item.title}
                                    </span>

                                </Link>

                            );

                        })}

                    </div>

                ))}

            </nav>


            {/* =========================
                LOGOUT
            ========================= */}

            <button
                type="button"
                className="sidebar-logout"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
            >

                <LogOut size={20} />

                <span>
                    {logoutMutation.isPending
                        ? "Logging out..."
                        : "Logout"}
                </span>

            </button>

        </aside>
    );
}

