export interface CustomerProfileProp {

    id: number;

    username: string;

    is_customer: boolean;

    user: number;

}




export interface Customer {
    username: string;
}

export interface Address {
    id: number;
    state: string;
    city: string;
    postal_code: string;
    customer: Customer;
}
