"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Gem, Trophy, Bot, ChevronRight, Play, Sparkles, Crown, Calendar, Brain, Target, BookOpen, Plus, Bell } from "lucide-react";
import { Button3D } from "@/components/brand/button";
import { Lumo, LumoFace } from "@/components/brand/lumo";
import { ProgressBar, ProgressRing, StarRow } from "@/components/brand/indicators";
import { useApp, useActiveCourse } from "@/lib/store";
import { COURSES, findCourse, findLesson } from "@/data/courses";
import { QUESTS, ACHIEVEMENTS, BOT_LEARNERS, LEAGUES } from "@/data/catalog";

function useCountUp(target: number, duration = 800) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export function HomeView() {
  const { user, gamification, activeCourseId, coursesProgress, notifications, questsProgress, setView, mistakes, aiConversations } = useApp();
  const activeCourse = useActiveCourse();
  const courseProgress = activeCourseId ? coursesProgress[activeCourseId] : null;
  const totalLessons = activeCourse ? activeCourse.units.reduce((a, u) => a + u.lessons.length, 0) : 0;
  const completedLessons = courseProgress?.completedLessons.length ?? 0;
  const pct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dailyQuests = QUESTS.filter((q) => q.type === "daily").slice(0, 3);
  const recentNotifs = notifications.slice(0, 3);

  // Find current lesson for "Continue learning"
  let currentLesson: { id: string; title: string; type: string } | null = null;
  if (activeCourse && courseProgress) {
    for (const unit of activeCourse.units) {
      const lesson = unit.lessons.find((l, i) => {
        const wasCompleted = courseProgress.completedLessons.includes(l.id);
        if (wasCompleted) return false;
        const prevDone = i === 0 || courseProgress.completedLessons.includes(unit.lessons[i - 1].id);
        return prevDone;
      });
      if (lesson) { currentLesson = lesson; break; }
    }
    if (!currentLesson && activeCourse.units[0]?.lessons[0]) {
      currentLesson = activeCourse.units[0].lessons[0];
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center p-6">
        <div>
          <Lumo size={140} expression="wave" float />
          <h2 className="font-display text-2xl font-extrabold mt-4">Welcome to Lingoland!</h2>
          <p className="text-[#8b7d6b] mt-1 mb-4">Log in or sign up to start your journey.</p>
          <Button3D variant="primary" size="lg" onClick={() => setView("landing")}>Get started</Button3D>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Greeting + Streak */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#fff0d6] to-[#fff8ee] rounded-3xl p-5 md:p-6 border-2 border-[#e8dcc4] overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#2c2334]">
              {greeting}, {user.name?.split(" ")[0] ?? "Learner"}! 🦊
            </h1>
            <p className="text-[#6b4f1d] text-sm md:text-base mt-1">Ready for today's adventure?</p>
            <div className="flex items-center gap-1.5 mt-3">
              <Flame size={22} className="text-[#ff6b6b]" fill="#ff6b6b" />
              <span className="font-display text-xl font-extrabold text-[#ff6b6b]">{gamification.currentStreak}</span>
              <span className="text-sm font-bold text-[#8b7d6b]">day streak</span>
            </div>
          </div>
          <div className="hidden md:block">
            <LumoFace size={80} />
          </div>
        </div>
        {/* Mini week calendar */}
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const isToday = i === 6;
            const isActive = i <= 6 && i >= (6 - Math.min(6, gamification.currentStreak));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full aspect-square rounded-lg grid place-items-center text-xs font-bold ${isActive ? "bg-[#ff6b6b] text-white" : "bg-white text-[#8b7d6b] border border-[#e8dcc4]"}`}>
                  {isActive ? "🔥" : d.getDate()}
                </div>
                <span className="text-[10px] text-[#8b7d6b] uppercase">{["S","M","T","W","T","F","S"][d.getDay()]}</span>
                {isToday && <div className="w-1 h-1 rounded-full bg-[#58cc8d]" />}
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Continue learning - prominent */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        {activeCourse && currentLesson ? (
          <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-[#e8dcc4] shadow-chunk-sm" style={{ ["--btn-shadow" as any]: "#e8dcc4" } as React.CSSProperties}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#8b7d6b] mb-1">
                  <span>{COURSES.find(c => c.id === activeCourseId)?.languageId === "es" ? "🇪🇸" : COURSES.find(c => c.id === activeCourseId)?.languageId === "ja" ? "🇯🇵" : "🇫🇷"}</span>
                  Continue learning
                </div>
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#2c2334] truncate">{currentLesson.title}</h2>
                <p className="text-sm text-[#8b7d6b] mt-0.5 line-clamp-1">{activeCourse.title}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 max-w-xs">
                    <ProgressBar value={pct} color={activeCourse.iconColor} />
                  </div>
                  <span className="text-xs font-bold text-[#8b7d6b]">{completedLessons}/{totalLessons}</span>
                </div>
              </div>
              <Button3D variant="primary" size="lg" onClick={() => setView("lesson", { lessonId: currentLesson.id })}>
                <Play size={18} fill="currentColor" /> Continue
              </Button3D>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#e8dcc4] text-center">
            <Lumo size={120} expression="thinking" />
            <h2 className="font-display text-xl font-extrabold mt-2">Pick your first language</h2>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {COURSES.map((c) => {
                const lang = c.languageId === "es" ? "🇪🇸 Spanish" : c.languageId === "ja" ? "🇯🇵 Japanese" : "🇫🇷 French";
                return (
                  <button key={c.id} onClick={() => { useApp.getState().setActiveCourse(c.id); setView("learn"); }} className="p-4 rounded-2xl border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition">
                    <div className="text-3xl mb-1">{lang.split(" ")[0]}</div>
                    <div className="text-sm font-bold">{lang.split(" ")[1]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.section>

      {/* Stats grid */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total XP" value={gamification.totalXP} icon={<Zap size={18} fill="#ffc93c" className="text-[#ffc93c]" />} color="#ffc93c" bg="#fff8e0" onClick={() => setView("stats")} />
        <StatCard label="Streak" value={gamification.currentStreak} suffix="days" icon={<Flame size={18} fill="#ff6b6b" className="text-[#ff6b6b]" />} color="#ff6b6b" bg="#ffe9e9" onClick={() => setView("stats")} />
        <StatCard label="Hearts" value={gamification.hearts} suffix={`/${gamification.maxHearts}`} icon={<span className="text-base">❤️</span>} color="#ff4757" bg="#ffe3e3" onClick={() => setView("shop")} />
        <StatCard label="Gems" value={gamification.gems} icon={<Gem size={18} fill="#4d96ff" className="text-[#4d96ff]" />} color="#4d96ff" bg="#e6f0ff" onClick={() => setView("shop")} />
      </motion.section>

      {/* Daily quests */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Target size={20} className="text-[#58cc8d]" /> Daily Quests</h2>
          <button onClick={() => setView("quests")} className="text-sm font-bold text-[#4d96ff] hover:underline">View all →</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {dailyQuests.map((q) => {
            const qp = questsProgress[q.id] ?? { progress: 0, completed: false, claimed: false };
            const pct = Math.min(100, (qp.progress / q.goalAmount) * 100);
            return (
              <div key={q.id} className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ backgroundColor: `${q.color}22` }}>{q.icon}</div>
                  {qp.completed && !qp.claimed && (
                    <Button3D variant="sun" size="sm" onClick={() => { useApp.getState().claimQuest(q.id); useApp.getState().pushToast({ text: `+${q.xp} XP, +${q.gems} gems!`, emoji: "🎁", variant: "success" }); }}>
                      Claim
                    </Button3D>
                  )}
                  {qp.claimed && <span className="text-[#58cc8d] font-bold text-xs">✓ Done</span>}
                </div>
                <div className="font-bold text-sm text-[#2c2334] line-clamp-2 min-h-[2.5em]">{q.title}</div>
                <div className="mt-2"><ProgressBar value={pct} color={q.color} height={8} /></div>
                <div className="flex items-center justify-between mt-1.5 text-xs">
                  <span className="text-[#8b7d6b] font-bold">{qp.progress}/{q.goalAmount}</span>
                  <span className="text-[#ffc93c] font-bold">+{q.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* What's next */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display text-xl font-extrabold mb-3">What's next?</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <ActionCard emoji="🧠" title="Practice weak skills" desc={mistakes.length > 0 ? `${mistakes.length} mistakes to review` : "Review your vocabulary"} color="#a06bd6" onClick={() => setView("practice")} />
          <ActionCard emoji="🤖" title="AI Tutor" desc={`${aiConversations.length === 0 ? "Start your first chat" : `${aiConversations.length} conversations`}`} color="#4d96ff" onClick={() => setView("ai-tutor")} />
          <ActionCard emoji="🏆" title="League rank" desc={`Rank in ${gamification.league}`} color="#ffc93c" onClick={() => setView("leaderboard")} />
        </div>
      </motion.section>

      {/* Personal learning map */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl p-5 border-2 border-[#e8dcc4]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Brain size={20} className="text-[#a06bd6]" /> Personal Learning Map</h2>
          <button onClick={() => setView("insights")} className="text-sm font-bold text-[#4d96ff] hover:underline">Insights →</button>
        </div>
        <ConfidenceRadar confidence={gamification.confidence} />
      </motion.section>

      {/* Friend activity */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><span>👥</span> Friend Activity</h2>
          <button onClick={() => setView("friends")} className="text-sm font-bold text-[#4d96ff] hover:underline">Find friends →</button>
        </div>
        <div className="space-y-2">
          {BOT_LEARNERS.slice(0, 4).map((b, i) => {
            const actions = [
              `earned ${50 + i * 15} XP`,
              `reached a ${3 + i}-day streak`,
              `completed lesson: ${["Greetings", "Family", "Numbers", "Food"][i]}`,
              `climbed to rank ${i + 1} in Silver`,
            ];
            return (
              <div key={b.name} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-[#e8dcc4]">
                <div className="w-10 h-10 rounded-full bg-[#fff0d6] grid place-items-center text-xl">{b.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#2c2334]"><span className="text-base mr-1">{b.country}</span>{b.name}</div>
                  <div className="text-xs text-[#8b7d6b]">{actions[i]}</div>
                </div>
                <span className="text-[10px] text-[#8b7d6b] font-bold">{i + 1}h ago</span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Notifications */}
      {recentNotifs.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Bell size={20} className="text-[#58cc8d]" /> Recent Activity</h2>
            <button onClick={() => setView("notifications")} className="text-sm font-bold text-[#4d96ff] hover:underline">View all →</button>
          </div>
          <div className="space-y-2">
            {recentNotifs.map((n) => (
              <div key={n.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-[#e8dcc4]">
                <div className="text-2xl">{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#2c2334] truncate">{n.title}</div>
                  <div className="text-xs text-[#8b7d6b] truncate">{n.body}</div>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#58cc8d]" />}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Plus promo */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => setView("subscription")}
        className="w-full text-left rounded-3xl p-5 bg-gradient-to-br from-[#ffc93c] to-[#ff6b6b] text-white shadow-chunk-sm"
        style={{ ["--btn-shadow" as any]: "#d9744a" } as React.CSSProperties}
      >
        <div className="flex items-center gap-3">
          <Crown size={28} />
          <div className="flex-1">
            <div className="font-display text-lg font-extrabold">Lingoland Plus</div>
            <div className="text-sm text-white/90">Unlimited hearts, no ads, AI pro.</div>
          </div>
          <ChevronRight size={20} />
        </div>
      </motion.button>
    </div>
  );
}

function StatCard({ label, value, suffix, icon, color, bg, onClick }: { label: string; value: number; suffix?: string; icon: React.ReactNode; color: string; bg: string; onClick?: () => void }) {
  const v = useCountUp(value, 600);
  return (
    <button onClick={onClick} className="text-left bg-white rounded-2xl p-4 border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition">
      <div className="w-9 h-9 rounded-xl grid place-items-center mb-2" style={{ backgroundColor: bg }}>{icon}</div>
      <div className="font-display text-2xl font-extrabold tabular-nums" style={{ color }}>
        {v}{suffix && <span className="text-sm text-[#8b7d6b]">{suffix}</span>}
      </div>
      <div className="text-xs font-bold uppercase tracking-wide text-[#8b7d6b]">{label}</div>
    </button>
  );
}

function ActionCard({ emoji, title, desc, color, onClick }: { emoji: string; title: string; desc: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left p-4 rounded-2xl border-2 border-[#e8dcc4] bg-white hover:border-[#58cc8d] transition">
      <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl mb-2" style={{ backgroundColor: `${color}22` }}>{emoji}</div>
      <div className="font-bold text-[#2c2334]">{title}</div>
      <div className="text-xs text-[#8b7d6b] mt-0.5">{desc}</div>
    </button>
  );
}

function ConfidenceRadar({ confidence }: { confidence: { vocab: number; grammar: number; listening: number; speaking: number; reading: number; writing: number } }) {
  const areas = [
    { key: "vocab", label: "Vocab", color: "#58cc8d" },
    { key: "grammar", label: "Grammar", color: "#4d96ff" },
    { key: "listening", label: "Listen", color: "#ff6b6b" },
    { key: "speaking", label: "Speak", color: "#ffc93c" },
    { key: "reading", label: "Read", color: "#a06bd6" },
    { key: "writing", label: "Write", color: "#ff8c42" },
  ] as const;
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const pts = areas.map((a, i) => {
    const angle = (Math.PI * 2 * i) / areas.length - Math.PI / 2;
    const v = confidence[a.key] / 100;
    return { x: cx + Math.cos(angle) * r * v, y: cy + Math.sin(angle) * r * v, lx: cx + Math.cos(angle) * (r + 14), ly: cy + Math.sin(angle) * (r + 14) };
  });
  const polyPts = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="max-w-full">
        {[0.25, 0.5, 0.75, 1].map((s, i) => (
          <polygon key={i} points={areas.map((_, j) => {
            const a = (Math.PI * 2 * j) / areas.length - Math.PI / 2;
            return `${cx + Math.cos(a) * r * s},${cy + Math.sin(a) * r * s}`;
          }).join(" ")} fill="none" stroke="#e8dcc4" strokeWidth="1" />
        ))}
        {areas.map((_, i) => {
          const a = (Math.PI * 2 * i) / areas.length - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="#e8dcc4" strokeWidth="1" />;
        })}
        <motion.polygon points={polyPts} fill="rgba(88,204,141,0.25)" stroke="#58cc8d" strokeWidth="2" initial={{ scale: 0, originX: cx, originY: cy }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={areas[i].color} />)}
        {areas.map((a, i) => (
          <text key={a.key} x={pts[i].lx} y={pts[i].ly} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold" fill="#6b4f1d">{a.label}</text>
        ))}
      </svg>
    </div>
  );
}
