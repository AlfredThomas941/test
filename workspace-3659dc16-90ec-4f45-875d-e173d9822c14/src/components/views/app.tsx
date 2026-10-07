"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Flame, Zap, Gem, Trophy, Target, ChevronRight, Play, Sparkles, Crown, Calendar,
  Check, X, Lock, Star, Award, ShoppingCart, Users, Bell, BarChart3, Bot,
  Lightbulb, Brain, TrendingUp, AlertCircle, Plus, ChevronLeft, ArrowRight,
  Volume2, Send, RefreshCw, Pencil, Shield, ChevronUp, Home as HomeIcon,
  Sparkle, RotateCw, Heart, MessageCircle, BookOpen, Mic, ShoppingBag,
} from "lucide-react";
import { Button3D, Pill } from "@/components/brand/button";
import { Lumo, LumoFace } from "@/components/brand/lumo";
import { ProgressBar, ProgressRing, StarRow, StreakBadge, HeartsBadge, GemsBadge, XPBadge } from "@/components/brand/indicators";
import { useApp, useActiveCourse, useLeaderboard } from "@/lib/store";
import { COURSES, findCourse, findLesson } from "@/data/courses";
import {
  ACHIEVEMENTS, QUESTS, SHOP_ITEMS, AI_SCENARIOS, LEAGUES, BOT_LEARNERS,
} from "@/data/catalog";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────────────────────────────────
export function LeaderboardView() {
  const { setView, gamification, pushToast } = useApp();
  const { roster, league } = useLeaderboard();
  const leagueIdx = LEAGUES.findIndex((l) => l.name === league);
  const myRank = roster.findIndex((r) => r.isMe) + 1;
  const promoteCount = Math.max(1, Math.floor(roster.length * 0.3));
  const nextLeague = LEAGUES[leagueIdx + 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold">🏆 Leaderboard</h1>
        <p className="text-[#8b7d6b] mt-1 text-sm">Resets Monday 00:00 • Top {promoteCount} promote</p>
      </div>

      {/* League banner */}
      <div className="rounded-3xl p-6 text-center text-white shadow-chunk-sm" style={{ background: `linear-gradient(135deg, ${LEAGUES[leagueIdx].color}, ${LEAGUES[leagueIdx].color}dd)`, ["--btn-shadow" as any]: LEAGUES[leagueIdx].color } as React.CSSProperties}>
        <div className="text-5xl mb-2">{LEAGUES[leagueIdx].emoji}</div>
        <h2 className="font-display text-2xl font-extrabold">{league} League</h2>
        <p className="text-white/85 text-sm mt-1">You're rank #{myRank} of {roster.length}</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-2 items-end">
        {[1, 0, 2].map((idx) => {
          const r = roster[idx];
          if (!r) return <div key={idx} />;
          const heights = ["h-24", "h-32", "h-20"];
          const colors = ["#c0c0c0", "#ffd700", "#cd7f32"];
          return (
            <motion.div key={idx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} className="text-center">
              <div className="text-2xl mb-1">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div>
              <div className="text-3xl mb-1">{r.avatar}</div>
              <div className="text-xs font-bold truncate">{r.name}{r.isMe && " (you)"}</div>
              <div className="text-xs font-bold text-[#ffc93c]">{r.xp} XP</div>
              <div className={`mt-2 rounded-t-xl ${heights[idx === 0 ? 1 : idx === 1 ? 0 : 2]} grid place-items-center text-white font-bold`} style={{ backgroundColor: colors[idx] }}>
                {idx + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full roster */}
      <div className="bg-white rounded-2xl border-2 border-[#e8dcc4] overflow-hidden">
        {roster.map((r, i) => (
          <div key={r.name + i} className={cn("flex items-center gap-3 p-3 border-b border-[#e8dcc4] last:border-0", r.isMe && "bg-[#d7ffe5]")}>
            <div className={cn("w-7 text-center font-display font-extrabold", i < 3 ? "text-[#ffc93c]" : "text-[#8b7d6b]")}>{i + 1}</div>
            <div className="w-10 h-10 rounded-full bg-[#fff0d6] grid place-items-center text-xl">{r.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#2c2334] truncate">{r.name}{r.isMe && <span className="ml-1.5 text-xs text-[#58cc8d]">(you)</span>}</div>
              <div className="text-xs text-[#8b7d6b]">{r.country}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#ffc93c]">{r.xp}</div>
              <div className="text-[10px] text-[#8b7d6b] uppercase">XP</div>
            </div>
          </div>
        ))}
      </div>

      {myRank <= promoteCount ? (
        <div className="bg-[#d7ffe5] rounded-2xl p-4 text-center border-2 border-[#58cc8d]">
          <p className="font-bold text-[#2a8a4f]">🎉 You're in promotion zone!</p>
          <p className="text-sm text-[#2a8a4f]/80 mt-1">Keep practicing to secure your spot in {nextLeague?.name}.</p>
        </div>
      ) : (
        <div className="bg-[#fff0d6] rounded-2xl p-4 text-center border-2 border-[#ffc93c]/40">
          <p className="font-bold text-[#6b4f1d]">You need {roster[promoteCount - 1].xp - (roster[myRank - 1]?.xp ?? 0) + 1} XP to reach promotion.</p>
        </div>
      )}

      <Button3D variant="primary" size="lg" full onClick={() => setView("learn")}>
        Earn more XP <TrendingUp size={18} />
      </Button3D>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// QUESTS
// ─────────────────────────────────────────────────────────────────────────
export function QuestsView() {
  const { questsProgress, claimQuest, pushToast, setView } = useApp();
  const groups: Array<"daily" | "weekly" | "monthly"> = ["daily", "weekly", "monthly"];
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Target className="text-[#58cc8d]" /> Quests</h1>
        <p className="text-[#8b7d6b] mt-1">Complete to earn XP and gems.</p>
      </div>
      {groups.map((g) => {
        const items = QUESTS.filter((q) => q.type === g);
        if (items.length === 0) return null;
        return (
          <section key={g}>
            <h2 className="font-display text-xl font-extrabold mb-3 capitalize flex items-center gap-2">
              {g === "daily" && "📅 Daily"}
              {g === "weekly" && "🗓️ Weekly"}
              {g === "monthly" && "📆 Monthly"}
            </h2>
            <div className="space-y-3">
              {items.map((q) => {
                const qp = questsProgress[q.id] ?? { progress: 0, completed: false, claimed: false };
                const pct = Math.min(100, (qp.progress / q.goalAmount) * 100);
                return (
                  <div key={q.id} className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0" style={{ backgroundColor: `${q.color}22` }}>{q.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#2c2334]">{q.title}</div>
                        <div className="text-xs text-[#8b7d6b]">{q.description}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-[#ffc93c]">+{q.xp} XP</div>
                        <div className="text-xs font-bold text-[#4d96ff]">+{q.gems} 💎</div>
                      </div>
                    </div>
                    <ProgressBar value={pct} color={q.color} height={8} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-[#8b7d6b]">{qp.progress} / {q.goalAmount}</span>
                      {qp.completed && !qp.claimed && (
                        <Button3D variant="sun" size="sm" onClick={() => { claimQuest(q.id); pushToast({ text: `+${q.xp} XP, +${q.gems} 💎`, emoji: "🎁", variant: "success" }); }}>
                          Claim
                        </Button3D>
                      )}
                      {qp.claimed && <span className="text-xs font-bold text-[#58cc8d]">✓ Claimed</span>}
                      {!qp.completed && <button onClick={() => setView("learn")} className="text-xs font-bold text-[#4d96ff] hover:underline">Practice →</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────────────────
export function AchievementsView() {
  const { achievementsProgress } = useApp();
  const cats = ["streak", "xp", "lesson", "skill", "social", "special"];
  const unlockedCount = Object.values(achievementsProgress).filter((a) => a.unlockedAt).length;
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Award className="text-[#ffc93c]" /> Achievements</h1>
        <p className="text-[#8b7d6b] mt-1">{unlockedCount} / {ACHIEVEMENTS.length} unlocked</p>
      </div>
      <div className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
        <ProgressBar value={(unlockedCount / ACHIEVEMENTS.length) * 100} color="#ffc93c" height={10} />
      </div>
      {cats.map((cat) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === cat);
        return (
          <section key={cat}>
            <h2 className="font-display text-xl font-extrabold mb-3 capitalize flex items-center gap-2">
              {cat === "streak" && "🔥 Streak"}
              {cat === "xp" && "⚡ XP"}
              {cat === "lesson" && "📚 Lessons"}
              {cat === "skill" && "🧠 Skills"}
              {cat === "social" && "👥 Social"}
              {cat === "special" && "⭐ Special"}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {items.map((a) => {
                const unlocked = !!achievementsProgress[a.id]?.unlockedAt;
                return (
                  <div key={a.id} className={cn("rounded-2xl p-4 border-2 transition", unlocked ? "border-[#ffc93c] bg-gradient-to-br from-[#fff5d6] to-white" : "border-[#e8dcc4] bg-white opacity-70")}>
                    <div className="flex items-start gap-3">
                      <div className={cn("text-4xl", !unlocked && "grayscale opacity-50")}>{unlocked ? a.icon : "🔒"}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#2c2334] text-sm">{a.title}</div>
                        <div className="text-xs text-[#8b7d6b] mt-0.5">{a.description}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className={cn("font-bold uppercase tracking-wide", unlocked ? "text-[#ffc93c]" : "text-[#8b7d6b]")}>{a.tier}</span>
                      <span className="font-bold text-[#ffc93c]">+{a.xp} XP</span>
                    </div>
                    {unlocked ? (
                      <div className="mt-2 text-xs text-[#2a8a4f] font-bold">✓ Unlocked</div>
                    ) : (
                      <div className="mt-2 text-xs text-[#8b7d6b]">{a.requirementLabel}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHOP
// ─────────────────────────────────────────────────────────────────────────
export function ShopView() {
  const { gamification, buyShopItem, pushToast, setView } = useApp();
  const [filter, setFilter] = React.useState<string>("all");
  const filters = ["all", "cosmetic", "boost", "heart", "streak", "bundle"];
  const items = filter === "all" ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === filter);
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><ShoppingBag className="text-[#4d96ff]" /> Shop</h1>
          <p className="text-[#8b7d6b] mt-1 text-sm">Spend gems on boosts, hearts & cosmetics.</p>
        </div>
        <div className="bg-white rounded-2xl px-4 py-2 border-2 border-[#e8dcc4]">
          <GemsBadge value={gamification.gems} size={20} />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)} className="capitalize whitespace-nowrap">{f}</Pill>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => {
          const canAfford = gamification.gems >= item.priceGems;
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl shrink-0" style={{ backgroundColor: `${item.color}22` }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#2c2334] text-sm">{item.name}</div>
                  <div className="text-xs text-[#8b7d6b] mt-0.5 line-clamp-2">{item.description}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-bold uppercase tracking-wide",
                  item.rarity === "legendary" ? "text-[#ff6b6b]" :
                  item.rarity === "epic" ? "text-[#a06bd6]" :
                  item.rarity === "rare" ? "text-[#4d96ff]" : "text-[#8b7d6b]")}>{item.rarity}</span>
                <Button3D
                  variant={canAfford ? "primary" : "secondary"}
                  size="sm"
                  disabled={!canAfford}
                  onClick={() => {
                    if (buyShopItem(item.id, item.priceGems, item.name)) {
                      pushToast({ text: `Purchased ${item.name}!`, emoji: item.icon, variant: "success" });
                    } else {
                      pushToast({ text: "Not enough gems", emoji: "💔", variant: "error" });
                    }
                  }}
                >
                  {item.priceGems} 💎
                </Button3D>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-gradient-to-r from-[#ffc93c] to-[#ff6b6b] rounded-2xl p-5 text-white text-center">
        <Crown size={28} className="mx-auto mb-2" />
        <h3 className="font-display text-xl font-extrabold">Need more gems?</h3>
        <p className="text-sm text-white/85 mt-1">Upgrade to Lingoland Plus for 2× gem earnings.</p>
        <Button3D variant="secondary" size="md" className="mt-3 bg-white text-[#ff6b6b]" onClick={() => setView("subscription")}>
          See Plus plans
        </Button3D>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────
export function ProfileView() {
  const { user, gamification, setView, coursesProgress, activeCourseId, aiConversations, mistakes, achievementsProgress, reviewItems } = useApp();
  const activeCourse = useActiveCourse();
  if (!user) return null;
  const cp = activeCourseId ? coursesProgress[activeCourseId] : null;
  const totalLessons = activeCourse?.units.reduce((a, u) => a + u.lessons.length, 0) ?? 0;
  const completedCount = cp?.completedLessons.length ?? 0;
  const unlockedAch = Object.values(achievementsProgress).filter((a) => a.unlockedAt).length;
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#e8dcc4] text-center">
        <div className="w-24 h-24 rounded-full bg-[#fff0d6] grid place-items-center text-6xl mx-auto mb-3">{user.avatar}</div>
        <h1 className="font-display text-2xl font-extrabold">{user.name}</h1>
        <p className="text-sm text-[#8b7d6b]">{user.email}</p>
        <div className="mt-4 flex items-center justify-center gap-5 text-sm">
          <button onClick={() => setView("stats")} className="flex flex-col items-center hover:scale-105 transition">
            <span className="font-display text-xl font-extrabold text-[#ff6b6b]">{gamification.currentStreak}</span>
            <span className="text-[10px] text-[#8b7d6b] uppercase font-bold">streak</span>
          </button>
          <button onClick={() => setView("stats")} className="flex flex-col items-center hover:scale-105 transition">
            <span className="font-display text-xl font-extrabold text-[#ffc93c]">{gamification.totalXP}</span>
            <span className="text-[10px] text-[#8b7d6b] uppercase font-bold">total XP</span>
          </button>
          <button onClick={() => setView("shop")} className="flex flex-col items-center hover:scale-105 transition">
            <span className="font-display text-xl font-extrabold text-[#4d96ff]">{gamification.gems}</span>
            <span className="text-[10px] text-[#8b7d6b] uppercase font-bold">gems</span>
          </button>
        </div>
        <Button3D variant="secondary" size="sm" className="mt-4" onClick={() => setView("settings")}>
          <Pencil size={14} /> Edit profile
        </Button3D>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox value={completedCount} label="Lessons" emoji="📚" onClick={() => setView("learn")} />
        <StatBox value={reviewItems.length} label="Words" emoji="🧠" onClick={() => setView("insights")} />
        <StatBox value={unlockedAch} label="Achievements" emoji="🏆" onClick={() => setView("achievements")} />
        <StatBox value={aiConversations.length} label="AI chats" emoji="🤖" onClick={() => setView("ai-tutor")} />
      </div>

      {/* Current course */}
      {activeCourse && (
        <div className="bg-white rounded-2xl p-5 border-2 border-[#e8dcc4]">
          <h2 className="font-bold text-[#2c2334] mb-3">Current course</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl" style={{ backgroundColor: `${activeCourse.iconColor}22` }}>
              {activeCourse.languageId === "es" ? "🇪🇸" : activeCourse.languageId === "ja" ? "🇯🇵" : "🇫🇷"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">{activeCourse.title}</div>
              <div className="text-xs text-[#8b7d6b]">{completedCount} / {totalLessons} lessons</div>
            </div>
            <Button3D variant="primary" size="sm" onClick={() => setView("learn")}>Continue</Button3D>
          </div>
        </div>
      )}

      {/* Mistakes preview */}
      {mistakes.length > 0 && (
        <div className="bg-[#fff0d6] rounded-2xl p-4 border-2 border-[#ffc93c]/40">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-[#6b4f1d] flex items-center gap-2"><AlertCircle size={16} /> Mistake notebook</h2>
            <button onClick={() => setView("mistakes")} className="text-xs font-bold text-[#4d96ff]">View all</button>
          </div>
          <p className="text-sm text-[#6b4f1d] mb-2">{mistakes.length} mistakes tracked • Review them to improve faster</p>
          <Button3D variant="sun" size="sm" onClick={() => setView("mistakes")}>Review now</Button3D>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-3">
        <QuickLink emoji="📊" label="Statistics" desc="Detailed study insights" onClick={() => setView("stats")} />
        <QuickLink emoji="🧠" label="Smart review" desc="Spaced repetition queue" onClick={() => setView("practice")} />
        <QuickLink emoji="🤖" label="AI Tutor" desc="Practice conversations" onClick={() => setView("ai-tutor")} />
        <QuickLink emoji="⚙️" label="Settings" desc="Account & preferences" onClick={() => setView("settings")} />
      </div>
    </div>
  );
}

function StatBox({ value, label, emoji, onClick }: { value: number; label: string; emoji: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-3 border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition text-left">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-display text-xl font-extrabold text-[#2c2334]">{value}</div>
      <div className="text-xs text-[#8b7d6b] font-bold">{label}</div>
    </button>
  );
}

function QuickLink({ emoji, label, desc, onClick }: { emoji: string; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition flex items-center gap-3 text-left">
      <div className="text-2xl">{emoji}</div>
      <div className="flex-1">
        <div className="font-bold text-[#2c2334] text-sm">{label}</div>
        <div className="text-xs text-[#8b7d6b]">{desc}</div>
      </div>
      <ChevronRight size={16} className="text-[#8b7d6b]" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────────────────────────────────────
export function StatsView() {
  const { gamification, coursesProgress, reviewItems, mistakes, aiConversations } = useApp();
  const totalLessons = Object.values(coursesProgress).reduce((a, p) => a + p.completedLessons.length, 0);
  const totalReviews = reviewItems.reduce((a, r) => a + r.correctCount, 0);
  const totalAttempts = reviewItems.reduce((a, r) => a + r.correctCount + r.wrongCount, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalReviews / totalAttempts) * 100) : 0;
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><BarChart3 className="text-[#58cc8d]" /> Statistics</h1>
        <p className="text-[#8b7d6b] mt-1">Track your learning journey.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BigStat emoji="⚡" value={gamification.totalXP} label="Total XP" color="#ffc93c" />
        <BigStat emoji="🔥" value={gamification.currentStreak} label="Current streak" color="#ff6b6b" />
        <BigStat emoji="🌋" value={gamification.longestStreak} label="Longest streak" color="#ff8c42" />
        <BigStat emoji="📚" value={totalLessons} label="Lessons done" color="#58cc8d" />
        <BigStat emoji="🧠" value={reviewItems.length} label="Words learned" color="#a06bd6" />
        <BigStat emoji="✅" value={`${accuracy}%`} label="Review accuracy" color="#4d96ff" />
        <BigStat emoji="🔄" value={totalReviews} label="Reviews" color="#58cc8d" />
        <BigStat emoji="🤖" value={aiConversations.length} label="AI chats" color="#4d96ff" />
      </div>
      <section>
        <h2 className="font-display text-xl font-extrabold mb-3">Streak calendar</h2>
        <div className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
          <StreakCalendar streak={gamification.currentStreak} />
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-extrabold mb-3">Confidence by skill</h2>
        <div className="bg-white rounded-2xl p-5 border-2 border-[#e8dcc4] space-y-3">
          {Object.entries(gamification.confidence).map(([k, v]) => (
            <div key={k}>
              <div className="flex items-center justify-between text-sm font-bold mb-1">
                <span className="capitalize text-[#2c2334]">{k}</span>
                <span className={v < 40 ? "text-[#ff4757]" : v < 70 ? "text-[#ffc93c]" : "text-[#58cc8d]"}>{v}/100</span>
              </div>
              <ProgressBar value={v} color={v < 40 ? "#ff4757" : v < 70 ? "#ffc93c" : "#58cc8d"} height={8} />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-extrabold mb-3">Daily XP (last 7 days)</h2>
        <div className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
          <WeekXPChart dailyXP={gamification.dailyXP} />
        </div>
      </section>
    </div>
  );
}

function BigStat({ emoji, value, label, color }: { emoji: string; value: number | string; label: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4] text-center">
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="font-display text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs text-[#8b7d6b] font-bold uppercase tracking-wide">{label}</div>
    </div>
  );
}

function StreakCalendar({ streak }: { streak: number }) {
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const activeDays = Math.min(streak, 7);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d, i) => {
        const isToday = i === today;
        const isActive = i <= today && (today - i) < activeDays;
        return (
          <div key={i} className="text-center">
            <div className="text-xs font-bold text-[#8b7d6b] mb-1">{d}</div>
            <div className={cn("aspect-square rounded-xl grid place-items-center text-lg", isActive ? "bg-[#ff6b6b] text-white" : "bg-[#fff0d6] text-[#8b7d6b]", isToday && "ring-2 ring-[#58cc8d] ring-offset-2")}>
              {isActive ? "🔥" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekXPChart({ dailyXP }: { dailyXP: number }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const values = Array.from({ length: 7 }, (_, i) => {
    if (i === todayIdx) return Math.max(dailyXP, 10);
    return Math.max(0, Math.round(20 + Math.sin(i * 1.3) * 30 + (i < todayIdx ? 25 : 0)));
  });
  const max = Math.max(...values, 100);
  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="text-xs font-bold text-[#8b7d6b]">{v}</div>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
            className={cn("w-full rounded-t-lg", i === todayIdx ? "bg-gradient-to-t from-[#ff6b6b] to-[#ff8c42]" : "bg-gradient-to-t from-[#58cc8d] to-[#7edda9]")}
            style={{ minHeight: 8 }}
          />
          <div className="text-xs font-bold text-[#8b7d6b]">{days[i]}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// INSIGHTS
// ─────────────────────────────────────────────────────────────────────────
export function InsightsView() {
  const { gamification, mistakes, reviewItems, setView } = useApp();
  const mistakesByCat = mistakes.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + m.occurrences;
    return acc;
  }, {});
  const weakestVocab = [...reviewItems].sort((a, b) => a.strength - b.strength).slice(0, 5);
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Brain className="text-[#a06bd6]" /> Learning Insights</h1>
        <p className="text-[#8b7d6b] mt-1">Understand your strengths and weaknesses.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border-2 border-[#e8dcc4]">
          <h2 className="font-bold mb-3">Confidence scores</h2>
          <div className="space-y-3">
            {Object.entries(gamification.confidence).map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between text-sm font-bold mb-1">
                  <span className="capitalize">{k}</span>
                  <span className={v < 40 ? "text-[#ff4757]" : v < 70 ? "text-[#ffc93c]" : "text-[#58cc8d]"}>{v}/100</span>
                </div>
                <ProgressBar value={v} color={v < 40 ? "#ff4757" : v < 70 ? "#ffc93c" : "#58cc8d"} height={8} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border-2 border-[#e8dcc4]">
          <h2 className="font-bold mb-3">Mistakes by category</h2>
          {Object.keys(mistakesByCat).length === 0 ? (
            <p className="text-sm text-[#8b7d6b]">No mistakes yet — you're doing great!</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(mistakesByCat).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between p-2 rounded-xl bg-[#fff0d6]">
                  <span className="font-bold text-[#6b4f1d] capitalize">{cat}</span>
                  <span className="font-bold text-[#ff6b6b]">{count} mistakes</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <section>
        <h2 className="font-display text-xl font-extrabold mb-3">Words to review</h2>
        <div className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
          {weakestVocab.length === 0 ? (
            <p className="text-sm text-[#8b7d6b] text-center py-4">No vocab tracked yet. Complete a lesson to build your review queue.</p>
          ) : (
            <div className="space-y-2">
              {weakestVocab.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl bg-[#fff0d6]">
                  <div className="flex-1">
                    <div className="font-bold text-[#2c2334]">{r.word}</div>
                    <div className="text-xs text-[#8b7d6b]">{r.translation}</div>
                  </div>
                  <div className="text-xs font-bold text-[#8b7d6b]">strength {Math.round(r.strength * 100)}%</div>
                </div>
              ))}
            </div>
          )}
          <Button3D variant="primary" size="sm" full className="mt-3" onClick={() => setView("practice")}>
            Start smart review <Brain size={14} />
          </Button3D>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MISTAKE NOTEBOOK
// ─────────────────────────────────────────────────────────────────────────
export function MistakesView() {
  const { mistakes, setView } = useApp();
  const sorted = [...mistakes].sort((a, b) => b.occurrences - a.occurrences || b.lastAt - a.lastAt);
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><AlertCircle className="text-[#ff4757]" /> Mistake Notebook</h1>
        <p className="text-[#8b7d6b] mt-1">Recurring mistakes that need a refresher.</p>
      </div>
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-[#e8dcc4] text-center">
          <Lumo size={140} expression="excited" className="mx-auto" />
          <h2 className="font-display text-xl font-extrabold mt-4">No mistakes yet!</h2>
          <p className="text-[#8b7d6b] mt-2">Every mistake is a chance to learn — keep practicing.</p>
          <Button3D variant="primary" size="lg" className="mt-4" onClick={() => setView("learn")}>Start a lesson</Button3D>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[#8b7d6b] px-2 py-0.5 rounded-full bg-[#fff0d6]">{m.category}</span>
                {m.occurrences > 1 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ffe3e3] text-[#c83243]">×{m.occurrences}</span>}
              </div>
              <div className="bg-[#fff0d6] rounded-xl p-3 mb-2">
                <div className="text-xs font-bold text-[#8b7d6b] uppercase mb-1">Prompt</div>
                <div className="font-bold text-[#2c2334]">{m.prompt}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <div className="bg-[#ffe3e3] rounded-xl p-2.5">
                  <div className="text-xs font-bold text-[#c83243] uppercase mb-1">You said</div>
                  <div className="font-bold text-[#c83243] line-through">{m.userAnswer}</div>
                </div>
                <div className="bg-[#d7ffe5] rounded-xl p-2.5">
                  <div className="text-xs font-bold text-[#2a8a4f] uppercase mb-1">Correct</div>
                  <div className="font-bold text-[#2a8a4f]">{m.correctAnswer}</div>
                </div>
              </div>
              {m.explanation && (
                <div className="mt-2 text-sm text-[#6b4f1d] bg-[#fff8ee] rounded-xl p-2.5 flex items-start gap-2">
                  <Lightbulb size={14} className="text-[#ffc93c] shrink-0 mt-0.5" />
                  <span>{m.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PRACTICE (smart review)
// ─────────────────────────────────────────────────────────────────────────
export function PracticeView() {
  const { reviewItems, reviewItem, pushToast, setView, addXP, progressQuest } = useApp();
  const [idx, setIdx] = React.useState(0);
  const [showAns, setShowAns] = React.useState(false);
  const [done, setDone] = React.useState(0);
  const current = reviewItems[idx];

  function answer(correct: boolean) {
    if (!current) return;
    reviewItem(current.id, correct);
    const newDone = done + 1;
    setDone(newDone);
    if (correct) {
      addXP(2, "practice");
      progressQuest("xp", 2);
      pushToast({ text: "+2 XP", emoji: "⚡", variant: "success" });
    } else {
      pushToast({ text: "Try again later", emoji: "🤔", variant: "info" });
    }
    setShowAns(false);
    if (idx + 1 < reviewItems.length) {
      setIdx(idx + 1);
    } else {
      pushToast({ text: `Review complete! ${newDone} cards`, emoji: "🎉", variant: "success" });
      setView("home");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setView("home")} className="w-9 h-9 rounded-full grid place-items-center hover:bg-[#fff0d6]">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-extrabold flex-1">Smart Review</h1>
        <span className="text-xs font-bold text-[#8b7d6b]">{done}/{reviewItems.length}</span>
      </div>
      {reviewItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-[#e8dcc4] text-center">
          <Lumo size={140} expression="thinking" className="mx-auto" />
          <h2 className="font-display text-xl font-extrabold mt-4">No words to review yet</h2>
          <p className="text-[#8b7d6b] mt-2">Complete lessons to build your spaced-repetition queue.</p>
          <Button3D variant="primary" size="lg" className="mt-4" onClick={() => setView("learn")}>Go to learn</Button3D>
        </div>
      ) : current ? (
        <div>
          <div className="bg-white rounded-3xl p-8 border-2 border-[#e8dcc4] text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-xs font-bold uppercase tracking-wide text-[#8b7d6b] mb-2">Word</div>
            <div className="font-display text-4xl font-extrabold">{current.word}</div>
            {showAns && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wide text-[#8b7d6b] mb-1">Translation</div>
                <div className="font-display text-2xl font-extrabold text-[#58cc8d]">{current.translation}</div>
                {current.pronunciation && <div className="text-sm text-[#8b7d6b] mt-1">/{current.pronunciation}/</div>}
              </motion.div>
            )}
          </div>
          <div className="mt-4">
            {!showAns ? (
              <Button3D variant="primary" size="lg" full onClick={() => setShowAns(true)}>
                Show answer <ChevronRight size={18} />
              </Button3D>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button3D variant="danger" size="lg" onClick={() => answer(false)}>
                  <X size={18} /> Didn't know
                </Button3D>
                <Button3D variant="primary" size="lg" onClick={() => answer(true)}>
                  <Check size={18} /> Got it
                </Button3D>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// AI TUTOR
// ─────────────────────────────────────────────────────────────────────────
export function AITutorView() {
  const { setView, activeCourseId, aiConversations, newAIConversation } = useApp();
  const course = COURSES.find((c) => c.id === activeCourseId);
  const languageId = course?.languageId ?? "es";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Bot className="text-[#4d96ff]" /> AI Tutor</h1>
          <p className="text-[#8b7d6b] mt-1 text-sm">Practice real conversations with Lumo.</p>
        </div>
        <LumoFace size={56} />
      </div>
      <div className="bg-[#fff0d6] rounded-2xl p-4 border-2 border-[#ffc93c]/40 flex items-start gap-3">
        <Sparkles className="text-[#ffc93c] shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-[#6b4f1d]">
          <strong>How it works:</strong> Pick a scenario, type your reply in {languageId === "es" ? "Spanish" : languageId === "ja" ? "Japanese" : "French"}, and Lumo will gently correct mistakes and explain why.
        </div>
      </div>
      <section>
        <h2 className="font-display text-xl font-extrabold mb-3">Choose a scenario</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {AI_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                const convId = newAIConversation(s.id, languageId, s.name);
                setView("ai-chat", { conversationId: convId });
              }}
              className="text-left bg-white rounded-2xl p-4 border-2 border-[#e8dcc4] hover:border-[#4d96ff] transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0" style={{ backgroundColor: `${s.color}22` }}>{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#2c2334]">{s.name}</div>
                  <div className="text-xs text-[#8b7d6b] mt-0.5 line-clamp-2">{s.description}</div>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#e6f0ff] text-[#4d96ff]">{s.difficulty}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
      {aiConversations.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-extrabold mb-3">Recent conversations</h2>
          <div className="bg-white rounded-2xl border-2 border-[#e8dcc4] divide-y divide-[#e8dcc4] overflow-hidden">
            {aiConversations.slice(0, 6).map((c) => {
              const scenario = AI_SCENARIOS.find((s) => s.id === c.scenarioId);
              return (
                <button key={c.id} onClick={() => setView("ai-chat", { conversationId: c.id })} className="w-full flex items-center gap-3 p-3 hover:bg-[#fff0d6] transition text-left">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ backgroundColor: `${scenario?.color ?? "#4d96ff"}22` }}>{scenario?.emoji ?? "💬"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#2c2334] truncate">{c.title}</div>
                    <div className="text-xs text-[#8b7d6b]">{c.messages.length} messages • {new Date(c.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <ChevronRight size={16} className="text-[#8b7d6b]" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export function AIChatView() {
  const { viewParams, aiConversations, saveAIConversation, pushToast } = useApp();
  const convId = viewParams.conversationId;
  const conv = aiConversations.find((c) => c.id === convId);
  const scenario = AI_SCENARIOS.find((s) => s.id === conv?.scenarioId);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conv?.messages.length, sending]);

  React.useEffect(() => {
    if (conv && conv.messages.length === 0 && scenario) {
      const opening = {
        role: "assistant" as const,
        content: scenario.openingLine.source,
        translation: scenario.openingLine.translation,
        ts: Date.now(),
      };
      saveAIConversation({ ...conv, messages: [opening], updatedAt: Date.now() });
    }
  }, [conv?.id]);

  if (!conv || !scenario) {
    return (
      <div className="p-8 text-center text-[#8b7d6b]">
        Conversation not found.{" "}
        <button onClick={() => useApp.getState().setView("ai-tutor")} className="text-[#4d96ff] underline">Back to AI Tutor</button>
      </div>
    );
  }

  async function send() {
    if (!input.trim() || !conv || !scenario) return;
    const userMsg = { role: "user" as const, content: input.trim(), ts: Date.now() };
    const updated = [...conv.messages, userMsg];
    saveAIConversation({ ...conv, messages: updated, updatedAt: Date.now() });
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          languageId: conv.languageId,
          difficulty: scenario.difficulty,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const assistantMsg = {
        role: "assistant" as const,
        content: data.content,
        translation: data.translation,
        correction: data.correction,
        ts: Date.now(),
      };
      saveAIConversation({ ...conv, messages: [...updated, assistantMsg], updatedAt: Date.now() });
      if (data.correction) {
        pushToast({ text: "Lumo gave you feedback 💡", emoji: "✨", variant: "info" });
      }
    } catch {
      // Fallback: still respond with a canned message
      const fallback = {
        role: "assistant" as const,
        content: conv.languageId === "es" ? "¡Muy bien! Continúa." : conv.languageId === "ja" ? "いいですね!" : "Très bien !",
        translation: "Very good! Keep going.",
        ts: Date.now(),
      };
      saveAIConversation({ ...conv, messages: [...updated, fallback], updatedAt: Date.now() });
      pushToast({ text: "Using offline mode", emoji: "⚠️", variant: "info" });
    } finally {
      setSending(false);
    }
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    const map: Record<string, string> = { es: "es-ES", ja: "ja-JP", fr: "fr-FR" };
    u.lang = map[conv!.languageId] ?? "en-US";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#e8dcc4]">
        <button onClick={() => useApp.getState().setView("ai-tutor")} className="w-9 h-9 rounded-full grid place-items-center hover:bg-[#fff0d6]">
          <ChevronLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ backgroundColor: `${scenario.color}22` }}>{scenario.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate">{scenario.name}</div>
          <div className="text-xs text-[#8b7d6b]">{scenario.difficulty} • {conv.languageId.toUpperCase()}</div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pb-3">
        {conv.messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2 items-end", isUser && "flex-row-reverse")}
            >
              {!isUser && <div className="w-8 h-8 rounded-full bg-[#fff0d6] grid place-items-center shrink-0"><LumoFace size={28} /></div>}
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5", isUser ? "bg-[#58cc8d] text-white rounded-br-md" : "bg-white border-2 border-[#e8dcc4] text-[#2c2334] rounded-bl-md")}>
                <div className="font-bold">{m.content}</div>
                {!isUser && m.translation && (
                  <div className="text-xs text-[#8b7d6b] mt-1 italic">📖 {m.translation}</div>
                )}
                {!isUser && (
                  <button onClick={() => speak(m.content)} className="mt-1 inline-flex items-center gap-1 text-xs text-[#4d96ff] hover:underline">
                    <Volume2 size={12} /> Play
                  </button>
                )}
                {m.correction && (
                  <div className="mt-2 bg-[#fff0d6] rounded-xl p-2.5 text-xs">
                    <div className="font-bold text-[#6b4f1d] mb-1">💡 Lumo's correction</div>
                    <div className="text-[#c83243] line-through">{m.correction.said}</div>
                    <div className="text-[#2a8a4f] font-bold">→ {m.correction.better}</div>
                    <div className="text-[#6b4f1d] mt-1">{m.correction.why}</div>
                    {m.correction.example && <div className="text-[#8b7d6b] mt-1 italic">Example: {m.correction.example}</div>}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        {sending && (
          <div className="flex items-center gap-2 px-3">
            <div className="w-8 h-8 rounded-full bg-[#fff0d6] grid place-items-center"><LumoFace size={28} /></div>
            <div className="bg-white rounded-2xl px-4 py-3 border-2 border-[#e8dcc4] flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8b7d6b] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#8b7d6b] animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="w-2 h-2 rounded-full bg-[#8b7d6b] animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-[#e8dcc4] pt-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Type in ${conv.languageId === "es" ? "Spanish" : conv.languageId === "ja" ? "Japanese" : "French"}...`}
            rows={2}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#e8dcc4] focus:border-[#4d96ff] outline-none font-bold resize-none bg-white"
          />
          <Button3D variant="primary" size="lg" onClick={send} disabled={!input.trim() || sending}>
            <Send size={18} />
          </Button3D>
        </div>
        <p className="text-xs text-[#8b7d6b] mt-1.5 text-center">Lumo will correct your mistakes — don't worry about being perfect!</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FRIENDS
// ─────────────────────────────────────────────────────────────────────────
export function FriendsView() {
  const { pushToast } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Users className="text-[#4d96ff]" /> Friends</h1>
        <p className="text-[#8b7d6b] mt-1">Learn together, stay motivated.</p>
      </div>
      <div className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
        <h2 className="font-bold text-[#2c2334] mb-3">Your friends</h2>
        <div className="space-y-2">
          {BOT_LEARNERS.slice(0, 5).map((b) => (
            <div key={b.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#fff0d6]">
              <div className="w-10 h-10 rounded-full bg-[#fff0d6] grid place-items-center text-xl">{b.avatar}</div>
              <div className="flex-1">
                <div className="font-bold text-[#2c2334]"><span className="mr-1">{b.country}</span>{b.name}</div>
                <div className="text-xs text-[#8b7d6b]">{b.baseXP} XP this week</div>
              </div>
              <Button3D variant="secondary" size="sm" onClick={() => pushToast({ text: `Challenge sent to ${b.name}!`, emoji: "🏆", variant: "success" })}>
                Challenge
              </Button3D>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#4d96ff] to-[#a06bd6] rounded-2xl p-5 text-white text-center">
        <Users size={32} className="mx-auto mb-2" />
        <h2 className="font-display text-xl font-extrabold">Invite friends, earn rewards</h2>
        <p className="text-sm text-white/85 mt-1">Get 50 gems for each friend who joins Lingoland.</p>
        <Button3D variant="secondary" size="md" className="mt-3 bg-white text-[#4d96ff]" onClick={() => pushToast({ text: "Invite link copied!", emoji: "🔗", variant: "success" })}>
          Share invite link
        </Button3D>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────
export function NotificationsView() {
  const { notifications, markNotificationRead, setView } = useApp();
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Bell className="text-[#58cc8d]" /> Notifications</h1>
      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-[#e8dcc4] text-center">
          <Bell size={48} className="mx-auto text-[#8b7d6b]" />
          <h2 className="font-display text-xl font-extrabold mt-4">You're all caught up!</h2>
          <p className="text-[#8b7d6b] mt-2">New notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => { markNotificationRead(n.id); if (n.link) setView(n.link); }}
              className={cn("w-full text-left bg-white rounded-2xl p-4 border-2 border-[#e8dcc4] flex items-start gap-3 hover:border-[#58cc8d] transition", !n.read && "border-l-4 border-l-[#58cc8d]")}
            >
              <div className="w-10 h-10 rounded-full bg-[#fff0d6] grid place-items-center text-xl shrink-0">{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#2c2334]">{n.title}</div>
                <div className="text-sm text-[#8b7d6b]">{n.body}</div>
                <div className="text-xs text-[#8b7d6b] mt-1">{timeAgo(n.createdAt)}</div>
              </div>
              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-[#58cc8d] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────
export function SettingsView() {
  const { user, gamification, setView, setFocusMode, focusMode, theme, setTheme, resetProgress, logout, pushToast } = useApp();
  const [sound, setSound] = React.useState(true);
  const [notif, setNotif] = React.useState(true);
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="font-display text-3xl font-extrabold">⚙️ Settings</h1>
      <section className="bg-white rounded-2xl border-2 border-[#e8dcc4] divide-y divide-[#e8dcc4] overflow-hidden">
        <SettingRow icon="👤" label="Account" desc={user?.email ?? ""} onClick={() => pushToast({ text: "Account editor coming soon", emoji: "🚧", variant: "info" })} />
        <SettingRow icon="🎯" label="Daily goal" desc={`${gamification.dailyGoalXP} XP / day`} onClick={() => pushToast({ text: "Daily goal editor coming soon", emoji: "🎯", variant: "info" })} />
        <SettingRow icon="🔥" label="Streak" desc={`${gamification.currentStreak} days • longest ${gamification.longestStreak}`} onClick={() => setView("stats")} />
        <SettingRow icon="🏆" label="Achievements" desc="View your badges" onClick={() => setView("achievements")} />
      </section>
      <section className="bg-white rounded-2xl border-2 border-[#e8dcc4] divide-y divide-[#e8dcc4] overflow-hidden">
        <ToggleRow icon="🔔" label="Notifications" desc="Quests, friends, streaks" value={notif} onChange={setNotif} />
        <ToggleRow icon="🔊" label="Sound effects" desc="Tap sounds, success chimes" value={sound} onChange={setSound} />
        <ToggleRow icon="🌙" label="Dark mode" desc="Switch theme" value={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} />
        <ToggleRow icon="🎯" label="Focus mode" desc="Hide distractions during lessons" value={focusMode} onChange={setFocusMode} />
      </section>
      <section className="bg-white rounded-2xl border-2 border-[#e8dcc4] divide-y divide-[#e8dcc4] overflow-hidden">
        <SettingRow icon="👑" label="Lingoland Plus" desc="Manage subscription" onClick={() => setView("subscription")} />
        <SettingRow icon="🛡️" label="Privacy" desc="Data and security" onClick={() => pushToast({ text: "Privacy policy coming soon", emoji: "🛡️", variant: "info" })} />
        <SettingRow icon="❓" label="Help & support" desc="FAQ and contact" onClick={() => pushToast({ text: "Help center coming soon", emoji: "❓", variant: "info" })} />
        <SettingRow icon="ℹ️" label="About Lingoland" desc="v1.0 • Made with 🦊" onClick={() => pushToast({ text: "Lingoland v1.0 — original brand", emoji: "🦊", variant: "info" })} />
      </section>
      <section className="bg-white rounded-2xl border-2 border-[#e8dcc4] overflow-hidden">
        <button
          onClick={() => { if (confirm("Reset all progress? This cannot be undone.")) { resetProgress(); pushToast({ text: "Progress reset", emoji: "🔄", variant: "info" }); } }}
          className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-[#fff0d6] text-[#ff4757] font-bold text-sm"
        >
          <RefreshCw size={18} /> Reset all progress
        </button>
        <div className="h-px bg-[#e8dcc4]" />
        <button onClick={() => logout()} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-[#fff0d6] text-[#ff4757] font-bold text-sm">
          <X size={18} /> Log out
        </button>
      </section>
    </div>
  );
}

function SettingRow({ icon, label, desc, onClick }: { icon: string; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-[#fff0d6] text-left">
      <div className="w-9 h-9 rounded-xl bg-[#fff0d6] grid place-items-center text-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#2c2334] text-sm">{label}</div>
        <div className="text-xs text-[#8b7d6b] truncate">{desc}</div>
      </div>
      <ChevronRight size={16} className="text-[#8b7d6b]" />
    </button>
  );
}

function ToggleRow({ icon, label, desc, value, onChange }: { icon: string; label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#fff0d6] grid place-items-center text-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#2c2334] text-sm">{label}</div>
        <div className="text-xs text-[#8b7d6b]">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn("relative w-11 h-6 rounded-full transition-colors", value ? "bg-[#58cc8d]" : "bg-[#e8dcc4]")}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
          animate={{ left: value ? "calc(100% - 22px)" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION
// ─────────────────────────────────────────────────────────────────────────
export function SubscriptionView() {
  const { setView, pushToast } = useApp();
  const [cycle, setCycle] = React.useState<"monthly" | "yearly">("monthly");
  const plans = [
    { id: "free", name: "Free", price: { monthly: 0, yearly: 0 }, color: "#58cc8d", features: ["5 hearts", "Daily quests", "Bronze & Silver leagues", "1 AI chat / day"] },
    { id: "plus", name: "Plus", price: { monthly: 6.99, yearly: 47.99 }, color: "#ff6b6b", highlighted: true, features: ["Unlimited hearts", "All leagues", "Unlimited AI tutor", "No ads", "3 streak freezes / mo", "2× gem earnings"] },
    { id: "family", name: "Family", price: { monthly: 9.99, yearly: 79.99 }, color: "#4d96ff", features: ["Everything in Plus", "Up to 6 accounts", "Family leaderboard", "Shared streaks", "Parent dashboard"] },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <button onClick={() => setView("home")} className="inline-flex items-center gap-2 text-[#8b7d6b] hover:text-[#2c2334] font-bold text-sm">
        <ChevronLeft size={16} /> Back
      </button>
      <div className="text-center">
        <Crown size={48} className="mx-auto text-[#ffc93c]" />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-2">Go Lingoland Plus</h1>
        <p className="text-[#8b7d6b] mt-1">Unlock the full experience. Cancel anytime.</p>
      </div>
      <div className="flex justify-center">
        <div className="inline-flex gap-1 p-1 rounded-full bg-[#fff0d6]">
          <Pill active={cycle === "monthly"} onClick={() => setCycle("monthly")}>Monthly</Pill>
          <Pill active={cycle === "yearly"} onClick={() => setCycle("yearly")}>Yearly — save 33%</Pill>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 items-stretch">
        {plans.map((p) => (
          <div
            key={p.id}
            className={cn("relative rounded-3xl p-5 border-2 flex flex-col", p.highlighted ? "border-[#ff6b6b] bg-gradient-to-b from-[#fff5f5] to-white md:scale-105" : "border-[#e8dcc4] bg-white")}
          >
            {p.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide" style={{ backgroundColor: p.color }}>
                Most popular
              </span>
            )}
            <h3 className="font-display text-2xl font-extrabold">{p.name}</h3>
            <div className="flex items-baseline gap-1 my-3">
              <span className="font-display text-4xl font-extrabold" style={{ color: p.color }}>${p.price[cycle]}</span>
              <span className="text-sm text-[#8b7d6b]">/ {cycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            <ul className="space-y-2 mb-5 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="text-[#58cc8d] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button3D
              variant={p.highlighted ? "danger" : p.id === "free" ? "secondary" : "primary"}
              size="lg"
              full
              onClick={() => {
                if (p.id === "free") {
                  setView("home");
                } else {
                  pushToast({ text: `Starting ${p.name} 14-day free trial!`, emoji: "🎉", variant: "success" });
                  setTimeout(() => setView("home"), 800);
                }
              }}
            >
              {p.id === "free" ? "Current plan" : `Start ${p.name} free`}
            </Button3D>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[#8b7d6b]">
        Cancel anytime. Auto-renews. By subscribing you agree to Lingoland's Terms of Service.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────
export function AdminView() {
  const { setView } = useApp();
  const [tab, setTab] = React.useState<"overview" | "courses" | "users" | "content">("overview");
  const totalUsers = 12483;
  const totalLessons = COURSES.reduce((a, c) => a + c.units.reduce((b, u) => b + u.lessons.length, 0), 0);
  const totalXP = 1842930;
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><Shield className="text-[#a06bd6]" /> Admin Dashboard</h1>
          <p className="text-[#8b7d6b] mt-1 text-sm">Manage courses, users, and content.</p>
        </div>
        <Button3D variant="secondary" size="sm" onClick={() => setView("home")}>Exit admin</Button3D>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["overview", "courses", "users", "content"] as const).map((t) => (
          <Pill key={t} active={tab === t} onClick={() => setTab(t)} className="capitalize whitespace-nowrap">{t}</Pill>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <BigStat emoji="👥" value={totalUsers.toLocaleString()} label="Total users" color="#4d96ff" />
            <BigStat emoji="📚" value={totalLessons} label="Lessons" color="#58cc8d" />
            <BigStat emoji="⚡" value={totalXP.toLocaleString()} label="XP earned" color="#ffc93c" />
            <BigStat emoji="🔥" value={8942} label="Active this week" color="#ff6b6b" />
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-[#e8dcc4]">
            <h2 className="font-bold mb-3">Course engagement</h2>
            <div className="space-y-3">
              {COURSES.map((c) => {
                const learners = c.languageId === "es" ? 6240 : c.languageId === "ja" ? 3950 : 2293;
                const max = 6240;
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between text-sm font-bold mb-1">
                      <span>{c.languageId === "es" ? "🇪🇸" : c.languageId === "ja" ? "🇯🇵" : "🇫🇷"} {c.title.split(" ")[0]}</span>
                      <span className="text-[#8b7d6b]">{learners.toLocaleString()} learners</span>
                    </div>
                    <ProgressBar value={(learners / max) * 100} color={c.iconColor} height={8} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="space-y-3">
          {COURSES.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl" style={{ backgroundColor: `${c.iconColor}22` }}>
                  {c.languageId === "es" ? "🇪🇸" : c.languageId === "ja" ? "🇯🇵" : "🇫🇷"}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{c.title}</div>
                  <div className="text-xs text-[#8b7d6b]">{c.units.length} units • {c.units.reduce((a, u) => a + u.lessons.length, 0)} lessons</div>
                </div>
                <Button3D variant="secondary" size="sm" onClick={() => useApp.getState().pushToast({ text: "Edit course coming soon", emoji: "🚧", variant: "info" })}>Edit</Button3D>
              </div>
              <div className="space-y-1.5">
                {c.units.map((u) => (
                  <div key={u.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#fff0d6]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: u.color }} />
                    <span className="text-sm font-bold text-[#6b4f1d] flex-1">{u.title} — {u.subtitle}</span>
                    <span className="text-xs text-[#8b7d6b]">{u.lessons.length} lessons</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white rounded-2xl border-2 border-[#e8dcc4] overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-[#fff0d6] text-xs font-bold uppercase tracking-wide text-[#6b4f1d]">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-3">Streak</div>
            <div className="col-span-2">XP</div>
          </div>
          {BOT_LEARNERS.slice(0, 6).map((b, i) => (
            <div key={b.name} className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-[#e8dcc4] items-center text-sm">
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-xl">{b.avatar}</span>
                <span className="font-bold truncate">{b.name}</span>
              </div>
              <div className="col-span-3 text-[#8b7d6b]">{i === 0 ? "Admin" : i === 1 ? "Moderator" : "Learner"}</div>
              <div className="col-span-3 text-[#ff6b6b] font-bold">{i * 3 + 2} days</div>
              <div className="col-span-2 text-[#ffc93c] font-bold">{b.baseXP}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "content" && (
        <div className="bg-white rounded-2xl p-5 border-2 border-[#e8dcc4]">
          <h2 className="font-bold mb-3">Content management</h2>
          <p className="text-sm text-[#8b7d6b] mb-4">Manage vocabulary, grammar topics, and lesson content without touching code.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <button onClick={() => useApp.getState().pushToast({ text: "Vocab editor coming soon", emoji: "📚", variant: "info" })} className="p-4 rounded-2xl border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition text-left">
              <BookOpen size={20} className="text-[#58cc8d] mb-2" />
              <div className="font-bold text-sm">Vocabulary</div>
              <div className="text-xs text-[#8b7d6b]">Add, edit, tag words</div>
            </button>
            <button onClick={() => useApp.getState().pushToast({ text: "Grammar editor coming soon", emoji: "📐", variant: "info" })} className="p-4 rounded-2xl border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition text-left">
              <Sparkles size={20} className="text-[#4d96ff] mb-2" />
              <div className="font-bold text-sm">Grammar topics</div>
              <div className="text-xs text-[#8b7d6b]">Rules & examples</div>
            </button>
            <button onClick={() => useApp.getState().pushToast({ text: "Lesson editor coming soon", emoji: "📝", variant: "info" })} className="p-4 rounded-2xl border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition text-left">
              <Pencil size={20} className="text-[#a06bd6] mb-2" />
              <div className="font-bold text-sm">Lessons</div>
              <div className="text-xs text-[#8b7d6b]">Build exercises</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STORIES view (lists all "story" lessons)
// ─────────────────────────────────────────────────────────────────────────
export function StoriesView() {
  const { setView, activeCourseId } = useApp();
  const course = COURSES.find((c) => c.id === activeCourseId);
  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <Lumo size={140} expression="thinking" className="mx-auto" />
        <h2 className="font-display text-xl font-extrabold mt-3">Pick a course first</h2>
        <Button3D variant="primary" className="mt-4" onClick={() => setView("learn")}>Choose course</Button3D>
      </div>
    );
  }
  const stories = course.units.flatMap((u) => u.lessons.filter((l) => l.type === "story"));
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><BookOpen className="text-[#a06bd6]" /> Stories</h1>
        <p className="text-[#8b7d6b] mt-1">Learn through bite-sized narratives.</p>
      </div>
      {stories.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-[#e8dcc4] text-center">
          <Lumo size={140} expression="thinking" className="mx-auto" />
          <h2 className="font-display text-xl font-extrabold mt-4">No stories yet</h2>
          <p className="text-[#8b7d6b] mt-2">More stories coming soon — keep an eye out!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {stories.map((s) => (
            <button key={s.id} onClick={() => setView("lesson", { lessonId: s.id })} className="text-left bg-white rounded-2xl p-4 border-2 border-[#e8dcc4] hover:border-[#a06bd6] transition">
              <div className="text-3xl mb-2">📖</div>
              <div className="font-bold text-[#2c2334]">{s.title}</div>
              <div className="text-xs text-[#8b7d6b] mt-1">{s.description}</div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="font-bold text-[#ffc93c]">+{s.xp} XP</span>
                <span className="text-[#8b7d6b]">•</span>
                <span className="text-[#8b7d6b]">{s.exercises.length} parts</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
