"use client";

import { useQuery } from "@tanstack/react-query";

import {
    getCustomerTicketDetail,
    getCustomerTicketReplies,
} from "@/services/ticket.services";

import {
    CustomerTicketDetailProp,
    TicketReplyProp,
} from "@/types/ticket";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useCustomerTicketDetail(
    ticketId: number
) {

    const ticketQuery = useQuery<CustomerTicketDetailProp>({
        queryKey: customerQueryKeys.ticket(ticketId),

        queryFn: () =>
            getCustomerTicketDetail(ticketId),

        enabled: !!ticketId,

        staleTime: 5 * 60 * 1000,

        gcTime: 30 * 60 * 1000,
    });


    const repliesQuery = useQuery<TicketReplyProp[]>({
        queryKey:
            customerQueryKeys.ticketReplies(ticketId),

        queryFn: () =>
            getCustomerTicketReplies(ticketId),

        enabled: !!ticketId,

        staleTime: 5 * 60 * 1000,

        gcTime: 30 * 60 * 1000,
    });


    const refresh = async () => {

        await Promise.all([
            ticketQuery.refetch(),
            repliesQuery.refetch(),
        ]);

    };


    return {

        ticket: ticketQuery.data,

        replies: repliesQuery.data ?? [],

        isLoading:
            ticketQuery.isLoading ||
            repliesQuery.isLoading,

        isError:
            ticketQuery.isError ||
            repliesQuery.isError,

        refresh,

    };

}