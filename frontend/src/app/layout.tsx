import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickTap | Web3 Reaction Time Game on Botchain Mainnet",
  description:
    "Test your reflexes. Measure your reaction time in milliseconds and record your verified personal best score on Botchain Mainnet.",
  keywords: ["QuickTap", "Web3 Game", "Botchain", "Botchain Mainnet", "Solidity", "Reaction Time", "BOT"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#080a0f] text-gray-100 bg-grid-pattern flex flex-col selection:bg-[#00ff66] selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
