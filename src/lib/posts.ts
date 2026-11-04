import config from "@payload-config";
import {
  convertLexicalToHTMLAsync,
  type HTMLConvertersFunctionAsync,
} from "@payloadcms/richtext-lexical/html-async";
import { getPayload } from "payload";
import { cache } from "react";
import { codeToHtml } from "shiki";
import type { Media, Post as PostDoc } from "@/payload-types";

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

export type Post = PostMeta & { id: string; html: string; toc: TocEntry[] };

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

export type TocEntry = { id: string; text: string; level: 2 | 3 };

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const anchorId = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-") || "section";

const widthClass = (width?: string | null) => (width === "wide" ? " is-wide" : "");

const figcaption = (caption?: string | null) =>
  caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";

// Injected into each embed. The frame has no access to the page, so it reports
// its content height by message and EmbedFrames resizes it.
const embedResizer = `<script>(() => {
  const post = () => parent.postMessage({ type: "embed-height", height: document.documentElement.getBoundingClientRect().height }, "*");
  new ResizeObserver(post).observe(document.documentElement);
  addEventListener("load", post);
})();</script>`;

const calloutLabels: Record<string, string> = { note: "Note", key: "Key idea", warning: "Warning" };

type Fields<T> = { node: { fields: T } };

/** Converters for one render. Headings are collected into `toc` as they're met. */
function makeConverters(toc: TocEntry[]): HTMLConvertersFunctionAsync {
  const used = new Map<string, number>();

  return ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: async ({ node, nodesToHTML }) => {
      const children = (await nodesToHTML({ nodes: node.children })).join("");
      const tag = ["h2", "h3", "h4", "h5", "h6"].includes(node.tag) ? node.tag : "h2";
      const text = stripTags(children);
      const base = anchorId(text);
      const n = used.get(base) ?? 0;
      used.set(base, n + 1);
      const id = n ? `${base}-${n + 1}` : base;
      if (tag === "h2" || tag === "h3") toc.push({ id, text, level: tag === "h2" ? 2 : 3 });
      return `<${tag} id="${id}"><a href="#${id}">${children}</a></${tag}>`;
    },
    blocks: {
      Code: async ({ node }: Fields<{ code?: string; language?: string }>) => {
        const { code = "", language = "plaintext" } = node.fields;
        return codeToHtml(code, {
          lang: shikiLang[language] ?? language,
          theme: "github-dark-dimmed",
        });
      },

      // Rendered to SVG in the browser by PostEnhancements.
      mermaid: async ({ node }: Fields<{ diagram?: string; caption?: string; width?: string }>) => {
        const { diagram = "", caption, width } = node.fields;
        return `<figure class="post-figure post-diagram${widthClass(width)}"><div class="mermaid-source" data-mermaid>${escapeHtml(diagram)}</div>${figcaption(caption)}</figure>`;
      },

      embed: async ({
        node,
      }: Fields<{ title?: string; html?: string; height?: number | null; caption?: string; width?: string }>) => {
        const { title = "Embedded content", html = "", height, caption, width } = node.fields;
        const sizing = height
          ? `style="height:${Math.round(height)}px"`
          : `style="height:480px" data-auto-height`;
        // No allow-same-origin: the embed runs as an opaque origin and can't read
        // the site's cookies or DOM.
        return `<figure class="post-figure post-embed${widthClass(width)}"><iframe title="${escapeHtml(title)}" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals" loading="lazy" referrerpolicy="no-referrer" srcdoc="${escapeHtml(html + embedResizer)}" ${sizing}></iframe>${figcaption(caption)}</figure>`;
      },

      figure: async ({
        node,
      }: Fields<{ image?: Media | string | null; caption?: string; width?: string }>) => {
        const { caption, width } = node.fields;
        let image = node.fields.image;
        if (typeof image === "string") {
          const payload = await getPayload({ config });
          image = await payload.findByID({ collection: "media", id: image, depth: 0 }).catch(() => null);
        }
        if (!image?.url) return "";
        const size = image.width && image.height ? ` width="${image.width}" height="${image.height}"` : "";
        return `<figure class="post-figure${widthClass(width)}"><img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt ?? "")}"${size} loading="lazy" decoding="async" />${figcaption(caption)}</figure>`;
      },

      callout: async ({
        node,
      }: Fields<{ kind?: string; title?: string; content?: PostDoc["content"] }>) => {
        const { kind = "note", title, content } = node.fields;
        const body = content
          ? await convertLexicalToHTMLAsync({
              data: content,
              converters: makeConverters([]),
              disableContainer: true,
              disableIndent: true,
            })
          : "";
        const label = escapeHtml(title || calloutLabels[kind] || "Note");
        return `<aside class="callout callout-${escapeHtml(kind)}"><p class="callout-label">${label}</p><div class="callout-body">${body}</div></aside>`;
      },
    },
  });
}

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
    const toc: TocEntry[] = [];
    const html = await convertLexicalToHTMLAsync({
      data: doc.content,
      converters: makeConverters(toc),
      disableContainer: true,
      disableIndent: true,
    });

    return { ...(meta ?? toMeta(doc, "DRAFT")), id: String(doc.id), html, toc };
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
