/** Small formatting helpers shared across the dashboard. */

/** 0x1234…abcd shortener for addresses / hashes. */
export function shortAddr(addr?: string, head = 6, tail = 4): string {
  if (!addr) return "—";
  if (addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

/** Convert an `ipfs://…` URI to a public https gateway URL for <img>. */
export function toHttpUrl(uri?: string): string | undefined {
  if (!uri) return undefined;
  if (uri.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  return uri;
}

/** Etherscan (v2, chain-scoped) links for Sepolia. */
export const etherscan = {
  address: (a: string) => `https://sepolia.etherscan.io/address/${a}`,
  tx: (h: string) => `https://sepolia.etherscan.io/tx/${h}`,
  token: (contract: string, id: string) =>
    `https://sepolia.etherscan.io/token/${contract}?a=${id}`,
};
