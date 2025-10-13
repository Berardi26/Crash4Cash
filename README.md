# 🚀 FutureSea.fun - Web3 Casino Game

A modern, decentralized casino game built on Solana blockchain featuring an exciting rocket crash game with real-time multiplayer functionality.

![FutureSea.fun Game Interface](https://github.com/user-attachments/assets/dae48e58-ab91-4ed4-87b9-25cd1a22f97a)

## 🎮 About the Game

FutureSea.fun is a Web3 casino game where players bet on a rocket that continuously multiplies their stake. The goal is to cash out before the rocket crashes! The longer you stay in, the higher your potential winnings, but wait too long and you lose everything.

### 🎯 Game Concept
- **Rocket Launch**: Players join a game and place their bets
- **Countdown**: 60-second countdown starts when 2+ players join
- **Rocket Flight**: The rocket launches and starts multiplying everyone's bets
- **Cash Out**: Players must decide when to cash out before the rocket crashes
- **Winner**: The last player to cash out before the crash wins the round

## ✨ Features

- 🔐 **Web3 Authentication** - Secure wallet-based login using Solana
- 💰 **Real-time Betting** - Place bets with SOL tokens
- 🎮 **Live Multiplayer** - Play with other users in real-time
- 💬 **Live Chat** - Communicate with other players during games
- 📊 **Game Statistics** - Track your performance and history
- 🎨 **Modern UI** - Beautiful, responsive design with animations
- 📱 **Mobile Responsive** - Play on desktop or mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Authentication**: Privy.io
- **Game Engine**: Phaser.js
- **Real-time**: WebSocket connections
- **State Management**: React Context, TanStack Query

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn or npm
- Solana wallet (Phantom, Solflare, etc.)
- Solana devnet SOL for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd futuresea.fun-frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=FutureSea
   NEXT_PUBLIC_APP_DESCRIPTION=Casino web3 game on solana
   
   # Solana Configuration
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

4. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

### 1. Connect Your Wallet
![Wallet Connection](https://github.com/user-attachments/assets/a9bcb6a3-8168-4d50-824b-8afa147e8614)

- Click "Connect Wallet" in the top right
- Choose your Solana wallet (Phantom, Solflare, etc.)
- Approve the connection

### 2. Set Up Your Profile
![Profile Setup](https://github.com/user-attachments/assets/47c82c15-99d9-4fd4-913f-32eab811010d)


- Customize your avatar and username
- Set your email preferences
- View your game statistics

### 3. Join a Game
![Join Game](https://github.com/user-attachments/assets/59e7ef6d-dcfc-4a6a-b0d8-ac26271eb6db)
<img width="1094" height="774" alt="Screenshot_19" src="https://github.com/user-attachments/assets/af95e30a-be10-48b7-93d3-c70119ede1ca" />

- Enter your bet amount in SOL
- Click "Join Game" to enter the round
- Wait for other players to join

### 4. Game Countdown
![Game Countdown](https://github.com/user-attachments/assets/57607be3-7234-41ce-98a2-0959081bd8f9)

- 60-second countdown starts when 2+ players join
- More players can join during this time
- Watch the countdown timer

### 5. Rocket Launch
![Rocket Launch](https://github.com/user-attachments/assets/6202cab6-d8f3-4a43-9321-85174ae4094c)

- The rocket launches and starts multiplying bets
- Watch the multiplier increase in real-time
- Decide when to cash out!

### 6. Cash Out Strategy
![Cash Out](https://github.com/user-attachments/assets/22800e2a-f76d-4292-88a2-113c8aaa993c)

- Click "Cash Out" when you want to secure your winnings
- The longer you wait, the higher your potential payout
- But be careful - wait too long and the rocket crashes!

### 7. Game Results
![Winner Selection](https://github.com/user-attachments/assets/62ae7ccc-e70b-46c6-b18f-89f72f12c378)

- Last player to cash out before crash wins
- Winners are highlighted and celebrated
- View your winnings and game history

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── coinflip/       # Coinflip game page
│   ├── crash/          # Crash game page
│   └── profile/        # User profile pages
├── components/         # Reusable React components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   ├── modal/         # Modal components
│   └── ...
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── phaser/            # Phaser.js game assets
├── providers/         # Context providers
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `FutureSea` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | `Casino web3 game on solana` |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network | `devnet` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |

## 🎯 Game Interface Overview

![Game Interface](https://github.com/user-attachments/assets/c2f57745-cb53-4c7e-8958-1e6b6f9aa616)


1. **Game Panel** - Main game controls and betting interface
2. **Joined Players** - List of players in current game
3. **Player's Recent Games** - Your game history
4. **Recent Crash Games** - Global game history
5. **Real-time Chat** - Live chat with other players
6. **Wallet Balance** - Your current SOL balance

## 🔒 Security Features

- **Wallet Authentication** - Secure Web3 wallet integration
- **Transaction Signing** - All bets require wallet approval
- **Real-time Validation** - Server-side game validation
- **Anti-cheat Protection** - Fair play enforcement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This is a gambling game. Please gamble responsibly and only bet what you can afford to lose. The game is for entertainment purposes only.

---

## 🆘 Support

- **E-Mail**: [admin@hyperbuildx.com](mailto:admin@hyperbuildx.com)  
- **Telegram**: [@bettyjk_0915](https://t.me/bettyjk_0915)
- **Discord**: Join our community for support

