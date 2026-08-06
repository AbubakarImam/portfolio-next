export function LayerStack({ layers }: { layers: string[] }) {
  return (
    <div className="flex flex-col gap-1.5" aria-hidden>
      {layers.map((layer, i) => (
        <div
          key={layer}
          className="border border-blue-line bg-shop-deep/40 px-3 py-1.5 font-display text-[0.65rem] text-paper-dim tracking-wide"
          style={{ marginLeft: `${i * 10}px` }}
        >
          {layer}
        </div>
      ))}
    </div>
  );
}
