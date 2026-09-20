import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://crash4cash-backend.onrender.com';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [coins, setCoins] = useState(1000);
  const [gameState, setGameState] = useState('waiting');
  const [countdown, setCountdown] = useState(5);
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [acceptedTos, setAcceptedTos] = useState(() => {
    try {
      return localStorage.getItem('crash4cash_tos') === 'true';
    } catch {
      return false;
    }
  });
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      const newSocket = io(BACKEND_URL, {
        transports: ['websocket', 'polling'],
        withCredentials: true
      });
      setSocket(newSocket);

      newSocket.on('balance_update', (data) => {
        if (data && typeof data.coins === 'number') setCoins(data.coins);
      });

      newSocket.on('game_update', (data) => {
        if (!data) return;
        setGameState(data.gameState || 'waiting');
        if (typeof data.countdown === 'number') setCountdown(data.countdown);
        if (typeof data.multiplier === 'number') setMultiplier(data.multiplier);
        if (data.gameState === 'waiting') {
          setHasBet(false);
          setCashedOut(false);
        }
      });

      newSocket.on('chat_message', (msg) => {
        if (msg) setMessages((prev) => [...prev, msg]);
      });

      return () => newSocket.close();
    } catch (err) {
      console.error("Socket initialization error:", err);
    }
  }, []);

  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }, [messages]);

  const acceptTos = () => {
    try {
      localStorage.setItem('crash4cash_tos', 'true');
    } catch {}
    setAcceptedTos(true);
  };

  const placeBet = () => {
    if (!socket || gameState !== 'waiting' || hasBet) return;
    socket.emit('place_bet', { amount: Number(betAmount) || 10 });
    setHasBet(true);
    setCashedOut(false);
  };

  const cashOut = () => {
    if (!socket || gameState !== 'running' || !hasBet || cashedOut) return;
    socket.emit('cashout');
    setCashedOut(true);
  };

  const depositCoins = (amount) => {
    if (!socket) return;
    socket.emit('deposit', { amount });
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!socket || !chatInput || !chatInput.trim()) return;
    socket.emit('send_chat', chatInput.trim());
    setChatInput('');
  };

  // If Terms of Service hasn't been accepted, render the compliance gate cleanly
  if (!acceptedTos) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl flex flex-col gap-6">
          <h1 className="text-2xl font-black tracking-wider text-emerald-400 text-center">CRASH<span className="text-white">4</span>CASH</h1>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 h-48 overflow-y-auto leading-relaxed">
            <p className="font-bold text-slate-300 mb-2">Terms of Service & Compliance</p>
            <p className="mb-2">1. CC Coins are strictly play currency with no real-world cash value and cannot be redeemed back into fiat currency.</p>
            <p className="mb-2">2. Real-money interactions are strictly limited to purchasing optional CC Coin packs ($3, $5, $100).</p>
            <p className="mb-2">3. All coin pack deposits are final. Approved redemptions or payouts take between 1 and 48 hours to process, while in-game cashouts are instant.</p>
            <p>By entering, you confirm you are of legal age and agree to these terms.</p>
          </div>
          <button 
            onClick={acceptTos}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-lg shadow-lg transition-all cursor-pointer"
          >
            I AGREE & ENTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-slate-800 mb-6">
        <h1 className="text-2xl font-black tracking-wider text-emerald-400">CRASH<span className="text-white">4</span>CASH</h1>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">CC Coins:</span>
            <span className="font-bold text-emerald-400 text-lg">{Number(coins || 0).toFixed(2)}</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-80 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            {gameState === 'waiting' && (
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Next Round In</span>
                <span className="text-5xl font-black text-amber-400">{countdown}s</span>
              </div>
            )}
            {gameState === 'running' && (
              <div className="flex flex-col items-center animate-pulse">
                <span className="text-emerald-400 text-6xl font-black">{Number(multiplier || 1).toFixed(2)}x</span>
                <span className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Multiplier Climbing</span>
              </div>
            )}
            {gameState === 'crashed' && (
              <div className="flex flex-col items-center">
                <span className="text-rose-500 text-5xl font-black">CRASHED</span>
                <span className="text-slate-400 text-lg font-bold mt-1">@ {Number(multiplier || 1).toFixed(2)}x</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-400">Bet Amount (CC Coins)</label>
              <div className="flex gap-2">
                {[10, 50, 100, 500].map((val) => (
                  <button key={val} onClick={() => setBetAmount(val)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500"
            />

            {gameState === 'running' && hasBet && !cashedOut ? (
              <button 
                onClick={cashOut}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xl shadow-lg transition-all transform active:scale-95 cursor-pointer"
              >
                CASH OUT ({ (Number(betAmount || 0) * Number(multiplier || 1)).toFixed(2) } CC)
              </button>
            ) : (
              <button 
                onClick={placeBet}
                disabled={gameState !== 'waiting' || hasBet}
                className={`w-full py-4 font-black rounded-xl text-xl transition-all shadow-lg ${
                  hasBet ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                }`}
              >
                {hasBet ? 'BET PLACED' : 'PLACE BET'}
              </button>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Buy CC Coin Packs</h3>
            <div className="grid grid-cols-3 gap-3">
              {[ { price: 3, coins: 300 }, { price: 5, coins: 500 }, { price: 100, coins: 10000 } ].map((pack) => (
                <button 
                  key={pack.price}
                  onClick={() => depositCoins(pack.price)}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-4 rounded-xl flex flex-col items-center transition-all group cursor-pointer"
                >
                  <span className="text-lg font-black text-white group-hover:text-emerald-400">${pack.price}</span>
                  <span className="text-xs text-slate-400 mt-1">{pack.coins} CC</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-2xl">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Global Chat</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div key={index} className="text-sm bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                <span className="font-bold text-emerald-400 mr-2">{msg?.user || 'User'}:</span>
                <span className="text-slate-300">{msg?.text || ''}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message..." 
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer">
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
