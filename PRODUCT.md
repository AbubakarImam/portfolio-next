# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript, Tailwind CSS v4). Explicit user request: migrate off Create React App to Next.js. Project already scaffolded at repo root via `create-next-app`.

## Users

Two audiences, weighted evenly:
- Recruiters and hiring managers assessing Abubakar Imam Abdulsalam for full-time or contract developer roles.
- Businesses/individuals evaluating him directly for freelance project work.

Both arrive to answer the same question fast: can this person build what I need, and what has he actually shipped.

## Product Purpose

A personal portfolio that proves full-stack development capability through real, linked, working projects (not claims), and gives visitors a low-friction way to reach out — whether that's an application, an interview, or a freelance inquiry.

## Positioning

Backend software engineer, full-stack capable: C#/ASP.NET Core/Entity Framework in production at a live bank (Sterling Bank, on the MIZAN and SEABASS core banking platforms), NestJS/.NET Clean Architecture in personal systems work, React/Next.js/Angular on the frontend when needed, shipped via Git/GitHub/Docker/Netlify/Vercel. The differentiator is real backend depth under regulatory constraints — transaction-critical financial APIs, BPM integration — paired with genuine full-stack range, evidenced by a real employment history plus twelve shipped, linked projects rather than a skills checklist alone.

## Operating Context

Single-page-feeling marketing/portfolio site (one scrollable route, anchor navigation). Visited cold, usually from a resume, LinkedIn profile, or GitHub bio link — must establish credibility within the first viewport. Primary actions: skim projects, open a live demo or repo, download résumé, or make contact (email / WhatsApp / X / form).

## Capabilities and Constraints

- Contact form must actually deliver messages: reuses the existing EmailJS integration (same service/template/public key currently live in the CRA app's `Contact.jsx`) rather than standing up a new backend.
- Résumé downloads from a Google Drive direct-download link (`drive.google.com/uc?export=download&id=...`), not the bundled static PDF — the user's chosen canonical source, kept up to date on Drive rather than requiring a redeploy to update.
- Portfolio content (projects, skills, bio) is source-controlled data, hand-edited in `src/lib/content.ts`.
- Blog posts ("Field Notes", `/blog`) are the one exception: written in a Payload CMS admin at `/admin`, stored in MongoDB Atlas (free tier), images on Vercel Blob. The user chose a CMS + database over Markdown-in-repo so posts can be written and published from the browser and shared to social media immediately (2026-10-23).
- Real project screenshots and photos already exist as assets and must be reused, not regenerated/faked.
- Nine real frontend projects, each with a working GitHub link and/or live demo link — three demo links currently point to `https://github.com` as a placeholder (ImamFits, Koya App, Moviebox App) because the original author never filled them in; preserve as-is rather than inventing repos.
- Three real backend/systems projects (verified by reading each repo's own README, not inferred from its name): a NestJS/gRPC/RabbitMQ Paystack payment microservice with a documented security checklist (`github.com/AbubakarImam/payment`); a .NET 8 Clean-Architecture rental-marketplace API, "SpaceRent" (`github.com/AbubakarImam/ChangdiKiraya`); a React/Express/TypeScript book marketplace with session auth, "BookBazaar" (`github.com/AbubakarImam/bookStore`). None have a public live demo (local Docker/Postgres dependencies) — link to source only, never a fabricated demo URL.
- Two other candidate repos were checked and deliberately excluded: `PayStackDotNetSDK` is a fork/derivative of another author's SDK (README credits "Olorunfemi Davis" as author), and `Mini-Task-Manager-API` has no README/documentable content — including either would misrepresent authorship or substance.

## Brand Commitments

- Name: Abubakar Imam Abdulsalam. Footer signs off as "{name} — Field Manual" (see `BackCover.tsx`); no separate condensed wordmark is used.
- Real, existing social handles/profiles to preserve exactly:
  - GitHub: https://github.com/AbubakarImam
  - LinkedIn: https://linkedin.com/in/abdulsalam-abubakar-imam-a71273200
  - X/Twitter: https://twitter.com/Abubakar_Imam1 (@abubakarImam1)
  - WhatsApp: https://wa.me/+2347061069417
  - Email: salamabubakarimam@gmail.com

## Evidence on Hand

- Bio and role framing (rewritten from the user's actual CV, 2026-08-06): now "Backend Software Engineer" first, full-stack second — matches the CV's own title ("Backend Software Engineer | C# .NET") rather than the earlier frontend-led framing.
- Full employment history, from the CV, verbatim facts (not invented): Software Engineer @ Sterling Bank (Nov 2024–present, modifying MIZAN/SEABASS core banking APIs in C#/ASP.NET/EF, integrating with the KUSALA BPM platform); Customer Service Officer @ Ecobank Nigeria (Jan–Nov 2024); Software Engineer Intern @ Platr (Jul–Nov 2023, Angular/Node.js task-management tool). Rendered as a three-entry "Service Record" in `Specification.tsx`, sourced from `experience: Role[]` in `content.ts`.
- Education (Biology, Gombe State University) and certifications (Google IT Support, C#/.NET courses, McKinsey Forward Program) are known from the CV but not yet surfaced on the site — folded into the bio as one line about the non-linear path in, not built as a dedicated section.
- Skills (12): HTML, CSS, JavaScript, React, Angular, Git, GitHub, Tailwind CSS, Node.js, Figma, Netlify, Firebase.
- Projects (9, each with title + image + GitHub link + demo link): Interno, Shoe Landing Page, City Tour, Travel Agency, ImamFits, Portfolio, Restaurant Menu, Koya App, Moviebox App.
- Real photo assets: profile/avatar photo, a separate "about" photo — copied into `public/images/`.
- Real project screenshots (9) — copied into `public/images/projects/`.
- Résumé PDF — bundled copy sits unused in `public/resume/` (kept as a fallback); the live "Download résumé" link points to Google Drive instead.
- No testimonials, case studies, press, or metrics exist; none should be fabricated.

## Product Principles

1. Shipped work is the pitch — every project claim links to a live demo and/or repo; nothing is asserted without evidence.
2. Full-stack breadth, real backend depth — backend systems (gRPC, message queues, Clean Architecture, security/observability practices) are given equal or greater weight than polished frontend UI, not buried under it.
3. One page, one story — a cold visitor (recruiter or client) must get who/what/proof/contact without hunting; anchor navigation, not a multi-page maze.
4. Contact should never gatekeep — direct channels (email, WhatsApp, X) sit next to the form; no single point of failure to reach him.
5. Real content only — no invented metrics, testimonials, filler case studies, or claimed authorship of forked/derivative work.
6. The visual world must read as a software engineer's work on first viewport, to a technical audience — confirmed by direct user testing, not assumed from genre convention (see Design Correction below).

## Design Correction

An initial redesign direction (museum/gallery — framed "exhibits," a "guestbook," serif wall-labels) was built, tested with the actual user, and rejected: it read as a visual artist's portfolio, not a software developer's, undermining Product Principle 6 for the primary audience. It was replaced with a parts-catalog/shop-manual direction (see DESIGN.md) on named grounds, not taste. Any future redesign of this surface should treat "does this read as engineering to a recruiter within one viewport" as a hard gate, ideally verified with the user before full build-out.
