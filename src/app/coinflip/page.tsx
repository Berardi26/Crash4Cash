'use client'
import Layout from "@/components/layout/layout";
import CoinflipItem from "@/components/coinflipItem";
import { useState } from "react";

const mockGames = [
  {
    id: 1,
    avatarUrl: "/assets/images/avatar/ada.jpg",
    username: "Player1",
    level: 4,
    amount: 0.0135,
    value: 18.23,
    chance: 0.5,
    status: "joinable",
  },
  {
    id: 2,
    avatarUrl: "/assets/images/avatar/default.webp",
    username: "Player2",
    level: 4,
    amount: 0.0030,
    value: 4.05,
    chance: 0.5,
    status: "joined",
  },
  {
    id: 3,
    avatarUrl: "/assets/images/avatar/default.webp",
    username: "Player3",
    level: 4,
    amount: 0.0138,
    value: 18.60,
    chance: 0.5,
    status: "pending",
  },
  // ...more mock games
];

const CoinflipPage = () => {
  const [betAmount, setBetAmount] = useState(0.001);
  const [side, setSide] = useState("purple");
  const [sort, setSort] = useState("Highest Price");

  return (
    <Layout>
      <div className="min-h-screen bg-[#101114] py-8 px-4 flex flex-col items-center">
        {/* Header */}
        <div className="w-full max-w-4xl mb-6">
          <div className="text-[#b6aaff] text-sm font-semibold mb-1">Pick a side and flip</div>
          <div className="text-5xl font-extrabold text-white tracking-wide mb-2">COINFLIP</div>
          <div className="italic text-[#b6aaff] text-lg mb-6">ALL GAMES</div>
        </div>
        {/* Bet Controls */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-[#181A20] rounded-2xl p-4 mb-8 shadow-lg border border-[#23232a]">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-gray-400 text-xs mb-1">Bet Amount <span className="text-white">(${(betAmount*18).toFixed(2)})</span></span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={betAmount}
                  onChange={e => setBetAmount(Number(e.target.value))}
                  className="bg-[#23232a] text-white px-3 py-1 rounded-lg w-24 border border-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#b6aaff]"
                />
                <button className="bg-[#23232a] text-white px-2 py-1 rounded">1/2</button>
                <button className="bg-[#23232a] text-white px-2 py-1 rounded">2x</button>
                <button className="bg-[#23232a] text-white px-2 py-1 rounded">MAX</button>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-gray-400 text-xs mb-1">Choose Side</span>
              <div className="flex gap-2">
                <button
                  className={`w-10 h-10 rounded-lg border-2 ${side === "purple" ? "border-[#b6aaff] bg-[#7858fe]" : "border-[#23232a] bg-[#23232a]"}`}
                  onClick={() => setSide("purple")}
                >
                  <span className="text-white text-xl">🟣</span>
                </button>
                <button
                  className={`w-10 h-10 rounded-lg border-2 ${side === "gray" ? "border-[#b6aaff] bg-[#23232a]" : "border-[#23232a] bg-[#23232a]"}`}
                  onClick={() => setSide("gray")}
                >
                  <span className="text-white text-xl">⚫</span>
                </button>
              </div>
            </div>
            <button className="bg-[#1de9b6] hover:bg-[#13bfa6] text-white font-bold px-6 py-2 rounded-lg ml-0 md:ml-4 mt-4 md:mt-0">+ Create Flip</button>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-gray-400 mr-2">Sort By:</span>
            <select
              className="bg-[#23232a] text-white px-2 py-1 rounded border border-[#23232a]"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option>Highest Price</option>
              <option>Lowest Price</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
        {/* Game List */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {mockGames.map(game => (
            <div key={game.id} className="flex items-center justify-between bg-linear-to-br from-[#181A20] to-[#23232a] rounded-2xl px-6 py-4 shadow-lg border border-[#23232a]">
              <CoinflipItem {...game} />
              <div className="flex items-center gap-2 ml-4">
                {game.status === "joinable" && (
                  <button className="bg-[#1de9b6] hover:bg-[#13bfa6] text-white font-bold px-6 py-2 rounded-lg">Join</button>
                )}
                {game.status === "joined" && (
                  <span className="italic text-[#b6aaff] font-bold px-6 py-2 rounded-lg">JOINED</span>
                )}
                <button className="bg-[#23232a] hover:bg-[#181A20] text-white px-3 py-2 rounded-lg">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#b6aaff" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CoinflipPage;