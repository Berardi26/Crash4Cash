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

function generateCrashPoint() {
  const hash = crypto.randomBytes(32).toString('hex');
  roundHash = hash;
  const num = parseInt(hash.slice(0, 8), 16);
  let point = Math.floor((100 * 0.99) / (1 - (num / 4294967296))) / 100;
  return Math.max(1.00, point);
}

// Main game loop running every 100ms for smooth multiplier updates
setInterval(() => {
  if (gameState === 'waiting') {
    // Countdown ticks every 1 second (approx 10 ticks of 100ms)
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
    // Smooth increment every 100ms
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
      }, 3000);
    }
  }
}, 100);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('game_update', {
    gameState: gameState,
    countdown: countdown,
    multiplier: multiplier,
    serverSeedHash: roundHash,
    nonce: 1
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
