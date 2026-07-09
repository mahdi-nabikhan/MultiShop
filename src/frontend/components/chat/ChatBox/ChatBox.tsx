import ChatMessage from "../ChatMessage/ChatMessage";

import "./ChatBox.css";

export default function ChatBox() {

    const messages = [

        {
            id:1,
            sender:"seller",
            message:"Hello 👋 Welcome to our store.",
            time:"10:30"
        },

        {
            id:2,
            sender:"customer",
            message:"Hi, Is this laptop still available?",
            time:"10:31"
        },

        {
            id:3,
            sender:"seller",
            message:"Yes, it's available.",
            time:"10:31"
        },

        {
            id:4,
            sender:"customer",
            message:"Perfect. Thank you ❤️",
            time:"10:32"
        }

    ] as const;

    return (

        <section className="chatbox">

            <div className="chat-header">

                <div className="seller-info">

                    <div className="avatar">

                        T

                    </div>

                    <div>

                        <h3>Tech World</h3>

                        <span>Online</span>

                    </div>

                </div>

            </div>

            <div className="chat-body">

                {messages.map((item)=>(

                    <ChatMessage

                        key={item.id}

                        message={item.message}

                        sender={item.sender}

                        time={item.time}

                    />

                ))}

            </div>

        </section>

    );

}