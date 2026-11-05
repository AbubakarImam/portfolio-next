import { getCommentThreads, type PublicReply } from "@/lib/comments";
import { CommentForm } from "./CommentForm";
import { ReplyButton, ThreadReplies } from "./CommentThread";

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

function Comment({
  c,
  postId,
  thread,
  small,
  children,
}: {
  c: PublicReply;
  postId: string;
  thread: string;
  small?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li id={`comment-${c.id}`} className={`flex ${small ? "gap-3" : "gap-4"} scroll-mt-24`}>
      <div
        aria-hidden
        className={`shrink-0 flex items-center justify-center border font-display font-bold text-xs ${
          small ? "w-8 h-8" : "w-10 h-10"
        } ${c.byAuthor ? "bg-accent border-accent text-shop-deep" : "bg-blue border-blue-line text-paper"}`}
      >
        {initials(c.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display font-bold text-sm text-steel">{c.name}</span>
          {c.byAuthor && (
            <span className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-accent">Author</span>
          )}
          <time dateTime={c.date} className="font-label text-xs text-steel-dim">
            {formatWhen(c.date)}
          </time>
        </p>
        {c.replyingTo && (
          <p className="mt-1 font-label text-xs text-steel-dim">↳ replying to {c.replyingTo}</p>
        )}
        <p className="mt-2 text-steel leading-relaxed whitespace-pre-line break-words">{c.body}</p>
        <ReplyButton postId={postId} thread={thread} target={{ ...c.target, name: c.name }} />
        {children}
      </div>
    </li>
  );
}

export async function CommentSection({ postId }: { postId: string }) {
  const threads = await getCommentThreads(postId);
  const total = threads.reduce((n, t) => n + 1 + t.replies.length, 0);

  return (
    <section id="comments" aria-labelledby="comments-heading" className="mt-20 scroll-mt-8">
      <p className="font-label text-[0.7rem] tracking-[0.3em] uppercase text-accent mb-3">
        Discussion · {String(total).padStart(2, "0")}
      </p>
      <h2
        id="comments-heading"
        className="font-display font-bold uppercase tracking-tight text-2xl md:text-3xl text-steel"
      >
        {threads.length ? "Comments" : "Start the discussion"}
      </h2>
      <div className="accent-rule w-16 mt-4 mb-10" />

      {threads.length > 0 && (
        <ol className="flex flex-col gap-10 mb-14">
          {threads.map((t) => {
            const n = t.replies.length;
            const authorReplied = t.replies.some((r) => r.byAuthor);
            return (
              <Comment key={t.id} c={t} postId={postId} thread={t.id}>
                {n > 0 && (
                  <ThreadReplies
                    thread={t.id}
                    summary={`${n} ${n === 1 ? "reply" : "replies"}${authorReplied ? " · author replied" : ""}`}
                  >
                    {t.replies.map((r) => (
                      <Comment key={r.id} c={r} postId={postId} thread={t.id} small />
                    ))}
                  </ThreadReplies>
                )}
              </Comment>
            );
          })}
        </ol>
      )}

      <div className="bg-blue blueprint-grid border border-blue-line px-6 py-6 md:px-8 md:py-8">
        <p className="font-label text-sm text-paper mb-6">
          {threads.length ? "Add to the discussion." : "Questions, pushback or your own experience are all welcome."}
        </p>
        <CommentForm postId={postId} />
      </div>
    </section>
  );
}
