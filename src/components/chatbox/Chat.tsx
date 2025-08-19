import { useEffect, useRef, useState } from "react";
import ChatSkeleton from "./ChatSkeleton";
import { ChatMessage } from "@/types/types";
import { Button, Input } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { FaPaperPlane } from "react-icons/fa6";
import { useWebSocket } from "@/contexts/SocketContext";

const Chat = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialLoad = useRef(true);
    const [input, setInput] = useState<string>("");
    const { userProfile } = useAuth()

    const { ws, sendMessage } = useWebSocket()

    // Scroll to bottom only on initial load
    useEffect(() => {
        // optional: listen to messages (overrides global handler if needed)
        if (!ws) return;

        const handleMessage = (e: MessageEvent) => {
            console.log('Received in component:', e.data);
        };

        ws.addEventListener('message', handleMessage);

        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    }, [ws]);


    return (
        <div className="flex flex-col relative w-full flex-1">
            {/* Top gradient overlay */}
            <div className="absolute bg-gradient-primary w-full top-0 left-0 h-[40px] z-10" />

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
                <div className="flex flex-col w-full gap-2.5">
                    {/* {loading && new Array(5).fill(null).map((_, index) => (
                        <ChatSkeleton key={index} />
                    ))}
                    {messages?.map((chat: ChatMessage, index: number) => (
                        <ChatItem key={`${chat._id}`} {...chat} />
                    ))} */}
                    {/* Scroll anchor (only used for initial scroll) */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bg-gradient-primary-reserve w-full bottom-0 left-0 h-[40px] z-10" />
            <div>
                <div className="relative opacity-100 animate-fade-in">
                    <div className="absolute hidden bg-linear-to-b from-[#223150] to-[#0f1823] p-px w-[calc(100%-1rem)] mx-auto bottom-full inset-x-0 z-5 rounded-md transition-[transform,opacity] duration-300 cursor-pointer shadow-md opacity-100 translate-y-0">
                        <div className="flex items-center justify-between bg-[#162135] text-[#919191] pointer-events-none w-full h-max px-3 py-2 backdrop-blur-xl rounded-md">
                            <div className="flex items-center gap-1.5 text-sm text-[#E3E3E3]">
                                {/* <Icon icon="material-symbols-light:pause-rounded" width="24" height="24" style={{ color: "#E3E3E3" }} /> */}
                                <p>Chat Paused</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between p-4 pt-3 shrink-0 gap-2">
                        <div className="relative w-full bg-layer2 p-px font-inter rounded-lg flex gap-2">
                            <Input
                                name="message"
                                id="sendMsg"
                                placeholder="Type Message Here..."
                                maxLength={160}
                                value={input}
                                className={` `}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-xs">{input.length}/160</span>
                                    </div>
                                }
                                onChange={(e) => setInput(e.target.value)} />
                            <Button
                                variant="bordered"
                                disabled={!userProfile || input.length === 0}
                                onPress={() => sendMessage({
                                    type: 'chat',
                                    message: input,
                                    user: userProfile?.username || 'Guest'
                                })}
                                className={`min-w-0`}
                                type="button"
                                aria-expanded="false"
                            >
                                <FaPaperPlane />
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center gap-1.5 cursor-pointer text-[#A2A2A2] hover:text-white transition-colors">
                                {/* <Icon icon="icon-park-solid:info" width="12" height="12" style={{ color: "#A2A2A2" }} /> */}
                                <p className="font-inter text-sm font-medium leading-[21px]">Chat Rules</p>
                            </div>
                            <div className="flex items-center gap-1.5 cursor-pointer text-[#A2A2A2] transition-colors">
                                {/* <Icon icon="tabler:message-filled" width="16" height="16" style={{ color: "#A2A2A2" }} /> */}
                                {/* <p className="font-inter text-sm font-medium leading-[21px]">{messages.length}</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;