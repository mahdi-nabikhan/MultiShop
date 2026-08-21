export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    new_password1: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user_id: number;
    redirect_url: string | null;
}

export interface RegisterRequest {
    username: string;
    user: {
        email: string;
        password: string;
        password2: string;
    };
}

export interface RegisterShopAdminPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
}

export interface CreateOperatorData {
    username: string;
    user: {
        email: string;
        password: string;
        password2: string;
    };
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




export interface RegisterRequest {
    username: string;
    user: {
        email: string;
        password: string;
        password2: string;
    };
}




export interface RegisterShopAdminPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
}


export interface CreateOperatorData {
    username: string;
    user: {
        email: string;
        password: string;
        password2: string;
    };
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
