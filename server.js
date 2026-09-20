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
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let gameState = 'waiting';
let countdown = 5;
let multiplier = 1.00;
let crashPoint = 1.00;
let roundHash = crypto.randomBytes(32).toString('hex');

// Track user balances and states per socket connection
const users = {};

function generateCrashPoint() {
  const hash = crypto.randomBytes(32).toString('hex');
  roundHash = hash;
  const num = parseInt(hash.slice(0, 8), 16);
  let point = Math.floor((100 * 0.99) / (1 - (num / 4294967296))) / 100;
  return Math.max(1.00, point);
}

// Main game loop (100ms interval for smooth multiplier updates)
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

    io.emit('game_update', {
      gameState: gameState,
      countdown: countdown,
      multiplier: 1.00,
      serverSeedHash: roundHash,
      nonce: 1
    });

  } else if (gameState === 'running') {
    multiplier = parseFloat((multiplier + 0.01).toFixed(2));
    
    io.emit('game_update', {
      gameState: gameState,
      countdown: 0,
      multiplier: multiplier,
      serverSeedHash: roundHash,
      nonce: 1
    });

    if (multiplier >= crashPoint) {
      gameState = 'crashed';
      io.emit('game_update', {
        gameState: gameState,
        countdown: 0,
        multiplier: multiplier,
        serverSeedHash: roundHash,
        nonce: 1
      });
      
      setTimeout(() => {
        gameState = 'waiting';
        countdown = 5;
        roundHash = crypto.randomBytes(32).toString('hex');
        // Reset round-specific flags for all connected users
        Object.values(users).forEach(user => {
          user.cashedOut = false;
          user.activeBet = null;
        });
      }, 3000);
    }
  }
}, 100);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Initialize user balances (Starting with 100 Cash and 1000 CC Coins)
  users[socket.id] = {
    cash: 100.00,
    coins: 1000.00,
    activeBet: null,
    cashedOut: false
  };

  // Send initial balance and state
  socket.emit('balance_update', { cash: users[socket.id].cash, coins: users[socket.id].coins });
  socket.emit('game_update', {
    gameState: gameState,
    countdown: countdown,
    multiplier: multiplier,
    serverSeedHash: roundHash,
    nonce: 1
  });

  // Handle placing a bet (supports both 'cash' and 'coins' CC modes)
  socket.on('place_bet', ({ mode, amount }) => {
    const user = users[socket.id];
    if (!user || gameState !== 'waiting') return;

    if (mode === 'cash') {
      if (user.cash < amount) {
        socket.emit('redemption_error', { message: 'Insufficient Cash balance!' });
        return;
      }
      user.cash -= amount;
    } else if (mode === 'coins') {
      if (user.coins < amount) {
        socket.emit('redemption_error', { message: 'Insufficient CC Coins balance!' });
        return;
      }
      user.coins -= amount;
    } else {
      return;
    }

    user.activeBet = { mode, amount };
    socket.emit('balance_update', { cash: user.cash, coins: user.coins });
    socket.emit('bet_confirmed', { amount });
  });

  // Handle instant coin pack purchases ($3, $5, $100 packs)
  socket.on('deposit', ({ amount }) => {
    const user = users[socket.id];
    if (!user) return;
    
    // Add CC coins based on the pack purchase (e.g., $1 = 100 coins, or direct pack value)
    const coinReward = amount * 100;
    user.coins += coinReward;

    socket.emit('balance_update', { cash: user.cash, coins: user.coins });
    socket.emit('deposit_success', { amount: coinReward });
  });

  // Handle cashing out during a running round
  socket.on('cashout', () => {
    const user = users[socket.id];
    if (!user || !user.activeBet || user.cashedOut || gameState !== 'running') return;

    const payout = parseFloat((user.activeBet.amount * multiplier).toFixed(2));
    if (user.activeBet.mode === 'cash') {
      user.cash += payout;
    } else {
      user.coins += payout;
    }

    user.cashedOut = true;
    socket.emit('balance_update', { cash: user.cash, coins: user.coins });
    socket.emit('cashout_success', { payout });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
