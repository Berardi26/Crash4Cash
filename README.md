# 🚀 FutureSea.fun - Web3 Casino Game

A modern, decentralized casino game built on Solana blockchain featuring an exciting rocket crash game with real-time multiplayer functionality.

![FutureSea.fun Game Interface](https://github.com/user-attachments/assets/775b6bdf-b450-4b2f-97fb-7e367d15b5aa)

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
![Wallet Connection](https://github.com/user-attachments/assets/1239a495-a17f-47a6-9a56-bec255bee557)

- Click "Connect Wallet" in the top right
- Choose your Solana wallet (Phantom, Solflare, etc.)
- Approve the connection

### 2. Set Up Your Profile
![Profile Setup](https://github.com/user-attachments/assets/a3636fbd-0f87-42f8-839e-e5b75a22f59f)

- Customize your avatar and username
- Set your email preferences
- View your game statistics

### 3. Join a Game
![Join Game](https://github.com/user-attachments/assets/eb7e8b53-23bb-4765-9e3f-ef8c04b6a172)
<img width="1094" height="774" alt="Screenshot_19" src="https://github.com/user-attachments/assets/0f9a72cc-639d-403e-ac30-6ebb4cdac160" />

- Enter your bet amount in SOL
- Click "Join Game" to enter the round
- Wait for other players to join

### 4. Game Countdown
![Game Countdown](https://github.com/user-attachments/assets/0bece2fa-bbd3-4f3a-a35f-04d898fe8314)

- 60-second countdown starts when 2+ players join
- More players can join during this time
- Watch the countdown timer

### 5. Rocket Launch
![Rocket Launch](https://github.com/user-attachments/assets/23ffed4c-0709-42f2-8059-d6cadd6478d5)

- The rocket launches and starts multiplying bets
- Watch the multiplier increase in real-time
- Decide when to cash out!

### 6. Cash Out Strategy
![Cash Out](https://github.com/user-attachments/assets/6fc4a564-def3-4263-a637-9a68da752bfb)

- Click "Cash Out" when you want to secure your winnings
- The longer you wait, the higher your potential payout
- But be careful - wait too long and the rocket crashes!

### 7. Game Results
![Winner Selection](https://github.com/user-attachments/assets/a0480ebd-2d43-4c6f-9f22-fd3b7b80b218)

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

![Game Interface](https://github.com/user-attachments/assets/534528bf-9d65-41cf-b3ac-3718dc706688)

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: Join our community for support
- **Email**: support@futuresea.fun
- **Documentation**: Check our [docs](https://docs.futuresea.fun)

## ⚠️ Disclaimer

This is a gambling game. Please gamble responsibly and only bet what you can afford to lose. The game is for entertainment purposes only.

---

**Ready to launch? 🚀 Connect your wallet and start playing FutureSea.fun!**
