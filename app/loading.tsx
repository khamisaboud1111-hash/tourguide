export default function Loading() {
  return (
    <div className="container-page py-24 flex flex-col items-center justify-center gap-6" aria-busy="true" role="status" aria-label="Loading">
      <div className="spinner" aria-hidden="true">
        <div /><div /><div /><div /><div />
        <div /><div /><div /><div /><div />
      </div>
      <p className="text-sm text-stone-500">Loading…</p>
    </div>
  );
}
