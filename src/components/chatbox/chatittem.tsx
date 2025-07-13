import { ChatMessage } from "@/hooks/useChatMessages"
import { Badge, Image } from "@heroui/react"


const ChatItem = (msg: ChatMessage) => {
    return (
        <div className="flex items-start flex-col">
            <div className="flex gap-2 w-full items-center justify-between text-gray-400 text-lg font-bold">
                <div className="flex gap-2">
                    <Badge color="primary" size="sm" content={msg.level}>
                        {msg.avatar ? <Image src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-t-full" /> :
                            <Image src={`/assets/images/avatar/ada.jpg`} className="w-10 h-10 rounded-t-full" alt={msg.user} />}
                    </Badge>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-200 font-semibold text-sm">{msg.user}</span>
                    </div>
                </div>
                <span className="text-xs text-gray-500 ml-2">{msg.timestamp}</span>
            </div>
            <div>
                <div className="text-gray-300 text-sm bg-white/5 px-2 py-1 rounded-b-lg">&nbsp;{msg.content}</div>
            </div>
        </div>
    )
}

export default ChatItem