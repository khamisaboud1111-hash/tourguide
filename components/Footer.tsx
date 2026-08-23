import Link from "next/link";
import { AtSign, Mail, Phone, MapPin, ArrowRight, MessageCircle } from "lucide-react";
import { business, waLink } from "@/lib/constants";
import DoorMotifDivider from "./DoorMotifDivider";

export default function Footer() {
  return (
    <footer className="bg-indigo-800 text-stone-100">
      <DoorMotifDivider tone="onDark" className="opacity-80" />

      {/* CTA band */}
      <div className="container-page py-10 md:py-14">
        <div className="rounded-[20px] bg-indigo-700/70 border border-indigo-600/60 p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 backdrop-blur">
          <div>
            <p className="text-saffron-300 text-xs uppercase tracking-[0.18em] font-medium mb-2">Ready to discover Zanzibar?</p>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white text-balance">Plan your experience with a local guide</h3>
            <p className="mt-2 text-stone-300 text-sm max-w-xl leading-relaxed">
              No busloads, no scripts — just the island as your guide knows it. Message directly, no commitment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-indigo-900 px-6 py-3.5 text-sm font-medium hover:bg-white transition-colors shadow-card"
            >
              Plan your trip <ArrowRight size={16} />
            </Link>
            <a
              href={waLink(`Hi ${business.guideName}, I'd like to plan a trip to Zanzibar.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-50/20 bg-transparent text-stone-50 px-6 py-3.5 text-sm font-medium hover:bg-stone-50/10 transition-colors"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="container-page py-10 grid gap-10 md:grid-cols-12 border-t border-indigo-700/60">
        <div className="md:col-span-5">
          <h3 className="font-display text-xl font-semibold text-white">{business.name}</h3>
          <p className="mt-3 text-stone-300 text-sm leading-relaxed max-w-sm">
            {business.guideBioShort}
          </p>
          <p className="mt-4 text-stone-400 text-xs leading-relaxed max-w-sm">
            Zanzibar-born guiding since day one — licensed, small groups, flexible by design. No third-party markups.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-saffron-300 mb-4">Experiences</h4>
          <ul className="space-y-2.5 text-sm text-stone-300">
            <li><Link href="/tours" className="hover:text-white transition-colors">All tours</Link></li>
            <li><Link href="/tours" className="hover:text-white transition-colors">Culture &amp; History</Link></li>
            <li><Link href="/tours" className="hover:text-white transition-colors">Ocean &amp; Sailing</Link></li>
            <li><Link href="/tours" className="hover:text-white transition-colors">Nature &amp; Wildlife</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-saffron-300 mb-4">Discover</h4>
          <ul className="space-y-2.5 text-sm text-stone-300">
            <li><Link href="/about" className="hover:text-white transition-colors">About your guide</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact &amp; meeting points</Link></li>
            <li><Link href="/journal" className="hover:text-white transition-colors">Journal</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Zanzibar in photos</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-saffron-300 mb-4">
            Reach {business.guideName}
          </h4>
          <ul className="space-y-3 text-sm text-stone-300">
            <li className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 border border-indigo-600 shrink-0">
                <Phone size={14} className="text-saffron-300" />
              </span>
              <span>{business.phoneDisplay}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 border border-indigo-600 shrink-0">
                <Mail size={14} className="text-saffron-300" />
              </span>
              <a href={`mailto:${business.email}`} className="hover:text-white transition-colors">{business.email}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 border border-indigo-600 shrink-0">
                <MapPin size={14} className="text-saffron-300" />
              </span>
              <span>{business.location}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 border border-indigo-600 shrink-0">
                <AtSign size={14} className="text-saffron-300" />
              </span>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-indigo-600/60">
        <div className="container-page py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-stone-200 transition-colors">Cancellation policy</Link>
            <span className="h-3 w-px bg-indigo-600" />
            <span>Licensed local guide · {business.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
