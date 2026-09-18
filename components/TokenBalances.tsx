"use client";

import { useAccount, useReadContracts } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatUnits } from "viem";
import { erc20Abi } from "@/lib/abi";
import { SEPOLIA_TOKENS } from "@/lib/tokens";
import { etherscan } from "@/lib/format";
import EmptyState from "./EmptyState";

/**
 * Aggregated ERC-20 balances for a few canonical Sepolia test tokens, read in
 * a single batched multicall via wagmi's `useReadContracts`. Read-only.
 */
export default function TokenBalances() {
  const { address, isConnected } = useAccount();

  const contracts = SEPOLIA_TOKENS.map((t) => ({
    address: t.address,
    abi: erc20Abi,
    functionName: "balanceOf" as const,
    args: [address as `0x${string}`],
    chainId: sepolia.id,
  }));

  const { data, isLoading } = useReadContracts({
    contracts,
    query: { enabled: isConnected && !!address, refetchInterval: 20_000 },
  });

  return (
    <section className="rounded-xl border border-border bg-card/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-white/50">
          ERC-20 tokens
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          balanceOf · batched
        </span>
      </div>

      {!isConnected || !address ? (
        <EmptyState
          title="Connect to view tokens"
          body="Balances for canonical Sepolia test tokens (WETH, LINK, USDC) are read on-chain once a wallet is connected."
        />
      ) : isLoading ? (
        <div className="space-y-2">
          {SEPOLIA_TOKENS.map((t) => (
            <div key={t.symbol} className="skeleton h-12 rounded-lg" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {SEPOLIA_TOKENS.map((t, i) => {
            const raw = data?.[i]?.result as bigint | undefined;
            const amount = raw !== undefined ? formatUnits(raw, t.decimals) : "0";
            const nonZero = raw !== undefined && raw > 0n;
            return (
              <li
                key={t.symbol}
                className="flex items-center justify-between rounded-lg border border-border bg-bg/40 p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white">
                      {t.symbol}
                    </span>
                    <span className="truncate text-[11px] text-white/40">
                      {t.name}
                    </span>
                  </div>
                  <a
                    href={etherscan.address(t.address)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] text-white/30 hover:text-accent2"
                  >
                    {t.address.slice(0, 10)}…
                  </a>
                </div>
                <div
                  className={`font-mono text-sm ${
                    nonZero ? "text-accent2" : "text-white/45"
                  }`}
                >
                  {amount}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-white/35">
        Canonical Sepolia test tokens — most wallets hold 0. This panel
        demonstrates batched on-chain reads, not real assets.
      </p>
    </section>
  );
}
