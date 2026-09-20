const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

let gameState = 'waiting';
let countdown = 5;
let multiplier = 1.00;
let crashPoint = 1.00;
let currentHash = '';
let currentSalt = '';
let timerId = null;
let launchHistory = [];

function generateCrashPoint() {
  const e = 2 ** 32;
  const h = Math.floor(Math.random() * 4294967296);
  if (h % 33 === 0) return 1.00;
  return Math.floor((100 * e - h) / (e - h)) / 100;
}

function startNewRound() {
  crashPoint = generateCrashPoint();
  currentSalt = crypto.randomBytes(16).toString('hex');
  currentHash = crypto.createHash('sha256').update(`${crashPoint}-${currentSalt}`).digest('hex');
  multiplier = 1.00;
}

startNewRound();

const activeBets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let userData = {
    coins: 1000, // CC Gold Coins
    sweeps: 0.00 // C$ Sweeps Cash strictly starts at 0
  };

  socket.emit('balance_update', userData);
  socket.emit('game_state', { gameState, countdown, multiplier, currentHash, history: launchHistory });

  socket.on('place_bet', (data) => {
    if (gameState !== 'waiting') return;
    if (activeBets.has(socket.id)) return;

    const amount = Number(data?.amount);
    const mode = data?.mode === 'sweeps' ? 'sweeps' : 'cc';

    if (isNaN(amount) || amount <= 0) return;

    if (mode === 'cc') {
      if (userData.coins < amount) {
        socket.emit('notification', 'Insufficient CC Coins!');
        return;
      }
      userData.coins -= amount;
    } else {
      if (userData.sweeps < amount) {
        socket.emit('notification', 'Insufficient C$ Sweeps Cash! Purchase a CC pack to receive free C$ bonus.');
        return;
      }
      userData.sweeps -= amount;
    }

    activeBets.set(socket.id, { socket, amount, mode, cashedOut: false });
    socket.emit('balance_update', userData);
    io.emit('chat_message', { user: 'System', text: `Player wagered ${amount} ${mode === 'sweeps' ? 'C$' : 'CC'}` });
  });

  socket.on('cashout', () => {
    if (gameState !== 'running') return;
    const bet = activeBets.get(socket.id);
    if (!bet || bet.cashedOut) return;

    bet.cashedOut = true;
    const winAmount = Number((bet.amount * multiplier).toFixed(2));

    if (bet.mode === 'cc') {
      userData.coins += winAmount;
    } else {
      userData.sweeps += winAmount;
    }

    socket.emit('balance_update', userData);
    socket.emit('notification', `Successfully cashed out at ${multiplier.toFixed(2)}x for +${winAmount} ${bet.mode === 'sweeps' ? 'C$' : 'CC'}!`);
  });

  socket.on('deposit', (data) => {
    const price = Number(data?.amount);
    let addCC = 0;
    let addSweeps = 0;

    if (price === 3) {
      addCC = 300;
      addSweeps = 3.00;
    } else if (price === 5) {
      addCC = 500;
      addSweeps = 5.00;
    } else if (price === 100) {
      addCC = 10000;
      addSweeps = 105.00;
    } else {
      return;
    }

    userData.coins += addCC;
    userData.sweeps += addSweeps;

    socket.emit('balance_update', userData);
    socket.emit('notification', `Purchased CC Pack! Credited +${addCC} CC and +${addSweeps.toFixed(2)} C$ Promotional Bonus.`);
  });

  socket.on('request_redemption', (data) => {
    const amount = Number(data?.amount);
    if (isNaN(amount) || amount < 50) {
      socket.emit('notification', 'Minimum redemption threshold is 50.00 C$');
      return;
    }
    if (userData.sweeps < amount) {
      socket.emit('notification', 'Insufficient C$ balance for redemption.');
      return;
    }

    userData.sweeps -= amount;
    socket.emit('balance_update', userData);
    socket.emit('notification', `Redemption request of $${amount.toFixed(2)} USD submitted! Processing within 24-48 hours.`);
  });

  socket.on('claim_faucet', () => {
    userData.coins += 1000;
    socket.emit('balance_update', userData);
    socket.emit('notification', 'Daily Bonus Claimed: +1,000 CC Coins!');
  });

  socket.on('send_chat', (text) => {
    if (typeof text !== 'string' || !text.trim()) return;
    io.emit('chat_message', { user: `Player_${socket.id.substring(0, 4)}`, text: text.trim().substring(0, 200) });
  });

  socket.on('disconnect', () => {
    activeBets.delete(socket.id);
  });
});

function startGameLoop() {
  if (gameState === 'waiting') {
    countdown--;
    io.emit('game_update', { gameState: 'waiting', countdown, multiplier: 1.00, currentHash, history: launchHistory });

    if (countdown <= 0) {
      gameState = 'running';
      multiplier = 1.00;
      activeBets.clear();
      
      timerId = setInterval(() => {
        multiplier = Number((multiplier * 1.04).toFixed(2));
        
        if (multiplier >= crashPoint) {
          clearInterval(timerId);
          gameState = 'crashed';
          
          launchHistory.unshift({ multiplier: crashPoint, hash: currentHash, salt: currentSalt });
          if (launchHistory.length > 25) launchHistory.pop();

          io.emit('game_update', { gameState: 'crashed', multiplier: crashPoint, currentHash, salt: currentSalt, history: launchHistory });

          setTimeout(() => {
            gameState = 'waiting';
            countdown = 5;
            startNewRound();
            io.emit('game_update', { gameState: 'waiting', countdown, multiplier: 1.00, currentHash, history: launchHistory });
          }, 4000);
        } else {
          io.emit('game_update', { gameState: 'running', multiplier, currentHash, history: launchHistory });
        }
      }, 200);
    }
  }
}

setInterval(() => {
  if (gameState === 'waiting') {
    startGameLoop();
  }
}, 1000);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Sweepstakes server running on port ${PORT}`);
});
