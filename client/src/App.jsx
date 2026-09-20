  const handleCashout = () => {
    socketRef.current?.emit('cashout');
    setCashedOut(true);
  };
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://crash4cash-backend.onrender.com';

export default function App() {
  const [balance, setBalance] = useState({ coins: 5000, cash: 0 });
  const [betMode, setBetMode] = useState('cash');
  const [nextBet, setNextBet] = useState(10);
  const [autoCashout, setAutoCashout] = useState('');
  const [activeBetAmount, setActiveBetAmount] = useState(10);
  
  const [gameState, setGameState] = useState('waiting');
  const [countdown, setCountdown] = useState(5);
  const [multiplier, setMultiplier] = useState(1.00);
  
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [payout, setPayout] = useState(0);
  
  // Compliance & Modals
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [modal, setModal] = useState('terms'); // Opens Terms on first load
  const [pfTab, setPfTab] = useState('verify');
  const [packageAmount, setPackageAmount] = useState(50);
  const [redeemAmount, setRedeemAmount] = useState(50);
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Provably Fair State
  const [serverSeedHash, setServerSeedHash] = useState('Waiting for round seed hash...');
  const [revealedSeed, setRevealedSeed] = useState('');
  const [nonce, setNonce] = useState(1);
  const [verifyServerSeed, setVerifyServerSeed] = useState('');
  const [verifyClientSeed, setVerifyClientSeed] = useState('Crash4CashOfficialClientSeed2026');
  const [verifyNonce, setVerifyNonce] = useState(1);
  const [verificationResult, setVerificationResult] = useState(null);
  const [roundHistory, setRoundHistory] = useState([]);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('https://crash4cash-backend.onrender.com');
    socketRef.current = socket;

    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('balance_update', (newBalances) => setBalance(newBalances));

    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('game_update', (data) => {
      setGameState(prevState => {
        if (data.gameState === 'waiting' && prevState !== 'waiting') {
          setCashedOut(false);
          setHasBet(false);
        }
        return data.gameState;
      });

      if (data.countdown !== undefined) setCountdown(data.countdown);
      if (data.multiplier !== undefined) setMultiplier(data.multiplier);
      if (data.serverSeedHash) setServerSeedHash(data.serverSeedHash);
      if (data.nonce) setNonce(data.nonce);
      if (data.revealedServerSeed) setRevealedSeed(data.revealedServerSeed);
    });

    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('round_history', (history) => setRoundHistory(history));
    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('bet_confirmed', ({ amount }) => { setActiveBetAmount(amount); setHasBet(true); });
    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('cashout_success', ({ payout }) => { setPayout(payout); setCashedOut(true); });
    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('deposit_success', ({ amount }) => {
      setStatusMsg(`Package purchased! Received CC + C$${amount} CrashCash.`);
      setTimeout(() => setStatusMsg(''), 5000);
    });
    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('redemption_success', ({ requested, fee, payout }) => {
      setStatusMsg(`Redeemed C$${requested} (Fee: C$${fee}). Sent C$${payout} to crypto!`);
      setTimeout(() => setStatusMsg(''), 7000);
    });
    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('redemption_error', ({ message }) => {
      setStatusMsg(`Redemption Error: ${message}`);
      setTimeout(() => setStatusMsg(''), 5000);
    });
    
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('receive_chat', (msg) => setMessages(prev => [...prev.slice(-49), msg]));

    return () => socket.disconnect();
  }, []);

    const placeBet = () => {
    const amt = parseFloat(betAmount);
    if (isNaN(amt) || amt < 0.10 || amt > 100) {
      alert('Please enter a valid bet between $0.10 and $100');
      return;
    }
    if (gameState !== 'waiting') {
      alert('Cannot place bets while round is running');
      return;
    }
    socketRef.current?.emit('place_bet', {
      mode: betMode,
      amount: amt
    });
    setHasBet(true);
    setActiveBetAmount(amt);
  };
    const currentBal = betMode === 'cash' ? balance.cash : balance.coins;
    if (gameState !== 'waiting' || nextBet <= 0 || nextBet > currentBal || hasBet) return;
    socketRef.current?.emit('place_bet', { 
      amount: nextBet, 
      mode: betMode, 
      autoCashout: autoCashout ? Number(autoCashout) : null 
    });
  };

  const cashOut = () => {
    if (!hasBet || cashedOut) return;
    socketRef.current?.emit('cash_out');
  };

  const handlePurchase = async () => {
    if (!window.ethereum) {
      setStatusMsg('Error: No Web3 wallet detected.');
      return;
    }
    try {
      setStatusMsg('Initiating checkout...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const weiHex = "0x" + Math.floor(packageAmount * 1e14).toString(16);
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: accounts[0], to: "0xB365eA5663cd62094E25d34671bF433C5e4334b8", value: weiHex }],
      });
      socketRef.current?.emit('purchase_package', { packagePrice: packageAmount });
    } catch (err) {
      setStatusMsg('Checkout cancelled or failed.');
    }
  };

  const handleRedemption = () => {
    if (!cryptoAddress.trim() || redeemAmount < 50) {
      setStatusMsg('Enter valid crypto address & minimum C$50.00 redemption.');
      return;
    }
    socketRef.current?.emit('redeem_crash_cash', { amount: redeemAmount, cryptoAddress });
  };

  const loadRoundIntoVerifier = (round) => {
    setVerifyServerSeed(round.serverSeed);
    setVerifyClientSeed(round.clientSeed);
    setVerifyNonce(round.nonce);
    setPfTab('verify');
    setModal('provablyFair');
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socketRef.current?.emit('send_chat', { user: 'NinjaPlayer', text: chatInput });
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-3 sm:p-4">
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center py-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Crash4Cash <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase">Live</span>
          </h1>
          <div className="flex gap-3 mt-1">
            <button onClick={() => setModal('provablyFair')} className="text-[11px] text-emerald-400 hover:underline cursor-pointer font-medium flex items-center gap-1">🔒 Provably Fair Hashes</button>
            <button onClick={() => setModal('terms')} className="text-[11px] text-slate-400 hover:underline cursor-pointer font-medium">⚖️ Terms of Service</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-right">
            <span className="text-[9px] text-amber-400 uppercase font-bold block">CrashCoins</span>
            <span className="font-extrabold text-amber-300 text-xs sm:text-sm">{balance.coins.toLocaleString()} CC</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-right">
            <span className="text-[9px] text-emerald-400 uppercase font-bold block">CrashCash</span>
            <span className="font-extrabold text-emerald-400 text-xs sm:text-sm">C${balance.cash.toFixed(2)}</span>
          </div>
          <button onClick={() => setModal('store')} className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-3 py-2.5 rounded-xl cursor-pointer text-xs uppercase">Get CC</button>
          <button onClick={() => setModal('redeem')} className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-black px-3 py-2.5 rounded-xl cursor-pointer text-xs uppercase">Redeem C$</button>
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>ACTIVE HASH (SHA-256):</span>
              <span className="text-emerald-400 truncate max-w-[220px]" title={serverSeedHash}>{serverSeedHash}</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">History:</span>
              {roundHistory.map((r, idx) => (
                <button key={idx} onClick={() => loadRoundIntoVerifier(r)} className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-slate-950 border border-slate-800 text-slate-400 cursor-pointer hover:scale-105 transition">
                  {r.crashPoint.toFixed(2)}x
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-72 sm:h-80 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            {gameState === 'waiting' && (
              <div className="text-center px-4">
                <h2 className="text-2xl font-black text-slate-200">Liftoff In</h2>
                <div className="text-4xl font-black text-emerald-400 my-2 font-mono">0:0{countdown}</div>
              </div>
            )}
            {gameState === 'running' && (
              <div className="text-center flex flex-col items-center">
                <div className="text-4xl animate-bounce">🚀</div>
                <div className="text-5xl font-black text-emerald-400 font-mono mt-2">{multiplier.toFixed(2)}x</div>
              </div>
            )}
            {gameState === 'crashed' && (
              <div className="text-center">
                <div className="text-4xl font-black text-rose-500">CRASHED</div>
                <div className="text-xl font-bold text-slate-400 mt-2 font-mono">@ {multiplier.toFixed(2)}x</div>
              </div>
            )}
          </div>

          <div className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex justify-between bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onClick={() => !hasBet && gameState === 'waiting' && setBetMode('cash')} className={`flex-1 py-2 text-xs font-black rounded-lg ${betMode === 'cash' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}>💵 C$ Cash</button>
              <button onClick={() => !hasBet && gameState === 'waiting' && setBetMode('coins')} className={`flex-1 py-2 text-xs font-black rounded-lg ${betMode === 'coins' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>⚡ CC Coins</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={nextBet} onChange={(e) => setNextBet(Number(e.target.value))} disabled={gameState !== 'waiting' || hasBet} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-bold text-white text-sm" />
              <input type="number" step="0.1" placeholder="Auto-Cashout" value={autoCashout} onChange={(e) => setAutoCashout(e.target.value)} disabled={gameState !== 'waiting' || hasBet} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-bold text-emerald-400 text-sm" />
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="tosCheck" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="rounded bg-slate-950 border-slate-700 text-emerald-500 w-4 h-4 cursor-pointer" />
              <label htmlFor="tosCheck" className="text-xs text-slate-400 cursor-pointer">I agree to the <button onClick={() => setModal('terms')} className="text-emerald-400 underline">Terms of Service</button></label>
            </div>

            {gameState === 'waiting' && (
              hasBet ? (
                <div className="w-full py-3 bg-emerald-950 border border-emerald-600 text-emerald-400 font-bold text-center rounded-xl">Bet Locked — Waiting...</div>
              ) : (
                


            {/* Coin Pack Deposit Store */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 my-3">
              <h3 className="text-xs font-bold text-slate-300 mb-2">⚡ Instant Coin Packs</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => socketRef.current?.emit('deposit', { amount: 3 })} className="py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400 hover:bg-amber-500/20">$3 Pack</button>
                <button onClick={() => socketRef.current?.emit('deposit', { amount: 5 })} className="py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400 hover:bg-amber-500/20">$5 Pack</button>
                <button onClick={() => socketRef.current?.emit('deposit', { amount: 100 })} className="py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400 hover:bg-amber-500/20">$100 Pack</button>
              </div>
            </div>

<button onClick={placeBet} className={`w-full py-3.5 font-black text-lg rounded-xl cursor-pointer ${betMode === 'cash' ? 'bg-emerald-600 text-slate-950' : 'bg-amber-500 text-slate-950'}`}>Place Bet</button>
              )
            )}
            {gameState === 'running' && hasBet && !cashedOut && (
              <button onClick={cashOut} className="w-full py-3.5 bg-emerald-500 text-slate-950 font-black text-lg rounded-xl cursor-pointer animate-pulse">CASH OUT</button>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-64 md:h-auto shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 font-bold text-xs uppercase text-emerald-400">💬 Live Chat</div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs font-mono">
            {messages.map((m, idx) => (
              <div key={idx} className="bg-slate-950/50 p-2 rounded border border-slate-800/60">
                <span className="font-bold text-emerald-300 block text-[10px]">{m.user}</span>
                <p className="text-slate-300">{m.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendChat} className="p-2 border-t border-slate-800 bg-slate-950/60 flex gap-2">
            <input type="text" placeholder="Message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" />
            <button type="submit" className="bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer">Send</button>
          </form>
        </div>
      </main>

      {/* TERMS OF SERVICE MODAL */}
      {modal === 'terms' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-emerald-400">⚖️ Terms of Service & Agreement</h3>
            <div className="text-xs text-slate-300 space-y-2 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p>1. **Acceptance of Rules:** By placing any play or bet on Crash4Cash, you explicitly agree to these Terms of Service.</p>
              <p>2. **Currency Units:** Platform balances are designated in CrashCoins (CC) for entertainment play and CrashCash (C$) for redeemable balances.</p>
              <p>3. **Provably Fair:** All crash multipliers are determined dynamically using cryptographic HMAC-SHA256 pre-committed hashes, verifiable at any time.</p>
              <p>4. **Redemption Policy:** Minimum redemption threshold for CrashCash is C$50.00 with a 2% network processing fee applied to payouts.</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="modalTos" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 cursor-pointer" />
              <label htmlFor="modalTos" className="text-xs font-bold text-slate-200 cursor-pointer">I have read and agree to the Terms of Service</label>
            </div>
            <button onClick={() => { setAcceptedTerms(true); setModal(null); }} className="w-full py-3 bg-emerald-600 text-slate-950 font-black rounded-xl cursor-pointer">Accept & Continue</button>
          </div>
        </div>
      )}

      {/* PROVABLY FAIR MODAL */}
      {modal === 'provablyFair' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-emerald-400">🔒 Provably Fair Verification System</h3>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setPfTab('verify')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${pfTab === 'verify' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}>Verify Round</button>
              <button onClick={() => setPfTab('history')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${pfTab === 'history' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}>Recent Hashes</button>
            </div>
            {pfTab === 'verify' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Server Seed (Revealed):</label>
                  <input type="text" value={verifyServerSeed} onChange={(e) => setVerifyServerSeed(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]" placeholder="Enter round server seed..." />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Client Seed:</label>
                  <input type="text" value={verifyClientSeed} onChange={(e) => setVerifyClientSeed(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Nonce:</label>
                  <input type="number" value={verifyNonce} onChange={(e) => setVerifyNonce(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]" />
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <span className="font-bold text-emerald-400 block mb-1">Active Server Hash Match:</span>
                  <p className="font-mono text-[10px] break-all text-slate-400">{serverSeedHash}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
                {roundHistory.map((r, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-emerald-400 font-bold">{r.crashPoint.toFixed(2)}x</span>
                      <span className="text-slate-400 block text-[10px] truncate max-w-[200px]">Hash: {r.serverSeedHash}</span>
                    </div>
                    <button onClick={() => loadRoundIntoVerifier(r)} className="bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded text-[10px]">Verify</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setModal(null)} className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* STORE MODAL */}
      {modal === 'store' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-emerald-400">⚡ Purchase CrashCoins (CC)</h3>
            <select value={packageAmount} onChange={(e) => setPackageAmount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white">
              <option value={10}>$10 Pack (1,000 CC + C$10.00)</option>
              <option value={50}>$50 Pack (5,000 CC + C$50.00)</option>
              <option value={100}>$100 Pack (10,000 CC + C$100.00)</option>
            </select>
            <button onClick={handlePurchase} className="w-full py-3 bg-emerald-600 text-slate-950 font-black rounded-xl cursor-pointer">Buy via Web3</button>
            {statusMsg && <p className="text-xs text-emerald-400 text-center">{statusMsg}</p>}
            <button onClick={() => setModal(null)} className="w-full py-2 bg-slate-800 text-white rounded-xl cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* REDEEM MODAL */}
      {modal === 'redeem' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-teal-400">💵 Redeem CrashCash (C$50 Min)</h3>
            <input type="number" value={redeemAmount} onChange={(e) => setRedeemAmount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white" />
            <input type="text" placeholder="Crypto Address (0x...)" value={cryptoAddress} onChange={(e) => setCryptoAddress(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs" />
            <button onClick={handleRedemption} className="w-full py-3 bg-teal-600 text-slate-950 font-black rounded-xl cursor-pointer">Request Payout (2% Fee)</button>
            {statusMsg && <p className="text-xs text-teal-400 text-center">{statusMsg}</p>}
            <button onClick={() => setModal(null)} className="w-full py-2 bg-slate-800 text-white rounded-xl cursor-pointer">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
