import { business } from "@/lib/constants";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-stone-50 p-8">
        <h1 className="font-display text-2xl font-semibold text-center mb-1">
          {business.name}
        </h1>
        <p className="text-sm text-stone-500 text-center mb-6">Admin sign in</p>

        <LoginForm />
      </div>
    </div>
  );
}
