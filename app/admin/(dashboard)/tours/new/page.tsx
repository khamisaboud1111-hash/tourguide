import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TourForm from "@/components/admin/TourForm";
import { createTour } from "@/app/actions/tours";

export default function NewTourPage() {
  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6">
        <ArrowLeft size={15} /> Back to tours
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-6">Add a tour</h1>
      <TourForm action={createTour} />
    </div>
  );
}
