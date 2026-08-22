"use client";
import React from 'react'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { registerManager } from '@/services/auth.services';
import { useMutation } from "@tanstack/react-query";
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
  const registerManagerMutation = useMutation({
    mutationFn: registerManager,

    onSuccess: () => {
      router.push("/");
    },
  });
  function handlerSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    registerManagerMutation.mutate({
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
    });
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

          {registerManagerMutation.error && (
            <div className="error-message">
              {registerManagerMutation.error instanceof Error
                ? registerManagerMutation.error.message
                : "Something went wrong."
              }
            </div>
          )}

          <button
            type="submit"
            disabled={registerManagerMutation.isPending}
            className="submit-btn"
          >
            {registerManagerMutation.isPending
              ? "Creating..."
              : "Create Store"
            }
          </button>

        </form>
      </div>
    </div>
  );

}
