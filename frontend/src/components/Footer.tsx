import React from "react";
import { QUICK_TAP_ADDRESS } from "@/config/contract";
import { ExternalLink, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  const isConfigured = QUICK_TAP_ADDRESS && QUICK_TAP_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <footer className="mt-16 border-t border-gray-800/80 bg-[#06080d] text-gray-400">
      {/* Ecosystem Section */}
      <div className="border-b border-gray-800/60 bg-gradient-to-b from-[#0a0e17] to-[#06080d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-2xl border border-gray-800/90 bg-[#0d121d]/80 backdrop-blur-md p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-[#00ff66]/5 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
              {/* BOT Chain Brand & Description */}
              <div className="flex items-start sm:items-center gap-4">
                {/* Official BOT Chain Logo */}
                <div className="w-14 h-14 rounded-2xl bg-black border border-[#00ff66]/40 p-1 shadow-xl shadow-[#00ff66]/20 shrink-0 flex items-center justify-center">
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain Logo"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                      BOT Chain <span className="text-xs px-2 py-0.5 rounded-md bg-[#00ff66]/15 border border-[#00ff66]/30 text-[#00ff66] font-mono font-semibold uppercase">Mainnet</span>
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                    High-performance blockchain built for decentralized AI and next-gen Web3 applications.
                  </p>
                </div>
              </div>

              {/* Required BOT Chain Ecosystem Links with Logo in front */}
              <div className="flex flex-wrap items-center gap-3">
                {/* BOT Chain Website Link */}
                <a
                  id="botchain-website-link"
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-[#00ff66]/60 text-xs sm:text-sm font-semibold text-white hover:text-[#00ff66] transition cursor-pointer shadow-md group"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-5 h-5 rounded object-contain shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00ff66]" />
                </a>

                {/* BOT Chain Explorer Link */}
                <a
                  id="botchain-explorer-link"
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66]/15 to-[#00cc55]/10 hover:from-[#00ff66]/25 hover:to-[#00cc55]/20 border border-[#00ff66]/40 hover:border-[#00ff66] text-xs sm:text-sm font-semibold text-[#00ff66] transition cursor-pointer shadow-md group"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-5 h-5 rounded object-contain shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#00ff66]" />
                </a>

                {/* BOT Chain Contract on Explorer Link */}
                <a
                  id="botchain-contract-explorer-btn"
                  href={`https://scan.botchain.ai/address/${QUICK_TAP_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-[#00ff66]/60 text-xs sm:text-sm font-semibold text-white hover:text-[#00ff66] transition cursor-pointer shadow-md group"
                  title={`View Verified Contract ${QUICK_TAP_ADDRESS} on BOT Chain Explorer`}
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain Contract"
                    className="w-5 h-5 rounded object-contain shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span>Contract: 0xc6eB...F5FA</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#00ff66]" />
                </a>
              </div>
            </div>

            {/* Network Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-800/80 text-xs">
              <div className="bg-[#080b11]/80 rounded-xl p-3 border border-gray-800/60">
                <span className="text-gray-500 block mb-0.5 font-medium">Chain ID</span>
                <span className="font-mono text-white font-bold text-sm">677</span>
              </div>
              <div className="bg-[#080b11]/80 rounded-xl p-3 border border-gray-800/60">
                <span className="text-gray-500 block mb-0.5 font-medium">Native Token</span>
                <span className="font-mono text-[#00ff66] font-bold text-sm">BOT</span>
              </div>
              <div className="bg-[#080b11]/80 rounded-xl p-3 border border-gray-800/60">
                <span className="text-gray-500 block mb-0.5 font-medium">Total Supply</span>
                <span className="font-mono text-white font-bold text-sm">150 Million</span>
              </div>
              <div className="bg-[#080b11]/80 rounded-xl p-3 border border-gray-800/60">
                <span className="text-gray-500 block mb-0.5 font-medium">RPC Endpoint</span>
                <span className="font-mono text-gray-300 text-xs truncate block" title="https://rpc.botchain.ai">
                  rpc.botchain.ai
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract & Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* QuickTap Brand Info */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#00ff66]" />
          </div>
          <span className="text-gray-300 font-semibold tracking-wide">
            QuickTap &bull; Reflex Reaction Protocol on <span className="text-[#00ff66]">BOT Chain</span>
          </span>
        </div>

        {/* Verified Mainnet Contract Address Link */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400 bg-gray-900/90 px-4 py-2 rounded-xl border border-gray-800 hover:border-[#00ff66]/50 transition">
          <img
            src="/botchain-logo.png"
            alt="BOT Chain"
            className="w-4 h-4 rounded object-contain shrink-0"
          />
          <ShieldCheck className="w-4 h-4 text-[#00ff66] shrink-0" />
          <span className="text-gray-400 font-sans font-semibold">Mainnet Contract:</span>
          <a
            id="footer-contract-link"
            href={`https://scan.botchain.ai/address/${QUICK_TAP_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#00ff66] hover:underline font-mono font-bold tracking-tight"
            title={`View ${QUICK_TAP_ADDRESS} on BOT Chain Explorer`}
          >
            <span className="hidden sm:inline">{QUICK_TAP_ADDRESS}</span>
            <span className="sm:hidden">{QUICK_TAP_ADDRESS.slice(0, 8)}...{QUICK_TAP_ADDRESS.slice(-6)}</span>
          </a>
          <ExternalLink className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
        </div>
      </div>

      {/* Copyright / Attribution */}
      <div className="border-t border-gray-900/80 py-4 text-center text-gray-600 text-[11px]">
        Built with Next.js & Solidity &bull; Native dApp on BOT Chain Mainnet
      </div>
    </footer>
  );
}
