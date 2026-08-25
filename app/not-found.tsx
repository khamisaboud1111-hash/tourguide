import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display italic text-7xl text-saffron-500">404</p>
        <h1 className="font-display text-3xl font-semibold text-stone-900 mt-2">This page drifted out to sea</h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist — but your Zanzibar trip still can.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 text-sm font-medium hover:bg-clove-700 transition-colors shadow-soft"
          >
            Explore experiences
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
