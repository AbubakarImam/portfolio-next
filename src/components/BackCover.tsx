import { profile } from "@/lib/content";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./icons";

const socials = [
  { icon: GithubIcon, href: profile.socials.github, label: "GitHub" },
  { icon: LinkedinIcon, href: profile.socials.linkedin, label: "LinkedIn" },
  { icon: TwitterIcon, href: profile.socials.twitter, label: "X / Twitter" },
];

export function BackCover() {
  return (
    <footer className="relative bg-shop-deep border-t border-blue-line pt-14 pb-28">
      <div className="mx-auto w-[90%] max-w-6xl flex flex-col items-center text-center gap-8">
        <a
          href="#cover"
          className="font-display font-bold text-lg uppercase tracking-wide text-steel hover:text-accent-bright transition-colors"
        >
          {profile.name} — Field Manual
        </a>

        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-8 gap-y-2"
        >
          {[
            ["Cover", "#cover"],
            ["Spec", "#spec"],
            ["B.O.M.", "#bom"],
            ["Assemblies", "#assemblies"],
            ["Request", "#request"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-label text-xs tracking-[0.15em] uppercase text-steel-dim hover:text-accent-bright transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-5 h-5 text-steel-dim hover:text-accent-bright transition-colors"
            >
              <s.icon className="w-full h-full" />
            </a>
          ))}
        </div>

        <p className="font-display text-[0.65rem] tracking-[0.15em] uppercase text-steel-dim/70">
          &copy; {new Date().getFullYear()} {profile.name}. Rev. current —
          printed on demand.
        </p>
      </div>
    </footer>
  );
}
