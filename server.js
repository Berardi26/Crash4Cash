const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Crash4Cash Backend is running!');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true }
});

let gameState = 'waiting';
let countdown = 5;
let multiplier = 1.00;
let crashPoint = 1.00;
let roundHash = crypto.randomBytes(32).toString('hex');
const users = {};

function generateCrashPoint() {
  const hash = crypto.randomBytes(32).toString('hex');
  roundHash = hash;
  const num = parseInt(hash.slice(0, 8), 16);
  let point = Math.floor((100 * 0.99) / (1 - (num / 4294967296))) / 100;
  return Math.max(1.00, point);
}

setInterval(() => {
  if (gameState === 'waiting') {
    global.waitCounter = (global.waitCounter || 0) + 1;
    if (global.waitCounter >= 10) {
      global.waitCounter = 0;
      countdown--;
      if (countdown <= 0) {
        gameState = 'running';
        multiplier = 1.00;
        crashPoint = generateCrashPoint();
      }
    }
    io.emit('game_update', { gameState, countdown, multiplier: 1.00, serverSeedHash: roundHash, nonce: 1 });
  } else if (gameState === 'running') {
    multiplier = parseFloat((multiplier + 0.01).toFixed(2));
    io.emit('game_update', { gameState, countdown: 0, multiplier, serverSeedHash: roundHash, nonce: 1 });

    if (multiplier >= crashPoint) {
      gameState = 'crashed';
      io.emit('game_update', { gameState, countdown: 0, multiplier, serverSeedHash: roundHash, nonce: 1 });
      setTimeout(() => {
        gameState = 'waiting';
        countdown = 5;
        roundHash = crypto.randomBytes(32).toString('hex');
        Object.values(users).forEach(u => { u.cashedOut = false; u.activeBet = null; });
      }, 3000);
    }
  }
}, 100);

io.on('connection', (socket) => {
  users[socket.id] = { cash: 100.00, coins: 1000.00, activeBet: null, cashedOut: false };

  socket.emit('balance_update', { cash: users[socket.id].cash, coins: users[socket.id].coins });
  socket.emit('game_update', { gameState, countdown, multiplier, serverSeedHash: roundHash, nonce: 1 });

  socket.on('place_bet', ({ mode, amount }) => {
    const user = users[socket.id];
    if (!user || gameState !== 'waiting') return;
    if (mode === 'cash' && user.cash >= amount) {
      user.cash -= amount;
    } else if (mode === 'coins' && user.coins >= amount) {
      user.coins -= amount;
    } else {
      return;
    }
    user.activeBet = { mode, amount };
    user.cashedOut = false;
    socket.emit('balance_update', { cash: user.cash, coins: user.coins });
    socket.emit('bet_confirmed', { amount });
  });

  socket.on('deposit', ({ amount }) => {
    const user = users[socket.id];
    if (!user) return;
    user.coins += amount * 100;
    socket.emit('balance_update', { cash: user.cash, coins: user.coins });
  });

  socket.on('cashout', () => {
    const user = users[socket.id];
    if (!user || !user.activeBet || user.cashedOut || gameState !== 'running') return;
    
    const payout = parseFloat((user.activeBet.amount * multiplier).toFixed(2));
    if (user.activeBet.mode === 'cash') user.cash += payout;
    else user.coins += payout;

    user.cashedOut = true;
    socket.emit('balance_update', { cash: user.cash, coins: user.coins });
    socket.emit('cashout_success', { payout });
  });

  // Chat listener
  socket.on('send_chat', (message) => {
    if (!message || typeof message !== 'string') return;
    io.emit('chat_message', { user: `User_${socket.id.slice(0, 4)}`, text: message.slice(0, 200) });
  });

  socket.on('disconnect', () => { delete users[socket.id]; });
});

server.listen(process.env.PORT || 10000, () => console.log('Server running'));
