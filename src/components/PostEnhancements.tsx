"use client";

import { useEffect } from "react";

// Mermaid colours drawn from the blueprint palette in globals.css. Mermaid only
// understands hex values here; rgba() or "transparent" stops nodes drawing.
const mermaidTheme = {
  darkMode: true,
  background: "#1d3f5c",
  fontFamily: "var(--font-display), ui-monospace, monospace",
  fontSize: "14px",
  primaryColor: "#14324a",
  primaryTextColor: "#eaf3f7",
  primaryBorderColor: "#ef7a41",
  secondaryColor: "#1d3f5c",
  tertiaryColor: "#0b0c0e",
  lineColor: "#eaf3f7",
  textColor: "#eaf3f7",
  mainBkg: "#14324a",
  nodeBorder: "#ef7a41",
  clusterBkg: "#173650",
  clusterBorder: "#6b8396",
  edgeLabelBackground: "#1d3f5c",
  actorBkg: "#14324a",
  actorBorder: "#ef7a41",
  actorTextColor: "#eaf3f7",
  signalColor: "#eaf3f7",
  signalTextColor: "#eaf3f7",
  noteBkgColor: "#d9622c",
  noteTextColor: "#0b0c0e",
  noteBorderColor: "#ef7a41",
};

let renderCount = 0;

/**
 * Runs the parts of a post body that need the browser: draws Mermaid diagrams
 * and sizes interactive embeds to their content.
 */
export function PostEnhancements() {
  useEffect(() => {
    // Claim diagrams before the async import, so a second run of this effect
    // (React dev mode runs effects twice) doesn't draw the same one again.
    const sources = Array.from(
      document.querySelectorAll<HTMLElement>(".post-body [data-mermaid]:not([data-claimed])"),
    );
    for (const el of sources) el.dataset.claimed = "true";
    if (sources.length) {
      // Loaded only on posts that have a diagram.
      import("mermaid").then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: mermaidTheme,
        });
        for (const el of sources) {
          try {
            const { svg } = await mermaid.render(`diagram-${++renderCount}`, el.textContent ?? "");
            el.innerHTML = svg;
            el.classList.add("is-rendered");
          } catch {
            el.classList.add("is-broken");
          }
        }
      });
    }

    const frames = Array.from(
      document.querySelectorAll<HTMLIFrameElement>(".post-body iframe[data-auto-height]"),
    );
    if (!frames.length) return;
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "embed-height") return;
      const frame = frames.find((f) => f.contentWindow === e.source);
      const height = Number(e.data.height);
      if (frame && height > 0) frame.style.height = `${Math.min(Math.ceil(height), 4000)}px`;
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
