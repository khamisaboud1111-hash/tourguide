export default function Loading() {
  return (
    <div className="container-page py-16 animate-pulse">
      <div className="h-6 w-24 bg-stone-200 rounded-full" />
      <div className="h-10 w-64 bg-stone-200 rounded-xl mt-4" />
      <div className="h-4 w-96 bg-stone-200 rounded mt-4" />
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <div className="h-64 bg-stone-200 rounded-2xl" />
        <div className="h-64 bg-stone-200 rounded-2xl" />
        <div className="h-64 bg-stone-200 rounded-2xl" />
      </div>
    </div>
  );
}
