export interface CommentReply {
    id: number;
    descriptions: string;
    status: string;
    user: number;
    product: number;
    parent: number | null;
}


export interface CreateCommentPayload {
    descriptions: string;
    parent?: number;
}





export interface ProductComment {

    id: number;

    content: string;

    created: string;

    product: number;

    customer: number;

}


export interface ProductComment {
    id: number;
    descriptions: string;
    status: string;
    user: {
        id: number;
        email: string;
    };
    product: number;
    parent: number | null;
}

export interface ProductCommentsResponse {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: ProductComment[];
}