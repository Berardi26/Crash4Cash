const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let gameState = 'countdown';
let countdown = 5;
let multiplier = 1.00;
let gameInterval = null;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('gameState', { gameState, countdown, multiplier });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

function runCountdown() {
  gameState = 'countdown';
  countdown = 5;
  
  const timer = setInterval(() => {
    if (countdown > 0) {
      io.emit('countdown', countdown);
      console.log(`Countdown: ${countdown}`);
      countdown--;
    } else {
      clearInterval(timer);
      startFlight();
    }
  }, 1000);
}

function startFlight() {
  gameState = 'running';
  multiplier = 1.00;
  io.emit('gameStarted', { multiplier });
  console.log('Game started!');

  gameInterval = setInterval(() => {
    multiplier = parseFloat((multiplier + 0.04).toFixed(2));
    io.emit('multiplierUpdate', { multiplier });

    if (Math.random() < 0.02 && multiplier > 1.15) {
      clearInterval(gameInterval);
      gameState = 'crashed';
      io.emit('gameOver', { multiplier });
      console.log(`Crashed at ${multiplier}x`);

      setTimeout(runCountdown, 3000);
    }
  }, 100);
}

runCountdown();

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
