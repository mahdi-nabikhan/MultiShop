"use client";

import { useEffect, useState } from "react";


interface ProfileData {
    [key: string]: any;
}


interface Props {
    data: ProfileData;
    loading: boolean;
    onSubmit: (values: ProfileData) => void;
}


export default function ProfileForm({
    data,
    loading,
    onSubmit,
}: Props) {


    const [formData, setFormData] = useState<ProfileData>({});



    useEffect(() => {

        if(data){
            setFormData(data);
        }

    }, [data]);



    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ){

        const {name,value} = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    }



    function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ){

        e.preventDefault();

        onSubmit(formData);

    }



    return (

        <form onSubmit={handleSubmit}>



            {
                Object.keys(formData)
                .filter(
                    field =>
                    field !== "id" &&
                    field !== "user" &&
                    field !== "shop" &&
                    field !== "is_manager"
                )
                .map(field => (

                    <div key={field}>

                        <label>
                            {field}
                        </label>


                        <input
                            name={field}
                            value={
                                formData[field] ?? ""
                            }
                            onChange={handleChange}
                        />

                    </div>

                ))
            }



            <button
                type="submit"
                disabled={loading}
            >

                {
                    loading
                    ?
                    "Saving..."
                    :
                    "Save"
                }

            </button>


        </form>

    );
}