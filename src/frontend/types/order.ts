
export interface Cart {

    id: number;

    status: boolean;

    created: string;

    customer: number;

}


export interface Bill {

    id: number;

    created_at: string;

    status: boolean;

    cart: Cart;

    address: number;

}
export interface CustomerOrderProduct {

    id: number;

    name: string;

    description: string;

    product_image: string | null;

    price: number;

}


export interface CustomerOrderItem {

    id: number;

    quantity: number;

    status: string;

    created: string;

    total: string;

    order: number;

    product: CustomerOrderProduct;

}



export interface OrderProduct {

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


export interface OrderItem {

    id: number;

    quantity: number;

    status: string;

    created: string;

    total: string;

    order: number;

    product: OrderProduct;

}


export interface OrderAddress {

    id: number;

    state: string;

    city: string;

    postal_code: string;

    customer: {

        username: string;

    };

}
export interface SessionProduct {
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

export interface SessionCartItem {
    product: SessionProduct;
    quantity: number;
    total_price: number;
}

export interface SessionCartResponse {
    items: SessionCartItem[];
    total_quantity: number;
    total_price: number;
}

export interface Order {

    id: number;

    status: boolean;

    created: string;

    customer: number;

}