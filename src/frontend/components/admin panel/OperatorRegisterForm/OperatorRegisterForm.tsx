"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOperator } from "@/services/auth.services";
import { User, Mail, Lock } from "lucide-react";
import "./OperatorRegisterForm.css";

export default function OperatorRegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlerSubmit = async (
    e: React.FormEvent<HTMLFormElement>
) => {

    e.preventDefault();

    setError("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername) {
        setError("Username is required.");
        return;
    }

    if (cleanUsername.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
    }

    if (cleanEmail.length === 0) {
        setError("Email is required.");
        return;
    }

    if (!password) {
        setError("Password is required.");
        return;
    }

    if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
    }

    if (!password2) {
        setError("Please confirm your password.");
        return;
    }

    if (password !== password2) {
        setError("Passwords do not match.");
        return;
    }

    try {

        setLoading(true);

        await createOperator({
            username: cleanUsername,
            user: {
                email: cleanEmail,
                password,
                password2,
            },
        });

        setUsername("");
        setEmail("");
        setPassword("");
        setPassword2("");

        router.push("/shop-admin-panel");

    } catch (err) {

        console.error(err);

        if (
            typeof err === "object" &&
            err !== null &&
            "response" in err
        ) {

            const axiosError = err as {
                response?: {
                    data?: unknown;
                };
            };

            const responseData =
                axiosError.response?.data;

            if (typeof responseData === "string") {

                setError(responseData);

            } else if (responseData) {

                setError(
                    JSON.stringify(responseData)
                );

            } else {

                setError(
                    "Failed to create operator."
                );

            }

        } else {

            setError(
                "Something went wrong."
            );

        }

    } finally {

        setLoading(false);

    }
};

  return (
    <div className="register-container">

      <div className="register-card">

        <div className="register-header">

          <h1>Create Operator Account</h1>

          <p>
            Join MultiShop as an operator.
          </p>

        </div>

        <form
          className="register-form"
          onSubmit={handlerSubmit}
        >

          <div className="input-group">

            <User size={20} />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
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
                setEmail(e.target.value)
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
                setPassword(e.target.value)
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
                setPassword2(e.target.value)
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
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Operator"}

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