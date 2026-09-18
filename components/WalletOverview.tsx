"use client";

import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatEther } from "viem";
import { shortAddr, etherscan } from "@/lib/format";
import EmptyState from "./EmptyState";

/**
 * Top-left panel: who is connected, their native ETH balance on Sepolia,
 * and quick actions (copy address, open Etherscan). Read-only.
 */
export default function WalletOverview() {
  const { address, isConnected, chainId } = useAccount();
  const [copied, setCopied] = useState(false);

  const { data: balance, isLoading } = useBalance({
    address,
    chainId: sepolia.id,
    query: { enabled: isConnected && !!address, refetchInterval: 15_000 },
  });

  const onSepolia = chainId === sepolia.id;

  function copy() {
    if (!address) return;
    navigator.clipboard?.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section className="rounded-xl border border-border bg-card/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-white/50">
          Wallet
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            isConnected && onSepolia
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : isConnected
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-white/10 bg-white/5 text-white/50"
          }`}
        >
          <span
            className={`pulse-dot h-1.5 w-1.5 rounded-full ${
              isConnected && onSepolia
                ? "bg-emerald-400"
                : isConnected
                ? "bg-amber-400"
                : "bg-white/40"
            }`}
          />
          {isConnected ? (onSepolia ? "Sepolia" : "Wrong network") : "Not connected"}
        </span>
      </div>

      {!isConnected || !address ? (
        <EmptyState
          title="Connect your wallet"
          body="Use the button in the top-right. Nothing is signed or sent — this dashboard only reads public chain data."
        />
      ) : (
        <>
          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-wider text-white/40">
              Address
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-lg text-white">
                {shortAddr(address, 8, 6)}
              </span>
              <button
                type="button"
                onClick={copy}
                className="rounded border border-border bg-bg/50 px-2 py-0.5 font-mono text-[10px] text-white/60 transition hover:border-accent/40 hover:text-white"
              >
                {copied ? "✓ copied" : "copy"}
              </button>
              <a
                href={etherscan.address(address)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] text-accent2 hover:underline"
              >
                etherscan ↗
              </a>
            </div>
            <div className="mt-1 break-all font-mono text-[10px] text-white/30">
              {address}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-bg/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-white/40">
              ETH balance
            </div>
            {isLoading ? (
              <div className="skeleton mt-2 h-8 w-40 rounded" />
            ) : (
              <div className="mt-1 font-mono text-3xl text-white">
                {balance ? formatEther(balance.value) : "0"}
                <span className="ml-2 text-sm text-white/40">
                  {balance?.symbol ?? "ETH"}
                </span>
              </div>
            )}
            <div className="mt-1 font-mono text-[10px] text-white/35">
              Testnet ETH only — no real value.
            </div>
          </div>

          {!onSepolia && (
            <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-400">
              You&apos;re on the wrong network. Switch your wallet to{" "}
              <span className="font-mono">Sepolia</span> to read balances.
            </p>
          )}
        </>
      )}
    </section>
  );
}
