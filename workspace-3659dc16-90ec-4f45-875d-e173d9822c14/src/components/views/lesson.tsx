"use client";

/**
 * Lesson shell + completion views for Lingoland.
 *
 * LessonView        — wraps ExerciseRunner with a top bar (quit / progress /
 *                     hearts / title), boots the active lesson on mount from
 *                     `viewParams.lessonId`, shows an "Out of hearts" overlay
 *                     when hearts hit 0, and a friendly not-found state when
 *                     the lesson id is missing or invalid.
 *
 * LessonCompleteView — celebratory screen with confetti, Lumo cheering, big
 *                      count-up reward cards (XP / accuracy / streak), star row,
 *                      perfect-lesson badge + bonus callout, "added to stats"
 *                      mini-list, newly-unlocked achievements, and three CTAs.
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Zap,
  Target,
  Flame,
  Sparkles,
  Gem,
  Share2,
  ChevronRight,
  Dumbbell,
  ArrowLeft,
  Crown,
} from "lucide-react";
import { Button3D } from "@/components/brand/button";
import { Lumo } from "@/components/brand/lumo";
import { ProgressBar, StarRow } from "@/components/brand/indicators";
import { Confetti } from "@/components/layout/app-shell";
import { ExerciseRunner } from "@/components/exercises/runner";
import { useApp } from "@/lib/store";
import { findLesson, type LessonSpec } from "@/data/courses";
import { ACHIEVEMENTS } from "@/data/catalog";

// ─────────────────────────────────────────────────────────────
// Hooks & helpers
// ─────────────────────────────────────────────────────────────

/** Animate a number from 0 → target with an easeOutCubic curve. */
function useCountUp(target: number, duration = 1100, delay = 0): number {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }
    let raf = 0;
    let startTs = 0;
    const beginAt = performance.now() + delay;
    const tick = (now: number) => {
      if (now < beginAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!startTs) startTs = now;
      const t = Math.min(1, (now - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

/** Find the next lesson in the same unit, if any (used for the "Continue" CTA). */
function findNextLessonInUnit(lessonId: string): LessonSpec | null {
  const found = findLesson(lessonId);
  if (!found) return null;
  const { lesson, unit } = found;
  const idx = unit.lessons.findIndex((l) => l.id === lesson.id);
  if (idx < 0 || idx + 1 >= unit.lessons.length) return null;
  return unit.lessons[idx + 1] ?? null;
}

// ─────────────────────────────────────────────────────────────
// LessonView
// ─────────────────────────────────────────────────────────────

export function LessonView() {
  const lessonId = useApp((s) => s.viewParams.lessonId);
  const activeLesson = useApp((s) => s.activeLesson);
  const hearts = useApp((s) => s.gamification.hearts);
  const maxHearts = useApp((s) => s.gamification.maxHearts);
  const startLesson = useApp((s) => s.startLesson);
  const recordAnswer = useApp((s) => s.recordAnswer);
  const advanceLesson = useApp((s) => s.advanceLesson);
  const completeLesson = useApp((s) => s.completeLesson);
  const quitLesson = useApp((s) => s.quitLesson);

  // Look up the lesson spec from the catalog. Memoized so the boot effect
  // doesn't re-run every render (findLesson returns a fresh ref each call).
  const found = React.useMemo(
    () => (lessonId ? findLesson(lessonId) : undefined),
    [lessonId]
  );

  // Boot the active lesson on mount if it isn't already running.
  React.useEffect(() => {
    if (!activeLesson && found) startLesson(found.lesson);
  }, [activeLesson, found, startLesson]);

  if (!activeLesson) {
    if (found) return <LoadingShim />;
    return <LessonNotFound />;
  }

  const total = activeLesson.exercises.length;
  const current = activeLesson.exercises[activeLesson.currentIndex];
  if (!current) return <LessonNotFound />;

  const isLast = activeLesson.currentIndex >= total - 1;
  // Match the runner's own progress semantics: "on exercise N of T".
  const progressPct = ((activeLesson.currentIndex + 1) / total) * 100;
  const languageId = found?.course.languageId ?? "es";
  const lessonTitle = found?.lesson.title ?? "Lesson";

  return (
    <div className="min-h-screen bg-[#fff8ee] flex flex-col">
      {/* Top bar: quit · progress · hearts · title */}
      <header className="sticky top-0 z-20 bg-[#fff8ee]/95 backdrop-blur border-b border-[#e8dcc4]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={quitLesson}
            aria-label="Quit lesson"
            className="w-10 h-10 rounded-full grid place-items-center text-[#8b7d6b] hover:bg-[#fff0d6] transition shrink-0"
          >
            <X size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <ProgressBar value={progressPct} height={10} />
          </div>
          <div
            className="flex items-center gap-1.5 font-extrabold text-[#ff4757] shrink-0"
            aria-label={`Hearts: ${hearts} of ${maxHearts}`}
          >
            <Heart
              size={22}
              fill={hearts > 0 ? "#ff4757" : "#e8dcc4"}
              stroke={hearts > 0 ? "#d63545" : "#c4b8a0"}
              strokeWidth={1.5}
            />
            <span className="tabular-nums text-base">
              {hearts}
              <span className="text-[#8b7d6b]">/{maxHearts}</span>
            </span>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-2 -mt-1">
          <h1 className="text-xs font-bold text-[#8b7d6b] uppercase tracking-wide truncate">
            {lessonTitle}
          </h1>
        </div>
      </header>

      {/* Exercise runner */}
      <main className="flex-1">
        <ExerciseRunner
          exercise={current}
          index={activeLesson.currentIndex}
          total={total}
          languageId={languageId}
          onAnswered={(correct, userAnswer, xp) =>
            recordAnswer(current.id, correct, userAnswer, xp)
          }
          onNext={() => {
            if (isLast) completeLesson();
            else advanceLesson();
          }}
          onQuit={quitLesson}
        />
      </main>

      {/* Out-of-hearts modal */}
      <AnimatePresence>
        {hearts === 0 && <OutOfHeartsOverlay />}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LessonCompleteView
// ─────────────────────────────────────────────────────────────

export function LessonCompleteView() {
  const activeLesson = useApp((s) => s.activeLesson);
  const currentStreak = useApp((s) => s.gamification.currentStreak);
  const achievementsProgress = useApp((s) => s.achievementsProgress);
  const setView = useApp((s) => s.setView);
  const pushToast = useApp((s) => s.pushToast);

  const hasLesson = !!activeLesson;
  const total = activeLesson?.exercises.length ?? 0;
  const correct = activeLesson?.correctCount ?? 0;
  const wrong = activeLesson?.wrongCount ?? 0;
  const xpEarned = activeLesson?.earnedXP ?? 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perfect = hasLesson && wrong === 0;
  const stars = perfect ? 3 : wrong <= 1 ? 2 : 1;
  // Bonus is `floor(rawXP * 0.5)`; since `xpEarned = rawXP * 1.5` when perfect,
  // backing out: bonus ≈ floor(xpEarned / 3).
  const bonus = perfect ? Math.floor(xpEarned / 3) : 0;
  const gemsEarned = 5;
  const startedAt = activeLesson?.startedAt ?? 0;

  // Always +1 day: completing a lesson either increments the streak or starts a
  // new 1-day streak.
  const streakIncreased = hasLesson;

  // Count-up animations — declared unconditionally to satisfy hook rules.
  const animatedXP = useCountUp(hasLesson ? xpEarned : 0, 1100, 200);
  const animatedAccuracy = useCountUp(hasLesson ? accuracy : 0, 950, 350);
  const animatedStreak = useCountUp(hasLesson ? currentStreak : 0, 850, 500);
  const animatedGems = useCountUp(hasLesson ? gemsEarned : 0, 700, 650);

  if (!activeLesson) {
    return <NoLessonToComplete />;
  }

  const nextLesson = findNextLessonInUnit(activeLesson.lessonId);

  const newlyUnlocked = ACHIEVEMENTS.filter((a) => {
    const p = achievementsProgress[a.id];
    return !!p?.unlockedAt && p.unlockedAt > startedAt;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8ee] via-[#fff8ee] to-[#fff0d6] flex flex-col items-center px-4 py-8 md:py-12 relative overflow-hidden">
      <Confetti active />

      {/* Lumo cheering */}
      <motion.div
        initial={{ scale: 0, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 13, delay: 0.1 }}
        className="mb-2"
      >
        <Lumo size={140} expression="cheer" />
      </motion.div>

      {/* Perfect badge */}
      <AnimatePresence>
        {perfect && (
          <motion.div
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 11, delay: 0.3 }}
            className="mb-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ffc93c] to-[#ff6b6b] text-white font-extrabold text-sm uppercase tracking-wide shadow-chunk"
            style={{ ["--btn-shadow" as any]: "#d9744a" }}
            aria-label="Perfect lesson"
          >
            <Sparkles size={16} fill="white" />
            Perfect!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-extrabold text-[#2c2334] text-center mb-1"
      >
        Lesson complete!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-[#8b7d6b] font-bold mb-5 text-center text-sm md:text-base"
      >
        You&rsquo;re on a roll — keep the momentum going!
      </motion.p>

      {/* Stars */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 12 }}
        className="mb-6"
        aria-label={`Earned ${stars} out of 3 stars`}
      >
        <StarRow count={stars} size={36} />
      </motion.div>

      {/* Reward cards */}
      <section className="w-full max-w-3xl mb-6" aria-label="Lesson rewards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <RewardCard
            icon={<Zap size={20} className="text-[#ffc93c]" fill="#ffc93c" strokeWidth={1.5} />}
            label="XP earned"
            value={animatedXP}
            accent="#ffc93c"
            delay={0.4}
          />
          <RewardCard
            icon={<Target size={20} className="text-[#4d96ff]" strokeWidth={1.5} />}
            label="Accuracy"
            value={`${animatedAccuracy}%`}
            accent="#4d96ff"
            delay={0.55}
          />
          <RewardCard
            icon={<Flame size={20} className="text-[#ff6b6b]" fill="#ff6b6b" strokeWidth={1.5} />}
            label="Day streak"
            value={animatedStreak}
            accent="#ff6b6b"
            delay={0.7}
            extra={
              streakIncreased ? (
                <motion.span
                  initial={{ scale: 0, y: 6 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 12 }}
                  className="text-xs font-extrabold text-[#ff6b6b] bg-[#ff6b6b]/10 px-1.5 py-0.5 rounded-md mb-0.5"
                >
                  +1
                </motion.span>
              ) : null
            }
          />
        </div>
      </section>

      {/* Perfect bonus callout */}
      <AnimatePresence>
        {perfect && bonus > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 14 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#fff0d6] text-[#5b3f00] font-bold text-sm border-2 border-[#ffc93c]/50"
            aria-label={`Perfect lesson bonus: ${bonus} XP`}
          >
            <Crown size={16} className="text-[#ffc93c]" fill="#ffc93c" />
            +{bonus} XP perfect bonus!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Added to stats list */}
      <section className="w-full max-w-md mb-6" aria-label="Added to your stats">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#8b7d6b] mb-2 text-center">
          Added to your stats
        </h2>
        <div className="bg-white rounded-2xl p-3 shadow-chunk-sm grid grid-cols-3 gap-2 text-center divide-x divide-[#e8dcc4]">
          <StatItem
            icon={<Zap size={15} className="text-[#ffc93c]" fill="#ffc93c" />}
            value={`+${xpEarned}`}
            label="XP"
          />
          <StatItem
            icon={<Flame size={15} className="text-[#ff6b6b]" fill="#ff6b6b" />}
            value="+1"
            label="day"
          />
          <StatItem
            icon={<Gem size={15} className="text-[#4d96ff]" fill="#4d96ff" />}
            value={`+${animatedGems}`}
            label="gems"
          />
        </div>
      </section>

      {/* Newly unlocked achievements */}
      <AnimatePresence>
        {newlyUnlocked.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="w-full max-w-md mb-6"
            aria-label="Achievements unlocked"
          >
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#8b7d6b] mb-2 text-center">
              Achievement unlocked!
            </h2>
            <div className="space-y-2">
              {newlyUnlocked.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.12, type: "spring", stiffness: 220, damping: 18 }}
                  className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-chunk-sm border-2 border-[#ffc93c]/50"
                >
                  <div className="w-11 h-11 grid place-items-center rounded-xl bg-[#fff0d6] text-2xl shrink-0">
                    {a.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-[#2c2334] text-sm leading-tight">
                      {a.title}
                    </div>
                    <div className="text-xs text-[#8b7d6b] truncate">{a.description}</div>
                  </div>
                  <Sparkles size={18} className="text-[#ffc93c] shrink-0" fill="#ffc93c" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTAs */}
      <section className="w-full max-w-md flex flex-col gap-2.5" aria-label="Next actions">
        <Button3D
          size="xl"
          full
          onClick={() => {
            if (nextLesson) setView("lesson", { lessonId: nextLesson.id });
            else setView("learn");
          }}
          aria-label={
            nextLesson ? `Continue to next lesson: ${nextLesson.title}` : "Continue to learn"
          }
        >
          Continue <ChevronRight size={18} />
        </Button3D>
        <div className="grid grid-cols-2 gap-2.5">
          <Button3D
            variant="secondary"
            size="lg"
            onClick={() => setView("practice")}
            aria-label="Practice more"
          >
            <Dumbbell size={16} /> Practice
          </Button3D>
          <Button3D
            variant="ghost"
            size="lg"
            onClick={() =>
              pushToast({ text: "Shared to your feed! 🎉", variant: "success" })
            }
            aria-label="Share to friends"
          >
            <Share2 size={16} /> Share
          </Button3D>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

interface RewardCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: string;
  delay: number;
  extra?: React.ReactNode;
}

function RewardCard({ icon, label, value, accent, delay, extra }: RewardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 16 }}
      className="relative bg-white rounded-3xl p-5 shadow-chunk overflow-hidden"
      style={{ ["--btn-shadow" as any]: "#e8dcc4" }}
    >
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.15]"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-2 mb-2.5">
        {icon}
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#8b7d6b]">
          {label}
        </span>
      </div>
      <div className="relative flex items-end gap-1.5">
        <span className="text-4xl font-extrabold tabular-nums text-[#2c2334] leading-none">
          {value}
        </span>
        {extra}
      </div>
    </motion.div>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="font-extrabold text-[#2c2334] text-sm tabular-nums">{value}</span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7d6b]">
        {label}
      </span>
    </div>
  );
}

/** Hearts-depleted modal — refill with gems, practice, or quit. */
function OutOfHeartsOverlay() {
  const gems = useApp((s) => s.gamification.gems);
  const spendGems = useApp((s) => s.spendGems);
  const refillHearts = useApp((s) => s.refillHearts);
  const setView = useApp((s) => s.setView);
  const quitLesson = useApp((s) => s.quitLesson);
  const pushToast = useApp((s) => s.pushToast);

  const canRefill = gems >= 30;

  const handleRefill = () => {
    if (spendGems(30)) {
      refillHearts();
      pushToast({ text: "Hearts refilled! ❤️", emoji: "💖", variant: "success" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#2c2334]/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ooh-title"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-chunk"
        style={{ ["--btn-shadow" as any]: "#e8dcc4" }}
      >
        <Lumo size={100} expression="sad" className="mx-auto" />
        <h2 id="ooh-title" className="text-xl font-extrabold text-[#2c2334] mt-3 mb-1">
          Out of hearts!
        </h2>
        <p className="text-[#8b7d6b] font-bold text-sm mb-5">
          You ran out of hearts. Refill to keep going or practice to recover.
        </p>
        <div className="flex flex-col gap-2.5">
          {canRefill ? (
            <Button3D
              variant="primary"
              size="lg"
              full
              onClick={handleRefill}
              aria-label="Refill hearts for 30 gems"
            >
              <Heart size={18} fill="white" /> Refill hearts (30 💎)
            </Button3D>
          ) : (
            <Button3D
              variant="sun"
              size="lg"
              full
              onClick={() => setView("shop")}
              aria-label="Go to shop to buy more gems"
            >
              <Gem size={18} fill="#5b3f00" /> Go to shop
            </Button3D>
          )}
          <Button3D
            variant="secondary"
            size="md"
            full
            onClick={() => setView("practice")}
            aria-label="Practice to recover hearts"
          >
            Practice to recover
          </Button3D>
          <Button3D
            variant="ghost"
            size="md"
            full
            onClick={quitLesson}
            aria-label="Quit lesson and return to learn"
          >
            Quit
          </Button3D>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Lesson id missing or invalid — friendly Lumo sad state. */
function LessonNotFound() {
  const setView = useApp((s) => s.setView);
  return (
    <div className="min-h-screen bg-[#fff8ee] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <Lumo size={140} expression="sad" />
      </motion.div>
      <h1 className="text-2xl font-extrabold text-[#2c2334] mt-4 mb-2">Lesson not found</h1>
      <p className="text-[#8b7d6b] font-bold mb-6 max-w-xs">
        Hmm, we couldn&rsquo;t find that lesson. Let&rsquo;s get you back on the path.
      </p>
      <Button3D size="lg" onClick={() => setView("learn")} aria-label="Back to Learn">
        <ArrowLeft size={18} /> Back to Learn
      </Button3D>
    </div>
  );
}

/** No active lesson to celebrate — graceful fallback for LessonCompleteView. */
function NoLessonToComplete() {
  const setView = useApp((s) => s.setView);
  return (
    <div className="min-h-screen bg-[#fff8ee] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <Lumo size={140} expression="thinking" />
      </motion.div>
      <h1 className="text-2xl font-extrabold text-[#2c2334] mt-4 mb-2">
        No lesson to celebrate
      </h1>
      <p className="text-[#8b7d6b] font-bold mb-6 max-w-xs">
        Start a lesson to earn XP and unlock the celebration!
      </p>
      <Button3D size="lg" onClick={() => setView("learn")} aria-label="Back to Learn">
        <ArrowLeft size={18} /> Back to Learn
      </Button3D>
    </div>
  );
}

/** Brief loader shown while the lesson boots up. */
function LoadingShim() {
  return (
    <div className="min-h-screen bg-[#fff8ee] flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lumo size={100} expression="happy" />
      </motion.div>
      <span className="text-[#8b7d6b] font-bold text-sm">Loading lesson...</span>
    </div>
  );
}
