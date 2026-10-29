import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";
import { formatDate, getAllPosts } from "@/lib/posts";

export const alt = "Field note by Abubakar Imam Abdulsalam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

// The card social networks show when a post link is shared.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);

  const line = "rgba(234, 243, 247, 0.14)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          background: "#16181b",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px",
            background: "#1d3f5c",
            border: `2px solid ${line}`,
            backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#ef7a41",
            }}
          >
            {`Field Notes · Log ${post?.log ?? ""}`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: (post?.title.length ?? 0) > 60 ? 54 : 66,
              fontWeight: 700,
              lineHeight: 1.12,
              textTransform: "uppercase",
              color: "#eaf3f7",
            }}
          >
            {post?.title ?? "Field Notes"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 26,
              color: "rgba(234, 243, 247, 0.75)",
            }}
          >
            <span>{profile.name}</span>
            <span>{post ? formatDate(post.date) : ""}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
