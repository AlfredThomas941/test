"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Route, Trophy, ShoppingBag, User, Bell, Settings, Bot, BarChart3, Target, X, Sparkles, Crown } from "lucide-react";
import { useApp, type View } from "@/lib/store";
import { Logo } from "@/components/brand/logo";
import { LumoFace } from "@/components/brand/lumo";
import { StreakBadge, HeartsBadge, GemsBadge } from "@/components/brand/indicators";
import { cn } from "@/lib/utils";

interface NavItem {
  view: View;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  group: "primary" | "secondary";
}

const PRIMARY: NavItem[] = [
  { view: "home", label: "Home", icon: Home, group: "primary" },
  { view: "learn", label: "Learn", icon: Route, group: "primary" },
  { view: "leaderboard", label: "Leagues", icon: Trophy, group: "primary" },
  { view: "quests", label: "Quests", icon: Target, group: "primary" },
  { view: "shop", label: "Shop", icon: ShoppingBag, group: "primary" },
];

const SECONDARY: NavItem[] = [
  { view: "ai-tutor", label: "AI Tutor", icon: Bot, group: "secondary" },
  { view: "stats", label: "Statistics", icon: BarChart3, group: "secondary" },
  { view: "profile", label: "Profile", icon: User, group: "secondary" },
  { view: "settings", label: "Settings", icon: Settings, group: "secondary" },
];

const MOBILE_NAV: NavItem[] = [
  { view: "home", label: "Home", icon: Home, group: "primary" },
  { view: "learn", label: "Learn", icon: Route, group: "primary" },
  { view: "leaderboard", label: "Leagues", icon: Trophy, group: "primary" },
  { view: "quests", label: "Quests", icon: Target, group: "primary" },
  { view: "profile", label: "Profile", icon: User, group: "primary" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { view, setView, gamification, user, notifications, focusMode, setFocusMode } = useApp();
  const isLesson = view === "lesson" || view === "lesson-complete";

  // Hide chrome entirely during lesson & focus mode
  if (isLesson || focusMode) {
    return (
      <div className="min-h-screen bg-background">
        {children}
        {focusMode && !isLesson && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-chunk-sm text-xs font-bold text-ink"
          >
            <X size={14} /> Exit focus
          </button>
        )}
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-[#e8dcc4] bg-white sticky top-0 h-screen">
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-2 px-6 pt-6 pb-4 hover:opacity-80 transition"
          aria-label="Lingoland home"
        >
          <Logo size={36} />
        </button>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {PRIMARY.map((item) => (
              <li key={item.view}>
                <NavButton item={item} active={view === item.view} onClick={() => setView(item.view)} />
              </li>
            ))}
          </ul>
          <div className="my-3 h-px bg-[#e8dcc4]" />
          <ul className="space-y-1">
            {SECONDARY.map((item) => (
              <li key={item.view}>
                <NavButton item={item} active={view === item.view} onClick={() => setView(item.view)} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Upgrade card */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setView("subscription")}
            className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-[#ffc93c] to-[#ff6b6b] text-white shadow-chunk-sm"
            style={{ ["--btn-shadow" as any]: "#d9744a" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Crown size={18} />
              <span className="font-bold text-sm">Lingoland Plus</span>
            </div>
            <p className="text-xs/4 text-white/90">Unlimited hearts, no ads, AI tutor pro.</p>
            <span className="inline-block mt-2 text-xs font-bold uppercase tracking-wide bg-white/25 px-2 py-0.5 rounded-full">
              Try free →
            </span>
          </button>
        </div>

        {/* User mini-card */}
        <div className="px-3 pb-4 border-t border-[#e8dcc4] pt-3">
          <button onClick={() => setView("profile")} className="w-full flex items-center gap-2 hover:bg-[#fff0d6] p-2 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#fff0d6] grid place-items-center text-xl">{user?.avatar ?? "🦊"}</div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{user?.name ?? "Learner"}</div>
              <div className="text-[10px] text-[#8b7d6b] truncate">{user?.email ?? "demo@lingoland.app"}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile + desktop) */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-[#e8dcc4]">
          <div className="flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 max-w-[1400px] mx-auto">
            {/* Mobile logo */}
            <button onClick={() => setView("home")} className="md:hidden flex items-center" aria-label="Lingoland home">
              <LumoFace size={32} />
            </button>
            {/* Stats cluster */}
            <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
              <button onClick={() => setView("stats")} className="flex items-center gap-1.5 hover:scale-105 transition" aria-label="Streak">
                <StreakBadge value={gamification.currentStreak} size={20} />
              </button>
              <button onClick={() => setView("shop")} className="flex items-center gap-1.5 hover:scale-105 transition" aria-label="Gems">
                <GemsBadge value={gamification.gems} size={20} />
              </button>
              <button onClick={() => setView("stats")} className="flex items-center gap-1.5 hover:scale-105 transition" aria-label="Hearts">
                <HeartsBadge value={gamification.hearts} max={gamification.maxHearts} size={20} />
              </button>
              <button
                onClick={() => setView("notifications")}
                className="relative w-9 h-9 grid place-items-center rounded-full hover:bg-[#fff0d6] transition"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-[#2c2334]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#ff4757] text-white text-[10px] font-bold w-4 h-4 grid place-items-center rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#e8dcc4] grid grid-cols-5 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile navigation">
        {MOBILE_NAV.map((item) => {
          const active = view === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 no-tap-highlight"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <motion.div
                animate={active ? { scale: [1, 1.18, 1] } : {}}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className={cn("p-1 rounded-xl transition", active ? "text-[#58cc8d]" : "text-[#8b7d6b]")}
              >
                <Icon size={24} />
              </motion.div>
              <span className={cn("text-[10px] font-bold", active ? "text-[#58cc8d]" : "text-[#8b7d6b]")}>
                {item.label}
              </span>
              {active && <span className="absolute top-0 inset-x-1/4 h-1 bg-[#58cc8d] rounded-b-full" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all no-tap-highlight",
        active
          ? "bg-[#fff0d6] text-[#2c2334] ring-2 ring-[#58cc8d]/30"
          : "text-[#8b7d6b] hover:bg-[#fff0d6]/50 hover:text-[#2c2334]"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon size={20} className={active ? "text-[#58cc8d]" : ""} />
      {item.label}
    </button>
  );
}

/** Toast viewport — overlays at top-center */
export function ToastViewport() {
  const { toasts } = useApp();
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={cn(
              "pointer-events-auto px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2",
              t.variant === "success" && "bg-[#58cc8d] text-white",
              t.variant === "error" && "bg-[#ff4757] text-white",
              t.variant === "info" && "bg-[#2c2334] text-white"
            )}
          >
            {t.emoji && <span className="text-lg">{t.emoji}</span>}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Confetti burst — pure SVG/CSS, no external deps */
export function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#ff6b6b", "#ffc93c", "#58cc8d", "#4d96ff", "#a06bd6"];
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 60 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1.6 + Math.random() * 1.4;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 8;
        const rotation = Math.random() * 360;
        return (
          <motion.div
            key={i}
            className="absolute top-0"
            style={{ left: `${left}%`, width: size, height: size * 0.4, backgroundColor: color, borderRadius: 2, transform: `rotate(${rotation}deg)` }}
            initial={{ y: -20, opacity: 1 }}
            animate={{ y: "100vh", opacity: [1, 1, 0.7, 0], rotate: rotation + 360 }}
            transition={{ duration, delay, ease: "easeIn" }}
          />
        );
      })}
    </div>
  );
}

/** Sparkles decoration */
export function SparkleBurst({ x, y }: { x: number; y: number }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }}>
      <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.6 }}>
        <Sparkles className="text-[#ffc93c]" size={32} />
      </motion.div>
    </div>
  );
}
