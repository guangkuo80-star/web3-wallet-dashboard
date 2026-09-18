import Reveal from "@/components/Reveal";
import WalletOverview from "@/components/WalletOverview";
import NetworkStats from "@/components/NetworkStats";
import TokenBalances from "@/components/TokenBalances";
import NFTHoldings from "@/components/NFTHoldings";
import TxHistory from "@/components/TxHistory";
import CrossLinks from "@/components/CrossLinks";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <Reveal>
        <section>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Sepolia Testnet · read-only
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Your Sepolia wallet,{" "}
            <span className="text-gradient">at a glance</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/65">
            A read-only dashboard built with{" "}
            <span className="font-mono text-accent2">wagmi · viem · RainbowKit</span>.
            Connect a wallet to see its ETH balance, ERC-20 tokens, NFT holdings
            from the sibling gallery demo, and recent on-chain activity. This
            page never sends a transaction — it only reads.
          </p>
        </section>
      </Reveal>

      {/* Wallet snapshot + live network */}
      <Reveal delay={60}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <WalletOverview />
          <NetworkStats />
        </div>
      </Reveal>

      {/* Assets */}
      <Reveal delay={60}>
        <div className="grid gap-6 lg:grid-cols-2">
          <TokenBalances />
          <NFTHoldings />
        </div>
      </Reveal>

      {/* Activity */}
      <Reveal delay={60}>
        <TxHistory />
      </Reveal>

      {/* Cross-demo navigation */}
      <Reveal delay={60}>
        <CrossLinks />
      </Reveal>
    </div>
  );
}
