# Sepolia Wallet Dashboard

A **read-only** Web3 dashboard for the Sepolia testnet. Connect a wallet and
see its ETH balance, ERC-20 token balances, NFT holdings from a sibling demo,
and recent on-chain activity — all without ever sending a transaction.

Part of a connected portfolio set:
**[Portfolio hub]** → **[NFT Gallery]** (write / mint) → **this dashboard** (read / inspect).
Mint an NFT in the gallery and it shows up here automatically.

> Testnet only. No mainnet, no real funds, no private keys.

---

## Live links

| What | Where |
| --- | --- |
| 🌐 Live demo | https://web3-wallet-dashboard-xi.vercel.app |
| 💻 Source | https://github.com/guangkuo80-star/web3-wallet-dashboard |
| 🎨 NFT Gallery (companion) | https://web3-nft-gallery.vercel.app |
| 🏠 Portfolio hub | https://web3-portfolio-pied.vercel.app |

---

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **wagmi v2** + **viem** — on-chain reads (`useBalance`, `useReadContracts`, `useReadContract`)
- **RainbowKit** — wallet connect (MetaMask / WalletConnect / Coinbase)
- **Tailwind CSS** — dark UI, animated background, scroll reveals (no extra deps)
- **Etherscan API** (optional) — recent transaction list

This demo is **purely read-only**: it never calls `writeContract`, never signs,
and never needs a private key.

---

## What it shows

| Panel | Data source | Needs wallet? |
| --- | --- | --- |
| Wallet overview | `eth_getBalance` (native ETH) | Yes |
| Network stats | `eth_blockNumber`, `eth_gasPrice` via public RPC | No |
| ERC-20 tokens | batched `balanceOf` on canonical Sepolia test tokens | Yes |
| NFT holdings | `tokensOfOwner()` + `tokenURI()` on the linked gallery contract | Yes |
| Recent activity | Etherscan API `account/txlist` | Yes + API key |

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

All are `NEXT_PUBLIC_*` (browser-exposed) — safe for a read-only demo.
**No private key is used or required.**

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | RPC used by wagmi + network stats | Optional (public default) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | RainbowKit / WalletConnect id | Yes (free at cloud.reown.com) |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | Gallery contract to read NFT holdings from | Optional |
| `NEXT_PUBLIC_DEMO_NFT_GALLERY` | Cross-link to the gallery demo | Optional |
| `NEXT_PUBLIC_DEMO_PORTFOLIO` | Cross-link to the portfolio hub | Optional |
| `NEXT_PUBLIC_ETHERSCAN_API_KEY` | Enables the recent-activity panel | Optional |

Without an Etherscan key, the activity panel shows a hint — every other panel
still works.

---

## Linking it to the NFT Gallery

1. Deploy the contract in [`web3-nft-gallery`](../web3-nft-gallery) and copy its
   Sepolia address.
2. Put that address in `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` here.
3. Connect the same wallet you minted with — your tokens appear under
   **NFT holdings**, read live from the gallery contract.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel → Framework preset **Next.js** (auto-detected).
3. Add every `NEXT_PUBLIC_*` variable under **Settings → Environment Variables**.
4. Deploy. Subsequent `git push` triggers automatic redeploys.

---

## Safety notes

- Sepolia testnet only (`chainId 11155111`).
- Read-only — no transaction is ever constructed or signed.
- No private key, no seed phrase, no server-side secrets.
- Token addresses listed in `lib/tokens.ts` are canonical public Sepolia test
  tokens with no real value.

---

## Project structure

```
app/            layout, providers (wagmi + RainbowKit), page composition
components/     WalletOverview, NetworkStats, TokenBalances,
                NFTHoldings, TxHistory, CrossLinks, Background, Reveal
lib/            wagmi config, ABIs, known tokens, formatting helpers
```

Built as a Web3 frontend portfolio demo.
