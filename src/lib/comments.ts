import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

export type PublicComment = {
  id: string;
  name: string;
  body: string;
  reply: string | null;
  date: string;
};

/** Approved comments on a post, oldest first. Emails are never included. */
export const getApprovedComments = cache(async (postId: string): Promise<PublicComment[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "comments",
    where: { post: { equals: postId }, status: { equals: "approved" } },
    sort: "createdAt",
    pagination: false,
    depth: 0,
    select: { name: true, body: true, reply: true, createdAt: true },
  });
  return docs.map((c) => ({
    id: String(c.id),
    name: c.name,
    body: c.body,
    reply: c.reply ?? null,
    date: c.createdAt,
  }));
});
