"use client";

import { useEffect, useState } from "react";
import "./UpdateAdminModal.css";

interface Props {
    open: boolean;
    loading: boolean;
    username: string;
    onClose: () => void;
    onConfirm: (username: string) => void;
}

export default function UpdateAdminModal({
    open,
    loading,
    username,
    onClose,
    onConfirm,
}: Props) {

    const [value, setValue] = useState(username);


    useEffect(() => {

        setValue(username);

    }, [username, open]);


    if (!open) {
        return null;
    }


    const handleSubmit = () => {

        const cleanUsername = value.trim();

        if (!cleanUsername) {
            return;
        }

        onConfirm(cleanUsername);

    };


    return (

        <div
            className="update-modal-overlay"
            onClick={onClose}
        >

            <div
                className="update-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="update-modal-header">

                    <h2>
                        Update Admin
                    </h2>

                </div>


                <div className="update-form-group">

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                            setValue(e.target.value)
                        }
                        placeholder="Enter username"
                        disabled={loading}
                    />

                </div>


                <div className="update-modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="update-button"
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !value.trim()
                        }
                    >

                        {loading
                            ? "Updating..."
                            : "Update"
                        }

                    </button>

                </div>

            </div>

        </div>

    );
}