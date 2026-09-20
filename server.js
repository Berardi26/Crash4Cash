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

let gameState = 'WAITING'; // WAITING, RUNNING, CRASHED
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
    
    // Broadcast game_update that the frontend expects
    io.emit('game_update', {
      state: gameState,
      countdown: countdown,
      multiplier: 1.00,
      hash: roundHash
    });

    if (countdown <= 0) {
      gameState = 'RUNNING';
      multiplier = 1.00;
      crashPoint = generateCrashPoint();
      io.emit('game_update', {
        state: gameState,
        countdown: 0,
        multiplier: multiplier,
        crashPoint: crashPoint,
        hash: roundHash
      });
    }
  } else if (gameState === 'RUNNING') {
    multiplier = parseFloat((multiplier + 0.05).toFixed(2));
    
    io.emit('game_update', {
      state: gameState,
      countdown: 0,
      multiplier: multiplier,
      hash: roundHash
    });

    if (multiplier >= crashPoint) {
      gameState = 'CRASHED';
      io.emit('game_update', {
        state: gameState,
        countdown: 0,
        multiplier: multiplier,
        hash: roundHash
      });
      
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
  
  // Send immediate state on connection
  socket.emit('game_update', {
    state: gameState,
    countdown: countdown,
    multiplier: multiplier,
    hash: roundHash
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
