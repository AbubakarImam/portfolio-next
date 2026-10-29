import type { Metadata } from "next";
import { Courier_Prime, Archivo } from "next/font/google";
import { profile, siteUrl } from "@/lib/content";
import "./globals.css";

const stamp = Courier_Prime({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const label = Archivo({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: { siteName: profile.name, locale: "en_GB" },
  twitter: { site: profile.socials.twitterHandle },
  title: "Abubakar Imam Abdulsalam — Full-Stack Field Manual",
  description:
    "A full-stack developer's build manual: shipped frontend and backend systems by Abubakar Imam Abdulsalam — React, Next.js, Angular, NestJS, .NET, and Node.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${stamp.variable} ${label.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-shop text-steel antialiased">
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{
            __html: `<!--
          THESIS: This is a field manual for an assembled system, not a
          resume page -- every claimed part ships with its spec, not just
          its name.
          OWN-WORLD: Dark graphite shop floor lit by a single work lamp,
          hung with cyanotype-blue spec plates on a faint graph-paper grid,
          Courier Prime typewriter stamps for part numbers and specs,
          Archivo condensed caps for section headers, safety-orange ink for
          stamps and active state.
          STORY: Visitor opens the cover sheet (hero), reads the
          specification (about), scans the bill of materials (skills by
          bin: Frontend/Backend/Tooling), pages through the assemblies
          (13 shipped builds -- 4 backend systems with real specs, led by
          GARBATI (flagship, live demo), plus 9 frontend builds with
          screenshots), and files a service request (contact).
          FIRST VIEWPORT: Dark shop floor, name stamped in large monospace
          type left-of-center, a spec plate below giving role + CTA pair,
          a framed ID-style portrait right, table of contents tab strip
          at the edge.
          FORM: Parts Catalog / Shop Manual, re-rolled from gallery-exhibition
          on named grounds (audience read it as a fine-art portfolio, not a
          developer's), candidate 1/7 of the original grounded list, seed
          8398ef0a.
          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, and DESIGN.md.
        -->`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
