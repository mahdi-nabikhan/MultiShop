"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Store,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import BACKEND_URLS from "@/utils";

import "./Sidebar.css";

type Role = "manager" | "admin" | "operator";

interface RoleResponse {
    role: Role;
}

interface ChildItem {
    title: string;
    href: string;
}

interface MenuItem {
    title: string;
    icon: React.ElementType;
    href?: string;
    roles: Role[];
    children?: ChildItem[];
}

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/shop-admin-panel",
        roles: ["manager", "admin", "operator"],
    },

    {
        title: "Products",
        icon: Package,
        href: "/shop-admin-panel/products",
        roles: ["manager", "admin", "operator"],
    },

    {
        title: "Orders",
        icon: ShoppingCart,
        href: "/shop-admin-panel/order",
        roles: ["manager", "admin", "operator"],
    },

    {
        title: "Tickets",
        icon: Users,
        href: "/shop-admin-panel/ticket",
        roles: ["manager", "admin", "operator"],
    },

    {
        title: "Store",
        icon: Store,
        roles: ["manager"],
        children: [
            {
                title: "Store Detail",
                href: "/shop-admin-panel/store",
            },
        ],
    },

    {
        title: "Admins",
        icon: Users,
        roles: ["manager"],
        children: [
            {
                title: "Register New Admin",
                href: "/shop-admin-panel/register-admin",
            },
            {
                title: "Admins",
                href: "/shop-admin-panel/admins",
            },
        ],
    },

    {
        title: "Operators",
        icon: Users,
        roles: ["manager", "admin"],
        children: [
            {
                title: "Register Operator",
                href: "/shop-admin-panel/register-operator",
            },
            {
                title: "Operators",
                href: "/shop-admin-panel/operators",
            },
        ],
    },
];

export default function Sidebar() {

    const [role, setRole] = useState<Role | null>(null);

    const [loading, setLoading] = useState(true);

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    useEffect(() => {

        const getRole = async () => {

            try {

                const { data } = await axios.get<RoleResponse>(
                    `${BACKEND_URLS}vendor/api/v1/store/user/roles/`,
                    {
                        withCredentials: true,
                    }
                );

                setRole(data.role);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        getRole();

    }, []);

    if (loading) {

        return (
            <aside className="sidebar">
                Loading...
            </aside>
        );

    }

    if (!role) {

        return (
            <aside className="sidebar">
                No Role Found
            </aside>
        );

    }

    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(role)
    );

    return (

        <aside className="sidebar">

            <div className="sidebar-title">

                Multi Shop

            </div>

            <nav>

                {

                    filteredMenu.map((item) => {

                        const Icon = item.icon;

                        if (item.children) {

                            const isOpen = openMenu === item.title;

                            return (

                                <div
                                    key={item.title}
                                    className="sidebar-group"
                                >

                                    <button
                                        className="sidebar-dropdown"
                                        onClick={() =>
                                            setOpenMenu(
                                                isOpen
                                                    ? null
                                                    : item.title
                                            )
                                        }
                                    >

                                        <div className="left">

                                            <Icon size={20} />

                                            <span>

                                                {item.title}

                                            </span>

                                        </div>

                                        {

                                            isOpen
                                                ? <ChevronDown size={18} />
                                                : <ChevronRight size={18} />

                                        }

                                    </button>

                                    {

                                        isOpen && (

                                            <div className="submenu">

                                                {

                                                    item.children.map(child => (

                                                        <Link

                                                            key={child.title}

                                                            href={child.href}

                                                            className="submenu-link"

                                                        >

                                                            {child.title}

                                                        </Link>

                                                    ))

                                                }

                                            </div>

                                        )

                                    }

                                </div>

                            );

                        }

                        return (

                            <Link

                                key={item.title}

                                href={item.href!}

                                className="sidebar-link"

                            >

                                <Icon size={20} />

                                <span>

                                    {item.title}

                                </span>

                            </Link>

                        );

                    })

                }

            </nav>

            <div className="sidebar-bottom">

                {

                    role !== "operator" && (

                        <Link

                            href="/shop-admin-panel/settings"

                            className="sidebar-link"

                        >

                            <Settings size={20} />

                            <span>

                                Settings

                            </span>

                        </Link>

                    )

                }

                <button className="logout-link">

                    <LogOut size={20} />

                    <span>

                        Logout

                    </span>

                </button>

            </div>

        </aside>

    );

}