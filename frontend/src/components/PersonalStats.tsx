"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { QUICK_TAP_ADDRESS, QUICK_TAP_ABI } from "@/config/contract";
import { Trophy, Activity, Hash, RefreshCw, AlertCircle } from "lucide-react";

interface PersonalStatsProps {
  refreshTrigger?: number;
}

export function PersonalStats({ refreshTrigger }: PersonalStatsProps) {
  const { address, isConnected } = useAccount();

  const {
    data: statsData,
    isLoading,
    refetch,
    isRefetching,
  } = useReadContract({
    address: QUICK_TAP_ADDRESS,
    abi: QUICK_TAP_ABI,
    functionName: "playerStats",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && QUICK_TAP_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Re-fetch when refreshTrigger updates
  React.useEffect(() => {
    if (isConnected && address) {
      refetch();
    }
  }, [refreshTrigger, isConnected, address, refetch]);

  const bestScore = statsData ? Number(statsData[0]) : 0;
  const attempts = statsData ? Number(statsData[1]) : 0;
  const lastScore = statsData ? Number(statsData[2]) : 0;

  const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-[#0e1320]/90 border border-gray-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00ff66]" />
          <h2 className="text-base font-bold text-white tracking-wide">Personal On-Chain Stats</h2>
        </div>
        {isConnected && (
          <button
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00ff66] transition disabled:opacity-50 cursor-pointer"
            title="Refresh on-chain stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-[#00ff66]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      {!isConnected ? (
        <div className="py-6 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
          <AlertCircle className="w-7 h-7 text-gray-500" />
          <p>Connect your wallet to record and view your verified personal stats on BOT Chain.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono bg-[#080b12] px-3 py-2 rounded-lg border border-gray-800/60">
            <span>Player Wallet:</span>
            <span className="text-[#00ff66] font-semibold">{address ? shorten(address) : "N/A"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Personal Best */}
            <div className="bg-[#121829] border border-gray-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Personal Best</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                {isLoading ? (
                  <span className="text-gray-500 text-sm animate-pulse">Loading...</span>
                ) : bestScore > 0 ? (
                  <span className="text-[#00ff66]">{bestScore} <span className="text-xs text-gray-400 font-normal">ms</span></span>
                ) : (
                  <span className="text-gray-500 text-sm">No record yet</span>
                )}
              </div>
            </div>

            {/* Total Submissions */}
            <div className="bg-[#121829] border border-gray-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>Total Attempts</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                {isLoading ? (
                  <span className="text-gray-500 text-sm animate-pulse">Loading...</span>
                ) : (
                  <span>{attempts} <span className="text-xs text-gray-400 font-normal">saved</span></span>
                )}
              </div>
            </div>
          </div>

          {lastScore > 0 && (
            <div className="text-[11px] text-gray-400 text-center pt-1">
              Last saved score: <span className="font-mono text-gray-300 font-semibold">{lastScore} ms</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
