import React from "react";
import TicketReplyList from "@/components/admin panel/TicketReply/TicketReplyList";

interface Props {
    params: Promise<{
        ticketId: string;
    }>;
}

export default async function Page({ params }: Props) {

    const { ticketId } = await params;

    return (
        <TicketReplyList
            ticketId={Number(ticketId)}
        />
    );
}