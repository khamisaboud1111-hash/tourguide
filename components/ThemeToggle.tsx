"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Uiverse "Theme Switch" widget — a springy sliding toggle between sun and
 * moon. Toggles `.theme-dark` on <html>; components opt into dark styling
 * when the class is present. Falls back to prefers-color-scheme on load.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const preferred = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
    const stored = localStorage.getItem("theme");
    const initial = stored ? stored === "dark" : preferred;
    setDark(initial);
    document.documentElement.classList.toggle("theme-dark", initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("theme-dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="theme-toggle"
      style={{ ["--toggle-accent" as any]: "#8B3A2B" }}
    >
      <span className="theme-toggle__icon theme-toggle__icon--sun">
        <Sun size={15} />
      </span>
      <span className={`theme-toggle__icon theme-toggle__icon--moon ${dark ? "" : "theme-toggle__icon--active"}`}>
        <Moon size={15} />
      </span>
      <span className="theme-toggle__knob" />
      <style jsx>{`
        .theme-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 56px;
          height: 30px;
          border-radius: 9999px;
          border: 1px solid var(--color-border-strong, #e0d2ac);
          background: var(--color-surface-muted, #f5efdd);
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          transition: background 0.3s ease;
        }
        .theme-toggle__icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          color: var(--toggle-accent, #8b3a2b);
          opacity: 0;
          transition: opacity 0.3s ease, right 0.3s ease, left 0.3s ease;
          z-index: 2;
        }
        .theme-toggle__icon--sun {
          left: 4px;
          opacity: 1;
        }
        .theme-toggle__icon--moon {
          right: 4px;
        }
        .theme-toggle__icon--active {
          opacity: 1;
        }
        .theme-toggle__knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-card, #fff);
          box-shadow: var(--shadow-soft, 0 1px 2px rgba(0, 0, 0, 0.12));
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }
        html.theme-dark .theme-toggle {
          background: #1e1e1f;
          border-color: #333;
        }
        html.theme-dark .theme-toggle .theme-toggle__icon--moon {
          opacity: 1;
        }
        html.theme-dark .theme-toggle .theme-toggle__icon--sun {
          opacity: 0;
        }
        html.theme-dark .theme-toggle__knob {
          transform: translateX(26px);
        }
        @media (prefers-reduced-motion: reduce) {
          .theme-toggle,
          .theme-toggle__icon,
          .theme-toggle__knob {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}