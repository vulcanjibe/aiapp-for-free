"use client";

import { useEffect, useState } from "react";
import { Sparkles, Layers, ShieldCheck } from "lucide-react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if splash screen was already shown in this session
    const hasSeenSplash = sessionStorage.getItem("freehub_splash_seen");
    if (!hasSeenSplash) {
      setVisible(true);
      sessionStorage.setItem("freehub_splash_seen", "true");

      // Fade out animation
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 1800);

      // Hide completely
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 2300);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6 animate-pulse">
        {/* Glow Ring */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-indigo-500/40">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            FreeHub
          </h1>
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">
            Alternatives Gratuites & Open Source
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Web & PWA
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Conteneurisé
          </span>
        </div>
      </div>
    </div>
  );
}
