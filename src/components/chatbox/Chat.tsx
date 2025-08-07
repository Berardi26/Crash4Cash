import { useEffect, useRef } from "react";
import ChatItem from "./ChatItem";
import { ChatMessage, useChatMessages } from "@/hooks/useChatMessages";

const Chat = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialLoad = useRef(true);
    const {
        messages,
        sendMessage,
        loading,
        typingUsers,
        onlineCount,
        startTyping,
        stopTyping,
        isAuthenticated
    } = useChatMessages()

    // Scroll to bottom only on initial load
    useEffect(() => {
        console.log("messages", messages, onlineCount, loading);
        if (initialLoad.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView();
            initialLoad.current = false;
        }
    }, [messages, loading, onlineCount]);


    return (
        <div className="flex flex-col relative w-full h-full max-h-[calc(100vh-281px)]">
            {/* Top gradient overlay */}
            <div className="absolute bg-gradient-primary w-full top-0 left-0 h-[40px] z-10" />

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
                <div className="flex flex-col w-full gap-2.5">
                    {messages?.map((chat: ChatMessage, index: number) => (
                        <ChatItem key={`${chat._id}`} {...chat} />
                    ))}
                    {/* Scroll anchor (only used for initial scroll) */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bg-gradient-primary-reserve w-full bottom-0 left-0 h-[40px] z-10" />
        </div>
    );
};

export default Chat;