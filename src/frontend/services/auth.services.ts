import axios from "axios";
import BACKEND_URLS from "@/utils";

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    new_password1: string;
}

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



export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: number;
  redirect_url: string | null;
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



export interface RegisterRequest {
  username: string;
  user: {
    email: string;
    password: string;
    password2: string;
  };
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




export interface RegisterShopAdminPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
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


interface CreateOperatorData {
    username: string;
    user: {
        email: string;
        password: string;
        password2: string;
    };
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




export interface RegisterManagerData {

    user: {
        email: string;
        password: string;
        password2: string;
    };

    store: {
        name: string;
        description: string;
    };

    address: {
        state: string;
        street: string;
    };

    first_name: string;
    last_name: string;

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