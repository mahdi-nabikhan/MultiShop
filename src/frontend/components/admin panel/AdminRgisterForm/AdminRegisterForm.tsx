"use client";

import { useState } from "react";

import {
    useMutation,
} from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import Link from "next/link";

import {
    User,
    Mail,
    Lock,
} from "lucide-react";

import { registerShopAdmin } from "@/services/auth.services";

import "./AdminRegisterForm.css";


export default function AdminRegisterForm() {

    const router = useRouter();


    // ==========================================
    // Form State
    // ==========================================

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [password2, setPassword2] =
        useState("");

    const [error, setError] =
        useState("");


    // ==========================================
    // Register Mutation
    // ==========================================

    const registerMutation =
        useMutation({

            mutationFn:
                registerShopAdmin,

            onSuccess: () => {

                router.push(
                    "/shop-admin-panel"
                );

            },

            onError: (err: unknown) => {

                setError(

                    err instanceof Error

                        ? err.message

                        : "Something went wrong."

                );

            },

        });


    // ==========================================
    // Submit
    // ==========================================

    function handlerSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setError("");


        // ==========================================
        // Validation
        // ==========================================

        if (password !== password2) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        if (password.length < 8) {

            setError(
                "Password must be at least 8 characters."
            );

            return;

        }


        // ==========================================
        // Mutation
        // ==========================================

        registerMutation.mutate({

            username:
                username.trim(),

            email:
                email.trim(),

            password,

            password2,

        });

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="register-container">


            <div className="register-card">


                <div className="register-header">

                    <h1>
                        Create Operator Account
                    </h1>

                    <p>
                        Join MultiShop as an operator.
                    </p>

                </div>


                <form

                    className="register-form"

                    onSubmit={
                        handlerSubmit
                    }

                >


                    <div className="input-group">

                        <User size={20} />

                        <input

                            type="text"

                            placeholder="Username"

                            value={username}

                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    <div className="input-group">

                        <Mail size={20} />

                        <input

                            type="email"

                            placeholder="Email"

                            value={email}

                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    <div className="input-group">

                        <Lock size={20} />

                        <input

                            type="password"

                            placeholder="Password"

                            value={password}

                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    <div className="input-group">

                        <Lock size={20} />

                        <input

                            type="password"

                            placeholder="Confirm Password"

                            value={password2}

                            onChange={(e) =>
                                setPassword2(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    {error && (

                        <div className="error-message">

                            {error}

                        </div>

                    )}


                    <button

                        type="submit"

                        className="register-button"

                        disabled={
                            registerMutation.isPending
                        }

                    >

                        {
                            registerMutation.isPending

                                ? "Creating..."

                                : "Create Operator"
                        }

                    </button>


                </form>


                <div className="login-link">

                    <span>

                        Already have an account?

                    </span>


                    <Link href="/login">

                        Login

                    </Link>

                </div>


            </div>


        </div>

    );

}