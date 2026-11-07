import type { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { profile, siteUrl } from "../lib/content";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const quote = "border-left:3px solid #d9622c;margin:0 0 16px;padding:4px 12px;white-space:pre-line";

const postOf = async (doc: { post?: unknown }, req: Parameters<CollectionAfterChangeHook>[0]["req"]) => {
  if (!doc.post) return null;
  if (typeof doc.post === "object") return doc.post as { title: string; slug: string };
  return req.payload
    .findByID({ collection: "posts", id: doc.post as string, depth: 0, req })
    .catch(() => null);
};

// Emails COMMENT_NOTIFY_EMAIL each new message, with the reader as reply-to so
// you can answer straight from your inbox. A failed send never loses the
// message: it's still in the admin.
const notifyAuthor: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  const to = process.env.COMMENT_NOTIFY_EMAIL;
  if (operation !== "create" || !to) return doc;
  try {
    const post = await postOf(doc, req);
    const adminUrl = `${siteUrl}/admin/collections/messages/${doc.id}`;
    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `Private message from ${doc.name}${post ? ` about “${post.title}”` : ""}`,
      html: `
        <p><strong>${escapeHtml(doc.name)}</strong> &lt;${escapeHtml(doc.email)}&gt; sent you a private message${
          post ? ` from <a href="${siteUrl}/blog/${post.slug}">${escapeHtml(post.title)}</a>` : ""
        }:</p>
        <blockquote style="${quote}">${escapeHtml(doc.body)}</blockquote>
        <p><a href="${adminUrl}">Open it in the admin</a></p>
        <p style="color:#888;font-size:12px">Reply to this email to answer ${escapeHtml(doc.name)} directly,
        or fill in “Your reply” on the message in the admin. It isn't shown on the site.</p>`,
    });
  } catch (err) {
    req.payload.logger.error({ err, msg: "Couldn't send the new-message email" });
  }
  return doc;
};

// Emails the reader the first time you save "Your reply", then stamps
// repliedAt and marks the message Replied. If the send fails, the stamp stays
// empty and the next save tries again.
const sendReply: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== "update" || req.context.skipReplyEmail || !doc.reply?.trim() || doc.repliedAt) return doc;
  try {
    const post = await postOf(doc, req);
    await req.payload.sendEmail({
      to: doc.email,
      replyTo: process.env.COMMENT_NOTIFY_EMAIL || undefined,
      subject: `${profile.name} replied to your message`,
      html: `
        <p>Hi ${escapeHtml(doc.name)},</p>
        <p style="white-space:pre-line">${escapeHtml(doc.reply)}</p>
        <p>— ${escapeHtml(profile.name)}</p>
        <p style="color:#888;font-size:12px;margin:24px 0 4px">You wrote${
          post ? ` about <a href="${siteUrl}/blog/${post.slug}">${escapeHtml(post.title)}</a>` : ""
        }:</p>
        <blockquote style="${quote};color:#666">${escapeHtml(doc.body)}</blockquote>
        <p style="color:#888;font-size:12px">You can answer by replying to this email.</p>`,
    });
    const stamped = await req.payload.update({
      collection: "messages",
      id: doc.id,
      data: { repliedAt: new Date().toISOString(), status: "replied" },
      context: { skipReplyEmail: true },
      req,
    });
    return { ...doc, repliedAt: stamped.repliedAt, status: stamped.status };
  } catch (err) {
    req.payload.logger.error({ err, msg: "Couldn't email the reader your reply" });
  }
  return doc;
};

// Private messages from readers, sent with the "Message privately" form on
// each post. Only you can see them; nothing here is shown on the site.
export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    group: "Blog",
    useAsTitle: "name",
    defaultColumns: ["name", "status", "post", "createdAt"],
    listSearchableFields: ["name", "email", "body"],
    description:
      "Private messages from readers. Each one is also emailed to you; reply to that email, or fill in Your reply here and the reader gets it by email.",
  },
  access: {
    // Created only through the site's message form (src/app/(site)/blog/[slug]/message-action.ts).
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      index: true,
      options: [
        { label: "New", value: "new" },
        { label: "Read", value: "read" },
        { label: "Replied", value: "replied" },
        { label: "Spam", value: "spam" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "post",
      label: "Sent from",
      type: "relationship",
      relationTo: "posts",
      admin: { position: "sidebar", readOnly: true },
    },
    { name: "name", type: "text", required: true, maxLength: 80, admin: { readOnly: true } },
    { name: "email", type: "email", required: true, admin: { readOnly: true } },
    { name: "body", label: "Message", type: "textarea", required: true, maxLength: 5000, admin: { readOnly: true } },
    {
      name: "reply",
      label: "Your reply",
      type: "textarea",
      maxLength: 5000,
      admin: {
        description: "Optional. The first time you save a reply, the reader gets it by email. Editing it afterwards doesn't email them again.",
      },
    },
    {
      name: "repliedAt",
      label: "Reply emailed",
      type: "date",
      admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "ipHash",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Hashed IP address, used to rate-limit the message form.",
      },
    },
  ],
  hooks: {
    // Saving a New message in the admin means you've seen it.
    beforeChange: [
      ({ data, operation, originalDoc }) =>
        operation === "update" && originalDoc?.status === "new" && data.status === "new"
          ? { ...data, status: "read" }
          : data,
    ],
    afterChange: [notifyAuthor, sendReply],
  },
  timestamps: true,
};
