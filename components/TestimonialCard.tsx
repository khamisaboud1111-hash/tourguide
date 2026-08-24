import { Star } from "lucide-react";

export type Testimonial = {
  quote: string;
  name: string;
  origin: string;
  tour: string;
};

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="rounded-2xl bg-stone-50 border border-stone-200 p-6">
      <div className="flex gap-0.5 text-saffron-500 mb-3" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <blockquote className="font-display text-lg leading-snug text-stone-800">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-4 text-sm text-stone-500">
        <span className="font-medium text-stone-700">{testimonial.name}</span>, {testimonial.origin} ·{" "}
        {testimonial.tour}
      </figcaption>
    </figure>
  );
}
