import type { Payload } from "payload";

/** A banner on the admin dashboard when readers' private messages are waiting. */
export async function NewMessages({ payload }: { payload: Payload }) {
  const { totalDocs } = await payload.count({
    collection: "messages",
    overrideAccess: true,
    where: { status: { equals: "new" } },
  });
  if (!totalDocs) return null;
  const href = "/admin/collections/messages?where[status][equals]=new";
  return (
    <a
      href={href}
      style={{
        display: "block",
        marginBottom: "calc(var(--base) * 1.5)",
        padding: "12px 16px",
        border: "1px solid #d9622c",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <strong>
        {totalDocs} new private {totalDocs === 1 ? "message" : "messages"}
      </strong>{" "}
      from readers. Open {totalDocs === 1 ? "it" : "them"} →
    </a>
  );
}
