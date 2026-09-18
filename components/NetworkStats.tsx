"use client";

import { useEffect, useState } from "react";

const RPC =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
  "https://ethereum-sepolia-rpc.publicnode.com";

type Stats = {
  block: number;
  gasGwei: string;
};

async function rpc(method: string) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: [] }),
    cache: "no-store",
  });
  return res.json();
}

/**
 * Live Sepolia network panel: latest block number + gas price, polled from a
 * public RPC every 12s. Works without a wallet connected. Degrades gracefully
 * if the RPC is unreachable so the layout never breaks.
 */
export default function NetworkStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;

    async function tick() {
      try {
        const [blockJson, gasJson] = await Promise.all([
          rpc("eth_blockNumber"),
          rpc("eth_gasPrice"),
        ]);
        if (!active) return;
        const block = parseInt(blockJson.result as string, 16);
        const gasGwei = (Number(BigInt(gasJson.result as string)) / 1e9).toFixed(
          1
        );
        setStats({ block, gasGwei });
        setLive(true);
      } catch {
        if (active) setLive(false);
      }
    }

    tick();
    const id = setInterval(tick, 12_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="flex flex-col rounded-xl border border-border bg-card/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-white/50">
          Network
        </h2>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/50">
          <span
            className={`pulse-dot h-1.5 w-1.5 rounded-full ${
              live ? "bg-emerald-400" : "bg-yellow-400"
            }`}
          />
          {live ? "live" : "connecting…"}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3">
        <Metric
          label="Chain"
          value="Sepolia"
          sub="chainId 11155111"
        />
        <Metric
          label="Latest block"
          value={stats ? stats.block.toLocaleString("en-US") : "—"}
          sub="eth_blockNumber"
          loading={!stats}
        />
        <Metric
          label="Gas price"
          value={stats ? `${stats.gasGwei} gwei` : "—"}
          sub="eth_gasPrice"
          loading={!stats}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  sub,
  loading,
}: {
  label: string;
  value: string;
  sub: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </div>
      {loading ? (
        <div className="skeleton mt-1.5 h-6 w-28 rounded" />
      ) : (
        <div className="mt-0.5 font-mono text-lg text-white">{value}</div>
      )}
      <div className="mt-0.5 font-mono text-[10px] text-accent2/70">{sub}</div>
    </div>
  );
}
