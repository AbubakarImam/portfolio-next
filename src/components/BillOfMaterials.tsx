import { materials, type Material } from "@/lib/content";
import { SpecHeader } from "./SpecHeader";

const bins: Material["bin"][] = ["Frontend", "Backend", "Tooling"];

export function BillOfMaterials() {
  return (
    <section id="bom" className="relative py-24 md:py-32 shop-texture">
      <div className="mx-auto w-[90%] max-w-6xl">
        <SpecHeader sec="Sec. 02" title="Bill of Materials" />

        <div className="grid md:grid-cols-3 gap-8">
          {bins.map((bin) => (
            <div
              key={bin}
              className="bg-blue blueprint-grid border border-blue-line px-6 py-6"
            >
              <p className="font-label text-[0.65rem] tracking-[0.25em] uppercase text-accent-bright mb-5 pb-3 border-b border-blue-line">
                Bin — {bin}
              </p>
              <ul className="flex flex-col gap-3">
                {materials
                  .filter((m) => m.bin === bin)
                  .map((m) => (
                    <li
                      key={m.part}
                      className="flex items-baseline justify-between gap-3 font-label text-paper"
                    >
                      <span className="text-base">{m.name}</span>
                      <span className="font-display text-[0.7rem] text-paper-dim shrink-0">
                        {m.part}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
