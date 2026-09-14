interface AdminChatHeaderProps {
    conversationId: number;
}

function AdminChatHeader({
    conversationId,
}: AdminChatHeaderProps) {
    return (
        <header className="admin-chat-header">
            <div className="admin-chat-user">
                <div className="admin-chat-avatar">
                    C
                </div>

                <div>
                    <h3>Customer</h3>

                    <span>
                        Conversation #{conversationId}
                    </span>
                </div>
            </div>
        </header>
    );
}

export default AdminChatHeader;