"use client";

import { useEffect } from "react";
import { recordView } from "@/app/(site)/blog/[slug]/view-action";

/** Counts this post once per browser session. Sets no cookies. */
export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `viewed:${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage blocked (private mode): count it anyway.
    }
    const params = new URLSearchParams(location.search);
    const utm = params.get("utm_source") ?? "";
    recordView(postId, document.referrer, utm);
    // Drop the tag from the address bar so a reader who shares it onwards
    // doesn't pass it on.
    if (utm) {
      params.delete("utm_source");
      const q = params.toString();
      history.replaceState(history.state, "", `${location.pathname}${q ? `?${q}` : ""}${location.hash}`);
    }
  }, [postId]);
  return null;
}
