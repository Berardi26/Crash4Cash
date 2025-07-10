import React from "react";
import { CoinIcon } from "./icos/svg";
import Image from "next/image";

interface CoinflipItemProps {
  avatarUrl?: string;
  username: string;
  level: number;
  amount: number;
  value: number;
  chance: number; // 0-1 (e.g. 0.33 for 33%)
}

const CoinflipItem: React.FC<CoinflipItemProps> = ({
  avatarUrl,
  username,
  level,
  amount,
  value,
  chance,
}) => {
  return (
    <div className="flex items-center w-full max-w-xl bg-gradient-to-br from-[#181A20] to-[#23232a] rounded-2xl px-4 py-2 shadow-lg border border-[#23232a] relative overflow-hidden">
      {/* Avatar */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#23232a] mr-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={username} width={40} height={40} className="rounded-lg" />
        ) : (
          <span className="text-2xl">🙂</span>
        )}
      </div>
      {/* User Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold truncate max-w-[120px]">{username}</span>
          <span className="bg-[#23232a] text-xs px-2 py-0.5 rounded text-blue-300 font-bold">{level}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <CoinIcon />
          <span className="text-white font-bold text-lg">{amount.toFixed(3)}</span>
          <span className="text-xs text-gray-400">~${value.toFixed(2)}</span>
        </div>
      </div>
      {/* Chance */}
      <div className="flex flex-col items-end ml-4 min-w-[70px]">
        <span className="text-xs text-gray-400 mb-1">Chance</span>
        <span className="text-white font-bold text-lg">{(chance * 100).toFixed(2)}%</span>
        <div className="w-12 h-1 bg-[#23232a] rounded mt-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7858fe] via-[#bd74ff] to-[#7858fe]"
            style={{ width: `${Math.max(6, Math.min(100, chance * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinflipItem; 