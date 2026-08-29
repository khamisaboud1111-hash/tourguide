import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TourForm from "@/components/admin/TourForm";
import { createTour } from "@/app/actions/tours";
import { getLang, tServer } from "@/lib/i18n/server";

export default function NewTourPage() {
  const lang = getLang();
  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6">
        <ArrowLeft size={15} /> {tServer("adminBackToTours", lang)}
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminAddATour", lang)}</h1>
      <TourForm action={createTour} />
    </div>
  );
}
