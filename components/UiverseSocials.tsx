"use client";

import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/SocialIcons";
import { business } from "@/lib/constants";

/**
 * Uiverse "Social Icons" widget — circular buttons that lift and fill with
 * their brand color on hover. Adapted from the Uiverse CSS-only design;
 * uses the project's inline brand SVG icons (lucide 1.x dropped brand marks).
 */

const items = [
  { label: "Facebook", href: business.facebook, Icon: FacebookIcon, size: 20 },
  { label: "Instagram", href: business.instagram, Icon: InstagramIcon, size: 20 },
  { label: "TikTok", href: business.tiktok, Icon: TikTokIcon, size: 20 },
];

export default function UiverseSocials() {
  return (
    <div className="uiverse-socials" style={{ ["--brand-orange" as any]: "#8B3A2B" }}>
      <ul className="uiverse-socials__list">
        {items.map(({ label, href, Icon, size }) => (
          <li className="uiverse-socials__item" key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="uiverse-socials__link">
              <Icon size={size} />
              <span className="uiverse-socials__tip">{label}</span>
            </a>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .uiverse-socials__list {
          display: flex;
          gap: 1.25rem;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .uiverse-socials__item {
          transform: rotate(-6deg);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .uiverse-socials__item:hover {
          transform: rotate(0);
        }
        .uiverse-socials__link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-card);
          color: var(--color-ink);
          border: 1px solid var(--color-border-strong);
          box-shadow: var(--shadow-soft);
          text-decoration: none;
          transition: color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .uiverse-socials__link:hover {
          color: #fff;
          transform: translateY(-6px);
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.16);
        }
        .uiverse-socials__item:nth-child(1) .uiverse-socials__link:hover {
          background: #3b5998;
          border-color: #3b5998;
        }
        .uiverse-socials__item:nth-child(2) .uiverse-socials__link:hover {
          background: #e1306c;
          border-color: #e1306c;
        }
        .uiverse-socials__item:nth-child(3) .uiverse-socials__link:hover {
          background: #010101;
          border-color: #010101;
        }
        .uiverse-socials__tip {
          position: absolute;
          top: -34px;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          background: var(--brand-orange, #8b3a2b);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          opacity: 0;
          pointer-events: none;
          white-space: nowrap;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .uiverse-socials__link:hover .uiverse-socials__tip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .uiverse-socials__item,
          .uiverse-socials__link,
          .uiverse-socials__tip {
            transition: none;
          }
          .uiverse-socials__item:hover {
            transform: none;
          }
          .uiverse-socials__link:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}