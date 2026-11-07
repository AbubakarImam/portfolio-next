"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { sendMessage, type MessageFormState } from "@/app/(site)/blog/[slug]/message-action";
import { profile } from "@/lib/content";

const initial: MessageFormState = { status: "idle", message: "" };

const field =
  "w-full bg-shop-deep border border-blue-line px-4 py-3 text-steel placeholder:text-steel-dim/60 " +
  "focus:outline-none focus:border-accent transition-colors";
const label = "block font-label text-[0.65rem] tracking-[0.25em] uppercase text-paper-dim mb-2";

const firstName = profile.name.split(/\s+/)[0];

/**
 * "Message privately": a button under the post that opens a short form. The
 * message goes to the admin and your inbox, never onto the page. Hidden while
 * you're signed in, since it would only message yourself.
 */
export function MessageAuthor({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [state, action, pending] = useActionState(sendMessage, initial);
  const uid = useId();
  const started = useRef<HTMLInputElement>(null);
  const stamp = () => {
    if (started.current && !started.current.value) started.current.value = String(Date.now());
  };

  useEffect(() => {
    fetch("/api/users/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setIsAuthor(Boolean(d?.user)))
      .catch(() => {});
  }, []);

  if (isAuthor) return null;

  if (!open)
    return (
      <p className="mt-5 pt-5 border-t border-blue-line text-sm text-paper-dim">
        Something you’d rather not say in public?{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-label text-xs tracking-[0.2em] uppercase text-accent hover:text-accent-bright transition-colors"
        >
          Message {firstName} privately
        </button>
      </p>
    );

  const sent = state.status === "ok";
  const v = state.status === "error" ? state.values : undefined;

  return (
    <div className="mt-5 pt-5 border-t border-blue-line">
      <p className="font-label text-sm text-paper mb-1">Message {firstName} privately</p>
      <p className="text-xs text-steel-dim mb-5">
        Only {firstName} sees this. It isn’t posted on the page, and replies come to your email.
      </p>
      {sent ? (
        <p role="status" aria-live="polite" className="border border-accent px-4 py-3 text-sm text-accent-bright">
          {state.message}
        </p>
      ) : (
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
          <div>
            <label htmlFor={`${uid}-body`} className={label}>Message</label>
            <textarea
              id={`${uid}-body`}
              name="body"
              required
              minLength={2}
              maxLength={5000}
              rows={5}
              autoFocus
              defaultValue={v?.body}
              className={`${field} resize-y`}
            />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 px-4 font-label text-xs tracking-[0.2em] uppercase text-paper-dim hover:text-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="h-11 px-6 bg-accent text-shop-deep font-label text-xs tracking-[0.2em] uppercase
              hover:bg-accent-bright disabled:opacity-60 transition-colors"
            >
              {pending ? "Sending…" : "Send privately"}
            </button>
          </div>
          {state.status === "error" && (
            <p role="status" aria-live="polite" className="border border-[#e5b93a] px-4 py-3 text-sm text-[#e5b93a]">
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
