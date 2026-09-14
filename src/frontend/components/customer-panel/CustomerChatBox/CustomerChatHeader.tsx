interface CustomerChatHeaderProps {
    conversationId: number;
}

function CustomerChatHeader({
    conversationId,
}: CustomerChatHeaderProps) {
    return (
        <header className="customer-chat-header">
            <div className="customer-chat-user">
                <div className="customer-chat-avatar">
                    S
                </div>

                <div>
                    <h3>
                        Store Chat
                    </h3>

                    <span>
                        Conversation #{conversationId}
                    </span>
                </div>
            </div>
        </header>
    );
}

export default CustomerChatHeader;