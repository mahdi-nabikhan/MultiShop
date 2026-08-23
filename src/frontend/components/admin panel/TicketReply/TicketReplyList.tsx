"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTicketReplies } from "@/services/shop-admin-panel.services";
import { Reply } from "@/types/panel-admin";
import "./TicketReply.css";
import { useState } from "react";
import AddReplyModal from "./AddReplyModal";
import EditReplyModal from "./EditReplyModal";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import DeleteReplyModal from "./DeleteReplyModal";

interface Props {
    ticketId: number;
}

export default function TicketReplyList({
    ticketId,
}: Props) {

    const queryClient = useQueryClient();

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [selectedReply, setSelectedReply] =
        useState<Reply | null>(null);

    const {
        data: replies = [],
        isPending,
        isError,
    } = useQuery<Reply[]>({
        queryKey: shopAdminQueryKeys.ticketReplies(ticketId),
        queryFn: () => getTicketReplies(ticketId),
    });


    const refreshReplies = async () => {

        await queryClient.invalidateQueries({
            queryKey: shopAdminQueryKeys.ticketReplies(ticketId),
        });

    };


    const handleCloseEdit = () => {

        setOpenEdit(false);
        setSelectedReply(null);

    };


    const handleCloseDelete = () => {

        setOpenDelete(false);
        setSelectedReply(null);

    };


    if (isPending) {

        return <h2>Loading...</h2>;

    }


    if (isError) {

        return <h2>Failed to load replies</h2>;

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

                replies.length === 0 ? (

                    <p>
                        No replies yet.
                    </p>

                ) : (

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

                )

            }


            <AddReplyModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                ticketId={ticketId}
                refreshReplies={refreshReplies}
            />


            {

                selectedReply && (

                    <EditReplyModal
                        open={openEdit}
                        onClose={handleCloseEdit}
                        reply={selectedReply}
                        refreshReplies={refreshReplies}
                    />

                )

            }


            {

                selectedReply && (

                    <DeleteReplyModal
                        open={openDelete}
                        onClose={handleCloseDelete}
                        replyId={selectedReply.id}
                        refreshReplies={refreshReplies}
                    />

                )

            }

        </div>

    );

}