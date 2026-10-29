import config from "@payload-config";
import {
  convertLexicalToHTMLAsync,
  type HTMLConvertersFunctionAsync,
} from "@payloadcms/richtext-lexical/html-async";
import { getPayload } from "payload";
import { cache } from "react";
import { codeToHtml } from "shiki";
import type { Post as PostDoc } from "@/payload-types";

export type PostMeta = {
  slug: string;
  /** Sequential log number, oldest post = 001. Stamped as "Log 001". */
  log: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

const toIsoDate = (value: string) => new Date(value).toISOString().slice(0, 10);

// Rough word count over the Lexical tree, for the "N min read" stamp.
function countWords(node: unknown): number {
  if (!node || typeof node !== "object") return 0;
  const n = node as { text?: unknown; code?: unknown; fields?: unknown; children?: unknown[]; root?: unknown };
  let words = 0;
  if (typeof n.text === "string") words += n.text.split(/\s+/).filter(Boolean).length;
  if (n.fields) words += countWords(n.fields);
  if (typeof n.code === "string") words += n.code.split(/\s+/).filter(Boolean).length;
  if (n.root) words += countWords(n.root);
  if (Array.isArray(n.children)) for (const c of n.children) words += countWords(c);
  return words;
}

function toMeta(doc: PostDoc, log: string): PostMeta {
  return {
    slug: doc.slug ?? String(doc.id),
    log,
    title: doc.title,
    description: doc.description,
    date: toIsoDate(doc.publishedAt),
    tags: doc.tags ?? [],
    readingMinutes: Math.max(1, Math.round(countWords(doc.content) / 220)),
  };
}

/** Published posts, newest first. Cached per request. */
export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "publishedAt",
    pagination: false,
    depth: 0,
  });

  // Number oldest-first so a post keeps its log number as new ones are added.
  return docs
    .map((d, i) => toMeta(d, String(i + 1).padStart(3, "0")))
    .reverse();
});

// Monaco ids used by the editor's code block -> Shiki language ids.
const shikiLang: Record<string, string> = { plaintext: "text", shell: "bash" };

const converters: HTMLConvertersFunctionAsync = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    Code: async ({
      node,
    }: {
      node: { fields: { code?: string; language?: string } };
    }) => {
      const { code = "", language = "plaintext" } = node.fields;
      return codeToHtml(code, {
        lang: shikiLang[language] ?? language,
        theme: "github-dark-dimmed",
      });
    },
  },
});

/**
 * A single post with its body rendered to HTML. With `draft`, returns the
 * latest saved version even if unpublished (used by the admin's Preview).
 */
export const getPost = cache(
  async (slug: string, draft = false): Promise<Post | null> => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "posts",
      where: draft ? { slug: { equals: slug } } : { slug: { equals: slug }, _status: { equals: "published" } },
      draft,
      overrideAccess: draft,
      limit: 1,
      depth: 1,
    });
    const doc = docs[0];
    if (!doc) return null;

    const meta = (await getAllPosts()).find((p) => p.slug === slug);
    const html = await convertLexicalToHTMLAsync({
      data: doc.content,
      converters,
      disableContainer: true,
      disableIndent: true,
    });

    return { ...(meta ?? toMeta(doc, "DRAFT")), html };
  },
);

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
