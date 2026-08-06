export function SpecHeader({ sec, title }: { sec: string; title: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="font-label text-[0.7rem] md:text-xs tracking-[0.3em] uppercase text-accent mb-3">
        {sec}
      </p>
      <h2 className="font-label font-extrabold uppercase tracking-tight text-3xl md:text-5xl text-steel">
        {title}
      </h2>
      <div className="accent-rule w-20 mt-5" />
    </div>
  );
}
