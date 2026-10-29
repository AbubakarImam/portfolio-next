import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { BackCover } from "@/components/BackCover";
import { BlogMasthead } from "@/components/BlogMasthead";
import { ShareBar } from "@/components/ShareBar";
import { profile, siteUrl } from "@/lib/content";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

// Posts published after the last deploy are rendered on first visit, then cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — ${profile.name}`,
    description: post.description,
    authors: [{ name: profile.name, url: siteUrl }],
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [profile.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: profile.socials.twitterHandle,
    },
  };
}

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const { isEnabled: draft } = await draftMode();
  const post = await getPost(slug, draft);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}`;

  return (
    <>
      <BlogMasthead />
      <main className="flex-1 py-16 md:py-24 shop-texture">
        <article className="mx-auto w-[90%] max-w-3xl">
          {draft && (
            <p className="mb-6 border border-accent px-4 py-2 font-label text-xs tracking-[0.15em] uppercase text-accent-bright">
              Preview — showing the latest saved draft.{" "}
              <a href="/next/exit-preview" className="underline underline-offset-4">
                Exit preview
              </a>
            </p>
          )}
          <Link
            href="/blog"
            className="font-label text-xs tracking-[0.15em] uppercase text-steel-dim hover:text-accent-bright transition-colors"
          >
            ← All field notes
          </Link>

          <header className="mt-8 mb-12">
            <p className="font-label text-[0.7rem] md:text-xs tracking-[0.3em] uppercase text-accent mb-3">
              Log {post.log}
            </p>
            <h1 className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl leading-[1.15] text-steel">
              {post.title}
            </h1>
            <div className="accent-rule w-20 mt-5 mb-8" />

            <div className="bg-blue blueprint-grid border border-blue-line px-6 py-5 flex flex-col gap-4">
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-display text-xs">
                <div>
                  <dt className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim mb-1">
                    Filed
                  </dt>
                  <dd className="text-paper">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </dd>
                </div>
                <div>
                  <dt className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim mb-1">
                    Read time
                  </dt>
                  <dd className="text-paper">{post.readingMinutes} min</dd>
                </div>
                {post.tags.length > 0 && (
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim mb-1">
                      Tags
                    </dt>
                    <dd className="text-paper">{post.tags.join(" · ")}</dd>
                  </div>
                )}
              </dl>
              <ShareBar url={url} title={post.title} />
            </div>
          </header>

          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <footer className="mt-16 bg-blue blueprint-grid border border-blue-line px-6 py-5">
            <p className="font-label text-sm text-paper mb-4">
              Found this useful? Pass it on.
            </p>
            <ShareBar url={url} title={post.title} />
          </footer>
        </article>
      </main>
      <BackCover />
    </>
  );
}
