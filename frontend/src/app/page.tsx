"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GameCard } from "@/components/GameCard";
import { PersonalStats } from "@/components/PersonalStats";
import { Leaderboard } from "@/components/Leaderboard";
import { Footer } from "@/components/Footer";
import { QUICK_TAP_ADDRESS } from "@/config/contract";
import { Zap, HelpCircle, Trophy, ShieldCheck, AlertCircle } from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleScoreSaved = () => {
    // Increment trigger to reload PersonalStats and Leaderboard
    setRefreshTrigger((prev) => prev + 1);
  };

  const isContractConfigured =
    QUICK_TAP_ADDRESS && QUICK_TAP_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Unconfigured contract warning notice */}
        {!isContractConfigured && (
          <div className="mb-6 bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Contract Address Not Configured</p>
              <p className="mt-0.5 text-amber-200/90">
                To enable on-chain score saving on Botchain Testnet, deploy the contract using{" "}
                <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">
                  npm run deploy
                </code>{" "}
                and paste the contract address into{" "}
                <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">
                  frontend/.env.local
                </code>{" "}
                as{" "}
                <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">
                  NEXT_PUBLIC_QUICK_TAP_CONTRACT_ADDRESS
                </code>
                . You can still test the reaction timer mechanics in the arena below!
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/20 text-[#00ff66] text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Botchain Reaction Challenge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Test Your Reflexes. <span className="text-[#00ff66]">Save Your Best.</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Wait for green, tap instantly, and lock your reaction speed into the immutable Botchain Testnet ledger.
          </p>
        </div>

        {/* Game Arena & Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Game Reaction Card (Takes 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <GameCard onScoreSaved={handleScoreSaved} />

            {/* How to play card */}
            <div className="bg-[#0e1320]/80 border border-gray-800/80 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <HelpCircle className="w-4 h-4 text-[#00ff66]" />
                <span>How QuickTap Works</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400">
                <div className="bg-[#121828] p-3 rounded-xl border border-gray-800">
                  <span className="font-bold text-[#00ff66] block mb-1">1. Wait For Green</span>
                  Do not click on red! A random delay (2-5s) prevents pre-clicking cheats.
                </div>
                <div className="bg-[#121828] p-3 rounded-xl border border-gray-800">
                  <span className="font-bold text-[#00ff66] block mb-1">2. Tap Immediately</span>
                  The moment it turns neon green, click anywhere inside the arena.
                </div>
                <div className="bg-[#121828] p-3 rounded-xl border border-gray-800">
                  <span className="font-bold text-[#00ff66] block mb-1">3. Record On-Chain</span>
                  Hit &quot;Save Score&quot; to push your score to the Botchain smart contract!
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Stats & Global Leaderboard */}
          <div className="space-y-6">
            <PersonalStats refreshTrigger={refreshTrigger} />
            <Leaderboard refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
