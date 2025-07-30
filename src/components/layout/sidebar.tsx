'use client'
import React, { useState } from "react";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useSetting } from "@/contexts/SettingContext";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import SendChat from "../chatbox/SendChat";
import { FaEject } from "react-icons/fa";
import Chat from "../chatbox/Chat";
import { FaRegComment, FaRocketchat } from "react-icons/fa6";

const Sidebar = () => {
  const { messages, sendMessage, loading, typingUsers, onlineCount, startTyping, stopTyping, isAuthenticated } = useChatMessages();
  const [input, setInput] = useState("");
  const [absolute, setAbsolute] = useState(false)
  const { sidebarOpen, setSidebarOpen } = useSetting()

  const handleSend = () => {
    if (!isAuthenticated) {
      alert("Please log in to send messages");
      return;
    }
    if (input.trim()) {
      sendMessage(input);
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

  // Typing event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (isAuthenticated) {
      startTyping();
    }
  };

  const handleInputBlur = () => {
    if (isAuthenticated) {
      stopTyping();
    }
  };

  return (
    <div className="flex w-fit h-full z-10 duration-300">
      {sidebarOpen && (
        <div
          className={`
            w-[350px] xl:w-[300px] 2xl:w-[350px] xl:bg-opacity-0 bg-[#1e2a38]
            transform duration-150 ease-in-out
            left-0 right-0 z-40
            h-[calc(100vh-60px)] lg:h-[calc(100vh-100px)] fixed bottom-0
            flex flex-col bg-black/90 backdrop-blur-md shadow-lg border border-[#23232a]
            transition-all
          `}
        >
          <div className="w-full px-6 py-4 bg-main top-0 left-0 z-[10] grow-0 shrink-0 animate-fade-in">
            <div className="flex w-full gap-2">
              <button className="flex w-full bg-gradient-border-btn p-[1px] rounded-lg">
                <div className="group flex items-center relative h-9 min-w-10 overflow-hidden transition duration-300 px-4 w-full bg-[#37445C] hover:bg-[#37445C]/75 rounded-lg justify-between cursor-pointer">
                  <div className="flex items-center gap-1 font-inter whitespace-nowrap w-[calc(100%-40px)] truncate">
                    {/* <Icon icon="heroicons-solid:chat" width="16" height="16" className="drop-shadow-small" style={{ color: "#fff" }} /> */}
                    <p className="font-bold text-xs truncate text-white drop-shadow-small">Degen Chat</p>
                  </div>
                  <div className="flex gap-1.5 items-center justify-center">
                    <div className="flex items-center justify-center w-3 h-3 bg-[#09A0FC]/40 rounded-full">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full">
                      </div>
                    </div>
                    {/* <p className="font-inter text-sm text-light-grey font-book">{onlineUsers}</p> */}
                  </div>
                </div>
              </button>
              <button className="flex w-fit bg-gradient-border-btn p-[1px] rounded-lg" onClick={() => setSidebarOpen(false)}>
                <div
                  className="group flex items-center justify-center h-9 px-4 transition duration-300 bg-[#37445C] hover:bg-[#37445C]/75 rounded-lg cursor-pointer"
                >
                  {/* <Icon icon="fluent:arrow-previous-16-filled" width="14" height="14" style={{ color: "#fff" }} /> */}
                  <FaEject  className="rounded-90 "/>
                </div>
              </button>
            </div>
          </div>
          <Chat />
          <SendChat />
        </div>
      )}
      <button
        className={`left-0 items-center justify-center min-w-10 transition duration-300 px-3 bg-[#303030] hover:bg-[#393939]/75 text-sm font-medium text-white rounded-lg fixed top-[84px] lg:top-[124px] z-[35] w-[56px] h-[56px] rounded-l-none border-r-[2px] border-[#3B3B3B] will-change-transform ${sidebarOpen ? "hidden xl:hidden" : "md:block hidden"} opacity-100 animate-fade-in cursor-pointer`}
        onClick={() => setSidebarOpen(true)}
      >
        {/* <Icon icon="tabler:message-filled" width="28" height="28" style={{ color: "#cecece" }} /> */}
        <FaRocketchat size={20} />
      </button>
    </div>
  );
};

export default Sidebar;