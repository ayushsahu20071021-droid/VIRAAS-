export function QueueNote({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-ink/20 bg-white/60 p-10 text-center">
      <p className="font-display text-xl">Production imagery in queue</p>
      <p className="mt-2 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
