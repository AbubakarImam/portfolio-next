import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionConfig, FieldAccess } from "payload";
import { profile, siteUrl } from "../lib/content";

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
          live ? "Reply, remove or mark as spam" : "Approve or remove"
        }</a></p>
        <p style="color:#888;font-size:12px">To reply publicly, fill in “Your reply” on the comment in the admin;
        ${escapeHtml(doc.name)} gets an email with it. To answer privately, reply to this email.</p>`,
    });
  } catch (err) {
    req.payload.logger.error({ err, msg: "Couldn't send the new-comment email" });
  }
  return doc;
};

// Emails the reader the first time you fill in "Your reply" on their comment,
// then stamps replyEmailedAt so later edits to the reply don't email them again.
// If the send fails, the stamp stays empty and the next save tries again.
const notifyReader: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (
    operation !== "update" ||
    req.context.skipReplyEmail ||
    doc.status !== "approved" ||
    !doc.reply?.trim() ||
    doc.replyEmailedAt
  )
    return doc;
  try {
    const post =
      typeof doc.post === "object"
        ? doc.post
        : await req.payload.findByID({ collection: "posts", id: doc.post, depth: 0, req });
    const postUrl = `${siteUrl}/blog/${post.slug}#comment-${doc.id}`;
    const quote = "border-left:3px solid #d9622c;margin:0 0 16px;padding:4px 12px;white-space:pre-line";
    await req.payload.sendEmail({
      to: doc.email,
      replyTo: process.env.COMMENT_NOTIFY_EMAIL || undefined,
      subject: `${profile.name} replied to your comment on “${post.title}”`,
      html: `
        <p>Hi ${escapeHtml(doc.name)},</p>
        <p>${escapeHtml(profile.name)} replied to your comment on <strong>${escapeHtml(post.title)}</strong>.</p>
        <p style="color:#888;font-size:12px;margin-bottom:4px">You wrote:</p>
        <blockquote style="${quote};color:#666">${escapeHtml(doc.body)}</blockquote>
        <p style="color:#888;font-size:12px;margin-bottom:4px">Reply:</p>
        <blockquote style="${quote}">${escapeHtml(doc.reply)}</blockquote>
        <p><a href="${postUrl}">See it on the post</a></p>
        <p style="color:#888;font-size:12px">You're getting this because you commented on abubakarabdulsalam.com.
        You can answer by replying to this email.</p>`,
    });
    const stamped = await req.payload.update({
      collection: "comments",
      id: doc.id,
      data: { replyEmailedAt: new Date().toISOString() },
      context: { skipReplyEmail: true, disableRevalidate: true },
      req,
    });
    return { ...doc, replyEmailedAt: stamped.replyEmailedAt };
  } catch (err) {
    req.payload.logger.error({ err, msg: "Couldn't email the reader about your reply" });
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
      admin: {
        description:
          "Optional. Shown under the comment, marked as from the author. The first time you save a reply, the reader gets it by email.",
      },
    },
    {
      name: "replyEmailedAt",
      label: "Reply emailed to reader",
      type: "date",
      access: { read: signedIn },
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime" },
        description: "Set when the reader was emailed your reply. Editing the reply afterwards doesn't email them again.",
      },
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
      notifyReader,
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
