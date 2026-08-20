"use client";

import { useEffect, useState } from "react";
import { getProductComments } from "@/services/comment.services";

import CommentCard from "../CommentCard/CommentCard";
import Pagination from "../../../commen/Paginations";


interface IUser {
    id: number;
    email: string;
}


interface IComment {
    id: number;
    descriptions: string;
    status: string;
    user: IUser;
    product: number;
    parent: number | null;
}


interface IResponse {
    links: {
        next: string | null;
        previous: string | null;
    };

    count: number;

    results: IComment[];
}


interface Props {
    productID: number | string;
}


export default function CommentList({
    productID,
}: Props) {


    const [comments, setComments] =
        useState<IComment[]>([]);


    const [next, setNext] =
        useState<string | null>(null);


    const [previous, setPrevious] =
        useState<string | null>(null);


    const [page, setPage] =
        useState(1);


    const [loading, setLoading] =
        useState(false);


    async function loadComments(
        currentPage: number
    ) {

        try {

            setLoading(true);


            const  data  =await getProductComments(productID, currentPage)
               

            setComments(data.results);

            setNext(data.links.next);

            setPrevious(data.links.previous);


        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadComments(page);

    }, [page]);


    return (

        <div className="comment-list">

            {comments.map((comment) => (

                <CommentCard
                    key={comment.id}
                    comment={comment}
                    productID={productID}
                />

            ))}


            <Pagination

                next={next}

                previous={previous}

                loading={loading}

                onNext={() =>
                    setPage(
                        (prev: number) =>
                            prev + 1
                    )
                }

                onPrevious={() =>
                    setPage(
                        (prev: number) =>
                            Math.max(
                                1,
                                prev - 1
                            )
                    )
                }

            />

        </div>

    );

}