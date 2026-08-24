export default function ToursLoading() {
  return (
    <div className="container-page py-10">
      <div className="h-4 w-28 bg-stone-200 rounded-full animate-pulse" />
      <div className="h-10 w-72 bg-stone-200 rounded-xl mt-3 animate-pulse" />
      <div className="mt-8 rounded-2xl bg-white border border-stone-200 p-5 animate-pulse">
        <div className="h-12 bg-stone-100 rounded-xl" />
      </div>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white border border-stone-200 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-stone-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-stone-200 rounded" />
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-2/3 bg-stone-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
