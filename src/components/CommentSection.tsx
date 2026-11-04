import { profile } from "@/lib/content";
import { getApprovedComments } from "@/lib/comments";
import { CommentForm } from "./CommentForm";

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export async function CommentSection({ postId }: { postId: string }) {
  const comments = await getApprovedComments(postId);

  return (
    <section id="comments" aria-labelledby="comments-heading" className="mt-20 scroll-mt-8">
      <p className="font-label text-[0.7rem] tracking-[0.3em] uppercase text-accent mb-3">
        Discussion · {String(comments.length).padStart(2, "0")}
      </p>
      <h2
        id="comments-heading"
        className="font-display font-bold uppercase tracking-tight text-2xl md:text-3xl text-steel"
      >
        {comments.length ? "Comments" : "Start the discussion"}
      </h2>
      <div className="accent-rule w-16 mt-4 mb-10" />

      {comments.length > 0 && (
        <ol className="flex flex-col gap-8 mb-14">
          {comments.map((c) => (
            <li key={c.id} id={`comment-${c.id}`} className="flex gap-4">
              <div
                aria-hidden
                className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue border border-blue-line
                font-display text-xs font-bold text-paper"
              >
                {initials(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display font-bold text-sm text-steel">{c.name}</span>
                  <time dateTime={c.date} className="font-label text-xs text-steel-dim">
                    {formatWhen(c.date)}
                  </time>
                </p>
                <p className="mt-2 text-steel leading-relaxed whitespace-pre-line break-words">{c.body}</p>

                {c.reply && (
                  <div className="mt-4 border-l-2 border-accent bg-shop-deep px-4 py-3">
                    <p className="flex items-baseline gap-3">
                      <span className="font-display font-bold text-sm text-steel">{profile.name}</span>
                      <span className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-accent">
                        Author
                      </span>
                    </p>
                    <p className="mt-2 text-steel leading-relaxed whitespace-pre-line break-words">{c.reply}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="bg-blue blueprint-grid border border-blue-line px-6 py-6 md:px-8 md:py-8">
        <p className="font-label text-sm text-paper mb-6">
          {comments.length ? "Add to the discussion." : "Questions, pushback or your own experience are all welcome."}
        </p>
        <CommentForm postId={postId} />
      </div>
    </section>
  );
}
