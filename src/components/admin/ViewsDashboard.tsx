import type { Payload } from "payload";
import { VIEW_SOURCES, type ViewSource } from "../../collections/PostViews";
import { dayKey } from "../../lib/views";

const SOURCE_LABELS: Record<ViewSource, string> = {
  direct: "Direct / apps",
  x: "X",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  facebook: "Facebook / Instagram",
  search: "Search",
  site: "This site",
  other: "Other sites",
};

type Row = {
  id: string;
  title: string;
  slug: string;
  today: number;
  week: number;
  month: number;
  total: number;
  daily: number[];
  sources: Partial<Record<ViewSource, number>>;
};

const n = (v: number) => v.toLocaleString("en-GB");

const cell: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--theme-elevation-100)",
  textAlign: "right",
  whiteSpace: "nowrap",
};

/** 30 bars, one per day, oldest first. */
function Spark({ daily }: { daily: number[] }) {
  const max = Math.max(1, ...daily);
  return (
    <svg width={120} height={24} viewBox="0 0 120 24" role="img" aria-label="Views per day, last 30 days">
      {daily.map((v, i) => {
        const h = v ? Math.max(2, (v / max) * 24) : 1;
        return (
          <rect
            key={i}
            x={i * 4}
            y={24 - h}
            width={3}
            height={h}
            fill={v ? "#d9622c" : "var(--theme-elevation-150)"}
          />
        );
      })}
    </svg>
  );
}

/**
 * Article views on the admin dashboard: totals, a row per post with a 30-day
 * trend, and where readers came from. Counted by the post page (ViewTracker).
 */
export async function ViewsDashboard({ payload }: { payload: Payload }) {
  const days = Array.from({ length: 30 }, (_, i) => dayKey(29 - i));
  const [today, weekStart, monthStart] = [days[29], days[23], days[0]];

  const model = payload.db.collections["post-views"];
  const [allTime, recent, posts] = await Promise.all([
    model.aggregate<{ _id: unknown; total: number }>([{ $group: { _id: "$post", total: { $sum: "$views" } } }]),
    model.find({ day: { $gte: monthStart } }).lean<{ post: unknown; day: string; views: number; sources?: Record<string, number> }[]>(),
    payload.find({
      collection: "posts",
      pagination: false,
      depth: 0,
      select: { title: true, slug: true },
      where: { _status: { equals: "published" } },
    }),
  ]);

  const rows = new Map<string, Row>(
    posts.docs.map((p) => [
      String(p.id),
      { id: String(p.id), title: p.title, slug: p.slug ?? "", today: 0, week: 0, month: 0, total: 0, daily: days.map(() => 0), sources: {} },
    ]),
  );
  for (const a of allTime) {
    const r = rows.get(String(a._id));
    if (r) r.total = a.total;
  }
  const sourceTotals: Partial<Record<ViewSource, number>> = {};
  for (const v of recent) {
    const r = rows.get(String(v.post));
    if (!r) continue;
    r.month += v.views;
    if (v.day >= weekStart) r.week += v.views;
    if (v.day === today) r.today += v.views;
    const i = days.indexOf(v.day);
    if (i >= 0) r.daily[i] += v.views;
    for (const s of VIEW_SOURCES) {
      const c = v.sources?.[s] ?? 0;
      if (!c) continue;
      r.sources[s] = (r.sources[s] ?? 0) + c;
      sourceTotals[s] = (sourceTotals[s] ?? 0) + c;
    }
  }

  const list = [...rows.values()].sort((a, b) => b.month - a.month || b.total - a.total);
  const sum = (k: "today" | "week" | "month" | "total") => list.reduce((t, r) => t + r[k], 0);
  const topSource = (s: Row["sources"]) => {
    const best = VIEW_SOURCES.filter((k) => s[k]).sort((a, b) => (s[b] ?? 0) - (s[a] ?? 0))[0];
    return best ? SOURCE_LABELS[best] : "—";
  };
  const monthTotal = sum("month");
  const sources = VIEW_SOURCES.filter((s) => sourceTotals[s]).sort((a, b) => (sourceTotals[b] ?? 0) - (sourceTotals[a] ?? 0));

  return (
    <section style={{ marginBottom: "calc(var(--base) * 2)" }}>
      <h2 style={{ marginBottom: 4 }}>Article views</h2>
      <p style={{ color: "var(--theme-elevation-500)", marginBottom: 16 }}>
        A view is one browser session opening a post. Your own visits while signed in aren&apos;t counted.
        Days run on Lagos time.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        {(
          [
            ["Today", sum("today")],
            ["Last 7 days", sum("week")],
            ["Last 30 days", monthTotal],
            ["All time", sum("total")],
          ] as const
        ).map(([label, value]) => (
          <div key={label} style={{ border: "1px solid var(--theme-elevation-150)", padding: "12px 16px" }}>
            <div style={{ fontSize: 12, color: "var(--theme-elevation-500)" }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{n(value)}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: "var(--theme-elevation-500)" }}>
              <th style={{ ...cell, textAlign: "left" }}>Article</th>
              <th style={{ ...cell, textAlign: "left" }}>Last 30 days</th>
              <th style={cell}>Today</th>
              <th style={cell}>7 days</th>
              <th style={cell}>30 days</th>
              <th style={cell}>All time</th>
              <th style={{ ...cell, textAlign: "left" }}>Top source (30 days)</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td style={{ ...cell, textAlign: "left", whiteSpace: "normal", minWidth: 220 }}>
                  <a href={`/admin/collections/posts/${r.id}`}>{r.title}</a>{" "}
                  <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer" style={{ color: "var(--theme-elevation-500)" }}>
                    ↗
                  </a>
                </td>
                <td style={{ ...cell, textAlign: "left" }}>
                  <Spark daily={r.daily} />
                </td>
                <td style={cell}>{n(r.today)}</td>
                <td style={cell}>{n(r.week)}</td>
                <td style={cell}>{n(r.month)}</td>
                <td style={{ ...cell, fontWeight: 600 }}>{n(r.total)}</td>
                <td style={{ ...cell, textAlign: "left" }}>{topSource(r.sources)}</td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={7} style={{ ...cell, textAlign: "left" }}>No published posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sources.length > 0 && (
        <>
          <h3 style={{ marginBottom: 8 }}>Where readers came from (30 days)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 520 }}>
            {sources.map((s) => {
              const c = sourceTotals[s] ?? 0;
              return (
                <div key={s} style={{ display: "grid", gridTemplateColumns: "150px 1fr 60px", alignItems: "center", gap: 10, fontSize: 14 }}>
                  <span>{SOURCE_LABELS[s]}</span>
                  <span style={{ background: "var(--theme-elevation-100)", height: 8 }}>
                    <span style={{ display: "block", height: 8, width: `${(c / monthTotal) * 100}%`, background: "#d9622c" }} />
                  </span>
                  <span style={{ textAlign: "right" }}>{n(c)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
