import type { Payload } from "payload";
import type { ViewSource } from "../collections/PostViews";

export const TIME_ZONE = "Africa/Lagos";

/** YYYY-MM-DD in Lagos time, `daysAgo` days before now. */
export const dayKey = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 86_400_000).toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

/** Groups a referrer (or utm_source) into the sources the dashboard shows. */
export function classifySource(referrer: string, utm: string, siteHost: string): ViewSource {
  const tag = utm.toLowerCase();
  if (tag) {
    if (/^(x|twitter)$/.test(tag)) return "x";
    if (tag.includes("linkedin")) return "linkedin";
    if (tag.includes("whatsapp")) return "whatsapp";
    if (/facebook|instagram|^fb$|^ig$/.test(tag)) return "facebook";
  }
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
  if (host === siteHost.replace(/^www\./, "")) return "site";
  if (/(^|\.)(t\.co|x\.com|twitter\.com)$/.test(host)) return "x";
  if (/(^|\.)(linkedin\.com|lnkd\.in)$/.test(host)) return "linkedin";
  if (/(^|\.)(whatsapp\.com|wa\.me)$/.test(host)) return "whatsapp";
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com)$/.test(host)) return "facebook";
  if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|ecosia\.org|brave\.com)$/.test(host))
    return "search";
  return "other";
}

/**
 * Adds one view to today's row for the post, creating the row if needed.
 * Uses Mongo's $inc so simultaneous views don't overwrite each other.
 */
export async function addView(payload: Payload, postId: string, source: ViewSource) {
  const model = payload.db.collections["post-views"];
  const now = new Date();
  await model.updateOne(
    { post: postId, day: dayKey() },
    {
      $inc: { views: 1, [`sources.${source}`]: 1 },
      $set: { updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
}
