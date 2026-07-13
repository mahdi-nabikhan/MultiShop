"use client";
import React from 'react'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import axios from 'axios';
import BACKEND_URLS from '@/utils';
import './RegisterManager.css'
export default function RegisterManager() {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");

    const [state, setState] = useState("");
    const [street, setStreet] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
        await axios.post(
            `${BACKEND_URLS}vendor/api/v1/manager/register/`,
            {
                user: {
                    email,
                    password,
                    password2,
                },
                store: {
                    name: storeName,
                    description: storeDescription,
                },
                address: {
                    state,
                    street,
                },
                first_name: firstName,
                last_name: lastName,
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
        
  <div className="manager-register-container">
    <div className="manager-register-card">

      <div className="manager-register-header">
        <h1>Create Store Account</h1>
        <p>Start selling on MultiShop today.</p>
      </div>

      <form onSubmit={handlerSubmit} className="manager-register-form">

        <h2>Personal Information</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <h2>Account Information</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <h2>Store Information</h2>

        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />

        <textarea
          placeholder="Store Description"
          value={storeDescription}
          onChange={(e) => setStoreDescription(e.target.value)}
          rows={4}
          required
        />

        <h2>Store Address</h2>

        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? "Creating..." : "Create Store"}
        </button>

      </form>
    </div>
  </div>
);
    
}
