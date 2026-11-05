import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Comments } from "./collections/Comments";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { PostViews } from "./collections/PostViews";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// The build reads posts from the database, so fail early with a clear message
// instead of a cryptic MongoParseError when the env vars aren't set.
for (const name of ["DATABASE_URL", "PAYLOAD_SECRET"]) {
  if (!process.env[name]) {
    throw new Error(
      `${name} is not set. Locally, add it to .env.local (see .env.example). ` +
        `On Vercel, add it under Settings → Environment Variables for both ` +
        `Production and Preview, then redeploy: existing deployments don't pick up new variables.`,
    );
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — Field Notes admin" },
    components: { beforeDashboard: ["/components/admin/ViewsDashboard#ViewsDashboard"] },
  },
  collections: [Posts, Comments, PostViews, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: mongooseAdapter({ url: process.env.DATABASE_URL || "" }),
  // Sends comment notifications (and admin password resets). Without a key,
  // Payload logs emails to the console instead.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || "notes@abubakarabdulsalam.com",
        defaultFromName: "Field Notes",
      })
    : undefined,
  sharp,
  plugins: [
    // Vercel's filesystem is read-only, so uploaded images go to Vercel Blob in
    // production. Without a token (local dev) they're saved to ./media instead.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
