import Image from "next/image";
import { assemblies } from "@/lib/content";
import { SpecHeader } from "./SpecHeader";
import { LayerStack } from "./LayerStack";
import { ArrowIcon, GithubIcon } from "./icons";

const systems = assemblies.filter((a) => a.category === "Systems");
const frontend = assemblies.filter((a) => a.category === "Frontend");

export function Assemblies() {
  return (
    <section id="assemblies" className="relative py-24 md:py-32 shop-texture">
      <div className="mx-auto w-[90%] max-w-6xl">
        <SpecHeader sec="Sec. 03" title="Assemblies" />

        <p className="font-label text-xs tracking-[0.25em] uppercase text-accent mb-6">
          Systems Assemblies — Backend
        </p>
        <div className="grid gap-6 mb-20">
          {systems.map((a) => (
            <article
              key={a.id}
              className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 bg-blue blueprint-grid border border-blue-line p-6 md:p-8"
            >
              <div className="hidden md:block">
                <LayerStack layers={a.layers ?? []} />
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-xs text-accent-bright">
                      {a.asm}
                    </span>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-paper uppercase tracking-tight">
                      {a.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.featured && (
                      <span className="stamp font-display text-[0.6rem] uppercase tracking-widest border border-accent-bright bg-accent-bright/10 text-accent-bright px-2 py-0.5">
                        Flagship
                      </span>
                    )}
                    <span className="stamp font-display text-[0.6rem] uppercase tracking-widest border border-accent text-accent-bright px-2 py-0.5">
                      {a.status}
                    </span>
                  </div>
                </div>

                <p className="font-label text-sm text-paper-dim mb-4">
                  {a.stack}
                </p>

                <div className="md:hidden mb-4">
                  <LayerStack layers={a.layers ?? []} />
                </div>

                <ul className="flex flex-col gap-1.5 mb-5">
                  {a.highlights?.map((h) => (
                    <li
                      key={h}
                      className="font-label text-sm text-paper flex gap-2"
                    >
                      <span className="text-accent-bright shrink-0">—</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-5">
                  {a.demo && (
                    <a
                      href={a.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-label text-xs tracking-[0.08em] uppercase
                      text-paper hover:text-accent-bright transition-colors"
                    >
                      <ArrowIcon className="w-4 h-4" />
                      View live
                    </a>
                  )}
                  <a
                    href={a.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-label text-xs tracking-[0.08em] uppercase
                    text-paper hover:text-accent-bright transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    View source · {a.year}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="font-label text-xs tracking-[0.25em] uppercase text-accent mb-6">
          Frontend Assemblies
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {frontend.map((a) => (
            <article key={a.id} className="group flex flex-col">
              <div className="relative border-2 border-blue-line overflow-hidden">
                {a.image && (
                  <Image
                    src={a.image}
                    alt={a.title}
                    width={640}
                    height={480}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
                <span className="stamp absolute top-2 right-2 font-display text-[0.55rem] uppercase tracking-widest
                bg-shop-deep/85 border border-accent text-accent-bright px-2 py-0.5">
                  {a.status}
                </span>
              </div>

              <div className="bg-blue blueprint-grid text-paper mt-0 px-5 py-4 border border-t-0 border-blue-line">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-[0.65rem] text-accent-bright">
                    {a.asm}
                  </p>
                  <p className="font-display text-[0.6rem] text-paper-dim">
                    {a.year}
                  </p>
                </div>
                <h3 className="font-display font-bold text-lg mt-1.5 uppercase tracking-tight leading-snug">
                  {a.title}
                </h3>
                <p className="font-label text-xs text-paper-dim mt-1 leading-relaxed">
                  {a.stack}
                </p>

                <div className="mt-4 flex items-center gap-4 pt-3 border-t border-blue-line">
                  <a
                    href={a.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-label text-xs tracking-[0.05em] uppercase
                    text-paper hover:text-accent-bright transition-colors"
                  >
                    View
                    <ArrowIcon className="w-3 h-3" />
                  </a>
                  <a
                    href={a.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-label text-xs tracking-[0.05em] uppercase
                    text-paper-dim hover:text-accent-bright transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    Source
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
