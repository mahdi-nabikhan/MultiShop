export interface Reply {

    id: number;

    content: string;

    created: string;

}
export interface StoreData {
    pk: number;
    image: string | null;
    description?: string;
    name?: string;
}

export interface StoreFormData {
    name: string;
    description: string;
}
export interface Ticket {
    pk: number;
    title: string;
    content: string;
    store: number;
    customer: {
        id: number;
        username: string;
        is_customer: boolean;
        user: number;
    };
}
export interface ShopProductData {

    id: number;

    name: string;

    description: string;

    quantity_in_stock: number;

    price: number;

    price_after: number;

    product_image: string | null;

    category: number;

    store: number;

}


export interface ProductImage {

    id: number;

    product_image: string;

    title: string | null;

    description: string | null;

    product: number;

}


export interface ProductImage {

    id: number;

    product_image: string;

    title: string | null;

    description: string | null;

    product: number;

}



interface Customer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}

export interface Order {
    pk: number;
    status: boolean;
    customer: Customer;
}



export interface Product {
    id: number;
    name: string;
    description: string;
    quantity_in_stock: string;
    price: number;
    price_after: number;
    product_image: string | null;
    category: number;
    store: number;
}

export interface OrderItem {
    id: number;
    quantity: number;
    status: string;
    created: string;
    total: string;
    order: number;
    product: Product;
}




export interface Operator {
    id:number
    username: string;
    user: {
        email: string;
    };
}
export interface OperatorDetail {
    username: string;
    user: {
        email: string;
    };
}




export interface Conversation {
    id: number;
    store: number;
    customer: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}
export interface Admin {
    id:number
    username: string;
    user: {

        email: string;
    };
}
export interface DiscountData {
    id: number;
    products: number;
    value: number;
    discount_type: "cash" | "percent";
}


export interface AdminDetailProp {

    username: string;

    user: {

        email: string;

    };

}


export interface Message {

    id: number;

    conversation: number;

    sender: string | null;

    text: string | null;

    image: string | null;

    file: string | null;

    reply_to: number | null;

    is_read: boolean;

    is_edited: boolean;

    is_deleted: boolean;

    created_at: string;

    edited_at: string | null;

}

export interface CreateDiscountPayload {

    value: number;

    discount_type: "cash" | "percent";

}
export interface ShopProductListData {
    id: number;
    name: string;
    description: string;
    quantity_in_stock: number;
    price: number;
    price_after: number;
    product_image: string | null;
    category: number;
    store: number;
}
