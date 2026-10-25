# QuickTap ⚡ — Web3 Reaction Time Game

QuickTap is a Web3 reaction-time testing game built for **Botchain Mainnet**. Players test their reflexes by waiting for a randomized signal, clicking as quickly as possible upon green, measuring their reaction time in milliseconds, and permanently recording their verified personal best scores directly to the Botchain smart contract.

---

## 🎮 Game Mechanics

1. **Wallet Connection**: Connect any Web3 wallet (e.g., MetaMask, Rabby). The app automatically validates that you are on **Botchain Mainnet (Chain ID 677)** and prompts a 1-click network switch if not.
2. **Start Round**: Click **"Start Game"** or tap the arena.
3. **Wait for Green**: The arena displays a red background with `"Wait for green..."` for a randomized delay between **2 and 5 seconds**.
4. **Early Click Detection**: Clicking before the arena turns green triggers `"Too early!"` and immediately cancels that round to prevent anticipatory clicking.
5. **Reaction Measurement**: When the arena turns neon green with `"CLICK NOW!"`, a high-resolution browser performance timer (`performance.now()`) starts. The player's reaction time is measured upon their click.
6. **Save On-Chain**: After completing a valid round, players can click **"Save Score"** to record their result on the Botchain smart contract.

---

## ⚠️ Important Timing & Verifiability Notice

> [!WARNING]  
> **Client-Side Timing & Score Manipulation Caveat**:  
> In QuickTap, physical reaction times must be captured in the player's web browser using client-side JavaScript APIs (`performance.now()`). Because the EVM (Ethereum Virtual Machine) running on Botchain cannot independently measure the user's physical response speed or latency, the reaction time is passed as an argument (`submitScore(reactionTimeMs)`) by the player's wallet.  
>  
> The smart contract enforces strict bounds (**1 ms to 10,000 ms**) and personal-best updates, but cannot guarantee that a user has not modified client-side code or submitted synthetic transactions. In Web3 architectures, client-reported metrics are subject to this inherent limitation.

---

## 🌐 Botchain Mainnet Configuration

| Parameter | Value |
|---|---|
| **Network Name** | Botchain |
| **Chain ID** | `677` |
| **RPC URL** | [https://rpc.botchain.ai](https://rpc.botchain.ai/) |
| **Native Token** | BOT |
| **Currency Symbol** | `BOT` |
| **Decimals** | 18 |
| **Total Supply** | 150 Million |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai/) |
| **Mainnet Contract** | [`0xc6eBADCe654F6152c8c0826fBdF9f7867753F5FA`](https://scan.botchain.ai/address/0xc6eBADCe654F6152c8c0826fBdF9f7867753F5FA) |

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity `^0.8.24`, Hardhat, ethers.js, TypeScript
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Dark Cyberpunk Gaming Theme with Neon Accents)
- **Web3 Integration**: wagmi v2, viem, `@tanstack/react-query`
- **Icons**: Lucide React

---

## 📁 Repository Structure

```
Quick Tap/
├── contracts/
│   └── QuickTap.sol          # Solidity smart contract
├── scripts/
│   └── deploy.ts             # Botchain Mainnet deployment script
├── test/
│   └── QuickTap.test.ts      # Comprehensive Hardhat contract tests
├── hardhat.config.ts         # Hardhat configuration (Chain ID 677)
├── package.json              # Root package configuration
├── .env.example              # Root environment template (Private key)
└── frontend/                 # Next.js web application
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # Root layout with Web3 providers
    │   │   ├── page.tsx      # Main application page
    │   │   └── globals.css   # Dark neon gaming design system
    │   ├── components/
    │   │   ├── Navbar.tsx    # Navigation, network badge, wallet connection, explorer link
    │   │   ├── GameCard.tsx  # Central reaction-time interactive arena & contract explorer
    │   │   ├── PersonalStats.tsx # Real-time personal stats from contract
    │   │   ├── Leaderboard.tsx   # On-chain player rankings
    │   │   └── Footer.tsx    # Explorer links and network status
    │   └── config/
    │       ├── chain.ts      # Botchain Mainnet chain definition
    │       ├── wagmi.ts      # Wagmi client configuration
    │       └── contract.ts   # QuickTap ABI and deployed mainnet contract address
    ├── .env.example          # Frontend environment template
    └── package.json          # Frontend dependencies
```

---

## 🚀 Step-by-Step Setup & Deployment

### 1. Install Root Dependencies

From the project root:

```bash
npm install
```

### 2. Compile and Test Smart Contract

Run the unit tests to verify contract logic (bounds checking, personal best tracking, event emission):

```bash
npm test
```

Expected output:
```text
  QuickTap Contract
    ✔ should initialize with empty stats
    ✔ should allow a player to submit a valid score and update personal best
    ✔ should reject scores below 1ms or above 10000ms
    ✔ should only update personal best if the new score is lower (better)
    ✔ should work with alias submitReactionTime
    ✔ should track multiple players properly for leaderboard

  6 passing (3s)
```

### 3. Deploy Smart Contract to Botchain Mainnet

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your deployer wallet private key:
   ```env
   PRIVATE_KEY=0xYourPrivateKeyHere
   BOTCHAIN_RPC_URL=https://rpc.botchain.ai
   ```
3. Run the deployment script:
   ```bash
   npm run deploy
   ```
4. The script outputs the deployed contract address and automatically updates `frontend/.env.local`.

---

### 4. Configure & Run the Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Update `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_QUICK_TAP_CONTRACT_ADDRESS=0xc6eBADCe654F6152c8c0826fBdF9f7867753F5FA
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Deploying Frontend to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and import this repository.
3. In the project configuration:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: Next.js
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_QUICK_TAP_CONTRACT_ADDRESS`: `0xc6eBADCe654F6152c8c0826fBdF9f7867753F5FA`
5. Click **"Deploy"**. Vercel will automatically build and publish your Next.js application with a production URL.

---

## 📜 Smart Contract Reference (`QuickTap.sol`)

- `submitScore(uint256 reactionTimeMs)`: Submits a reaction time in milliseconds (1ms – 10,000ms). Updates personal best if faster.
- `submitReactionTime(uint256 reactionTimeMs)`: Convenient alias for `submitScore`.
- `getStats(address player)`: Returns `(uint256 bestScore, uint256 attempts)`.
- `playerStats(address)`: Mapping returning `(bestTime, attempts, lastTime, lastUpdated)`.
- `getAllPlayers()`: Returns list of unique player addresses for leaderboard discovery.
- `ScoreSubmitted(address indexed player, uint256 reactionTime, uint256 personalBest, uint256 totalAttempts, uint256 timestamp)`: Emitted on every valid score.
