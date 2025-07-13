import React from "react";

const Chatbox = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-80 bg-black/90 backdrop-blur-md shadow-lg p-4 min-w-[320px] max-w-[350px] border border-[#23232a]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-[#23232a] px-2 py-1 rounded text-xs font-semibold text-gray-300">Degen Chat</span>
          <span className="text-primary-400 font-bold text-sm ml-2">538</span>
        </div>
        <button className="bg-[#23232a] p-1 rounded hover:bg-[#2d2d36]">
          <span className="text-gray-400">⏴</span>
        </button>
      </div>
      {/* Airdrop Banner */}
      <div className="bg-[#23232a] rounded-lg p-3 flex items-center justify-between mb-4">
        <div className="text-xs text-primary-300 font-bold">LIVE <span className="ml-1">AIRDROP</span></div>
        <div className="flex items-center gap-2">
          <span className="bg-primary px-2 py-1 rounded text-white text-xs font-bold">0.264</span>
          <span className="bg-primary-800 p-1 rounded text-white text-xs">👤</span>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 scrollbar-thin scrollbar-thumb-[#23232a] scrollbar-track-transparent pr-1">
        {/* Example messages */}
        <div className="flex items-start gap-2">
          <div className="bg-[#23232a] rounded-full w-8 h-8 flex items-center justify-center text-gray-400 text-lg font-bold">🧑</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-200 font-semibold text-sm">OGHARI</span>
              <span className="bg-[#23232a] text-xs px-2 py-0.5 rounded text-blue-300 font-bold">12</span>
              <span className="text-xs text-gray-500 ml-2">08:19</span>
            </div>
            <div className="text-gray-300 text-sm">Dont ymman</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="bg-[#23232a] rounded-full w-8 h-8 flex items-center justify-center text-gray-400 text-lg font-bold">🤔</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-200 font-semibold text-sm">is it possible to make it all back?</span>
              <span className="text-xs text-gray-500 ml-2">08:19</span>
            </div>
          </div>
        </div>
        {/* Add more messages as needed for demo */}
      </div>
      {/* Chat Input */}
      <div className="mt-auto pt-2 border-t border-[#23232a]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type Message Here..."
            className="flex-1 bg-[#23232a] text-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
          />
          <button className="bg-primary hover:bg-primary-800 text-white px-3 py-2 rounded font-bold text-sm">
            ▶
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Chat Rules</span>
          <span>160</span>
        </div>
      </div>
    </div>
  );
};

export default Chatbox; 