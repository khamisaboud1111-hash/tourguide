import { signIn } from "@/app/actions/auth";
import { business } from "@/lib/constants";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-stone-50 p-8">
        <h1 className="font-display text-2xl font-semibold text-center mb-1">
          {business.name}
        </h1>
        <p className="text-sm text-stone-500 text-center mb-6">Admin sign in</p>

        {error && (
          <p className="mb-4 rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3">
            {error}
          </p>
        )}

        <form action={signIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-lagoon-600 hover:bg-lagoon-700 transition-colors text-stone-50 px-6 py-3 font-medium"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
