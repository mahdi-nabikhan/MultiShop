import axios from "axios";
import BACKEND_URLS from "@/utils";
import {
    ChangePasswordData, LoginRequest
    , LoginResponse, RegisterRequest
    , RegisterShopAdminPayload, CreateOperatorData,
    RegisterManagerData
} from "@/types/auth";

export async function changePassword(
    data: ChangePasswordData
) {
    const response = await axios.put(
        `${BACKEND_URLS}accounts/api/v1/change-password/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}





export async function login(
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
        `${BACKEND_URLS}account/api/v1/jwt/token/login/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}





export async function register(
    data: RegisterRequest
) {
    const response = await axios.post(
        `${BACKEND_URLS}customer/api/v1/customer/register/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}





export async function registerShopAdmin(
    payload: RegisterShopAdminPayload
) {
    const { data } = await axios.post(
        `${BACKEND_URLS}vendor/api/v1/admin/register/`,
        {
            username: payload.username,
            user: {
                email: payload.email,
                password: payload.password,
                password2: payload.password2,
            },
        },
        {
            withCredentials: true,
        }
    );

    return data;
}


export async function createOperator(
    data: CreateOperatorData
) {

    const response = await axios.post(
        `${BACKEND_URLS}vendor/api/v1/admin/register/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}






export async function registerManager(
    data: RegisterManagerData
): Promise<void> {

    await axios.post(

        `${BACKEND_URLS}vendor/api/v1/manager/register/`,

        data,

        {
            withCredentials: true,
        }

    );

}