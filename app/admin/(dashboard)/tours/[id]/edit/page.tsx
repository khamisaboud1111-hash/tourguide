import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TourForm from "@/components/admin/TourForm";
import { updateTour } from "@/app/actions/tours";
import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = getLang();
  const supabase = await createClient();
  const { data: tour } = await supabase.from("tours").select("*").eq("id", id).single();

  if (!tour) notFound();

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6">
        <ArrowLeft size={15} /> {tServer("adminBackToTours", lang)}
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminEditTour", lang)}</h1>
      <TourForm action={updateTour.bind(null, id)} tour={tour} />
    </div>
  );
}
