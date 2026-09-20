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

// Game state variables
let gameState = 'WAITING'; // WAITING, RUNNING, CRASHED
let countdown = 5;
let multiplier = 1.00;
let crashPoint = 1.00;
let roundHash = '';

function generateCrashPoint() {
  // Simple provably fair crash point generation
  const hash = crypto.randomBytes(32).toString('hex');
  roundHash = hash;
  const num = parseInt(hash.slice(0, 8), 16);
  // House edge ~1%, minimum crash 1.00x
  let point = Math.floor((100 * 0.99) / (1 - (num / 4294967296))) / 100;
  return Math.max(1.00, point);
}

// Game loop simulation
setInterval(() => {
  if (gameState === 'WAITING') {
    countdown--;
    io.emit('timer', { countdown, hash: roundHash });
    console.log(`Countdown: ${countdown}`);

    if (countdown <= 0) {
      gameState = 'RUNNING';
      multiplier = 1.00;
      crashPoint = generateCrashPoint();
      io.emit('game_started', { crashPoint });
      console.log(`Game started! Crash point: ${crashPoint}x`);
    }
  } else if (gameState === 'RUNNING') {
    multiplier = parseFloat((multiplier + 0.05).toFixed(2));
    io.emit('tick', { multiplier });
    console.log(`Current multiplier: ${multiplier}x`);

    if (multiplier >= crashPoint) {
      gameState = 'CRASHED';
      io.emit('crashed', { multiplier });
      console.log(`Crashed at ${multiplier}x`);
      
      setTimeout(() => {
        gameState = 'WAITING';
        countdown = 5;
        roundHash = crypto.randomBytes(32).toString('hex');
      }, 3000); // Wait 3 seconds before next round countdown
    }
  }
}, 1000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Send current state immediately on connection
  socket.emit('sync', { gameState, countdown, multiplier, roundHash });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
