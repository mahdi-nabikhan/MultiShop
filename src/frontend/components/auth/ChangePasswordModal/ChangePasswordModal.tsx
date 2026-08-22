"use client";

import { changePassword } from "@/services/auth.services";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";


interface Props {
    isOpen: boolean;
    onClose: () => void;
}



export default function ChangePasswordModal({
    isOpen,
    onClose,
}: Props) {


    const [formData, setFormData] = useState({

        old_password: "",
        new_password: "",
        new_password1: "",

    });


    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<any>({});



    if (!isOpen)
        return null;

    const changePasswordMutation = useMutation({
        mutationFn: changePassword,

        onSuccess: () => {
            setMessage("Password changed successfully");

            setFormData({
                old_password: "",
                new_password: "",
                new_password1: "",
            });

            setTimeout(() => {
                onClose();
            }, 1500);
        },

        onError: (error: any) => {
            if (error.response?.data) {
                setErrors(error.response.data);
            }
        },
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    }



    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setErrors({});
        setMessage("");

        changePasswordMutation.mutate(formData);
    }



    return (


        <div className="password-overlay">


            <div className="password-modal">


                <div className="password-header">


                    <h2>
                        Change Password
                    </h2>


                    <button
                        onClick={onClose}
                    >
                        ×
                    </button>


                </div>




                <form onSubmit={handleSubmit}>


                    <input

                        type="password"

                        name="old_password"

                        placeholder="Current password"

                        value={
                            formData.old_password
                        }

                        onChange={handleChange}

                    />



                    {
                        errors.old_password &&
                        <p>
                            {errors.old_password}
                        </p>
                    }





                    <input

                        type="password"

                        name="new_password"

                        placeholder="New password"

                        value={
                            formData.new_password
                        }

                        onChange={handleChange}

                    />





                    <input

                        type="password"

                        name="new_password1"

                        placeholder="Confirm password"

                        value={
                            formData.new_password1
                        }

                        onChange={handleChange}

                    />



                    {
                        errors.password &&
                        <p>
                            {errors.password}
                        </p>
                    }





                    {
                        message &&
                        <span>
                            {message}
                        </span>
                    }



                    <button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending
                            ? "Changing..."
                            : "Change Password"
                        }
                    </button>


                </form>



            </div>


        </div>

    );
}