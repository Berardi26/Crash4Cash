import { useEffect, useRef } from "react";
import ChatItem from "./ChatItem";
import { EChatEvent } from "@/types/socket";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useUserData } from "@/contexts/userDataContext";

const Chat = () => {
    const { user, messages, setMessages } = useUserData();
    const { chatSocket } = useChatSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialLoad = useRef(true);

    // Scroll to bottom only on initial load
    useEffect(() => {
        if (initialLoad.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView();
            initialLoad.current = false;
        }
    }, [messages]);

    // Socket event handlers
    useEffect(() => {
        if (!chatSocket) return;

        if (user && typeof user === "object" && "_id" in user) {
            chatSocket.emit(EChatEvent.JOIN, (user as { _id: string })._id);
        }

        chatSocket.on(EChatEvent.MESSAGE_HISTORY, (data: IChatItem[]) => {
            setMessages(data);
        });

        chatSocket.on(EChatEvent.NEW_MESSAGE, (message: IChatItem) => {
            setMessages(prev => [...prev, message]);
        });

        // chatSocket.on(EChatEvent.USER_LIST, (userList) => {
        //     setOnlineUsers(userList.length);
        // });

        return () => {
            chatSocket.off(EChatEvent.MESSAGE_HISTORY);
            chatSocket.off(EChatEvent.NEW_MESSAGE);
            chatSocket.off(EChatEvent.USER_LIST);
        };
    }, [chatSocket]);

    return (
        <div className="flex flex-col relative w-full h-full max-h-[calc(100vh-281px)]">
            {/* Top gradient overlay */}
            <div className="absolute bg-gradient-primary w-full top-0 left-0 h-[40px] z-10" />

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
                <div className="flex flex-col w-full gap-2.5">
                    {messages?.map((chat: IChatItem, index: number) => (
                        <ChatItem key={`${chat._id}-${index}`} {...chat} />
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