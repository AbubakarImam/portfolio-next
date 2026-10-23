import type { Metadata } from "next";
import Link from "next/link";
import { BackCover } from "@/components/BackCover";
import { BlogMasthead } from "@/components/BlogMasthead";
import { SpecHeader } from "@/components/SpecHeader";
import { ArrowIcon } from "@/components/icons";
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Field Notes — Abubakar Imam Abdulsalam",
  description:
    "Write-ups from a backend engineer working on core banking APIs: .NET, NestJS, system design, and what shipping under regulatory constraints actually looks like.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: { type: "website", url: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <>
      <BlogMasthead />
      <main className="flex-1 py-20 md:py-28 shop-texture">
        <div className="mx-auto w-[90%] max-w-4xl">
          <SpecHeader sec="Field Notes" title="Engineering Log" />

          {posts.length === 0 ? (
            <p className="font-label text-steel-dim">No entries filed yet.</p>
          ) : (
            <ol className="flex flex-col gap-5">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block bg-blue blueprint-grid border border-blue-line p-6 md:p-8
                    hover:border-accent transition-colors"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3 font-display text-xs">
                      <span className="text-accent-bright">Log {p.log}</span>
                      <time dateTime={p.date} className="text-paper-dim">
                        {formatDate(p.date)}
                      </time>
                      <span className="text-paper-dim">
                        {p.readingMinutes} min read
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-xl md:text-2xl text-paper uppercase tracking-tight mb-3">
                      {p.title}
                    </h2>
                    {p.description && (
                      <p className="font-label text-sm md:text-base text-paper-dim max-w-[65ch] mb-4">
                        {p.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 font-label text-xs tracking-[0.08em] uppercase text-paper group-hover:text-accent-bright transition-colors">
                      Read entry <ArrowIcon className="w-4 h-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

          <p className="mt-12 font-label text-xs tracking-[0.15em] uppercase text-steel-dim">
            Subscribe via{" "}
            <a
              href="/blog/rss.xml"
              className="text-steel hover:text-accent-bright transition-colors underline underline-offset-4"
            >
              RSS
            </a>
          </p>
        </div>
      </main>
      <BackCover />
    </>
  );
}
