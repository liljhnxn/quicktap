export const QUICK_TAP_MAINNET_ADDRESS = "0xc6eBADCe654F6152c8c0826fBdF9f7867753F5FA" as const;

// Hardcode mainnet address so stale Vercel dashboard environment variables cannot override it
export const QUICK_TAP_ADDRESS: `0x${string}` = QUICK_TAP_MAINNET_ADDRESS;

export const QUICK_TAP_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reactionTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "personalBest",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAttempts",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ScoreSubmitted",
    type: "event",
  },
  {
    inputs: [],
    name: "getAllPlayers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlayerCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getStats",
    outputs: [
      {
        internalType: "uint256",
        name: "bestScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "attempts",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "playerStats",
    outputs: [
      {
        internalType: "uint256",
        name: "bestTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "attempts",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdated",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "players",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reactionTimeMs",
        type: "uint256",
      },
    ],
    name: "submitReactionTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reactionTimeMs",
        type: "uint256",
      },
    ],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
