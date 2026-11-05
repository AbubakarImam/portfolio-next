"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CommentForm } from "./CommentForm";

// Threads to open when they next mount: a reply just posted to a comment with
// no replies yet creates its thread on the refreshed page.
const toOpen = new Set<string>();
const OPEN_EVENT = "comment-thread:open";

const openThread = (thread: string) => {
  toOpen.add(thread);
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: thread }));
};

/**
 * A thread's replies, collapsed by default so long discussions don't stretch
 * the page. Opens itself for a link to a reply inside it (as in the reply
 * emails) and after you post a reply to it.
 */
export function ThreadReplies({
  thread,
  summary,
  children,
}: {
  thread: string;
  summary: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const openForHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id && document.getElementById(id);
      if (target && el.contains(target)) {
        el.open = true;
        target.scrollIntoView({ block: "center" });
      }
    };
    const onOpen = (e: Event) => {
      if ((e as CustomEvent<string>).detail === thread) el.open = true;
    };
    if (toOpen.delete(thread)) el.open = true;
    openForHash();
    window.addEventListener("hashchange", openForHash);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("hashchange", openForHash);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [thread]);

  return (
    <details ref={ref} className="group mt-4">
      <summary
        className="inline-flex cursor-pointer list-none items-center gap-2 font-label text-[0.65rem] tracking-[0.25em]
        uppercase text-accent hover:text-accent-bright [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden className="inline-block transition-transform group-open:rotate-90">▸</span>
        <span className="group-open:hidden">{summary}</span>
        <span className="hidden group-open:inline">Hide replies</span>
      </summary>
      <ol className="mt-5 flex flex-col gap-6 border-l border-blue-line pl-4 sm:pl-6">{children}</ol>
    </details>
  );
}

/** The Reply button under a comment, opening a short form in place. */
export function ReplyButton({
  postId,
  thread,
  target,
}: {
  postId: string;
  thread: string;
  target: { id: string; toAuthor: boolean; name: string };
}) {
  const [open, setOpen] = useState(false);

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-steel-dim hover:text-accent transition-colors"
      >
        Reply
      </button>
    );

  return (
    <div className="basis-full mt-4 bg-blue blueprint-grid border border-blue-line px-4 py-4 sm:px-5">
      <CommentForm
        postId={postId}
        replyTo={target}
        onCancel={() => setOpen(false)}
        onPosted={(t) => {
          setOpen(false);
          openThread(t || thread);
        }}
      />
    </div>
  );
}
