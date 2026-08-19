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