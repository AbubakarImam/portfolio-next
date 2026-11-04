"use client";

import { useEffect, useState } from "react";

/** Thin accent bar along the top of the viewport showing how far through the article you are. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const update = () => {
      const { top, height } = target.getBoundingClientRect();
      const total = height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -top / total)) : 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-accent origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
