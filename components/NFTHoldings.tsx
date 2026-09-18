"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { sepolia } from "wagmi/chains";
import { nftAbi } from "@/lib/abi";
import { NFT_CONTRACT_ADDRESS, IS_NFT_CONFIGURED, DEMO_LINKS } from "@/lib/wagmi";
import { toHttpUrl, etherscan } from "@/lib/format";
import EmptyState from "./EmptyState";

type Meta = { name?: string; image?: string };

/**
 * The cross-demo payoff: reads the sibling `web3-nft-gallery` contract's
 * `tokensOfOwner(address)` and shows the NFTs the connected wallet minted
 * there. Purely read-only; if the contract address isn't configured it
 * explains how to wire the two demos together.
 */
export default function NFTHoldings() {
  const { address, isConnected } = useAccount();

  const { data: collectionName } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "name",
    chainId: sepolia.id,
    query: { enabled: IS_NFT_CONFIGURED },
  });

  const { data: tokenIds, isLoading } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
    chainId: sepolia.id,
    query: {
      enabled: IS_NFT_CONFIGURED && isConnected && !!address,
      refetchInterval: 15_000,
    },
  });

  const ids = (tokenIds as bigint[] | undefined) ?? [];

  return (
    <section className="rounded-xl border border-border bg-card/60 p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-mono text-xs uppercase tracking-wider text-white/50">
          NFT holdings
        </h2>
        {IS_NFT_CONFIGURED && collectionName && (
          <span className="truncate font-mono text-[10px] text-accent2">
            {collectionName as string}
          </span>
        )}
      </div>

      {!IS_NFT_CONFIGURED ? (
        <EmptyState
          title="Gallery contract not linked"
          body="Set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS to your deployed MyNFT address (from the web3-nft-gallery demo) to show its NFTs here."
        />
      ) : !isConnected || !address ? (
        <EmptyState
          title="Connect to view NFTs"
          body="Once connected, tokens you own from the linked gallery contract appear here via tokensOfOwner()."
        />
      ) : isLoading ? (
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton aspect-square rounded-lg" />
          ))}
        </div>
      ) : ids.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/30 p-6 text-center">
          <div className="mb-1 text-sm font-medium text-white/80">
            No NFTs from the gallery yet
          </div>
          <div className="mb-3 text-xs text-white/50">
            Mint one in the sibling demo — it will show up here automatically.
          </div>
          <a
            href={DEMO_LINKS.nftGallery}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-accent/90"
          >
            Open NFT Gallery →
          </a>
        </div>
      ) : (
        <>
          <div className="mb-3 font-mono text-[11px] text-white/40">
            {ids.length} token{ids.length === 1 ? "" : "s"} owned
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {ids.map((id) => (
              <NFTRow key={id.toString()} tokenId={id} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/** One token: reads its tokenURI on-chain, then fetches IPFS metadata. */
function NFTRow({ tokenId }: { tokenId: bigint }) {
  const { data: tokenUri } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "tokenURI",
    args: [tokenId],
    chainId: sepolia.id,
    query: { enabled: IS_NFT_CONFIGURED },
  });

  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = toHttpUrl(tokenUri as string | undefined);
    if (!url) return;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j) setMeta(j as Meta);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tokenUri]);

  const imageUrl = toHttpUrl(meta?.image);

  return (
    <a
      href={etherscan.token(NFT_CONTRACT_ADDRESS, tokenId.toString())}
      target="_blank"
      rel="noreferrer"
      className="card-hover group overflow-hidden rounded-lg border border-border bg-bg/40 hover:border-accent/40"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-accent/20 via-bg to-accent2/10">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={meta?.name ?? `#${tokenId.toString()}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-2xl text-accent/70">
            #{tokenId.toString()}
          </div>
        )}
      </div>
      <div className="p-2">
        <div className="truncate text-[11px] font-medium text-white/85">
          {meta?.name ?? `Token #${tokenId.toString()}`}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-wider text-white/35">
          #{tokenId.toString()}
        </div>
      </div>
    </a>
  );
}
