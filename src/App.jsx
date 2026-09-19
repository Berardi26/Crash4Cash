import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState('idle'); // idle, countdown, running, crashed, cashed
  const [multiplier, setMultiplier] = useState(1.00);
  const [payout, setPayout] = useState(0);
  
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
    
    // Brief pre-flight countdown delay
    setTimeout(() => {
      startCashRocket();
    }, 2000);
  };

  const startCashRocket = () => {
    setGameState('running');
    startTimeRef.current = Date.now();
    
    // 3% house edge random crash point calculation
    const randomVal = Math.random();
    const rawCrash = 0.97 / (1 - randomVal);
    crashPointRef.current = Math.max(1.01, parseFloat(rawCrash.toFixed(2)));

    const updateMultiplier = () => {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      
      // Growth rate: ~5 seconds to reach 2.0x, accelerating naturally as it climbs
      const growthRate = 0.1386; 
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-4">
      <header className="w-full max-w-2xl flex justify-between items-center py-4 border-b border-gray-800">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
          Crash4Cash
        </h1>
        <div className="text-right">
          <span className="text-sm text-gray-400">Balance: </span>
          <span className="font-bold text-green-400">${balance.toFixed(2)}</span>
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center my-auto py-8">
        <div className="w-full h-80 bg-gray-950 rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {gameState === 'idle' && (
            <div className="text-center px-4">
              <h2 className="text-3xl font-extrabold text-gray-300">CashRocket</h2>
              <p className="text-sm text-gray-500 mt-2">Ready for launch. Place your bet!</p>
            </div>
          )}

          {gameState === 'countdown' && (
            <div className="text-center px-4 animate-pulse">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">CashRocket is preparing for liftoff...</h2>
            </div>
          )}

          {gameState === 'running' && (
            <div className="text-center">
              <div className="text-6xl font-black tracking-wider text-green-400">
                {multiplier.toFixed(2)}x
              </div>
              <p className="text-xs text-gray-400 mt-2">CashRocket climbing...</p>
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="text-center">
              <div className="text-5xl font-black text-red-500">CRASHED</div>
              <div className="text-2xl font-bold text-gray-400 mt-2">@ {multiplier.toFixed(2)}x</div>
            </div>
          )}

          {gameState === 'cashed' && (
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400">CASHED OUT!</div>
              <div className="text-2xl font-bold text-white mt-2">Won: ${payout.toFixed(2)}</div>
            </div>
          )}
        </div>

        <div className="w-full mt-6 bg-gray-950 p-6 rounded-2xl border border-gray-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Bet Amount ($)</label>
            <input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={gameState === 'running' || gameState === 'countdown'}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-32 text-right font-bold text-white focus:outline-none focus:border-green-500"
            />
          </div>

          {gameState === 'running' ? (
            <button 
              onClick={cashOut}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xl rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              CASH OUT (${(bet * multiplier).toFixed(2)})
            </button>
          ) : (
            <button 
              onClick={startCountdown}
              disabled={gameState === 'countdown'}
              className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 text-white font-black text-xl rounded-xl transition shadow-lg shadow-green-600/20 active:scale-95 cursor-pointer"
            >
              {gameState === 'countdown' ? 'Preparing...' : 'Launch CashRocket'}
            </button>
          )}
        </div>
      </main>

      <footer className="w-full max-w-2xl text-xs text-gray-500 text-center border-t border-gray-800 pt-4 flex flex-col gap-1">
        <p>House Edge: 3% | ETH: {ethWallet.slice(0, 6)}...{ethWallet.slice(-4)}</p>
        <p>SOL: {solWallet.slice(0, 6)}...{solWallet.slice(-4)}</p>
      </footer>
    </div>
  );
}
