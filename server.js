const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const balances = {};
const activeBets = {};
const cashedOutStatus = {};
let gameState = 'waiting', countdown = 5, multiplier = 1.00, crashPoint = 2.00, flightStartTime = 0;
let currentServerSeed = '', currentServerSeedHash = '', currentNonce = 0, lastServerSeed = '';
let roundHistory = []; 

function generateNewSeeds() {
  lastServerSeed = currentServerSeed;
  currentServerSeed = crypto.randomBytes(32).toString('hex');
  currentServerSeedHash = crypto.createHash('sha256').update(currentServerSeed).digest('hex');
  currentNonce++;
}

function calculateCrashPoint(serverSeed, clientSeed, nonce) {
  const hmac = crypto.createHmac('sha256', serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);
  const hex = hmac.digest('hex');
  const intVal = parseInt(hex.slice(0, 8), 16);
  if (intVal % 100 < 4) return 1.00;
  const h = parseInt(hex.slice(0, 13), 16);
  const e = Math.pow(2, 52);
  let crash = Math.floor((100 * e - h) / (e - h)) / 100;
  crash = Number((crash * 0.96).toFixed(2)); // 4% early-crash adjustment
  return Math.max(1.01, crash);
}

function startGameLoop() {
  gameState = 'waiting'; countdown = 5; multiplier = 1.00;
  generateNewSeeds();
  for (let id in activeBets) { delete activeBets[id]; cashedOutStatus[id] = false; }
  io.emit('game_update', { gameState, countdown, multiplier, serverSeedHash: currentServerSeedHash, nonce: currentNonce });

  const countdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      io.emit('game_update', { gameState, countdown, multiplier, serverSeedHash: currentServerSeedHash });
    } else {
      clearInterval(countdownTimer);
      runFlight();
    }
  }, 1000);
}

function runFlight() {
  gameState = 'running';
  const clientSeed = 'Crash4CashOfficialClientSeed2026';
  crashPoint = calculateCrashPoint(currentServerSeed, clientSeed, currentNonce);
  flightStartTime = Date.now();
  io.emit('game_update', { gameState, multiplier, serverSeedHash: currentServerSeedHash });

  const flightInterval = setInterval(() => {
    const elapsed = (Date.now() - flightStartTime) / 1000;
    multiplier = Number((1.00 + Math.pow(elapsed, 1.3) * 0.12).toFixed(2));

    for (let socketId in activeBets) {
      const betInfo = activeBets[socketId];
      if (!cashedOutStatus[socketId] && betInfo.autoCashout && multiplier >= betInfo.autoCashout) {
        if (multiplier <= crashPoint) triggerCashOut(socketId, betInfo.autoCashout);
      }
    }

    if (multiplier >= crashPoint) {
      clearInterval(flightInterval);
      gameState = 'crashed';
      multiplier = crashPoint;
      roundHistory.unshift({ nonce: currentNonce, serverSeed: currentServerSeed, serverSeedHash: currentServerSeedHash, clientSeed, crashPoint, timestamp: new Date().toLocaleTimeString() });
      if (roundHistory.length > 25) roundHistory.pop();

      io.emit('game_update', { gameState, multiplier, revealedServerSeed: currentServerSeed, crashPoint });
      io.emit('round_history', roundHistory);
      setTimeout(startGameLoop, 5000);
    } else {
      io.emit('game_update', { gameState, multiplier });
    }
  }, 75);
}

function triggerCashOut(socketId, targetMultiplier) {
  if (cashedOutStatus[socketId]) return;
  cashedOutStatus[socketId] = true;
  const betInfo = activeBets[socketId];
  if (!betInfo) return;
  const payoutInCents = Math.round(betInfo.amount * Math.min(targetMultiplier, crashPoint));
  if (betInfo.mode === 'cash') balances[socketId].cash += payoutInCents;
  else balances[socketId].coins += payoutInCents;

  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    socket.emit('balance_update', { coins: balances[socketId].coins / 100, cash: balances[socketId].cash / 100 });
    socket.emit('cashout_success', { payout: payoutInCents / 100 });
  }
}

io.on('connection', (socket) => {
  balances[socket.id] = { coins: 500000, cash: 0 };
  cashedOutStatus[socket.id] = false;
  socket.emit('balance_update', { coins: 5000, cash: 0 });
  socket.emit('game_update', { gameState, countdown, multiplier, serverSeedHash: currentServerSeedHash, nonce: currentNonce });
  socket.emit('round_history', roundHistory);

  socket.on('place_bet', ({ amount, mode, autoCashout }) => {
    if (gameState !== 'waiting' || activeBets[socket.id]) return;
    const amountInCents = Math.round(Number(amount) * 100);
    if (amountInCents <= 0) return;
    if (mode === 'cash' && balances[socket.id].cash < amountInCents) return;
    if (mode === 'coins' && balances[socket.id].coins < amountInCents) return;

    if (mode === 'cash') balances[socket.id].cash -= amountInCents;
    else balances[socket.id].coins -= amountInCents;

    activeBets[socket.id] = { amount: amountInCents, mode, autoCashout: autoCashout ? Number(autoCashout) : null };
    cashedOutStatus[socket.id] = false;
    socket.emit('balance_update', { coins: balances[socket.id].coins / 100, cash: balances[socket.id].cash / 100 });
    socket.emit('bet_confirmed', { amount: amountInCents / 100 });
  });

  socket.on('cash_out', () => {
    if ((gameState === 'running' || (gameState === 'crashed' && Date.now() - flightStartTime < 5000)) && activeBets[socket.id] && !cashedOutStatus[socket.id]) {
      triggerCashOut(socket.id, multiplier);
    }
  });

  socket.on('purchase_package', ({ packagePrice }) => {
    const priceInCents = Math.round(Number(packagePrice) * 100);
    balances[socket.id].coins += priceInCents * 100;
    balances[socket.id].cash += priceInCents;
    socket.emit('balance_update', { coins: balances[socket.id].coins / 100, cash: balances[socket.id].cash / 100 });
    socket.emit('deposit_success', { amount: priceInCents / 100 });
  });

  socket.on('redeem_crash_cash', ({ amount, cryptoAddress }) => {
    const amountInCents = Math.round(Number(amount) * 100);
    if (amountInCents < 5000 || balances[socket.id].cash < amountInCents) {
      socket.emit('redemption_error', { message: 'Minimum redemption is $50.00 or insufficient balance.' });
      return;
    }
    const fee = Math.round(amountInCents * 0.02);
    balances[socket.id].cash -= amountInCents;
    socket.emit('balance_update', { coins: balances[socket.id].coins / 100, cash: balances[socket.id].cash / 100 });
    socket.emit('redemption_success', { requested: amountInCents / 100, fee: fee / 100, payout: (amountInCents - fee) / 100, cryptoAddress });
  });

  socket.on('send_chat', (msg) => {
    io.emit('receive_chat', { user: msg.user || 'NinjaPlayer', text: msg.text, time: new Date().toLocaleTimeString() });
  });

  socket.on('disconnect', () => { delete balances[socket.id]; delete activeBets[socket.id]; delete cashedOutStatus[socket.id]; });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => { console.log(`Backend running on port ${PORT}`); startGameLoop(); });
