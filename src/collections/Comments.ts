import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionConfig, FieldAccess } from "payload";
import { siteUrl } from "../lib/content";

const signedIn: FieldAccess = ({ req }) => Boolean(req.user);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Emails COMMENT_NOTIFY_EMAIL about each new comment, with links to read it on
// the post and to remove it in the admin. A failed send never blocks the comment.
const notifyAuthor: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  const to = process.env.COMMENT_NOTIFY_EMAIL;
  if (operation !== "create" || !to) return doc;
  try {
    const post =
      typeof doc.post === "object"
        ? doc.post
        : await req.payload.findByID({ collection: "posts", id: doc.post, depth: 0, req });
    const live = doc.status === "approved";
    const postUrl = `${siteUrl}/blog/${post.slug}#comment-${doc.id}`;
    const adminUrl = `${siteUrl}/admin/collections/comments/${doc.id}`;
    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `${live ? "New comment" : "Comment held for review"} on “${post.title}” from ${doc.name}`,
      html: `
        <p><strong>${escapeHtml(doc.name)}</strong> &lt;${escapeHtml(doc.email)}&gt; commented on
        <strong>${escapeHtml(post.title)}</strong>:</p>
        <blockquote style="border-left:3px solid #d9622c;margin:0;padding:4px 12px;white-space:pre-line">${escapeHtml(doc.body)}</blockquote>
        <p>${
          live
            ? "It's live on the post now."
            : "It contains several links, so it was held as Pending and isn't on the post yet."
        }</p>
        <p>${live ? `<a href="${postUrl}">View it on the post</a> · ` : ""}<a href="${adminUrl}">${
          live ? "Remove or mark as spam" : "Approve or remove"
        }</a></p>
        <p style="color:#888;font-size:12px">Reply to this email to answer ${escapeHtml(doc.name)} directly.</p>`,
    });
  } catch (err) {
    req.payload.logger.error({ err, msg: "Couldn't send the new-comment email" });
  }
  return doc;
};

// Reader comments. Readers don't sign in: the site's server action publishes
// each comment straight away and emails you about it, so you can remove spam
// or abuse afterwards. Emails are kept for following up and never shown publicly.
export const Comments: CollectionConfig = {
  slug: "comments",
  admin: {
    group: "Blog",
    useAsTitle: "name",
    defaultColumns: ["name", "status", "post", "createdAt"],
    listSearchableFields: ["name", "email", "body"],
    description:
      "Comments go live as soon as they're posted, and you get an email for each one. Set one to Spam (or delete it) to take it down. Comments with several links are held as Pending until you approve them.",
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
      defaultValue: "approved",
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
      notifyAuthor,
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
