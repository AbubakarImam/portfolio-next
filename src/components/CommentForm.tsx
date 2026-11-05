"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitComment, type CommentFormState } from "@/app/(site)/blog/[slug]/actions";

const initial: CommentFormState = { status: "idle", message: "" };

const field =
  "w-full bg-shop-deep border border-blue-line px-4 py-3 text-steel placeholder:text-steel-dim/60 " +
  "focus:outline-none focus:border-accent transition-colors";
const label = "block font-label text-[0.65rem] tracking-[0.25em] uppercase text-paper-dim mb-2";

type Props = {
  postId: string;
  /** Set for a reply: the comment it answers. */
  replyTo?: { id: string; toAuthor: boolean; name: string };
  /** Called after a reply goes live, with the thread it landed in. */
  onPosted?: (thread: string) => void;
  onCancel?: () => void;
};

// Whether you're signed in to the admin, checked once per page.
let authorCheck: Promise<boolean> | undefined;
const isSignedIn = () =>
  (authorCheck ??= fetch("/api/users/me", { credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => Boolean(d?.user))
    .catch(() => false));

export function CommentForm({ postId, replyTo, onPosted, onCancel }: Props) {
  const [state, action, pending] = useActionState(async (prev: CommentFormState, form: FormData) => {
    const result = await submitComment(prev, form);
    if (result.thread) onPosted?.(result.thread);
    return result;
  }, initial);
  const uid = useId();
  // Signed in, you post as the author: no name or email needed.
  const [asAuthor, setAsAuthor] = useState(false);
  useEffect(() => {
    isSignedIn().then(setAsAuthor);
  }, []);
  // Stamped when the reader first focuses the form. The server rejects posts
  // without it, or sent within seconds of it, as bots.
  const started = useRef<HTMLInputElement>(null);
  const stamp = () => {
    if (started.current && !started.current.value) started.current.value = String(Date.now());
  };

  const v = state.status === "error" ? state.values : undefined;

  return (
    <form action={action} onFocus={stamp} className={`flex flex-col ${replyTo ? "gap-4" : "gap-5"}`}>
      <input type="hidden" name="postId" value={postId} />
      {replyTo && (
        <>
          <input type="hidden" name="replyTo" value={replyTo.id} />
          {replyTo.toAuthor && <input type="hidden" name="toAuthor" value="1" />}
        </>
      )}
      <input ref={started} type="hidden" name="started" />
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {asAuthor ? (
        <p className="font-label text-xs text-paper-dim">
          Posting as the author. Signed in to the admin.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${uid}-name`} className={label}>Name</label>
            <input
              id={`${uid}-name`}
              name="name"
              required
              maxLength={80}
              autoComplete="name"
              defaultValue={v?.name}
              className={field}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className={label}>Email</label>
            <input
              id={`${uid}-email`}
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
      )}
      <div>
        <label htmlFor={`${uid}-body`} className={label}>
          {replyTo ? `Reply to ${replyTo.name}` : "Comment"}
        </label>
        <textarea
          id={`${uid}-body`}
          name="body"
          required
          minLength={2}
          maxLength={3000}
          rows={replyTo ? 3 : 5}
          autoFocus={Boolean(replyTo)}
          defaultValue={v?.body}
          className={`${field} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-steel-dim max-w-sm">
          {asAuthor
            ? "Readers you reply to get an email with your reply."
            : "Your email is never published. You’ll get an email when someone replies to you."}
        </p>
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-11 px-4 font-label text-xs tracking-[0.2em] uppercase text-paper-dim hover:text-paper transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-11 px-6 bg-accent text-shop-deep font-label text-xs tracking-[0.2em] uppercase
            hover:bg-accent-bright disabled:opacity-60 transition-colors"
          >
            {pending ? "Sending…" : replyTo ? "Post reply" : "Post comment"}
          </button>
        </div>
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
