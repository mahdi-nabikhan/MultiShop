import axios from "axios";
import BACKEND_URLS from "@/utils";
import { profileConfig, UserRole } from "./profileConfig";

export async function getProfile(role: UserRole) {
    const response = await axios.get(
        `${BACKEND_URLS}${profileConfig[role].endpoint}`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function updateProfile(
    role: UserRole,
    data: FormData | Record<string, any>
) {
    const response = await axios.put(
        `${BACKEND_URLS}${profileConfig[role].endpoint}`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}