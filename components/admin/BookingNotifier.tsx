"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BookingNotifier() {
  const [lastCount, setLastCount] = useState<number | null>(null);
  const [notifiedId, setNotifiedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Prepare audio element (short beep via base64 or external)
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c8ad3c.mp3?filename=notification-sound-7062.mp3");
    audio.volume = 0.8;
    audioRef.current = audio;

    // Request browser notification permission
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const supabase = createClient();
    let interval: ReturnType<typeof setInterval> | null = null;

    const check = async () => {
      const { count } = await supabase.from("bookings").select("id", { count: "exact", head: true });
      if (count === null) return;
      if (lastCount !== null && count > lastCount) {
        // New booking — fetch latest
        const { data } = await supabase.from("bookings").select("id, customer_name, tour_title_snapshot, whatsapp").order("created_at", { ascending: false }).limit(1).single();
        const id = (data as { id: string } | null)?.id ?? String(Date.now());
        if (id !== notifiedId) {
          setNotifiedId(id);
          try {
            await audioRef.current?.play();
          } catch {}
          const tour = (data as { tour_title_snapshot?: string } | null)?.tour_title_snapshot ?? "a tour";
          const name = (data as { customer_name?: string } | null)?.customer_name ?? "New customer";
          const body = `${name} booked ${tour}`;
          // Browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New booking request", { body, icon: "/sitmeir-logo-md.png" });
          }
          // Also vibrate on mobile
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      }
      setLastCount(count);
    };

    // Initial check
    check();
    interval = setInterval(check, 8000);

    // Realtime subscription for instant feedback
    const channel = supabase
      .channel("bookings-notify")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bookings" }, async (payload) => {
        const id = (payload.new as { id: string }).id;
        if (id === notifiedId) return;
        setNotifiedId(id);
        try {
          await audioRef.current?.play();
        } catch {}
        const tour = (payload.new as { tour_title_snapshot?: string }).tour_title_snapshot ?? "a tour";
        const name = (payload.new as { customer_name?: string }).customer_name ?? "New customer";
        const body = `${name} booked ${tour}`;
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New booking request", { body, icon: "/sitmeir-logo-md.png" });
        }
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        setLastCount((c) => (c === null ? 1 : c + 1));
      })
      .subscribe();

    return () => {
      if (interval) clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [lastCount, notifiedId]);

  return null;
}
