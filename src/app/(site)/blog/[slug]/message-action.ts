"use server";

import config from "@payload-config";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { getPayload } from "payload";

export type MessageFormState = {
  status: "idle" | "ok" | "error";
  message: string;
  /** Echoed back on error so the form keeps what the reader typed. */
  values?: { name: string; email: string; body: string };
};

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 3;
const MIN_FILL_MS = 3000;

const ok: MessageFormState = {
  status: "ok",
  message: "Sent. Only the author sees your message, and any reply comes to your email.",
};

function clientIp(h: Headers) {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function sendMessage(_prev: MessageFormState, form: FormData): Promise<MessageFormState> {
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const values = { name: get("name"), email: get("email"), body: get("body") };
  const fail = (message: string): MessageFormState => ({ status: "error", message, values });

  // Same bot checks as the comment form: the hidden "website" field, and a
  // "started" stamp set by the page's script. Bots are told it worked.
  const started = Number(get("started"));
  if (get("website") || !started || Date.now() - started < MIN_FILL_MS) return ok;

  if (!values.name || values.name.length > 80) return fail("Please enter your name (up to 80 characters).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254)
    return fail("Please enter a valid email address, so the author can reply.");
  if (values.body.length < 2) return fail("Please write a message.");
  if (values.body.length > 5000) return fail("Messages can be up to 5,000 characters.");

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    where: { id: { equals: get("postId") }, _status: { equals: "published" } },
    limit: 1,
    depth: 0,
  });

  const h = await headers();
  const ipHash = createHash("sha256")
    .update(`${process.env.PAYLOAD_SECRET}:${clientIp(h)}`)
    .digest("hex");
  const recent = await payload.count({
    collection: "messages",
    overrideAccess: true,
    where: {
      ipHash: { equals: ipHash },
      createdAt: { greater_than: new Date(Date.now() - RATE_WINDOW_MS).toISOString() },
    },
  });
  if (recent.totalDocs >= RATE_LIMIT)
    return fail("You've sent a few messages already. Please wait a while and try again.");

  await payload.create({
    collection: "messages",
    overrideAccess: true,
    data: { ...values, post: docs[0]?.id, status: "new", ipHash },
  });
  return ok;
}
