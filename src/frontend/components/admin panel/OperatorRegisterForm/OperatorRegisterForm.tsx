"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { User, Mail, Lock } from "lucide-react";

import BACKEND_URLS from "@/utils";
import "./OperatorRegisterForm.css";

export default function OperatorRegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlerSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${BACKEND_URLS}vendor/api/v1/admin/register/`,
        {
          username,
          user: {
            email,
            password,
            password2,
          },
        },
        {
          withCredentials: true,
        }
      );

      router.push("/shop-admin-panel");

    } catch (err) {

      if (axios.isAxiosError(err)) {

        setError(
          typeof err.response?.data === "string"
            ? err.response.data
            : JSON.stringify(err.response?.data)
        );

      } else {

        setError("Something went wrong.");

      }

    } finally {

      setLoading(false);

    }
  }

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