import Image from "next/image";
import { profile } from "@/lib/content";
import { PlaqueArrow } from "./icons";

export function CoverSheet() {
  return (
    <header
      id="cover"
      className="relative min-h-[100svh] flex flex-col justify-center shop-texture overflow-hidden"
    >
      <div className="relative mx-auto w-[90%] max-w-6xl py-28 md:py-0">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-display text-xs text-accent tracking-widest">
            DOC. FSD-001
          </span>
          <span className="w-1 h-1 bg-blue-line" />
          <p className="font-label text-xs tracking-[0.3em] uppercase text-accent">
            Cover Sheet
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          <div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.15] text-steel uppercase tracking-tight">
              {profile.name}
            </h1>
            <div className="accent-rule w-28 my-6" />
            <p className="font-label text-lg md:text-xl text-accent-bright tracking-wide font-semibold">
              {profile.role}
            </p>
            <p className="mt-6 max-w-md text-steel-dim leading-relaxed">
              {profile.tagline}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#assemblies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-shop-deep
                font-label font-bold text-sm tracking-[0.08em] uppercase hover:bg-accent-bright transition-colors"
              >
                View Assemblies
                <PlaqueArrow className="w-3.5 h-3.5 -rotate-90" />
              </a>
              <a
                href="#request"
                className="inline-flex items-center gap-2 px-6 py-3 border border-blue-line
                text-steel font-label text-sm tracking-[0.08em] uppercase hover:border-accent hover:text-accent-bright transition-colors"
              >
                Service Request
              </a>
              <a
                href={profile.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label text-sm tracking-[0.05em] text-steel-dim underline decoration-blue-line
                underline-offset-4 hover:text-accent-bright hover:decoration-accent-bright transition-colors"
              >
                Download résumé
              </a>
            </div>
          </div>

          <div className="relative mx-auto md:mx-0 w-56 sm:w-64 md:w-72">
            <div className="blueprint-grid absolute -inset-3 border border-blue-line bg-blue-deep/60" />
            <div className="relative border-2 border-blue-line">
              <Image
                src="/images/avatar.jpg"
                alt={profile.name}
                width={480}
                height={600}
                priority
                className="w-full h-auto object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-blue-deep/25 mix-blend-multiply" />
            </div>
            <p className="mt-4 text-center font-display text-[0.65rem] tracking-[0.2em] uppercase text-steel-dim">
              Fig. 0 — Subject Photo
            </p>
          </div>
        </div>

        <div className="mt-16 md:mt-24 bg-blue blueprint-grid border border-blue-line px-6 py-5 max-w-xl">
          <p className="font-label text-[0.6rem] tracking-[0.25em] uppercase text-paper-dim mb-3">
            Specifications
          </p>
          <div className="grid grid-cols-3 gap-4 font-display text-sm text-paper">
            <div>
              <p className="text-paper-dim text-[0.65rem] uppercase mb-1">
                Model
              </p>
              Full-Stack
            </div>
            <div>
              <p className="text-paper-dim text-[0.65rem] uppercase mb-1">
                Base
              </p>
              Nigeria
            </div>
            <div>
              <p className="text-paper-dim text-[0.65rem] uppercase mb-1">
                Status
              </p>
              Available
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
