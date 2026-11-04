"use client";

import { useActionState, useRef } from "react";
import { submitComment, type CommentFormState } from "@/app/(site)/blog/[slug]/actions";

const initial: CommentFormState = { status: "idle", message: "" };

const field =
  "w-full bg-shop-deep border border-blue-line px-4 py-3 text-steel placeholder:text-steel-dim/60 " +
  "focus:outline-none focus:border-accent transition-colors";
const label = "block font-label text-[0.65rem] tracking-[0.25em] uppercase text-paper-dim mb-2";

export function CommentForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(submitComment, initial);
  // Stamped when the reader first focuses the form. The server rejects posts
  // without it, or sent within seconds of it, as bots.
  const started = useRef<HTMLInputElement>(null);
  const stamp = () => {
    if (started.current && !started.current.value) started.current.value = String(Date.now());
  };

  const v = state.status === "error" ? state.values : undefined;

  return (
    <form action={action} onFocus={stamp} className="flex flex-col gap-5">
      <input type="hidden" name="postId" value={postId} />
      <input ref={started} type="hidden" name="started" />
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="comment-name" className={label}>Name</label>
          <input
            id="comment-name"
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={v?.name}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="comment-email" className={label}>Email</label>
          <input
            id="comment-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={v?.email}
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="comment-body" className={label}>Comment</label>
        <textarea
          id="comment-body"
          name="body"
          required
          minLength={2}
          maxLength={3000}
          rows={5}
          defaultValue={v?.body}
          className={`${field} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-steel-dim max-w-sm">
          Your email is never published. I may use it to reply to you directly. Comments appear after
          review.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="h-11 px-6 bg-accent text-shop-deep font-label text-xs tracking-[0.2em] uppercase
          hover:bg-accent-bright disabled:opacity-60 transition-colors"
        >
          {pending ? "Sending…" : "Post comment"}
        </button>
      </div>

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`border px-4 py-3 text-sm ${
            state.status === "ok"
              ? "border-accent text-accent-bright"
              : "border-[#e5b93a] text-[#e5b93a]"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
