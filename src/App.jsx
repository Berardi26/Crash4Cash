import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState('idle'); // idle, countdown, running, crashed, cashed
  const [multiplier, setMultiplier] = useState(1.00);
  const [payout, setPayout] = useState(0);
  const [modal, setModal] = useState(null); // 'terms' | 'privacy' | null
  
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);
  const crashPointRef = useRef(0);

  // House Vault Wallets
  const ethWallet = "0xB365eA5663cd62094E25d34671bF433C5e4334b8";
  const solWallet = "5EHy7Xoz7prA9nMje4qvxgGxh6ez2hchTu8jQR3PdPTG";

  const startCountdown = () => {
    if (bet <= 0 || bet > balance) return;
    setBalance(prev => prev - bet);
    setGameState('countdown');
    setMultiplier(1.00);
    
    setTimeout(() => {
      startCashRocket();
    }, 2000);
  };

  const startCashRocket = () => {
    setGameState('running');
    startTimeRef.current = Date.now();
    
    // 97% RTP random crash calculation
    const randomVal = Math.random();
    const rawCrash = 0.97 / (1 - randomVal);
    crashPointRef.current = Math.max(1.01, parseFloat(rawCrash.toFixed(2)));

    const updateMultiplier = () => {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const growthRate = 0.1386; // ~5 seconds to reach 2.0x
      const currentMult = Math.exp(growthRate * elapsedSeconds);

      if (currentMult >= crashPointRef.current) {
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        cancelAnimationFrame(animFrameRef.current);
      } else {
        setMultiplier(currentMult);
        animFrameRef.current = requestAnimationFrame(updateMultiplier);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateMultiplier);
  };

  const cashOut = () => {
    if (gameState !== 'running') return;
    cancelAnimationFrame(animFrameRef.current);
    const won = bet * multiplier;
    setPayout(won);
    setBalance(prev => prev + won);
    setGameState('cashed');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 selection:bg-emerald-500 selection:text-slate-950">
      <header className="w-full max-w-2xl flex justify-between items-center py-4 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
          Crash4Cash
        </h1>
        <div className="text-right bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl shadow-inner">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Balance</span>
          <span className="font-extrabold text-emerald-400 text-lg">${balance.toFixed(2)}</span>
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center my-auto py-6">
        <div className="w-full h-80 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-emerald-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/10 via-slate-900/50 to-slate-950 pointer-events-none"></div>

          {gameState === 'idle' && (
            <div className="text-center px-4 z-10">
              <h2 className="text-3xl font-black text-slate-200 tracking-tight">CashRocket</h2>
              <p className="text-sm text-slate-400 mt-2">Ready for launch. Place your bet below!</p>
            </div>
          )}

          {gameState === 'countdown' && (
            <div className="text-center px-4 animate-pulse z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-400">CashRocket is preparing for liftoff...</h2>
            </div>
          )}

          {gameState === 'running' && (
            <div className="text-center z-10">
              <div className="text-6xl font-black tracking-wider text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                {multiplier.toFixed(2)}x
              </div>
              <p className="text-xs text-emerald-500/80 font-medium mt-2 animate-pulse">CashRocket climbing...</p>
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="text-center z-10 animate-shake">
              <div className="text-5xl font-black text-rose-500 tracking-wider">CRASHED</div>
              <div className="text-2xl font-bold text-slate-400 mt-2">@ {multiplier.toFixed(2)}x</div>
            </div>
          )}

          {gameState === 'cashed' && (
            <div className="text-center z-10 animate-bounce">
              <div className="text-5xl font-black text-emerald-400 tracking-wider">CASHED OUT!</div>
              <div className="text-2xl font-bold text-slate-100 mt-2">Won: ${payout.toFixed(2)}</div>
            </div>
          )}
        </div>

        <div className="w-full mt-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-400">Bet Amount ($)</label>
            <input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={gameState === 'running' || gameState === 'countdown'}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 w-36 text-right font-bold text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {gameState === 'running' ? (
            <button 
              onClick={cashOut}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              CASH OUT (${(bet * multiplier).toFixed(2)})
            </button>
          ) : (
            <button 
              onClick={startCountdown}
              disabled={gameState === 'countdown'}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-black text-xl rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
            >
              {gameState === 'countdown' ? 'Preparing...' : 'Launch CashRocket'}
            </button>
          )}
        </div>
      </main>

      <footer className="w-full max-w-2xl text-xs text-slate-500 text-center border-t border-slate-800 pt-4 flex flex-col gap-2">
        <div className="flex justify-center gap-4 text-slate-400 font-medium">
          <button onClick={() => setModal('terms')} className="hover:text-emerald-400 transition cursor-pointer">Terms of Service</button>
          <span>•</span>
          <button onClick={() => setModal('privacy')} className="hover:text-emerald-400 transition cursor-pointer">Privacy Policy</button>
        </div>
        <p>RTP: 97% | ETH: {ethWallet.slice(0, 6)}...{ethWallet.slice(-4)} | SOL: {solWallet.slice(0, 6)}...{solWallet.slice(-4)}</p>
      </footer>

      {/* Modals for Terms & Privacy */}
      {modal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="font-bold text-lg text-emerald-400">
                {modal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button 
                onClick={() => setModal(null)}
                className="text-slate-400 hover:text-white font-bold px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-slate-300 space-y-4 leading-relaxed">
              {modal === 'terms' ? (
                <>
                  <p className="font-bold text-slate-200">1. Acceptance of Terms</p>
                  <p>By accessing and playing Crash4Cash, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using the platform.</p>
                  <p className="font-bold text-slate-200">2. Eligibility</p>
                  <p>Players must be of legal age in their respective jurisdiction to participate. All wagers and gameplay are final.</p>
                  <p className="font-bold text-slate-200">3. Fair Play & RTP</p>
                  <p>Crash4Cash operates with a certified Return to Player (RTP) of 97%. Game outcomes are generated algorithmically and are fully random.</p>
                  <p className="font-bold text-slate-200">4. Limitation of Liability</p>
                  <p>Crash4Cash and its operators are not responsible for network disruptions, connection failures, or user device errors during active rounds.</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-200">1. Information We Collect</p>
                  <p>Crash4Cash respects your privacy. We collect minimal telemetry and session data required to maintain secure gameplay and ledger balances.</p>
                  <p className="font-bold text-slate-200">2. Use of Data</p>
                  <p>Your data is used strictly to process transactions, ensure platform integrity, and improve your user experience across our services.</p>
                  <p className="font-bold text-slate-200">3. Security</p>
                  <p>We implement industry-standard security measures to protect your wallet linkages and session history against unauthorized access.</p>
                  <p className="font-bold text-slate-200">4. Cookies</p>
                  <p>We use essential local storage cookies to maintain your game state and session preferences.</p>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-right">
              <button 
                onClick={() => setModal(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
