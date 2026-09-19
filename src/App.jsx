import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [gameState, setGameState] = useState('IDLE');
  const [balance, setBalance] = useState(1000.00);
  const [betAmount, setBetAmount] = useState(10.00);
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(1.00);
  const [countdown, setCountdown] = useState(3);
  const [profit, setProfit] = useState(0);
  const [history, setHistory] = useState([]);
  
  const [houseBankroll, setHouseBankroll] = useState(50000.00);
  const houseWalletAddress = "0xB365eA5663cd62094E25d34671bF433C5e4334b8";
  const solanaWalletAddress = "5EHy7Xoz7prA9nMje4qvxgGxh6ez2hchTu8jQR3PdPTG";
  
  const requestRef = useRef();
  const startTimeRef = useRef();
  const actualCrashRef = useRef(1.00);

  const generateCrashPoint = () => {
    const r = Math.random();
    if (r < 0.03) return 1.00;
    const crash = 0.97 / (1 - Math.random());
    return Math.max(1.01, parseFloat(crash.toFixed(2)));
  };

  const startRound = () => {
    if (betAmount <= 0 || betAmount > balance) return;
    setBalance(prev => parseFloat((prev - betAmount).toFixed(2)));
    setHouseBankroll(prev => parseFloat((prev + betAmount).toFixed(2)));
    setGameState('STARTING');
    setCountdown(3);
    setProfit(0);

    let count = 3;
    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        launchFlight();
      }
    }, 1000);
  };

  const launchFlight = () => {
    const targetCrash = generateCrashPoint();
    actualCrashRef.current = targetCrash;
    setCrashPoint(targetCrash);
    setGameState('RUNNING');
    setMultiplier(1.00);
    startTimeRef.current = performance.now();

    const animate = (time) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const currentMult = Math.max(1.00, 1.00 + Math.pow(elapsed, 1.4) * 0.35);

      if (currentMult >= actualCrashRef.current) {
        setMultiplier(actualCrashRef.current);
        handleCrash(actualCrashRef.current);
      } else {
        setMultiplier(parseFloat(currentMult.toFixed(2)));
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const cashOut = () => {
    if (gameState !== 'RUNNING') return;
    cancelAnimationFrame(requestRef.current);
    const wonAmount = parseFloat((betAmount * multiplier).toFixed(2));
    setBalance(prev => parseFloat((prev + wonAmount).toFixed(2)));
    setHouseBankroll(prev => parseFloat((prev - wonAmount).toFixed(2)));
    setProfit(wonAmount);
    setGameState('CASHED_OUT');
    setHistory(prev => [{ mult: multiplier, won: true, amount: wonAmount }, ...prev.slice(0, 9)]);
  };

  const handleCrash = (finalMult) => {
    cancelAnimationFrame(requestRef.current);
    setGameState('CRASHED');
    setHistory(prev => [{ mult: finalMult, won: false, amount: betAmount }, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brandGroup}>
          <h1 style={styles.logo}>CRASH<span style={styles.accent}>4</span>CASH</h1>
          <span style={styles.subBadge}>3% House Edge Active</span>
        </div>
        <div style={styles.walletHeaderContainer}>
          <div style={styles.balanceBox}>
            <span style={styles.balanceLabel}>Player Balance:</span>
            <span style={styles.balanceValue}>${balance.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <div style={styles.houseWalletPanel}>
        <div style={styles.houseWalletInfo}>
          <span style={styles.houseTitle}>🏛️ House Bankroll Wallet (Owner: Nicholas Berardi)</span>
          <span style={styles.walletAddressText}>ETH: {houseWalletAddress}</span>
          <span style={styles.walletAddressText}>SOL: {solanaWalletAddress}</span>
        </div>
        <div style={styles.houseBalanceBox}>
          <span style={styles.balanceLabel}>House Vault:</span>
          <span style={styles.houseBalanceValue}>${houseBankroll.toFixed(2)}</span>
        </div>
      </div>

      <div style={styles.historyBar}>
        {history.map((h, i) => (
          <span key={i} style={{ ...styles.historyBadge, color: h.won ? '#22c55e' : '#ef4444' }}>
            {h.mult.toFixed(2)}x
          </span>
        ))}
      </div>

      <div style={styles.gameContainer}>
        <div style={styles.stage}>
          {gameState === 'IDLE' && (
            <div style={styles.stageCenter}>
              <h2 style={styles.stageTitle}>CRASH4CASH READY</h2>
              <p style={styles.stageSub}>Place your bet to launch the multiplier</p>
            </div>
          )}
          {gameState === 'STARTING' && (
            <div style={styles.stageCenter}>
              <div style={styles.countdownNumber}>{countdown}</div>
              <p style={styles.stageSub}>Preparing Crash4Cash Takeoff...</p>
            </div>
          )}
          {gameState === 'RUNNING' && (
            <div style={styles.stageCenter}>
              <div style={styles.multiplierText}>{multiplier.toFixed(2)}x</div>
              <div style={styles.rocketIcon}>🚀</div>
            </div>
          )}
          {gameState === 'CASHED_OUT' && (
            <div style={styles.stageCenter}>
              <div style={{ ...styles.multiplierText, color: '#22c55e' }}>{multiplier.toFixed(2)}x</div>
              <h3 style={styles.winText}>CRASH4CASH SUCCESS!</h3>
              <p style={styles.profitText}>Won +${profit.toFixed(2)}</p>
            </div>
          )}
          {gameState === 'CRASHED' && (
            <div style={styles.stageCenter}>
              <div style={{ ...styles.multiplierText, color: '#ef4444' }}>{multiplier.toFixed(2)}x</div>
              <h3 style={styles.crashText}>CRASH4CASH CRASHED</h3>
            </div>
          )}
        </div>

        <div style={styles.controlPanel}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Crash4Cash Bet Amount ($)</label>
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              disabled={gameState === 'RUNNING' || gameState === 'STARTING'}
              style={styles.input}
            />
            <div style={styles.quickBtns}>
              <button style={styles.quickBtn} onClick={() => setBetAmount(10)}>10</button>
              <button style={styles.quickBtn} onClick={() => setBetAmount(50)}>50</button>
              <button style={styles.quickBtn} onClick={() => setBetAmount(100)}>100</button>
              <button style={styles.quickBtn} onClick={() => setBetAmount(balance)}>MAX</button>
            </div>
          </div>

          {gameState === 'RUNNING' ? (
            <button style={styles.cashoutBtn} onClick={cashOut}>
              CASH OUT (${(betAmount * multiplier).toFixed(2)})
            </button>
          ) : (
            <button 
              style={{
                ...styles.launchBtn,
                opacity: (gameState === 'STARTING' || balance <= 0) ? 0.5 : 1
              }} 
              onClick={startRound}
              disabled={gameState === 'STARTING' || balance <= 0}
            >
              PLACE BET & LAUNCH CRASH4CASH
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#090d16', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
  header: { width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #1e293b' },
  brandGroup: { display: 'flex', flexDirection: 'column', gap: '2px' },
  logo: { fontSize: '26px', fontWeight: '900', letterSpacing: '1px', margin: 0 },
  accent: { color: '#22c55e' },
  subBadge: { fontSize: '11px', color: '#38bdf8', fontWeight: '600', letterSpacing: '0.5px' },
  walletHeaderContainer: { display: 'flex', gap: '10px' },
  balanceBox: { backgroundColor: '#111827', padding: '8px 14px', borderRadius: '8px', border: '1px solid #374151', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  balanceLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600' },
  balanceValue: { color: '#22c55e', fontSize: '16px', fontWeight: '800' },
  houseWalletPanel: { width: '100%', maxWidth: '800px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 16px', margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  houseWalletInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  houseTitle: { fontSize: '13px', fontWeight: '700', color: '#e2e8f0' },
  walletAddressText: { fontSize: '11px', color: '#64748b', fontFamily: 'monospace' },
  houseBalanceBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  houseBalanceValue: { color: '#38bdf8', fontSize: '15px', fontWeight: '800' },
  historyBar: { width: '100%', maxWidth: '800px', display: 'flex', gap: '8px', margin: '10px 0', overflowX: 'auto', paddingBottom: '5px' },
  historyBadge: { backgroundColor: '#111827', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: '1px solid #1f2937', whiteSpace: 'nowrap' },
  gameContainer: { width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px' },
  stage: { width: '100%', height: '350px', backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' },
  stageCenter: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  stageTitle: { fontSize: '22px', fontWeight: '800', color: '#94a3b8', margin: 0 },
  stageSub: { fontSize: '14px', color: '#64748b', margin: 0 },
  countdownNumber: { fontSize: '72px', fontWeight: '900', color: '#38bdf8' },
  multiplierText: { fontSize: '64px', fontWeight: '900', color: '#38bdf8', letterSpacing: '2px' },
  rocketIcon: { fontSize: '32px' },
  winText: { color: '#22c55e', fontSize: '20px', fontWeight: '800', margin: 0 },
  profitText: { color: '#38bdf8', fontSize: '16px', fontWeight: '600', margin: 0 },
  crashText: { color: '#ef4444', fontSize: '20px', fontWeight: '800', margin: 0 },
  controlPanel: { backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#94a3b8' },
  input: { backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '18px', fontWeight: '700', outline: 'none' },
  quickBtns: { display: 'flex', gap: '8px' },
  quickBtn: { flex: 1, backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#cbd5e1', padding: '6px', fontWeight: '700', cursor: 'pointer' },
  launchBtn: { backgroundColor: '#22c55e', color: '#052e16', border: 'none', borderRadius: '10px', padding: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)' },
  cashoutBtn: { backgroundColor: '#eab308', color: '#422006', border: 'none', borderRadius: '10px', padding: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4)' }
};
