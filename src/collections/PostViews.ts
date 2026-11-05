import type { CollectionConfig } from "payload";

/** Where a view came from, as counted in `sources`. */
export const VIEW_SOURCES = ["direct", "x", "linkedin", "whatsapp", "facebook", "search", "site", "other"] as const;
export type ViewSource = (typeof VIEW_SOURCES)[number];

// One row per post per day (Lagos time), counted by src/lib/views.ts. No
// cookies, IP addresses or visitor IDs are stored: a view is one browser
// session opening the post, and your own views while signed in aren't counted.
export const PostViews: CollectionConfig = {
  slug: "post-views",
  labels: { singular: "Daily views", plural: "Daily views" },
  admin: {
    group: "Blog",
    defaultColumns: ["day", "post", "views"],
    description: "Views per post per day. The dashboard sums these up.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: "-day",
  indexes: [{ fields: ["post", "day"], unique: true }],
  fields: [
    { name: "post", type: "relationship", relationTo: "posts", required: true, index: true },
    { name: "day", type: "text", required: true, index: true, admin: { description: "YYYY-MM-DD, Lagos time." } },
    { name: "views", type: "number", required: true, defaultValue: 0 },
    { name: "sources", type: "json", admin: { description: "Views by where the reader came from." } },
  ],
  timestamps: true,
};
