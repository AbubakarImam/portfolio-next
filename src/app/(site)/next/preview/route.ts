import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

// The admin's "Preview" button lands here. Only a signed-in admin can turn on
// draft mode, which makes /blog/<slug> show the latest unpublished draft.
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug || !/^[\w-]+$/.test(slug)) {
    return new Response("Missing or invalid slug", { status: 400 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response("Sign in at /admin to preview drafts", { status: 403 });
  }

  (await draftMode()).enable();
  redirect(`/blog/${slug}`);
}
