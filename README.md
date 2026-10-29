This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Blog (Payload CMS + MongoDB)

Posts are written in an admin panel at `/admin`, stored in MongoDB, and shown at `/blog`.
The panel is [Payload CMS](https://payloadcms.com), running inside this Next.js app.

### Writing and sharing a post

1. Go to `https://www.abubakarabdulsalam.com/admin` and sign in.
2. **Posts → Create New.** Fill in the title, a short description (it becomes the preview
   text on X, LinkedIn and WhatsApp) and the content. Use the `+` / `/` menu for headings,
   lists, quotes, tables, images and **Code** blocks (pick the language for highlighting).
3. **Save Draft** keeps it private. **Preview** shows exactly how it will look on the site.
4. **Publish changes** puts it live within a few seconds. No redeploy needed. You can also
   schedule publishing for a later date.
5. Open the post on the site and use its **Share** buttons (X, LinkedIn, WhatsApp, Copy link).
   Each post gets its own preview card image, generated from its title.

The slug (the `/blog/<slug>` part of the link) is filled in from the title. Don't change it after
sharing a post, or old links will break. To take a post down, open it and choose **Unpublish**.

Readers can follow along at `/blog/rss.xml`; `/sitemap.xml` lists every post for search engines.
LinkedIn and X cache link previews; if you change a title after sharing, refresh LinkedIn's with
its [Post Inspector](https://www.linkedin.com/post-inspector/).

### One-time production setup

1. **MongoDB Atlas (free):** at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
   create a free **M0** cluster. Under *Database Access* add a database user; under
   *Network Access* allow `0.0.0.0/0` (Vercel has no fixed IPs). Click **Connect → Drivers** and
   copy the connection string, adding a database name before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`
2. **Vercel Blob (free) for images:** in the Vercel project, *Storage → Create → Blob*, and
   connect it to this project. That adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Environment variables** (Vercel → Settings → Environment Variables, all environments):
   - `DATABASE_URL`: the Atlas string from step 1
   - `PAYLOAD_SECRET`: a long random string (`openssl rand -hex 32`)
4. **Node version:** Vercel → Settings → General → Node.js Version → **22.x** (or 24.x).
5. **Create your admin account:** add `ALLOW_FIRST_ADMIN` = `true`, deploy, open `/admin` and
   create your account. Then **delete `ALLOW_FIRST_ADMIN` and redeploy**. While it's unset,
   nobody can create an account without already being signed in, so a stranger can't claim
   the admin first. (To add a second admin later, sign in and use *Users → Create New*.)

### Security

- Writing, editing, publishing and uploading all require a signed-in admin. The public can only
  read published posts and images; drafts and the Preview link need a login.
- Account creation is locked as described in step 5. Payload locks an account for 10 minutes
  after 5 wrong passwords. There's no two-factor login, so use a strong, unique password.
- Keep `PAYLOAD_SECRET` and `DATABASE_URL` only in Vercel's environment variables. The secret
  signs logins; the Atlas database user's password is the only thing protecting the data, since
  Atlas must accept connections from anywhere for Vercel.

### Running it locally

Needs Node 22.23+ (`node -v`; upgrade with `brew install node@22` or from nodejs.org) and Docker.

```bash
cp .env.example .env.local   # then set PAYLOAD_SECRET (ALLOW_FIRST_ADMIN=true is fine locally)
docker compose up -d         # local MongoDB
npm install
npm run dev                  # site on :3000, admin on :3000/admin
```

Local image uploads are saved to `./media` (git-ignored). After changing a collection in
`src/collections/`, run `npm run generate:types` (and `npm run generate:importmap` if you add
admin components).
