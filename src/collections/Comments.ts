import { revalidatePath } from "next/cache";
import type { CollectionConfig, FieldAccess } from "payload";

const signedIn: FieldAccess = ({ req }) => Boolean(req.user);

// Reader comments. Readers don't sign in: the site's server action creates
// comments as "pending", and they appear on the post only once approved here.
// Emails are kept for following up and are never shown publicly.
export const Comments: CollectionConfig = {
  slug: "comments",
  admin: {
    group: "Blog",
    useAsTitle: "name",
    defaultColumns: ["name", "status", "post", "createdAt"],
    listSearchableFields: ["name", "email", "body"],
    description:
      "New comments wait as Pending. Set a comment to Approved to show it on the post, or Spam to hide it.",
  },
  access: {
    // Created only through the site's comment form (src/app/(site)/blog/[slug]/actions.ts).
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => (req.user ? true : { status: { equals: "approved" } }),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Spam", value: "spam" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
      index: true,
      admin: { position: "sidebar" },
    },
    { name: "name", type: "text", required: true, maxLength: 80 },
    {
      name: "email",
      type: "email",
      required: true,
      access: { read: signedIn },
      admin: { description: "Never shown on the site." },
    },
    { name: "body", label: "Comment", type: "textarea", required: true, maxLength: 3000 },
    {
      name: "reply",
      label: "Your reply",
      type: "textarea",
      maxLength: 3000,
      admin: { description: "Optional. Shown under the comment, marked as from the author." },
    },
    {
      name: "ipHash",
      type: "text",
      index: true,
      access: { read: signedIn },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Hashed IP address, used to rate-limit the comment form.",
      },
    },
  ],
  hooks: {
    // Only approved comments are on the page, so rebuild it when one is
    // approved, edited while approved, or taken down.
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (req.context.disableRevalidate) return doc;
        if (doc.status !== "approved" && previousDoc?.status !== "approved") return doc;
        const post =
          typeof doc.post === "object"
            ? doc.post
            : await req.payload.findByID({ collection: "posts", id: doc.post, depth: 0, req });
        if (post?.slug) revalidatePath(`/blog/${post.slug}`);
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        if (req.context.disableRevalidate || doc.status !== "approved") return doc;
        const post =
          typeof doc.post === "object"
            ? doc.post
            : await req.payload
                .findByID({ collection: "posts", id: doc.post, depth: 0, req })
                .catch(() => null);
        if (post?.slug) revalidatePath(`/blog/${post.slug}`);
        return doc;
      },
    ],
  },
  timestamps: true,
};
