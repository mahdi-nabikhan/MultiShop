"use client";

import axios from "axios";
import { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import BACKEND_URLS from "@/utils";

import ProfileForm from "./ProfileForm";


type Role = "manager" | "admin" | "operator";


export default function Profile() {


    const queryClient = useQueryClient();


    const [editMode, setEditMode] = useState(false);



    // گرفتن رول کاربر
    const roleQuery = useQuery<Role>({

        queryKey: ["user-role"],


        queryFn: async () => {

            const response = await axios.get(

                `${BACKEND_URLS}vendor/api/v1/store/user/roles/`,

                {
                    withCredentials: true
                }

            );


            return response.data.role;

        },

    });





    // گرفتن اطلاعات پروفایل
    const profileQuery = useQuery({


        queryKey: [
            "profile",
            roleQuery.data
        ],


        enabled: !!roleQuery.data,



        queryFn: async () => {


            const response = await axios.get(

                `${BACKEND_URLS}vendor/api/v1/${roleQuery.data}/detail/`,

                {
                    withCredentials: true
                }

            );


            return response.data;


        }


    });






    // آپدیت پروفایل
    const updateMutation = useMutation({


        mutationFn: async (data:any) => {


            const response = await axios.put(


                `${BACKEND_URLS}vendor/api/v1/${roleQuery.data}/detail/`,


                data,


                {
                    withCredentials:true
                }

            );


            return response.data;


        },



        onSuccess:()=>{


            queryClient.invalidateQueries({

                queryKey:[
                    "profile",
                    roleQuery.data
                ]

            });


            setEditMode(false);


        }


    });






    if(roleQuery.isPending)

        return (

            <p>
                Loading role...
            </p>

        );




    if(roleQuery.isError)

        return (

            <p>
                Failed to load role
            </p>

        );





    if(profileQuery.isPending)

        return (

            <p>
                Loading profile...
            </p>

        );





    if(profileQuery.isError)

        return (

            <p>
                Failed to load profile
            </p>

        );






    const profile = profileQuery.data;



    return (

        <div className="profile-container">



            {
                !editMode && (

                    <div className="profile-card">


                        <h2>
                            Profile Information
                        </h2>



                        <div className="profile-row">

                            <span>
                                First Name
                            </span>

                            <strong>
                                {
                                    profile.first_name || "-"
                                }
                            </strong>

                        </div>




                        <div className="profile-row">

                            <span>
                                Last Name
                            </span>

                            <strong>
                                {
                                    profile.last_name || "-"
                                }
                            </strong>

                        </div>





                        <div className="profile-row">

                            <span>
                                Email
                            </span>

                            <strong>

                                {
                                    profile.user?.email || "-"
                                }

                            </strong>

                        </div>





                        <div className="profile-row">

                            <span>
                                Store
                            </span>


                            <strong>

                                {
                                    profile.store?.name || "-"
                                }

                            </strong>

                        </div>





                        <button

                            className="edit-profile-btn"

                            onClick={()=>setEditMode(true)}

                        >

                            Edit Profile

                        </button>



                    </div>

                )
            }







            {
                editMode && (


                    <div className="profile-edit-box">



                        <button

                            className="back-profile-btn"

                            onClick={()=>setEditMode(false)}

                        >

                            Back

                        </button>





                        <ProfileForm


                            data={profile}


                            loading={
                                updateMutation.isPending
                            }



                            onSubmit={(values)=>{

                                updateMutation.mutate(values);

                            }}


                        />



                    </div>


                )
            }



        </div>

    );

}