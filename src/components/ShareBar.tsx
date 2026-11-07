"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedinIcon, TwitterIcon, WhatsappIcon } from "./icons";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState<"no" | "yes" | "manual">("no");
  const manual = useRef<HTMLInputElement>(null);
  const t = encodeURIComponent(title);
  // Tagged so the views dashboard can tell where readers came from, even from
  // apps like WhatsApp that don't send a referrer.
  const tagged = (source: string) => `${url}${url.includes("?") ? "&" : "?"}utm_source=${source}`;

  const targets = [
    {
      label: "X / Twitter",
      icon: TwitterIcon,
      href: `https://x.com/intent/post?text=${t}&url=${encodeURIComponent(tagged("x"))}`,
    },
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(tagged("linkedin"))}`,
    },
    {
      label: "WhatsApp",
      icon: WhatsappIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${tagged("whatsapp")}`)}`,
    },
  ];

  // In-app browsers (WhatsApp, X, Instagram) often block the clipboard API
  // and prompt(), so fall back to the old select-and-copy, then to showing the
  // link selected for the reader to copy themselves.
  function legacyCopy() {
    const el = document.createElement("textarea");
    el.value = url;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, url.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    el.remove();
    return ok;
  }

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = legacyCopy();
    }
    setCopied(ok ? "yes" : "manual");
    if (ok) setTimeout(() => setCopied("no"), 2000);
  }

  useEffect(() => {
    if (copied === "manual") manual.current?.select();
  }, [copied]);

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
        {copied === "yes" ? "Link copied" : "Copy link"}
      </button>
      {copied === "manual" && (
        <input
          ref={manual}
          readOnly
          value={url}
          aria-label="Link to this post"
          onFocus={(e) => e.currentTarget.select()}
          onBlur={() => setCopied("no")}
          className="basis-full h-9 px-3 bg-shop-deep border border-accent text-sm text-steel focus:outline-none"
        />
      )}
    </div>
  );
}
