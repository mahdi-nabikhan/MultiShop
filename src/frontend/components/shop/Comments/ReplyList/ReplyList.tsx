"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

interface IReply {
    id: number;
    descriptions: string;
    status: string;
    user: number;
    product: number;
    parent: number | null;
}

interface Props {
    commentID: number;
}

export default function ReplyList({ commentID }: Props) {

    const [replies, setReplies] = useState<IReply[]>([]);

    const [loading, setLoading] = useState(false);

    async function loadReplies() {

        try {

            setLoading(true);

            const { data } = await axios.get<IReply[]>(
                `${BACKEND_URLS}customer/api/v1/add/get/comment/repaly/${commentID}/`,
                {
                    withCredentials: true,
                }
            );

            setReplies(data);

        } catch (error) {

            console.error(
                "Failed to load replies:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadReplies();

    }, [commentID]);


    if (loading) {

        return (
            <div className="reply-loading">
                Loading replies...
            </div>
        );

    }


    if (replies.length === 0) {

        return null;

    }


    return (

        <div className="reply-list">

            {replies.map((reply) => (

                <div
                    key={reply.id}
                    className="reply-item"
                >

                    <div className="reply-icon">
                        ↳
                    </div>


                    <div className="reply-content">

                        <div className="reply-header">

                            <span className="reply-user">
                                User #{reply.user}
                            </span>

                        </div>


                        <p className="reply-text">
                            {reply.descriptions}
                        </p>

                    </div>

                </div>

            ))}

        </div>

    );

}