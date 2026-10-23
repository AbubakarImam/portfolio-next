import Link from "next/link";
import { profile } from "@/lib/content";

export function BlogMasthead() {
  return (
    <header className="border-b border-blue-line bg-shop-deep">
      <div className="mx-auto w-[90%] max-w-6xl flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display font-bold text-sm uppercase tracking-wide text-steel hover:text-accent-bright transition-colors"
        >
          {profile.name}
        </Link>
        <nav aria-label="Blog" className="flex items-center gap-6">
          <Link
            href="/blog"
            className="font-label text-xs tracking-[0.15em] uppercase text-steel-dim hover:text-accent-bright transition-colors"
          >
            Field Notes
          </Link>
          <Link
            href="/#assemblies"
            className="font-label text-xs tracking-[0.15em] uppercase text-steel-dim hover:text-accent-bright transition-colors"
          >
            Assemblies
          </Link>
          <Link
            href="/#request"
            className="font-label text-xs tracking-[0.15em] uppercase text-steel-dim hover:text-accent-bright transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
