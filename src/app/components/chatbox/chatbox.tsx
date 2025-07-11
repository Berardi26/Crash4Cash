import React, { useState } from "react";
import { useChatMessages, ChatMessage } from "../../hooks/useChatMessages";
import ChatItem from "./chatittem";
import { Button } from "@heroui/react";
import AirdropCard from "../card/airdrop";
import { radialGradient } from "framer-motion/client";

const Chatbox = () => {
    const { messages, sendMessage } = useChatMessages();
    const [input, setInput] = useState("");
    const [visible, setVisible] = useState(false);
    const [absolute, setAbsolute] = useState(false)

    const handleSend = () => {
        if (input.trim()) {
            sendMessage({
                user: "Guest", // Replace with actual user if available
                content: input,
            });
            setInput("");
        }
    };

    // Show chatbox by default on large screens
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setAbsolute(false)
            } else {
                setAbsolute(true)
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Toggle button for small screens */}
            <Button
                className="fixed bottom-6 right-6 z-50 lg:hidden bg-primary text-white px-4 py-2 rounded-full shadow-lg"
                style={{ display: visible ? 'none' : 'block' }}
                onClick={() => setVisible(true)}
            >
                Open Chat
            </Button>
            {/* Chatbox */}
            <div
                className={`
                    ${visible ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}
                    transform duration-150 ease-in-out
                    left-0 right-0 z-40
                    lg:w-80 h-[calc(100vh-60px)] lg:h-[calc(100vh-100px)]
                    flex flex-col bg-black/90 backdrop-blur-md shadow-lg  min-w-[320px] sm:max-w-[350px] border border-[#23232a]
                    transition-all
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#23232a] px-2 py-1 rounded text-xs font-semibold text-gray-300">Degen Chat</span>
                        <span className="text-primary-400 font-bold text-sm ml-2">{messages.length}</span>
                    </div>
                    <Button
                        className="bg-[#23232a] p-1 rounded hover:bg-[#2d2d36] min-w-0 px-2"
                        onPress={() => setVisible(false)}
                    >
                        <span className="text-gray-400">⏴</span>
                    </Button>
                </div>
                {/* Airdrop Banner */}
                {/* <div className="relative">
                    <div
                        className="absolute animate-pulse -inset-1 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 opacity-30 blur-sm transition-opacity duration-300 group-hover:opacity-40"
                    ></div>
                    <div
                        className="relative flex h-12 w-full  items-center justify-between px-4 rounded-xl bg-black/80"
                    >
                        <div className="text-xl text-primary-300 font-bold">LIVE <span className="ml-1">AIRDROP</span></div>
                        <div className="flex items-center gap-2">
                            <span className="bg-primary px-2 py-1 rounded text-white text-xs font-bold">0.264</span>
                        </div>
                    </div>


                    background: radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 20%,
      #111111aa 50%
    );
    background-size: 3px 3px;


                </div> */}
                {/* <AirdropCard /> */}
                {/* Chat Messages */}
                <div className=""
                    style={{
                        background: `radial-gradient(circle at 50% 50%, #0000 0, #0000 20%, #111111aa 50%)`,
                        backgroundSize: '3px 3px',
                    }}>
                    <AirdropCard />
                </div>
                <div className="fixed pointer-events-none bg-gradient-to-b from-black/90 z-20 to-transparent w-full left-0 top-52 h-32"> </div>
                <div className="pl-4 pr-3 relative flex-1 overflow-y-auto space-y-3 mb-2 scrollbar-thin scrollbar-thumb-[#23232a] scrollbar-track-transparent">
                    {messages.map((msg: ChatMessage, idx: number) => (
                        <ChatItem {...msg} key={idx} />
                    ))}
                </div>
                {/* Chat Input */}
                <div className="mt-auto px-4 pt-2 border-t border-[#23232a]">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type Message Here..."
                            className="flex-1 bg-[#23232a] text-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                        />
                        <Button
                            className="bg-primary hover:bg-primary-800 text-white px-3 py-2 rounded font-bold text-sm"
                            onClick={handleSend}
                        >
                            ▶
                        </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Chat Rules</span>
                        <span>{160 - input.length}</span>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Chatbox;