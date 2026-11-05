"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { toggleLike } from "@/app/(site)/blog/[slug]/like-action";

// Which comments this browser liked, so the heart shows filled on return
// visits. The server keeps the real record, keyed by voterId.
const LIKED_KEY = "liked-comments";
const VOTER_KEY = "voter-id";
const listeners = new Set<() => void>();

const readLiked = (): string => {
  try {
    return localStorage.getItem(LIKED_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

function setLiked(id: string, liked: boolean) {
  const ids = new Set<string>(JSON.parse(readLiked()));
  if (liked) ids.add(id);
  else ids.delete(id);
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
  } catch {}
  listeners.forEach((l) => l());
}

function voterId() {
  try {
    let id = localStorage.getItem(VOTER_KEY);
    if (!id) localStorage.setItem(VOTER_KEY, (id = crypto.randomUUID()));
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function LikeButton({
  commentId,
  likes,
  likedByAuthor,
}: {
  commentId: string;
  likes: number;
  likedByAuthor: boolean;
}) {
  const liked = useSyncExternalStore(subscribe, readLiked, () => "[]").includes(`"${commentId}"`);
  // The page's count can lag a moment behind a like, so show the server's
  // answer until the refreshed page catches up.
  const [count, setCount] = useState<{ base: number; value: number } | null>(null);
  const [pending, start] = useTransition();
  const shown = count && count.base === likes ? count.value : likes;

  const click = () =>
    start(async () => {
      const r = await toggleLike(commentId, voterId());
      if (!r.ok) return;
      setLiked(commentId, r.liked);
      setCount({ base: likes, value: r.likes });
    });

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={click}
        disabled={pending}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this comment" : "Like this comment"}
        className={`inline-flex items-center gap-1.5 font-label text-[0.65rem] tracking-[0.25em] uppercase transition-colors
        disabled:opacity-60 ${liked ? "text-accent" : "text-steel-dim hover:text-accent"}`}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
          <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.6 0 5.8 3.6 4.5 7.1-1.8 4.8-9.3 9.4-9.3 9.4z" />
        </svg>
        {shown > 0 ? shown : "Like"}
      </button>
      {likedByAuthor && (
        <span className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-accent">♥ by author</span>
      )}
    </span>
  );
}
