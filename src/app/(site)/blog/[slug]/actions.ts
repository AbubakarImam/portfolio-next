"use server";

import config from "@payload-config";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { profile } from "@/lib/content";

export type CommentFormState = {
  status: "idle" | "ok" | "error";
  message: string;
  /** The thread the new reply landed in, so the page can open it. */
  thread?: string;
  /** Echoed back on error so the form keeps what the reader typed. */
  values?: { name: string; email: string; body: string };
};

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 3;
const MIN_FILL_MS = 3000;

const ok: CommentFormState = { status: "ok", message: "Thanks! Your comment is posted." };
const held: CommentFormState = {
  status: "ok",
  message: "Thanks! Comments with several links are checked before they appear, so yours will show up shortly.",
};
// Link-heavy comments are the usual spam, so they wait for approval.
const MAX_LINKS = 2;

function clientIp(h: Headers) {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function submitComment(
  _prev: CommentFormState,
  form: FormData,
): Promise<CommentFormState> {
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const values = { name: get("name"), email: get("email"), body: get("body") };
  const fail = (message: string): CommentFormState => ({ status: "error", message, values });

  // Bots fill the hidden "website" field, and post faster than a person can
  // type or without running the page's script (which sets "started").
  // Tell them it worked so they don't adapt.
  const started = Number(get("started"));
  if (get("website") || !started || Date.now() - started < MIN_FILL_MS) return ok;

  const payload = await getPayload({ config });
  const h = await headers();
  // Signed in to the admin: post as the author, skipping the name, email and
  // spam limits.
  const { user } = await payload.auth({ headers: h });
  if (user) {
    values.name = profile.name;
    values.email = process.env.COMMENT_NOTIFY_EMAIL || String(user.email);
  }

  if (!values.name || values.name.length > 80) return fail("Please enter your name (up to 80 characters).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254)
    return fail("Please enter a valid email address.");
  if (values.body.length < 2) return fail("Please write a comment.");
  if (values.body.length > 3000) return fail("Comments can be up to 3,000 characters.");

  const { docs } = await payload.find({
    collection: "posts",
    where: { id: { equals: get("postId") }, _status: { equals: "published" } },
    limit: 1,
    depth: 0,
  });
  if (!docs[0]) return fail("This post isn't accepting comments.");

  // Replies all sit one level under the top-level comment, labelled with who
  // they answer. "toAuthor" is a reply to the author's "Your reply" on that
  // comment, which isn't a comment of its own.
  let thread: { parent: string; respondsTo?: string; replyingToName?: string } | undefined;
  if (get("replyTo")) {
    const { docs: targets } = await payload.find({
      collection: "comments",
      overrideAccess: true,
      where: {
        id: { equals: get("replyTo") },
        post: { equals: docs[0].id },
        status: { equals: "approved" },
      },
      limit: 1,
      depth: 0,
    });
    const target = targets[0];
    if (!target) return fail("That comment is no longer available, so you can't reply to it.");
    const parent = String(target.parent ?? target.id);
    // You hear about every reply anyway, so only readers are emailed as the person replied to.
    if (get("toAuthor") === "1" || target.byAuthor) thread = { parent, replyingToName: profile.name };
    else
      thread = {
        parent,
        respondsTo: String(target.id),
        replyingToName: String(target.id) === parent ? undefined : target.name,
      };
  }

  const ipHash = createHash("sha256")
    .update(`${process.env.PAYLOAD_SECRET}:${clientIp(h)}`)
    .digest("hex");
  const recent = user ? { totalDocs: 0 } : await payload.count({
    collection: "comments",
    overrideAccess: true,
    where: {
      ipHash: { equals: ipHash },
      createdAt: { greater_than: new Date(Date.now() - RATE_WINDOW_MS).toISOString() },
    },
  });
  if (recent.totalDocs >= RATE_LIMIT)
    return fail("You've posted a few comments in a row. Please wait a few minutes and try again.");

  const links = values.body.match(/https?:\/\/|www\./gi)?.length ?? 0;
  const status = links > MAX_LINKS && !user ? "pending" : "approved";

  // Publishing revalidates the post, so the comment shows on the reader's
  // page as soon as this returns.
  await payload.create({
    collection: "comments",
    overrideAccess: true,
    data: { ...values, post: docs[0].id, status, ipHash, byAuthor: Boolean(user), ...thread },
  });

  if (status !== "approved") return held;
  return thread ? { status: "ok", message: "Thanks! Your reply is posted.", thread: thread.parent } : ok;
}
