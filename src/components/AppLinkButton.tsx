"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExternalLink, Lock, Code } from "lucide-react";

interface AppLinkButtonProps {
  appId: string;
  url: string;
  label: string;
  icon: "demo" | "github";
}

export function AppLinkButton({ appId, url, label, icon }: AppLinkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      await fetch("/api/apps/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId }),
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
        icon === "demo"
          ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-600/30"
          : "bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800"
      }`}
    >
      {!session && <Lock className="w-3.5 h-3.5 text-amber-400" />}
      {icon === "demo" ? <ExternalLink className="w-4 h-4" /> : <Code className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
}
