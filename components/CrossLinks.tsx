const portfolio =
  process.env.NEXT_PUBLIC_DEMO_PORTFOLIO ?? "http://localhost:3000";
const gallery =
  process.env.NEXT_PUBLIC_DEMO_NFT_GALLERY ?? "http://localhost:3002";
const gh = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "your-github-username";

/**
 * Cross-demo navigation — ties this dashboard back to the rest of the
 * portfolio so the three sites form one connected project.
 */
export default function CrossLinks() {
  return (
    <section className="rounded-xl border border-border bg-card/40 p-6">
      <h2 className="mb-1 font-mono text-xs uppercase tracking-wider text-white/50">
        Part of a connected set
      </h2>
      <p className="mb-5 text-sm text-white/55">
        These demos share one wallet, one design system and one Sepolia
        testnet. Mint in the gallery → see it here → browse everything from the
        portfolio hub.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <LinkCard
          href={portfolio}
          kicker="hub"
          title="Portfolio"
          body="All projects, links and contact."
        />
        <LinkCard
          href={gallery}
          kicker="write"
          title="NFT Gallery"
          body="Mint ERC-721 tokens on Sepolia."
        />
        <LinkCard
          href={`https://github.com/${gh}`}
          kicker="source"
          title="GitHub"
          body="Read the source of every demo."
        />
      </div>
    </section>
  );
}

function LinkCard({
  href,
  kicker,
  title,
  body,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="card-hover group rounded-lg border border-border bg-bg/40 p-4 hover:border-accent/40"
    >
      <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-accent2/70">
        {kicker}
      </div>
      <div className="text-sm font-semibold text-white transition group-hover:text-accent2">
        {title} →
      </div>
      <div className="mt-1 text-[11px] text-white/45">{body}</div>
    </a>
  );
}
