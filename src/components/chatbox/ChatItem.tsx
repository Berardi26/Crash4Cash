import { useModal } from "@/contexts/modalContext";
import { useUserData } from "@/contexts/userDataContext";

const ChatItem: React.FC<IChatItem> = (data) => {
    const { setShowProfileModal } = useModal();
    const { setSelectedUser } = useUserData();

    return (
        <div className="animate-popup-enter" onClick={() => { setShowProfileModal(true); setSelectedUser(data.user_id!) }}>
            <div className="relative bg-[#162135]/70 hover:bg-[#162135] p-3 pl-8 rounded-lg cursor-pointer transition-colors duration-200">
                <div
                    className="w-9 h-9 rounded-[8px] overflow-hidden aspect-square hover:brightness-125 transition-[filter] duration-300 cursor-pointer absolute -left-3 dropShadow-samll bg-layer2 p-px border-none"
                >
                    <div className="w-full h-full p-0.5 rounded-[8px] border border-grey bg-layer2 p-px">
                        <img src={data.user_id.avatar} className="object-cover object-center rounded-[8px] w-full h-full" alt=""></img>
                    </div>
                </div>
                <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-[#2a3c58] rounded-bl-md rounded-tr-lg">
                    <p className="text-[11px] leading-[16px] text-[#cecece]">{new Date(data.timestamp).toISOString().split('T')[0]}</p>
                </div>
                <div className="relative z-3">
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold max-w-[150px] truncate text-white">{data.user_id.username}</p>
                        <div className="p-px rounded-md overflow-hidden bg-[#2A417C] text-[#60AAFF]">
                            <div className="flex items-center justify-center rounded-[5px] overflow-hidden bg-[#22222D]/80 font-semibold w-[28px] h-5 text-[11px]">1</div>
                        </div>
                    </div>
                    <p className="text-sm lg:text-xs 2xl:text-sm text-[#A2A2A2] mt-1 2xl:mt-0.5 word-break select-text">{data.content}</p>
                </div>
            </div>
        </div>
    )
}

export default ChatItem
