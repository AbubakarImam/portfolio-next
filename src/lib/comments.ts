import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { profile } from "./content";

export type PublicReply = {
  /** Element id on the page, `comment-<id>`. */
  id: string;
  name: string;
  body: string;
  date: string;
  byAuthor: boolean;
  replyingTo: string | null;
  likes: number;
  likedByAuthor: boolean;
  /** False for the admin's "Your reply", which isn't a comment of its own. */
  likeable: boolean;
  /** What a reply to this one posts as `replyTo` (and `toAuthor`). */
  target: { id: string; toAuthor: boolean };
};

export type PublicComment = PublicReply & { replies: PublicReply[] };

const idOf = (v: unknown) => (v && typeof v === "object" ? String((v as { id: unknown }).id) : v ? String(v) : null);

/**
 * Approved comments on a post as threads, oldest first. Replies sit one level
 * under their top-level comment; replies whose comment was taken down are
 * dropped with it. Emails are never included.
 */
export const getCommentThreads = cache(async (postId: string): Promise<PublicComment[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "comments",
    where: { post: { equals: postId }, status: { equals: "approved" } },
    sort: "createdAt",
    pagination: false,
    depth: 0,
    select: {
      name: true,
      body: true,
      reply: true,
      replyEmailedAt: true,
      parent: true,
      replyingToName: true,
      byAuthor: true,
      likes: true,
      likedByAuthor: true,
      createdAt: true,
    },
  });

  const threads = new Map<string, PublicComment>();
  const replies: [string, PublicReply][] = [];
  for (const c of docs) {
    const id = String(c.id);
    const item: PublicReply = {
      id,
      name: c.byAuthor ? profile.name : c.name,
      body: c.body,
      date: c.createdAt,
      byAuthor: Boolean(c.byAuthor),
      replyingTo: c.replyingToName ?? null,
      likes: c.likes ?? 0,
      likedByAuthor: Boolean(c.likedByAuthor),
      likeable: true,
      target: { id, toAuthor: false },
    };
    const parent = idOf(c.parent);
    if (parent) {
      replies.push([parent, item]);
      continue;
    }
    const thread: PublicComment = { ...item, replies: [] };
    // The admin's "Your reply" field shows as the author's reply in the thread.
    if (c.reply?.trim())
      thread.replies.push({
        id: `${id}-reply`,
        name: profile.name,
        body: c.reply,
        date: c.replyEmailedAt ?? c.createdAt,
        byAuthor: true,
        replyingTo: null,
        likes: 0,
        likedByAuthor: false,
        likeable: false,
        target: { id, toAuthor: true },
      });
    threads.set(id, thread);
  }
  for (const [parent, reply] of replies) threads.get(parent)?.replies.push(reply);
  for (const t of threads.values()) t.replies.sort((a, b) => a.date.localeCompare(b.date));
  return [...threads.values()];
});
