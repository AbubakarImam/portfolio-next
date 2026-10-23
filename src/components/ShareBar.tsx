"use client";

import { useState } from "react";
import { LinkedinIcon, TwitterIcon, WhatsappIcon } from "./icons";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const targets = [
    {
      label: "X / Twitter",
      icon: TwitterIcon,
      href: `https://x.com/intent/post?text=${t}&url=${u}`,
    },
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      label: "WhatsApp",
      icon: WhatsappIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-paper-dim mr-1">
        Share
      </span>
      {targets.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.label}`}
          className="w-9 h-9 flex items-center justify-center border border-blue-line text-paper
          hover:border-accent hover:text-accent-bright transition-colors"
        >
          <s.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="h-9 px-3 border border-blue-line font-label text-[0.65rem] tracking-[0.15em] uppercase text-paper
        hover:border-accent hover:text-accent-bright transition-colors"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
