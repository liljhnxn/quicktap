"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { QUICK_TAP_ADDRESS, QUICK_TAP_ABI } from "@/config/contract";
import { botchainMainnet } from "@/config/chain";
import { Zap, Play, RotateCcw, Save, CheckCircle2, AlertTriangle, ExternalLink, Loader2, Clock } from "lucide-react";

type GameState = "idle" | "waiting" | "ready" | "early" | "result";

interface GameCardProps {
  onScoreSaved: () => void;
}

export function GameCard({ onScoreSaved }: GameCardProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [gameState, setGameState] = useState<GameState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [hasSavedThisRound, setHasSavedThisRound] = useState(false);

  // High precision timer references
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Wagmi contract write hooks
  const {
    data: txHash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  // Clear timer helper
  const clearGameTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearGameTimer();
    };
  }, [clearGameTimer]);

  // When transaction confirms on-chain
  useEffect(() => {
    if (isConfirmed) {
      setHasSavedThisRound(true);
      onScoreSaved();
    }
  }, [isConfirmed, onScoreSaved]);

  // Start game round
  const startGame = () => {
    clearGameTimer();
    resetWrite();
    setReactionTime(null);
    setHasSavedThisRound(false);
    setGameState("waiting");

    // Random delay between 2 and 5 seconds (2000ms - 5000ms)
    const delay = Math.floor(Math.random() * 3000) + 2000;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState("ready");
    }, delay);
  };

  // Handle click on the reaction area
  const handleReactionAreaClick = () => {
    if (gameState === "idle") {
      startGame();
    } else if (gameState === "waiting") {
      // Too early!
      clearGameTimer();
      setGameState("early");
    } else if (gameState === "ready") {
      // Valid reaction!
      const endTime = performance.now();
      const measuredTime = Math.max(1, Math.round(endTime - startTimeRef.current));
      setReactionTime(measuredTime);
      setGameState("result");
    }
  };

  // Submit score to contract
  const handleSaveScore = async () => {
    if (!reactionTime || hasSavedThisRound || isWritePending || isConfirming) return;

    if (!isConnected) {
      alert("Please connect your wallet first to save your score on-chain!");
      return;
    }

    if (isWrongNetwork) {
      switchChain({ chainId: botchainMainnet.id });
      return;
    }

    if (QUICK_TAP_ADDRESS === "0x0000000000000000000000000000000000000000") {
      alert(
        "QuickTap smart contract address is not yet configured. Please set NEXT_PUBLIC_QUICK_TAP_CONTRACT_ADDRESS in .env.local"
      );
      return;
    }

    try {
      writeContract({
        address: QUICK_TAP_ADDRESS,
        abi: QUICK_TAP_ABI,
        functionName: "submitScore",
        args: [BigInt(reactionTime)],
      });
    } catch (err) {
      console.error("Failed to initiate transaction:", err);
    }
  };

  // Feedback message based on score
  const getRatingMessage = (ms: number) => {
    if (ms < 180) return { title: "Godlike Reflexes!", subtitle: "Lightning speed. Top 1% tier reaction." };
    if (ms <= 240) return { title: "Pro Gamer Tier!", subtitle: "Superb speed, well ahead of the curve." };
    if (ms <= 320) return { title: "Great Reaction!", subtitle: "Solid response time. Keep pushing!" };
    if (ms <= 420) return { title: "Average Human Reflex!", subtitle: "Good effort. Try again to beat your score." };
    return { title: "A Bit Slow Today!", subtitle: "Warm up your fingers and try again." };
  };

  return (
    <div className="bg-[#0e1320]/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Top Bar inside card */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00ff66]" />
          <h2 className="text-lg font-bold text-white tracking-wide">Reflex Test Arena</h2>
        </div>
        <div className="flex items-center gap-3">
          <a
            id="gamecard-contract-explorer-link"
            href={`https://scan.botchain.ai/address/${QUICK_TAP_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-gray-300 hover:text-white bg-gray-900/90 hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700/80 hover:border-[#00ff66]/50 transition cursor-pointer"
            title={`View Contract ${QUICK_TAP_ADDRESS} on BOT Chain Explorer`}
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-3.5 h-3.5 rounded object-contain shrink-0"
            />
            <span className="text-gray-400 font-medium hidden sm:inline">Contract:</span>
            <span className="font-mono text-[#00ff66] font-bold hidden md:inline">0xc6eBADCe654F6152c8c0826fBdF9f7867753F5FA</span>
            <span className="font-mono text-[#00ff66] font-bold md:hidden">0xc6eB...F5FA</span>
            <ExternalLink className="w-3 h-3 text-[#00ff66]" />
          </a>
          <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
            <span>Target: Wait for Green</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Reaction Area */}
      <div
        id="reaction-arena"
        onClick={handleReactionAreaClick}
        className={`w-full h-80 sm:h-96 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-colors duration-150 relative overflow-hidden border ${
          gameState === "idle"
            ? "bg-[#111726] border-gray-800 hover:border-gray-700 hover:bg-[#141b2d]"
            : gameState === "waiting"
            ? "bg-[#7f1d1d] border-red-500/80 text-white shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-pulse"
            : gameState === "ready"
            ? "bg-[#00ff66] border-emerald-300 text-black shadow-[0_0_60px_rgba(0,255,102,0.6)]"
            : gameState === "early"
            ? "bg-[#331118] border-red-800/80 text-white"
            : "bg-[#12192a] border-gray-800 text-white"
        }`}
      >
        {/* State: Idle */}
        {gameState === "idle" && (
          <div className="flex flex-col items-center gap-4 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center shadow-lg shadow-[#00ff66]/10">
              <Zap className="w-8 h-8 text-[#00ff66]" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-tight mb-1">Click to Start</p>
              <p className="text-sm text-gray-400">
                When the screen turns <span className="text-[#00ff66] font-bold">GREEN</span>, click as fast as possible.
              </p>
            </div>
            <button
              id="start-game-btn"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00cc55] text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#00ff66]/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {/* State: Waiting */}
        {gameState === "waiting" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-400 animate-ping mb-2" />
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase text-glow-red">
              Wait for green...
            </h3>
            <p className="text-red-200 text-sm font-medium">Do not click yet! Keep your finger ready.</p>
          </div>
        )}

        {/* State: Ready (Green) */}
        {gameState === "ready" && (
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-16 h-16 text-black fill-black animate-bounce" />
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-black uppercase">
              CLICK NOW!
            </h3>
            <p className="text-black/80 font-bold text-sm tracking-wide">TAP ANYWHERE QUICKLY!</p>
          </div>
        )}

        {/* State: Early */}
        {gameState === "early" && (
          <div className="flex flex-col items-center gap-4 max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-red-400 tracking-tight mb-1">Too early!</p>
              <p className="text-sm text-gray-400">
                You clicked before the screen turned green. That round was cancelled.
              </p>
            </div>
            <button
              id="try-again-btn"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition cursor-pointer shadow-lg shadow-red-900/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* State: Result */}
        {gameState === "result" && reactionTime !== null && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Reaction Time</span>
            <div className="text-5xl sm:text-7xl font-black font-mono tracking-tighter text-[#00ff66] text-glow-green">
              {reactionTime} <span className="text-2xl text-gray-300 font-normal">ms</span>
            </div>

            <div className="text-center mt-1">
              <p className="text-lg font-bold text-white">{getRatingMessage(reactionTime).title}</p>
              <p className="text-xs text-gray-400">{getRatingMessage(reactionTime).subtitle}</p>
            </div>

            {/* Actions for Result */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="play-again-btn"
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                id="save-score-btn"
                onClick={handleSaveScore}
                disabled={hasSavedThisRound || isWritePending || isConfirming}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition cursor-pointer shadow-lg ${
                  hasSavedThisRound
                    ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 cursor-default"
                    : isWritePending || isConfirming
                    ? "bg-gray-800 text-gray-400 cursor-wait"
                    : "bg-[#00ff66] text-black hover:brightness-110 shadow-[#00ff66]/20 active:scale-95"
                }`}
              >
                {isWritePending || isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isWritePending ? "Approve in Wallet..." : "Confirming on Botchain..."}</span>
                  </>
                ) : hasSavedThisRound ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Score Saved On-Chain!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Score to Blockchain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Status Alerts */}
      {(txHash || writeError || confirmError) && (
        <div className="mt-4 p-4 rounded-xl text-xs space-y-2 border">
          {/* Pending State */}
          {(isWritePending || isConfirming) && (
            <div className="flex items-center gap-2 text-amber-300 bg-amber-950/40 border border-amber-500/30 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <span>
                {isWritePending
                  ? "Awaiting transaction signature in your wallet..."
                  : "Transaction submitted! Waiting for Botchain block confirmation..."}
              </span>
            </div>
          )}

          {/* Success State */}
          {isConfirmed && txHash && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Score successfully recorded to Botchain smart contract!</span>
              </div>
              <a
                href={`https://scan.botchain.ai/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-[#00ff66] hover:underline shrink-0"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Error State */}
          {(writeError || confirmError) && (
            <div className="flex items-start gap-2 text-red-300 bg-red-950/40 border border-red-500/40 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Transaction Error</p>
                <p className="text-gray-300">
                  {writeError?.message?.includes("User rejected")
                    ? "Transaction rejected by user in wallet."
                    : writeError?.message || confirmError?.message || "Failed to submit score on-chain."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructional Footer */}
      <div className="mt-4 pt-4 border-t border-gray-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>Reaction time is calculated using high-resolution browser performance timing.</span>
        <span>Valid range: 1 ms – 10,000 ms</span>
      </div>
    </div>
  );
}
