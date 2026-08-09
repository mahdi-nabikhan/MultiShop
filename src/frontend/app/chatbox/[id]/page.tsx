"use client";

import ChatBox from "@/components/chat/ChatBox/ChatBox";

export default function Page() {

    const storeId = 1;
    const currentUserId = 3;

    return (
        <div className="container">

            <ChatBox
                storeId={storeId}
                currentUserId={currentUserId}
            />

        </div>
    );
}