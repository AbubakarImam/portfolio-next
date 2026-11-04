import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block, Field } from "payload";

// Editor blocks for articles beyond plain prose. Each one has a matching HTML
// converter in src/lib/posts.ts.

const width: Field = {
  name: "width",
  type: "select",
  defaultValue: "normal",
  options: [
    { label: "Text column", value: "normal" },
    { label: "Wide (breaks out of the text column)", value: "wide" },
  ],
};

const caption: Field = { name: "caption", type: "text" };

export const MermaidBlock: Block = {
  slug: "mermaid",
  interfaceName: "MermaidBlock",
  labels: { singular: "Diagram (Mermaid)", plural: "Diagrams (Mermaid)" },
  fields: [
    {
      name: "diagram",
      type: "code",
      required: true,
      admin: {
        language: "markdown",
        description:
          "Mermaid syntax, e.g. `flowchart LR` then `A[Client] --> B[API]`. Flowcharts, sequence, class, state, ER and C4 diagrams all work. Live editor: mermaid.live",
      },
    },
    caption,
    { ...width, defaultValue: "wide" },
  ],
};

export const EmbedBlock: Block = {
  slug: "embed",
  interfaceName: "EmbedBlock",
  labels: { singular: "Interactive embed (HTML)", plural: "Interactive embeds" },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Short name for screen readers, e.g. “Ledger posting simulator”." },
    },
    {
      name: "html",
      type: "code",
      required: true,
      admin: {
        language: "html",
        description:
          "A complete HTML page, such as a Claude artifact. It runs in a sandboxed frame, so its scripts can't reach the rest of the site.",
      },
    },
    {
      name: "height",
      type: "number",
      min: 120,
      admin: {
        description: "Height in pixels. Leave empty to size the frame to its content.",
      },
    },
    caption,
    { ...width, defaultValue: "wide" },
  ],
};

export const FigureBlock: Block = {
  slug: "figure",
  interfaceName: "FigureBlock",
  labels: { singular: "Figure", plural: "Figures" },
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    caption,
    width,
  ],
};

export const CalloutBlock: Block = {
  slug: "callout",
  interfaceName: "CalloutBlock",
  labels: { singular: "Callout", plural: "Callouts" },
  fields: [
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "note",
      options: [
        { label: "Note", value: "note" },
        { label: "Key idea", value: "key" },
        { label: "Warning", value: "warning" },
      ],
    },
    { name: "title", type: "text" },
    { name: "content", type: "richText", required: true, editor: lexicalEditor() },
  ],
};
