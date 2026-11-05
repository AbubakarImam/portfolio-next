"use server";

import config from "@payload-config";
import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getPayload } from "payload";

export type LikeResult = { ok: boolean; liked: boolean; likes: number };

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 60;

const hash = (s: string) => createHash("sha256").update(`${process.env.PAYLOAD_SECRET}:${s}`).digest("hex");

/**
 * Likes a comment, or takes the like back if this browser already liked it.
 * `voterId` is a random ID the browser keeps; signed in, you like as the
 * author, which also shows "Liked by the author" on the comment.
 */
export async function toggleLike(commentId: string, voterId: string): Promise<LikeResult> {
  const fail = { ok: false, liked: false, likes: 0 };
  if (!/^[a-f0-9]{24}$/.test(commentId) || !/^[\w-]{16,64}$/.test(voterId)) return fail;

  const payload = await getPayload({ config });
  const h = await headers();
  const { user } = await payload.auth({ headers: h });
  const comments = payload.db.collections.comments;

  const comment = await comments
    .findOne({ _id: commentId, status: "approved" }, { post: 1, likes: 1 })
    .lean<{ post: unknown; likes?: number }>();
  if (!comment) return fail;

  const ipHash = hash(h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown");
  const likes = payload.db.collections["comment-likes"];
  if (!user) {
    const recent = await likes.countDocuments({
      ipHash,
      createdAt: { $gt: new Date(Date.now() - RATE_WINDOW_MS) },
    });
    if (recent >= RATE_LIMIT) return { ok: false, liked: false, likes: comment.likes ?? 0 };
  }

  const voter = user ? "author" : hash(`voter:${voterId}`);
  const removed = await likes.deleteOne({ comment: commentId, voter });
  let liked = false;
  if (!removed.deletedCount) {
    try {
      const now = new Date();
      await likes.create({ comment: commentId, voter, ipHash, createdAt: now, updatedAt: now });
      liked = true;
    } catch {
      // A double click that lost the race: it's already liked.
      return { ok: true, liked: true, likes: comment.likes ?? 0 };
    }
  }

  const updated = await comments
    .findOneAndUpdate(
      { _id: commentId },
      { $inc: { likes: liked ? 1 : -1 }, ...(user ? { $set: { likedByAuthor: liked } } : {}) },
      { new: true, projection: { likes: 1 } },
    )
    .lean<{ likes?: number }>();

  const post = await payload.db.collections.posts.findOne({ _id: comment.post }, { slug: 1 }).lean<{ slug?: string }>();
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);

  return { ok: true, liked, likes: Math.max(0, updated?.likes ?? 0) };
}
