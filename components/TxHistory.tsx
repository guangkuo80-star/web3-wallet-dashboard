"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { ETHERSCAN_API_KEY } from "@/lib/wagmi";
import { shortAddr, etherscan } from "@/lib/format";
import EmptyState from "./EmptyState";

type Tx = {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  isError: string;
};

const API = "https://api.etherscan.io/v2/api";

/**
 * Recent normal transactions for the connected address, via the free Etherscan
 * API (read-only, public data). Requires NEXT_PUBLIC_ETHERSCAN_API_KEY; without
 * it the panel shows a hint and everything else on the page still works.
 */
export default function TxHistory() {
  const { address, isConnected } = useAccount();
  const [txs, setTxs] = useState<Tx[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const hasKey = ETHERSCAN_API_KEY.length > 0;

  useEffect(() => {
    if (!hasKey || !address) return;
    let active = true;
    setLoading(true);
    setErr(null);

    const url = `${API}?chainid=11155111&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=8&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (!active) return;
        if (j.status === "1" && Array.isArray(j.result)) {
          setTxs(j.result as Tx[]);
        } else if (j.message === "No transactions found") {
          setTxs([]);
        } else {
          setErr(j.message ?? "Could not load transactions");
          setTxs([]);
        }
      })
      .catch((e) => {
        if (active) setErr((e as Error).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [address, hasKey]);

  return (
    <section className="rounded-xl border border-border bg-card/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-white/50">
          Recent activity
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          etherscan api
        </span>
      </div>

      {!hasKey ? (
        <EmptyState
          title="Add an Etherscan API key to see transactions"
          body="Set NEXT_PUBLIC_ETHERSCAN_API_KEY (free at etherscan.io/myapikey). This is the only panel that needs it — balances, tokens and NFTs work without any key."
        />
      ) : !isConnected || !address ? (
        <EmptyState title="Connect to view activity" body="Your most recent Sepolia transactions will appear here." />
      ) : loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-12 rounded-lg" />
          ))}
        </div>
      ) : err ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3 font-mono text-xs text-red-400">
          {err}
        </div>
      ) : txs && txs.length === 0 ? (
        <EmptyState title="No transactions yet" body="This wallet hasn't sent any Sepolia transactions." dashed={false} />
      ) : (
        <ul className="space-y-2">
          {(txs ?? []).map((tx) => {
            const outgoing = tx.from.toLowerCase() === address?.toLowerCase();
            const ok = tx.isError === "0";
            return (
              <li
                key={tx.hash}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg/40 p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        outgoing
                          ? "bg-accent/15 text-accent"
                          : "bg-accent2/15 text-accent2"
                      }`}
                    >
                      {outgoing ? "out" : "in"}
                    </span>
                    <a
                      href={etherscan.tx(tx.hash)}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-mono text-xs text-white/80 hover:text-accent2"
                    >
                      {shortAddr(tx.hash, 10, 8)}
                    </a>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-white/35">
                    block {tx.blockNumber} ·{" "}
                    {new Date(Number(tx.timeStamp) * 1000).toLocaleDateString(
                      "en-US"
                    )}{" "}
                    · {outgoing ? "to" : "from"}{" "}
                    {shortAddr(outgoing ? tx.to : tx.from)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-sm text-white">
                    {formatEther(BigInt(tx.value || "0"))}
                    <span className="ml-1 text-[10px] text-white/40">ETH</span>
                  </div>
                  <div
                    className={`font-mono text-[9px] uppercase tracking-wider ${
                      ok ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {ok ? "success" : "failed"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
