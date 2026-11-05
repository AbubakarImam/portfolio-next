import type { CollectionConfig } from "payload";

// One row per like, so a reader can't like the same comment twice. `voter` is
// a hash of a random ID the reader's browser keeps (not their IP: many
// readers on the same mobile network share one), or "author" for you.
// The count shown on the page is the comment's `likes` field.
export const CommentLikes: CollectionConfig = {
  slug: "comment-likes",
  admin: { hidden: true },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  indexes: [{ fields: ["comment", "voter"], unique: true }],
  fields: [
    { name: "comment", type: "relationship", relationTo: "comments", required: true, index: true },
    { name: "voter", type: "text", required: true },
    { name: "ipHash", type: "text", index: true },
  ],
  timestamps: true,
};
