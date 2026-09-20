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

let gameState = 'WAITING';
let countdown = 5;
let multiplier = 1.00;
let crashPoint = 1.00;
let roundHash = crypto.randomBytes(32).toString('hex');

function generateCrashPoint() {
  const hash = crypto.randomBytes(32).toString('hex');
  roundHash = hash;
  const num = parseInt(hash.slice(0, 8), 16);
  let point = Math.floor((100 * 0.99) / (1 - (num / 4294967296))) / 100;
  return Math.max(1.00, point);
}

setInterval(() => {
  if (gameState === 'WAITING') {
    countdown--;
    // Broadcast all possible event name variations for countdown
    io.emit('timer', { countdown, hash: roundHash });
    io.emit('countdown', { countdown, hash: roundHash });
    io.emit('game_state', { state: 'WAITING', countdown, hash: roundHash });

    if (countdown <= 0) {
      gameState = 'RUNNING';
      multiplier = 1.00;
      crashPoint = generateCrashPoint();
      // Broadcast start variations
      io.emit('game_started', { crashPoint, hash: roundHash });
      io.emit('started', { crashPoint });
    }
  } else if (gameState === 'RUNNING') {
    multiplier = parseFloat((multiplier + 0.05).toFixed(2));
    // Broadcast all possible event name variations for ticks
    io.emit('tick', { multiplier });
    io.emit('multiplier', { multiplier });
    io.emit('game_tick', { multiplier });

    if (multiplier >= crashPoint) {
      gameState = 'CRASHED';
      // Broadcast all possible crash variations
      io.emit('crashed', { multiplier });
      io.emit('crash', { multiplier });
      
      setTimeout(() => {
        gameState = 'WAITING';
        countdown = 5;
        roundHash = crypto.randomBytes(32).toString('hex');
      }, 3000);
    }
  }
}, 1000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('sync', { gameState, countdown, multiplier, roundHash });
  socket.emit('init', { gameState, countdown, multiplier, roundHash });

  socket.on('disconnect', () => {
    console.log('Client connected/disconnected cleanup');
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
