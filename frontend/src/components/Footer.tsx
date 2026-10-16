import React from "react";
import { botchainTestnet } from "@/config/chain";
import { QUICK_TAP_ADDRESS } from "@/config/contract";
import { ExternalLink, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  const isConfigured = QUICK_TAP_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <footer className="mt-auto border-t border-gray-800/80 bg-[#07090e] py-8 text-xs text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Network & Contract Details */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#00ff66]"></span>
            <span className="font-semibold">Network:</span>
            <span>Botchain Testnet (Chain ID 968)</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="font-semibold">RPC:</span>
            <span className="font-mono text-gray-400">https://rpc.bohr.life</span>
          </div>

          <a
            href="https://scan.bohr.life"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#00ff66] hover:underline"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Contract Address if configured */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>Contract:</span>
          {isConfigured ? (
            <a
              href={`https://scan.bohr.life/address/${QUICK_TAP_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00ff66] hover:underline truncate max-w-[140px] sm:max-w-[200px]"
            >
              {QUICK_TAP_ADDRESS}
            </a>
          ) : (
            <span className="text-amber-400">Not configured yet</span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 pt-4 border-t border-gray-900 text-center text-gray-500 text-[11px]">
        QuickTap &bull; Built with Next.js, Solidity & Hardhat for Botchain Testnet
      </div>
    </footer>
  );
}
