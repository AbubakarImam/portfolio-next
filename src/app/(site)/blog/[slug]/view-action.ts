"use server";

import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { siteUrl } from "@/lib/content";
import { addView, classifySource } from "@/lib/views";

// Crawlers, link previews and test tools that run page scripts.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|phantom|puppeteer|playwright|selenium/i;

/** Counts one view of a published post. Never throws: a lost view is fine. */
export async function recordView(postId: string, referrer: string, utm: string) {
  try {
    const h = await headers();
    if (BOT.test(h.get("user-agent") ?? "") || !/^[a-f0-9]{24}$/.test(postId)) return;
    const payload = await getPayload({ config });
    // Your own visits while signed in to the admin don't count.
    if ((await payload.auth({ headers: h })).user) return;
    const { totalDocs } = await payload.count({
      collection: "posts",
      where: { id: { equals: postId }, _status: { equals: "published" } },
    });
    if (!totalDocs) return;
    await addView(payload, postId, classifySource(referrer.slice(0, 500), utm.slice(0, 50), new URL(siteUrl).hostname));
  } catch (err) {
    console.error("Couldn't record a view", err);
  }
}
