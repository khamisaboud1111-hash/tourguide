import Image from "next/image";
import Link from "next/link";
import { business } from "@/lib/constants";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white/70 shadow-card p-8 text-center">
        <Link href="/" aria-label={`${business.name} — home`} className="inline-flex justify-center">
          <Image
            src="/sitmeir-logo-md.png"
            alt={business.name}
            width={180}
            height={120}
            priority
            className="h-auto w-auto mx-auto"
            style={{ maxWidth: "220px" }}
          />
        </Link>
        <h1 className="font-display text-xl font-semibold text-center mt-5 mb-1">
          {business.name}
        </h1>
        <p className="text-sm text-stone-500 text-center mb-6">Admin sign in</p>

        <LoginForm />
      </div>
    </div>
  );
}
