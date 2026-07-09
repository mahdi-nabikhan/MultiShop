import "./ChatMessage.css";

interface ChatMessageProps {
  message: string;
  sender: "customer" | "seller";
  time: string;
}

export default function ChatMessage({
  message,
  sender,
  time,
}: ChatMessageProps) {
  return (
    <div
      className={`chat-message ${
        sender === "customer"
          ? "customer"
          : "seller"
      }`}
    >
      <div className="message-content">
        <p>{message}</p>

        <span>{time}</span>
      </div>
    </div>
  );
}