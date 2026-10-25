"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/config/chain";
import { QUICK_TAP_ADDRESS } from "@/config/contract";
import { Wallet, LogOut, Zap, AlertTriangle, CheckCircle2, ChevronDown, ExternalLink, Globe } from "lucide-react";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [showDropdown, setShowDropdown] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="border-b border-gray-800/80 bg-[#0c101a]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00ff66] to-[#009944] p-0.5 shadow-lg shadow-[#00ff66]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#00ff66] fill-[#00ff66]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-wider text-white">
                QUICK<span className="text-[#00ff66]">TAP</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66]">
                Mainnet
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Test reflexes on <span className="text-gray-300 font-semibold">BOT Chain</span></p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-3">
          {/* Network Indicator */}
          {isConnected && (
            <div>
              {isWrongNetwork ? (
                <button
                  id="switch-network-btn"
                  onClick={() => switchChain({ chainId: botchainMainnet.id })}
                  disabled={isSwitching}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold hover:bg-red-900/60 transition cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-xs text-gray-300">
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-3.5 h-3.5 rounded object-contain shrink-0"
                  />
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
                  </span>
                  <span className="font-medium">BOT Chain (677)</span>
                </div>
              )}
            </div>
          )}

          {/* BOT Chain Website Link with Logo in front */}
          <a
            id="navbar-botchain-website"
            href="https://botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-[#00ff66]/50 text-xs text-gray-200 hover:text-white transition cursor-pointer"
            title="BOT Chain Official Website (botchain.ai)"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-4 h-4 rounded object-contain shrink-0"
            />
            <span>botchain.ai</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          {/* BOT Chain Explorer Link with Logo in front */}
          <a
            id="navbar-explorer-link"
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-[#00ff66]/50 text-xs text-gray-200 hover:text-white transition cursor-pointer"
            title="BOT Chain Explorer (scan.botchain.ai)"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Explorer"
              className="w-4 h-4 rounded object-contain shrink-0"
            />
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-[#00ff66]" />
          </a>

          {/* Wallet Button */}
          {!isConnected ? (
            <button
              id="connect-wallet-btn"
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00cc55] text-black font-bold text-sm tracking-wide shadow-lg shadow-[#00ff66]/20 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                id="wallet-dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900/90 border border-gray-700/80 hover:border-[#00ff66]/50 text-sm font-mono text-gray-200 transition cursor-pointer shadow-sm"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
                <span>{address ? shortenAddress(address) : ""}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f1420] border border-gray-800 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-gray-800 text-xs text-gray-400 font-sans">
                    Connected Wallet
                    <div className="font-mono text-gray-200 truncate">{address}</div>
                  </div>
                  <button
                    id="disconnect-wallet-btn"
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
