/**
 * Canonical, well-known ERC-20 tokens deployed on Sepolia testnet.
 * These are public test tokens (no real value). The dashboard batch-reads
 * `balanceOf` for each to demonstrate multi-token aggregation.
 *
 * Most wallets hold 0 of these — that's expected and still shows the
 * read/aggregation path working. Faucets exist for LINK and USDC on Sepolia.
 */
export type KnownToken = {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
};

export const SEPOLIA_TOKENS: KnownToken[] = [
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
  },
  {
    symbol: "LINK",
    name: "Chainlink Token",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    decimals: 18,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    decimals: 6,
  },
];
