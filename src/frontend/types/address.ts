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

export interface CreateAddressRequest {
    state: string;
    city: string;
    postal_code: string;
}



export interface Address2 {
    id:number;
    state:string;
    city:string;
    postal_code:string}