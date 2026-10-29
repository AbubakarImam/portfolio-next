import {
  BlocksFeature,
  CodeBlock,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HorizontalRuleFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

/** Languages offered in the editor's code block; keys are Monaco ids. */
export const codeLanguages = {
  csharp: "C#",
  typescript: "TypeScript",
  javascript: "JavaScript",
  json: "JSON",
  sql: "SQL",
  shell: "Shell",
  yaml: "YAML",
  dockerfile: "Dockerfile",
  html: "HTML",
  css: "CSS",
  python: "Python",
  xml: "XML",
  plaintext: "Plain text",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");

// Rebuild the cached blog pages when a post is published, edited or removed,
// so changes show on the live site without a redeploy.
function revalidateBlog(slugs: (string | null | undefined)[]) {
  revalidatePath("/blog");
  revalidatePath("/blog/rss.xml");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/blog/${slug}`);
  }
}

const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc;
  const touchesLive =
    doc._status === "published" || previousDoc?._status === "published";
  if (touchesLive) revalidateBlog([doc.slug, previousDoc?.slug]);
  return doc;
};

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Blog",
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status", "updatedAt"],
    preview: (doc) =>
      doc?.slug
        ? `/next/preview?slug=${encodeURIComponent(String(doc.slug))}`
        : null,
  },
  access: {
    // The public sees published posts; signed-in users also see drafts.
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  versions: {
    drafts: { schedulePublish: true },
    maxPerDoc: 25,
  },
  defaultSort: "-publishedAt",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "description",
      type: "textarea",
      required: true,
      maxLength: 220,
      admin: {
        description:
          "One or two sentences. Shown on the blog list and as the preview text on X, LinkedIn and WhatsApp.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          HorizontalRuleFeature(),
          EXPERIMENTAL_TableFeature(),
          BlocksFeature({
            blocks: [
              CodeBlock({ languages: codeLanguages, defaultLanguage: "csharp" }),
            ],
          }),
        ],
      }),
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "The post's address: /blog/<slug>. Filled from the title if left empty. Changing it after sharing breaks old links.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ? slugify(String(value)) : data?.title ? slugify(data.title) : value,
        ],
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      },
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [
      ({ doc, req }) => {
        if (!req.context.disableRevalidate) revalidateBlog([doc?.slug]);
        return doc;
      },
    ],
  },
};
