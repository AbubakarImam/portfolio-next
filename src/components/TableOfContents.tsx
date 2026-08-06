"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "cover", number: "00", label: "Cover" },
  { id: "spec", number: "01", label: "Spec" },
  { id: "bom", number: "02", label: "B.O.M." },
  { id: "assemblies", number: "03", label: "Assemblies" },
  { id: "request", number: "04", label: "Request" },
];

export function TableOfContents() {
  const [active, setActive] = useState("cover");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Table of contents"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-stretch
      border border-blue-line bg-shop-deep/90 backdrop-blur-sm
      shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`group relative flex flex-col items-center gap-1 px-3.5 md:px-4 py-2.5
            border-r border-blue-line last:border-r-0 transition-colors font-label
            ${isActive ? "text-accent-bright" : "text-steel-dim hover:text-steel"}`}
          >
            <span className="font-display text-xs tracking-wide">
              {s.number}
            </span>
            <span className="text-[0.55rem] tracking-[0.15em] uppercase hidden md:block">
              {s.label}
            </span>
            {isActive && (
              <span className="absolute -top-px left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-accent-bright" />
            )}
          </a>
        );
      })}
    </nav>
  );
}
