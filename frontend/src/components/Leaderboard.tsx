"use client";

import React, { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { createPublicClient, http } from "viem";
import { botchainMainnet } from "@/config/chain";
import { QUICK_TAP_ADDRESS, QUICK_TAP_ABI } from "@/config/contract";
import { Trophy, Medal, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

interface LeaderboardEntry {
  player: string;
  bestTime: number;
  attempts: number;
}

interface LeaderboardProps {
  refreshTrigger?: number;
}

export function Leaderboard({ refreshTrigger }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);

  // Read all players from the smart contract
  const {
    data: playersList,
    isLoading: isPlayersLoading,
    refetch: refetchPlayers,
  } = useReadContract({
    address: QUICK_TAP_ADDRESS,
    abi: QUICK_TAP_ABI,
    functionName: "getAllPlayers",
    query: {
      enabled: QUICK_TAP_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  const fetchPlayerStats = React.useCallback(async (addresses: readonly string[]) => {
    if (!addresses || addresses.length === 0) {
      setEntries([]);
      return;
    }

    try {
      setIsLoadingScores(true);
      const publicClient = createPublicClient({
        chain: botchainMainnet,
        transport: http("https://rpc.botchain.ai"),
      });

      const promises = addresses.map(async (addr) => {
        try {
          const stats = (await publicClient.readContract({
            address: QUICK_TAP_ADDRESS,
            abi: QUICK_TAP_ABI,
            functionName: "playerStats",
            args: [addr as `0x${string}`],
          })) as [bigint, bigint, bigint, bigint];

          return {
            player: addr,
            bestTime: Number(stats[0]),
            attempts: Number(stats[1]),
          };
        } catch (e) {
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validEntries = results
        .filter((r): r is LeaderboardEntry => r !== null && r.bestTime > 0)
        .sort((a, b) => a.bestTime - b.bestTime);

      setEntries(validEntries);
    } catch (err) {
      console.error("Error fetching leaderboard player stats:", err);
    } finally {
      setIsLoadingScores(false);
    }
  }, []);

  useEffect(() => {
    if (playersList && Array.isArray(playersList)) {
      fetchPlayerStats(playersList);
    }
  }, [playersList, fetchPlayerStats]);

  useEffect(() => {
    refetchPlayers();
  }, [refreshTrigger, refetchPlayers]);

  const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-[#0e1320]/90 border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">On-Chain Hall of Fame</h2>
        </div>
        <button
          onClick={() => {
            refetchPlayers();
          }}
          disabled={isPlayersLoading || isLoadingScores}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00ff66] transition disabled:opacity-50 cursor-pointer"
          title="Refresh leaderboard"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingScores ? "animate-spin text-[#00ff66]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Disclaimed note */}
      <div className="bg-[#121828] border border-gray-800/80 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-xs text-gray-400">
        <AlertCircle className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
        <p>
          Scores are submitted directly from users&apos; browsers to Botchain Mainnet. Because the EVM cannot measure real-world physical reaction time, scores represent client-reported metrics.
        </p>
      </div>

      {/* Table / List */}
      {isPlayersLoading || isLoadingScores ? (
        <div className="py-12 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#00ff66]" />
          <span>Querying verified player records from Botchain Mainnet...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
          <Medal className="w-8 h-8 text-gray-600" />
          <p className="text-gray-400 font-semibold">No on-chain records submitted yet!</p>
          <p className="text-xs">Play a round and click &quot;Save Score&quot; to become #1 on the leaderboard.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase font-mono text-[11px] tracking-wider">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Player Wallet</th>
                <th className="py-3 px-3 text-right">Best Time</th>
                <th className="py-3 px-3 text-right">Attempts</th>
                <th className="py-3 px-2 text-center">Scan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {entries.map((entry, index) => {
                const isTop3 = index < 3;
                return (
                  <tr
                    key={entry.player}
                    className="hover:bg-[#131b2e]/60 transition font-mono"
                  >
                    <td className="py-3.5 px-3 whitespace-nowrap font-bold">
                      {index === 0 ? (
                        <span className="flex items-center gap-1.5 text-amber-400">
                          🥇 #1
                        </span>
                      ) : index === 1 ? (
                        <span className="flex items-center gap-1.5 text-gray-300">
                          🥈 #2
                        </span>
                      ) : index === 2 ? (
                        <span className="flex items-center gap-1.5 text-amber-600">
                          🥉 #3
                        </span>
                      ) : (
                        <span className="text-gray-500 font-normal">#{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-gray-200">
                      {shorten(entry.player)}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-right font-black text-white">
                      <span className={isTop3 ? "text-[#00ff66]" : "text-gray-200"}>
                        {entry.bestTime} ms
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-right text-gray-400">
                      {entry.attempts}
                    </td>
                    <td className="py-3.5 px-2 whitespace-nowrap text-center">
                      <a
                        href={`https://scan.botchain.ai/address/${entry.player}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-[#00ff66] transition inline-flex items-center gap-1"
                        title="View address on BOT Chain Explorer"
                      >
                        <img
                          src="/botchain-logo.png"
                          alt="BOT Chain"
                          className="w-3.5 h-3.5 rounded object-contain"
                        />
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
