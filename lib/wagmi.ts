"use client";

import { http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || "public-demo-id";

const sepoliaRpc =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
  "https://ethereum-sepolia-rpc.publicnode.com";

export const config = getDefaultConfig({
  appName: "Sepolia Wallet Dashboard",
  projectId,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(sepoliaRpc),
    [mainnet.id]: http(),
  },
  ssr: true,
});

/**
 * Address of the MyNFT contract deployed in the sibling `web3-nft-gallery`
 * demo. When configured, this dashboard reads `tokensOfOwner()` and shows
 * the NFTs minted there — the two demos cross-reference each other.
 */
export const NFT_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}` | undefined) ??
  ("0x0000000000000000000000000000000000000000" as `0x${string}`);

export const IS_NFT_CONFIGURED =
  NFT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

/** Optional Etherscan API key for the transaction-history panel. */
export const ETHERSCAN_API_KEY =
  process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";

/** Cross-demo URLs (populated from env, fall back to local dev ports). */
export const DEMO_LINKS = {
  portfolio: process.env.NEXT_PUBLIC_DEMO_PORTFOLIO ?? "http://localhost:3000",
  nftGallery: process.env.NEXT_PUBLIC_DEMO_NFT_GALLERY ?? "http://localhost:3002",
};
