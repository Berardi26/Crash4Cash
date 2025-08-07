import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/userDataContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { EChatEvent } from "@/types/socket";
import { Button, Input, Textarea } from "@heroui/react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { FaPaperPlane, FaShareNodes } from "react-icons/fa6";

const SendChat = () => {
    const [input, setInput] = useState<string>("");

    const { messages } = useUserData()
    const { sendMessage } = useChatMessages();

    const { user } = usePrivy()
    const { userProfile } = useAuth()

    useEffect(()=>{
        console.log("userProfile", userProfile, input);

    },[userProfile, input])


    return (
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
                        onPress={() => sendMessage(input)}
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
                        <p className="font-inter text-sm font-medium leading-[21px]">{messages.length}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendChat
