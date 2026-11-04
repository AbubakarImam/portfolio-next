"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/posts";

function useActiveHeading(entries: TocEntry[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((h): h is HTMLElement => Boolean(h));
    const update = () => {
      // The last heading that has scrolled past the top third of the screen.
      const line = window.innerHeight / 3;
      let current: string | null = null;
      for (const h of headings) if (h.getBoundingClientRect().top < line) current = h.id;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [entries]);

  return active;
}

function TocList({ entries, active }: { entries: TocEntry[]; active: string | null }) {
  return (
    <ol className="flex flex-col gap-2">
      {entries.map((e) => (
        <li key={e.id} className={e.level === 3 ? "pl-4" : ""}>
          <a
            href={`#${e.id}`}
            aria-current={active === e.id ? "location" : undefined}
            className={`block border-l-2 pl-3 text-sm leading-snug transition-colors ${
              active === e.id
                ? "border-accent text-accent-bright"
                : "border-transparent text-steel-dim hover:text-steel"
            }`}
          >
            {e.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

const label =
  "font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim";

/** Sticky contents rail, shown beside the article on very wide screens. */
export function TocRail({ entries }: { entries: TocEntry[] }) {
  const active = useActiveHeading(entries);
  return (
    <nav aria-label="Contents" className="sticky top-10">
      <p className={`${label} mb-4`}>Contents</p>
      <TocList entries={entries} active={active} />
    </nav>
  );
}

/** Collapsible contents panel at the top of the article, for narrower screens. */
export function TocPanel({ entries }: { entries: TocEntry[] }) {
  const active = useActiveHeading(entries);
  return (
    <details className="group border border-blue-line bg-shop-deep px-5 py-4">
      <summary className={`${label} cursor-pointer list-none flex items-center justify-between`}>
        <span>Contents · {entries.filter((e) => e.level === 2).length} sections</span>
        <span className="text-accent transition-transform group-open:rotate-45 text-base leading-none">+</span>
      </summary>
      <nav aria-label="Contents" className="mt-4">
        <TocList entries={entries} active={active} />
      </nav>
    </details>
  );
}
