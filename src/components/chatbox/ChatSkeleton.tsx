import { Card, Skeleton } from "@heroui/react";

const ChatSkeleton = () => {
  return (
    <div className="pl-8">
      <div className="w-full flex rounded-lg">
        <div className="relative bg-white/10 hover:bg-[#162135] p-3 pl-8 rounded-lg cursor-pointer transition-colors duration-200 w-full">
          <Skeleton
            className="w-9 h-9 rounded-[8px] overflow-hidden aspect-square hover:brightness-125 transition-[filter] duration-300 cursor-pointer absolute -left-3 dropShadow-samll bg-layer2 p-px border-none top-2"
          >
            <div className="h-9 rounded-lg bg-default-300" />
          </Skeleton>
          <Skeleton className="absolute top-0 right-0 px-1.5 py-0.5 bg-[#2a3c58] rounded-bl-md rounded-tr-lg">
            <div className="text-[11px] leading-[16px] text-[#cecece] w-8 h-3"></div>
          </Skeleton>
          <div className="relative z-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="text-sm font-bold max-w-[150px] truncate text-white w-10 h-3"></div>
              </Skeleton>
              <Skeleton className="p-px rounded-md overflow-hidden bg-[#2A417C] text-[#60AAFF]">
                <div className="flex items-center justify-center rounded-[5px] overflow-hidden bg-[#22222D]/80 font-semibold min-w-4 px-1 h-5 text-[11px]">{1}</div>
              </Skeleton>
            </div>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-full rounded-lg bg-default-200 w-12" />
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSkeleton;
