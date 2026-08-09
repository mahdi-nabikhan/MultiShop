
"use client";

import ChatBox from "@/components/chat/ChatBox/ChatBox";

export default function Page() {

    const storeId = 1;

    const currentUserEmail =
        "customer1@gmail.com";

    return (

        <div className="container">

            <ChatBox
                storeId={storeId}
                currentUserEmail={currentUserEmail}
            />

        </div>

    );

}

