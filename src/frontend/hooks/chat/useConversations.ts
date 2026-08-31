import { useQuery } from "@tanstack/react-query";
import { chatQueryKeys } from "@/Lib/query-keys/chat.keys";
import { getCustomerConversations } from "@/services/chat.services";

export default function useConversations() {
    return useQuery({
        queryKey: chatQueryKeys.conversations(),
        queryFn: getCustomerConversations,
    });
}