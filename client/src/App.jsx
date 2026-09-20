import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://crash4cash-backend.onrender.com';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [coins, setCoins] = useState(1000);
  const [sweeps, setSweeps] = useState(0.00);
  const [gameMode, setGameMode] = useState('cc');
  const [gameState, setGameState] = useState('waiting');
  const [countdown, setCountdown] = useState(5);
  const [multiplier, setMultiplier] = useState(1.00);
  const [currentHash, setCurrentHash] = useState('');
  const [launchHistory, setLaunchHistory] = useState([]);
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [notification, setNotification] = useState('');
  const [redeemAmount, setRedeemAmount] = useState(50);
  const [showTosModal, setShowTosModal] = useState(false);
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
        if (data) {
          if (typeof data.coins === 'number') setCoins(data.coins);
          if (typeof data.sweeps === 'number') setSweeps(data.sweeps);
        }
      });

      newSocket.on('game_state', (data) => {
        if (!data) return;
        setGameState(data.gameState || 'waiting');
        if (typeof data.countdown === 'number') setCountdown(data.countdown);
        if (typeof data.multiplier === 'number') setMultiplier(data.multiplier);
        if (data.currentHash) setCurrentHash(data.currentHash);
        if (Array.isArray(data.history)) setLaunchHistory(data.history);
      });

      newSocket.on('game_update', (data) => {
        if (!data) return;
        setGameState(data.gameState || 'waiting');
        if (typeof data.countdown === 'number') setCountdown(data.countdown);
        if (typeof data.multiplier === 'number') setMultiplier(data.multiplier);
        if (data.currentHash) setCurrentHash(data.currentHash);
        if (Array.isArray(data.history)) setLaunchHistory(data.history);
        if (data.gameState === 'waiting') {
          setHasBet(false);
          setCashedOut(false);
        }
      });

      newSocket.on('chat_message', (msg) => {
        if (msg) setMessages((prev) => [...prev, msg]);
      });

      newSocket.on('notification', (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 4000);
      });

      return () => newSocket.close();
    } catch (err) {
      console.error("Socket error:", err);
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
    socket.emit('place_bet', { amount: Number(betAmount) || 10, mode: gameMode });
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

  const requestRedemption = () => {
    if (!socket) return;
    socket.emit('request_redemption', { amount: Number(redeemAmount) });
  };

  const claimFaucet = () => {
    if (!socket) return;
    socket.emit('claim_faucet');
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!socket || !chatInput || !chatInput.trim()) return;
    socket.emit('send_chat', chatInput.trim());
    setChatInput('');
  };

  if (!acceptedTos) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl flex flex-col gap-6">
          <h1 className="text-2xl font-black tracking-wider text-emerald-400 text-center">CRASH<span className="text-white">4</span>CASH</h1>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 h-48 overflow-y-auto leading-relaxed">
            <p className="font-bold text-slate-300 mb-2">Sweepstakes Terms & Conditions</p>
            <p className="mb-2">1. Dual Currency Model: CC (Gold Coins) are for play-for-fun entertainment with no cash value. C$ (Sweeps Cash) are promotional coins redeemable for real cash prizes at a 1:1 ratio ($1 = 1 C$).</p>
            <p className="mb-2">2. No Purchase Necessary: C$ is obtained as a free promotional bonus with CC pack purchases, daily faucet claims, or mail-in entries.</p>
            <p className="mb-2">3. Minimum redemption threshold is 50.00 C$. Redemptions process within 24–48 hours.</p>
            <p>By entering, you confirm you are of legal age and agree to our sweepstakes rules.</p>
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
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center p-4 relative">
      {notification && (
        <div className="fixed top-4 z-50 bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-2xl animate-bounce">
          {notification}
        </div>
      )}

      {showTosModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-emerald-400">Terms of Service & Sweepstakes Rules</h2>
              <button onClick={() => setShowTosModal(false)} className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>
            <div className="text-xs text-slate-300 h-64 overflow-y-auto leading-relaxed flex flex-col gap-2">
              <p><strong>1. Introduction:</strong> Crash4Cash operates as a social gaming and promotional sweepstakes platform.</p>
              <p><strong>2. Currencies:</strong> CC (Gold Coins) are used for standard entertainment. C$ (Sweeps Cash) are promotional entries that can be redeemed for cash prizes upon meeting playthrough requirements and the 50 C$ minimum redemption limit.</p>
              <p><strong>3. Provably Fair:</strong> Every crash round uses a SHA-256 cryptographic hashing algorithm to ensure absolute randomness and fairness.</p>
              <p><strong>4. Eligibility:</strong> Participants must be at least 18 years of age (or legal age in their jurisdiction).</p>
            </div>
            <button onClick={() => setShowTosModal(false)} className="py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-sm cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center py-4 border-b border-slate-800 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-wider text-emerald-400">CRASH<span className="text-white">4</span>CASH</h1>
          <button onClick={() => setShowTosModal(true)} className="text-xs font-semibold text-slate-400 hover:text-emerald-400 underline cursor-pointer">
            Terms & Rules
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">CC:</span>
            <span className="font-bold text-amber-400 text-base">{Number(coins || 0).toFixed(2)}</span>
          </div>
          <div className="bg-slate-900 border border-emerald-500/50 px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950">
            <span className="text-xs text-emerald-400 font-semibold uppercase">C$:</span>
            <span className="font-bold text-emerald-400 text-base">${Number(sweeps || 0).toFixed(2)}</span>
          </div>
          <button 
            onClick={claimFaucet}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
            title="Claim Daily Free Bonus"
          >
            🎁 Daily Free
          </button>
        </div>
      </header>

      {/* Last 25 Launches Bar */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-2.5 mb-4 flex items-center gap-2 overflow-x-auto shadow-inner">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 px-2">Last Launches:</span>
        {launchHistory.length === 0 ? (
          <span className="text-xs text-slate-500 italic">No rounds completed yet</span>
        ) : (
          launchHistory.slice(0, 25).map((item, index) => {
            const mult = Number(item.multiplier || 1);
            const isHigh = mult >= 2.0;
            return (
              <span 
                key={index} 
                className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                  isHigh ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
                title={`Hash: ${item.hash}`}
              >
                {mult.toFixed(2)}x
              </span>
            );
          })
        )}
      </div>

      <div className="w-full max-w-4xl flex gap-3 mb-6">
        <button 
          onClick={() => setGameMode('cc')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
            gameMode === 'cc' 
              ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-lg' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          🎮 CC Play Mode (For Fun)
        </button>
        <button 
          onClick={() => setGameMode('sweeps')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
            gameMode === 'sweeps' 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          💵 C$ Sweepstakes Mode (Real Prizes)
        </button>
      </div>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Game Arena with Rocket Animation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-80 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
            
            <div className="absolute top-3 left-4 text-xs font-bold uppercase tracking-widest text-slate-400 z-10 flex items-center gap-2">
              <span>Mode: <strong className={gameMode === 'sweeps' ? 'text-emerald-400' : 'text-amber-400'}>{gameMode.toUpperCase()}</strong></span>
            </div>

            <div className="absolute top-3 right-4 text-[10px] text-slate-500 font-mono z-10 max-w-[200px] truncate" title={currentHash}>
              Hash: {currentHash ? `${currentHash.substring(0, 12)}...` : 'Generating...'}
            </div>

            {gameState === 'waiting' && (
              <div className="flex flex-col items-center z-10">
                <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Next Round In</span>
                <span className="text-5xl font-black text-amber-400">{countdown}s</span>
              </div>
            )}
            {gameState === 'running' && (
              <div className="flex flex-col items-center z-10 animate-pulse">
                <div className="text-4xl mb-2 transform -rotate-45 translate-x-4 animate-bounce">🚀</div>
                <span className="text-emerald-400 text-6xl font-black">{Number(multiplier || 1).toFixed(2)}x</span>
                <span className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">Rocket Ascending</span>
              </div>
            )}
            {gameState === 'crashed' && (
              <div className="flex flex-col items-center z-10">
                <span className="text-rose-500 text-5xl font-black animate-ping">💥 CRASHED</span>
                <span className="text-slate-300 text-lg font-bold mt-2">@ {Number(multiplier || 1).toFixed(2)}x</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-400">
                Wager Amount ({gameMode === 'sweeps' ? 'C$ Sweeps' : 'CC Coins'})
              </label>
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
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xl shadow-lg transition-all transform active:scale-95 cursor-pointer animate-pulse"
              >
                CASH OUT ({ (Number(betAmount || 0) * Number(multiplier || 1)).toFixed(2) } {gameMode === 'sweeps' ? 'C$' : 'CC'})
              </button>
            ) : (
              <button 
                onClick={placeBet}
                disabled={gameState !== 'waiting' || hasBet}
                className={`w-full py-4 font-black rounded-xl text-xl transition-all shadow-lg ${
                  hasBet ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                }`}
              >
                {hasBet ? 'BET PLACED' : `PLACE BET (${gameMode.toUpperCase()})`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Buy CC Packs (Get Free C$ Bonus)</h3>
              <div className="flex flex-col gap-2">
                {[ 
                  { price: 3, cc: 300, sc: 3.00 }, 
                  { price: 5, cc: 500, sc: 5.00 }, 
                  { price: 100, cc: 10000, sc: 105.00 } 
                ].map((pack) => (
                  <button 
                    key={pack.price}
                    onClick={() => depositCoins(pack.price)}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl flex justify-between items-center transition-all group cursor-pointer"
                  >
                    <span className="text-base font-black text-white group-hover:text-emerald-400">${pack.price} USD</span>
                    <span className="text-xs text-slate-400">{pack.cc} CC + <strong className="text-emerald-400">+{pack.sc.toFixed(2)} C$</strong></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">C$ Prize Redemption</h3>
              <p className="text-xs text-slate-400">Minimum 50.00 C$ required for prize payout (1 C$ = $1 USD).</p>
              <input 
                type="number"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={requestRedemption}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg"
              >
                Redeem Cash Prize
              </button>
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
