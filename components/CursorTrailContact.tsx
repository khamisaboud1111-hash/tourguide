"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor Trail Contact — a near-black contact section whose background is the
 * interactive centerpiece. Moving the cursor paints a twinkling halftone dot
 * trail that glows white and fades away, with subtle film grain over
 * everything. On touch devices the trail simply doesn't fire and the dark
 * gradient + grain still reads as a finished design.
 *
 * Faithful adaptation of the "Cursor Trail Contact" shader section, rebuilt
 * with a dependency-free 2D canvas so it degrades gracefully everywhere.
 */

export default function CursorTrailContact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Halftone dot trail
    const dots: { x: number; y: number; life: number; r: number }[] = [];
    let pointer = { x: -1000, y: -1000, active: false };
    let lastEmit = 0;

    // Procedural film grain (drawn each frame, cheap)
    function drawGrain() {
      const img = ctx!.createImageData(64, 64);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.floor(Math.random() * 255);
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 12; // very subtle alpha
      }
      // draw tiled
      const pattern = ctx!.createPattern(makeCanvas(img), "repeat");
      if (pattern) {
        ctx!.globalAlpha = 0.35;
        ctx!.fillStyle = pattern;
        ctx!.fillRect(0, 0, width, height);
        ctx!.globalAlpha = 1;
      }
    }

    function makeCanvas(img: ImageData) {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      c.getContext("2d")!.putImageData(img, 0, 0);
      return c;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function render(t: number) {
      ctx!.clearRect(0, 0, width, height);

      // Background: corner-to-corner dark gradient (#1e1e1f → #070708)
      const grad = ctx!.createLinearGradient(0, height, width, 0);
      grad.addColorStop(0, "#1e1e1f");
      grad.addColorStop(1, "#070708");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);

      // Emit dots along pointer (halftone trail)
      if (pointer.active && t - lastEmit > 16) {
        lastEmit = t;
        for (let i = 0; i < 2; i++) {
          dots.push({
            x: pointer.x + (Math.random() - 0.5) * 6,
            y: pointer.y + (Math.random() - 0.5) * 6,
            life: 1,
            r: 1 + Math.random() * 2.2,
          });
        }
      }

      // Update & paint dots (twinkle + fade)
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life -= 0.03;
        d.r *= 1.015;
        if (d.life <= 0) {
          dots.splice(i, 1);
          continue;
        }
        const twinkle = 0.6 + 0.4 * Math.sin(t / 120 + i * 1.7);
        ctx!.fillStyle = `rgba(255,255,255,${Math.max(0, d.life) * twinkle * 0.85})`;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r * twinkle, 0, Math.PI * 2);
        ctx!.fill();
      }

      drawGrain();

      raf = requestAnimationFrame(render);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    function onPointerDown(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    resize();
    raf = requestAnimationFrame(render);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <main
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#070708] text-white"
      style={{
        isolation: "isolate",
        fontFamily: "'Satoshi', ui-sans-serif, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
      aria-label="Contact us"
    >
      {/* Shader / interactive background */}
      <div className="absolute inset-0" aria-hidden="true">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Content */}
      <section
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
      >
        <h2
          className="reveal text-2xl font-medium sm:text-3xl"
          style={{ color: "rgba(255,255,255,0.7)", ["--reveal-delay" as any]: "0.1s" }}
        >
          Got something to make?
        </h2>
        <a
          href="/contact"
          className="reveal group mt-5 inline-block"
          style={{ ["--reveal-delay" as any]: "0.25s", overflowWrap: "anywhere", fontSize: "clamp(2.2rem, 7vw, 6rem)", lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}
        >
          Contact us
          <span className="mx-auto mt-2 block h-[3px] w-0 bg-white/70 transition-[width] duration-500 group-hover:w-full" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
        </a>
      </section>

      {/* Footer row */}
      <footer
        className="reveal relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 pb-9 sm:px-12"
        style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", ["--reveal-delay" as any]: "0.45s" }}
      >
        <div className="flex gap-7">
          <a href="#" className="transition-colors hover:text-white">Instagram</a>
          <a href="#" className="transition-colors hover:text-white">Are.na</a>
          <a href="#" className="transition-colors hover:text-white">GitHub</a>
        </div>
        <p className="hidden sm:block">( move your cursor )</p>
      </footer>

      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(14px);
          animation: revealUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--reveal-delay, 0s);
        }
        @keyframes revealUp {
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  );
}