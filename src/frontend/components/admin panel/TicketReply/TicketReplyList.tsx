"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

import "./TicketReply.css";

import AddReplyModal from "./AddReplyModal";
import EditReplyModal from "./EditReplyModal";
import DeleteReplyModal from "./DeleteReplyModal";

interface Reply {

    id: number;

    content: string;

    created: string;

}

interface Props {

    ticketId: number;

}

export default function TicketReplyList({

    ticketId,

}: Props) {

    const [replies, setReplies] = useState<Reply[]>([]);

    const [loading, setLoading] = useState(true);

    const [openAdd, setOpenAdd] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedReply, setSelectedReply] =
        useState<Reply | null>(null);

    const getReplies = async () => {

        try {

            const { data } = await axios.get<Reply[]>(

                `${BACKEND_URLS}dashboard/api/v1/replay/ticket/${ticketId}/`,

                {

                    withCredentials: true,

                }

            );

            setReplies(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getReplies();

    }, [ticketId]);

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="reply-page">

            <div className="reply-header">

                <h2>

                    Replies

                </h2>

                <button

                    onClick={() => setOpenAdd(true)}

                    className="add-reply-btn"

                >

                    + Add Reply

                </button>

            </div>

            {

                replies.map((reply) => (

                    <div

                        className="reply-card"

                        key={reply.id}

                    >

                        <p>

                            {reply.content}

                        </p>

                        <span>

                            {reply.created}

                        </span>

                        <div className="reply-actions">

                            <button

                                className="edit"

                                onClick={() => {

                                    setSelectedReply(reply);

                                    setOpenEdit(true);

                                }}

                            >

                                Edit

                            </button>

                            <button

                                className="delete"

                                onClick={() => {

                                    setSelectedReply(reply);

                                    setOpenDelete(true);

                                }}

                            >

                                Delete

                            </button>

                        </div>

                    </div>

                ))

            }

            <AddReplyModal

                open={openAdd}

                onClose={() => setOpenAdd(false)}

                ticketId={ticketId}

                refreshReplies={getReplies}

            />

            {

                selectedReply && (

                    <EditReplyModal

                        open={openEdit}

                        onClose={() => setOpenEdit(false)}

                        reply={selectedReply}

                        refreshReplies={getReplies}

                    />

                )

            }

            {

                selectedReply && (

                    <DeleteReplyModal

                        open={openDelete}

                        onClose={() => setOpenDelete(false)}

                        replyId={selectedReply.id}

                        refreshReplies={getReplies}

                    />

                )

            }

        </div>

    );

}