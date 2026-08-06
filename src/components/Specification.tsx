import Image from "next/image";
import { bio, experience, profile } from "@/lib/content";
import { SpecHeader } from "./SpecHeader";

export function Specification() {
  return (
    <section id="spec" className="relative py-24 md:py-32 shop-texture">
      <div className="mx-auto w-[90%] max-w-6xl">
        <SpecHeader sec="Sec. 01" title="Specification" />

        <div className="grid md:grid-cols-[38%_1fr] gap-12 md:gap-16 items-start">
          <div className="relative mx-auto md:mx-0 w-full max-w-sm">
            <div className="border-2 border-blue-line relative">
              <Image
                src="/images/about.png"
                alt={`${profile.name} at work`}
                width={640}
                height={640}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-blue-deep/15 mix-blend-multiply" />
            </div>
            <p className="mt-4 text-center font-display text-[0.65rem] tracking-[0.2em] uppercase text-steel-dim">
              Fig. 1 — Field Study
            </p>
          </div>

          <div>
            <p className="text-steel-dim leading-relaxed text-lg">{bio}</p>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <div className="bg-blue blueprint-grid text-paper px-6 py-5 border border-blue-line">
                <p className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim mb-2">
                  Current Post
                </p>
                <p className="font-display text-lg leading-snug">
                  {experience[0].title}
                </p>
                <p className="font-label text-sm text-paper-dim mt-1">
                  {experience[0].org}
                </p>
              </div>
              <div className="bg-blue blueprint-grid text-paper px-6 py-5 border border-blue-line">
                <p className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim mb-2">
                  Configuration
                </p>
                <p className="font-display text-lg leading-snug">
                  Backend-led, full-stack capable
                </p>
                <p className="font-label text-sm text-paper-dim mt-1">
                  C# · ASP.NET Core · EF Core · Angular/Node.js
                </p>
              </div>
            </div>

            <a
              href="#request"
              className="mt-10 inline-flex items-center gap-2 font-label text-sm tracking-[0.08em]
              uppercase text-accent-bright border-b border-accent-bright pb-0.5 hover:text-steel hover:border-steel transition-colors"
            >
              File a service request
            </a>
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-accent mb-6">
            Service Record
          </p>
          <div className="grid gap-6">
            {experience.map((role) => (
              <article
                key={`${role.title}-${role.org}`}
                className="bg-blue blueprint-grid border border-blue-line p-6 md:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
                  <h3 className="font-display font-bold text-lg md:text-xl text-paper uppercase tracking-tight">
                    {role.title}
                    <span className="font-label font-normal normal-case text-paper-dim">
                      {" "}
                      — {role.org}
                    </span>
                  </h3>
                  <span className="font-display text-[0.7rem] text-accent-bright shrink-0">
                    {role.period}
                  </span>
                </div>
                <p className="font-label text-xs text-paper-dim mb-4">
                  {role.location}
                  {role.note ? ` · ${role.note}` : ""}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {role.highlights.map((h) => (
                    <li
                      key={h}
                      className="font-label text-sm text-paper flex gap-2"
                    >
                      <span className="text-accent-bright shrink-0">—</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
