"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  BookOpen,
  Dumbbell,
  Trophy,
  RefreshCw,
  Mic,
  Lock,
  Check,
  ChevronDown,
  X,
  Sparkles,
  Play,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button3D } from "@/components/brand/button";
import { Lumo, LumoFace } from "@/components/brand/lumo";
import { ProgressBar, StarRow } from "@/components/brand/indicators";
import { useApp, type CourseProgress } from "@/lib/store";
import {
  COURSES,
  LANGUAGES,
  type CourseSpec,
  type UnitSpec,
  type LessonSpec,
} from "@/data/courses";

// ─────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────

type LessonNodeState = "completed" | "current" | "available" | "locked";

const LESSON_TYPE_ICON: Record<LessonSpec["type"], LucideIcon> = {
  lesson: Book,
  story: BookOpen,
  practice: Dumbbell,
  challenge: Trophy,
  review: RefreshCw,
  speaking: Mic,
};

/** 3-position zig-zag pattern: left, center, right, repeat. */
const ZIG_ZAG = [-1, 0, 1] as const;

function languageFlag(languageId: string): string {
  return LANGUAGES.find((l) => l.id === languageId)?.flag ?? "🌐";
}

function languageName(languageId: string): string {
  return LANGUAGES.find((l) => l.id === languageId)?.name ?? languageId;
}

function defaultProgress(courseId: string): CourseProgress {
  return {
    courseId,
    completedLessons: [],
    lessonStars: {},
    currentUnitOrder: 1,
    currentLessonOrder: 1,
    lastVisitedAt: null,
  };
}

function deriveLessonState(
  lesson: LessonSpec,
  lessonIndex: number,
  unit: UnitSpec,
  unitIndex: number,
  course: CourseSpec,
  cp: CourseProgress,
): LessonNodeState {
  if (cp.completedLessons.includes(lesson.id)) return "completed";
  const isCurrent =
    unitIndex + 1 === cp.currentUnitOrder && lessonIndex + 1 === cp.currentLessonOrder;
  if (isCurrent) return "current";

  // First lesson of unit: available only if previous unit is fully completed.
  if (lessonIndex === 0) {
    if (unitIndex === 0) return "available"; // first lesson of the course
    const prevUnit = course.units[unitIndex - 1];
    const prevUnitDone = prevUnit.lessons.every((l) => cp.completedLessons.includes(l.id));
    return prevUnitDone ? "available" : "locked";
  }
  // Otherwise: available if the previous lesson in the same unit is completed.
  const prevLesson = unit.lessons[lessonIndex - 1];
  return cp.completedLessons.includes(prevLesson.id) ? "available" : "locked";
}

/** Compute total lesson count across all units of a course. */
function totalLessonCount(course: CourseSpec): number {
  return course.units.reduce((acc, u) => acc + u.lessons.length, 0);
}

/** Find the first non-completed lesson in a unit (the one the "Start" button jumps to). */
function firstActiveLessonInUnit(
  unit: UnitSpec,
  cp: CourseProgress,
): LessonSpec | undefined {
  return unit.lessons.find((l) => !cp.completedLessons.includes(l.id)) ?? unit.lessons[0];
}

// ─────────────────────────────────────────────────────────────
// Lesson node
// ─────────────────────────────────────────────────────────────

interface LessonNodeProps {
  lesson: LessonSpec;
  state: LessonNodeState;
  unitColor: string;
  index: number;
  stars: number;
  onClick: () => void;
  onLockedClick: () => void;
}

function LessonNode({
  lesson,
  state,
  unitColor,
  index,
  stars,
  onClick,
  onLockedClick,
}: LessonNodeProps) {
  const Icon = LESSON_TYPE_ICON[lesson.type];
  const offsetPct = ZIG_ZAG[index % 3] * 50;

  // Pick colors / sizes based on state and lesson kind.
  let bgColor = unitColor;
  let shadowColor = unitColor;
  let size = 84;
  let opacity = 1;
  const isCompleted = state === "completed";
  const isLocked = state === "locked";
  const isCurrent = state === "current";

  if (isCompleted) {
    bgColor = "#58cc8d";
    shadowColor = "#44b277";
  } else if (isLocked) {
    bgColor = "#c4b8a0";
    shadowColor = "#a89a82";
    opacity = 0.6;
  } else if (isCurrent) {
    size = 104;
  }

  // Bonus / challenge color overrides (only when not locked & not completed).
  const isBonus = !!lesson.isBonus;
  const isChallenge = lesson.type === "challenge";
  if (!isLocked && !isCompleted) {
    if (isBonus) {
      bgColor = "#ffc93c";
      shadowColor = "#e0a91a";
    } else if (isChallenge) {
      bgColor = "#a06bd6";
      shadowColor = "#7c4bb0";
    }
  }

  const clickable = state === "current" || state === "available";

  const ariaLabel = `Lesson: ${lesson.title}, ${state}${
    isCompleted ? `, ${stars} ${stars === 1 ? "star" : "stars"}` : ""
  }`;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ transform: `translateX(${offsetPct}%)` }}
    >
      {/* Pulsing rings for the current lesson */}
      {isCurrent && (
        <>
          <motion.span
            aria-hidden
            className="absolute top-0 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              boxShadow: `0 0 0 6px ${bgColor}55`,
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute top-0 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              boxShadow: `0 0 0 6px ${bgColor}33`,
            }}
            animate={{ scale: [1, 1.32, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          />
        </>
      )}

      {/* Lumo mascot peeking next to the current lesson */}
      {isCurrent && (
        <motion.div
          initial={{ opacity: 0, x: -8, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}
          className="absolute -top-20 right-0 hidden sm:block"
          aria-hidden
        >
          <Lumo size={64} expression="wave" float />
          {/* Speech pointer */}
          <svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          >
            <path d="M14 0 L 26 0 L 20 12 Z" fill="#ff8c42" stroke="#2c2334" strokeWidth="2" />
          </svg>
        </motion.div>
      )}

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.6, y: 12 }}
        animate={{ opacity, scale: 1, y: 0 }}
        transition={{
          delay: Math.min(index * 0.05, 0.6),
          type: "spring",
          stiffness: 220,
          damping: 18,
        }}
        whileHover={clickable ? { scale: 1.06 } : undefined}
        whileTap={clickable ? { scale: 0.94 } : undefined}
        onClick={clickable ? onClick : onLockedClick}
        aria-label={ariaLabel}
        aria-disabled={!clickable}
        className="relative grid place-items-center rounded-full font-extrabold select-none no-tap-highlight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#58cc8d]/30"
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          color: "#fff8ee",
          border: "3px solid #2c2334",
          boxShadow: `0 6px 0 0 ${shadowColor}`,
        }}
      >
        {/* Icon */}
        {isCompleted ? (
          <Check size={32} strokeWidth={3.5} />
        ) : isLocked ? (
          <Lock size={28} strokeWidth={3} />
        ) : (
          <Icon size={32} strokeWidth={2.5} />
        )}

        {/* Bonus sparkle badge */}
        {isBonus && !isLocked && (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 240 }}
            className="absolute -top-1.5 -right-1.5 grid place-items-center w-7 h-7 rounded-full bg-white border-2 border-[#2c2334]"
            aria-hidden
          >
            <Sparkles size={14} className="text-[#ffc93c]" fill="#ffc93c" />
          </motion.span>
        )}

        {/* Star count for completed */}
        {isCompleted && (
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white border-2 border-[#2c2334] shadow-sm">
            <StarRow count={stars} size={11} max={3} />
          </div>
        )}
      </motion.button>

      {/* Lesson title */}
      <div
        className="mt-4 text-xs font-bold text-ink/70 text-center max-w-[140px] leading-tight"
        style={{ opacity: isLocked ? 0.55 : 1 }}
      >
        {lesson.title}
      </div>

      {/* START pill below the current lesson */}
      {isCurrent && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 18 }}
          className="mt-3"
        >
          <Button3D variant="primary" size="sm" onClick={onClick} className="font-extrabold">
            <Play size={14} fill="currentColor" />
            Start
          </Button3D>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Connector ribbon between two consecutive lesson nodes
// ─────────────────────────────────────────────────────────────

function Ribbon({
  fromOffset,
  toOffset,
  color,
}: {
  fromOffset: number;
  toOffset: number;
  color: string;
}) {
  // Offsets are in "half-node-widths" (each unit is 50% of node width).
  // Map them to pixel coords inside an SVG that is ~node-width wide.
  const W = 120; // svg viewport width in px
  const H = 32; // height matches vertical gap between slots
  const fromX = (fromOffset * W) / 2;
  const toX = (toOffset * W) / 2;
  return (
    <svg
      aria-hidden
      width={W}
      height={H}
      viewBox={`${-W / 2} 0 ${W} ${H}`}
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none overflow-visible"
      style={{ top: -H }}
    >
      <path
        d={`M ${fromX} 0 C ${fromX} ${H / 2}, ${toX} ${H / 2}, ${toX} ${H}`}
        stroke={color}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />
      <path
        d={`M ${fromX} 0 C ${fromX} ${H / 2}, ${toX} ${H / 2}, ${toX} ${H}`}
        stroke="#ffffff"
        strokeWidth={3}
        strokeDasharray="2 10"
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Unit section
// ─────────────────────────────────────────────────────────────

function UnitSection({
  course,
  unit,
  unitIndex,
  cp,
  onLessonClick,
  onLockedClick,
}: {
  course: CourseSpec;
  unit: UnitSpec;
  unitIndex: number;
  cp: CourseProgress;
  onLessonClick: (lesson: LessonSpec) => void;
  onLockedClick: () => void;
}) {
  const jumpLesson = firstActiveLessonInUnit(unit, cp);
  // Unit is locked if its first lesson is locked.
  const firstState = deriveLessonState(unit.lessons[0], 0, unit, unitIndex, course, cp);
  const unitLocked = firstState === "locked";
  const completedInUnit = unit.lessons.filter((l) =>
    cp.completedLessons.includes(l.id),
  ).length;
  const unitPct = (completedInUnit / unit.lessons.length) * 100;

  return (
    <section className="mb-14">
      {/* Unit header card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl p-5 mb-10 text-white overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: unit.color }}
      >
        {/* Decorative dots */}
        <div
          aria-hidden
          className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: "#fff8ee" }}
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">
              {unit.title}
            </div>
            <h3 className="font-display text-2xl font-extrabold leading-tight mt-0.5">
              {unit.subtitle}
            </h3>
            <p className="text-sm opacity-90 mt-1 max-w-md">{unit.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-28 h-2 rounded-full bg-white/30 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${unitPct}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </div>
              <span className="text-xs font-bold opacity-90">
                {completedInUnit}/{unit.lessons.length}
              </span>
            </div>
          </div>
          <Button3D
            size="sm"
            variant="secondary"
            disabled={unitLocked}
            onClick={() => jumpLesson && onLessonClick(jumpLesson)}
            className="shrink-0"
          >
            {unitLocked ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
            Start
          </Button3D>
        </div>
      </motion.div>

      {/* Path of lesson nodes */}
      <div className="flex flex-col items-center">
        {unit.lessons.map((lesson, idx) => {
          const state = deriveLessonState(lesson, idx, unit, unitIndex, course, cp);
          const fromOffset = idx > 0 ? ZIG_ZAG[(idx - 1) % 3] : ZIG_ZAG[idx % 3];
          const toOffset = ZIG_ZAG[idx % 3];
          return (
            <div
              key={lesson.id}
              className="relative flex flex-col items-center"
              style={{ marginBottom: idx === unit.lessons.length - 1 ? 0 : 36 }}
            >
              {idx > 0 && (
                <Ribbon fromOffset={fromOffset} toOffset={toOffset} color={unit.color} />
              )}
              <LessonNode
                lesson={lesson}
                state={state}
                unitColor={unit.color}
                index={idx}
                stars={cp.lessonStars[lesson.id] ?? 0}
                onClick={() => onLessonClick(lesson)}
                onLockedClick={onLockedClick}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Course picker modal
// ─────────────────────────────────────────────────────────────

function CoursePickerModal({
  open,
  activeCourseId,
  onPick,
  onClose,
}: {
  open: boolean;
  activeCourseId: string | null;
  onPick: (courseId: string) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-[#2c2334]/55 backdrop-blur-sm grid place-items-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a course"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="bg-background rounded-3xl p-5 w-full max-w-md shadow-2xl border-2 border-[#e8dcc4]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink">Switch course</h3>
                <p className="text-xs text-[#8b7d6b]">Your progress is saved per course.</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#fff0d6] transition text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {COURSES.map((c) => {
                const isActive = activeCourseId === c.id;
                const lessonCount = totalLessonCount(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => onPick(c.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left border-2 ${
                      isActive
                        ? "bg-[#fff0d6] border-[#58cc8d]"
                        : "bg-white border-transparent hover:bg-[#fff0d6]/60 hover:border-[#e8dcc4]"
                    }`}
                  >
                    <span className="text-3xl shrink-0">{languageFlag(c.languageId)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-ink truncate">{c.title}</div>
                      <div className="text-xs text-[#8b7d6b]">
                        {c.units.length} units • {lessonCount} lessons
                      </div>
                    </div>
                    {isActive ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-extrabold text-[#58cc8d]">
                        <Check size={16} /> Active
                      </span>
                    ) : (
                      <ArrowRight size={18} className="shrink-0 text-[#8b7d6b]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty state — no active course yet
// ─────────────────────────────────────────────────────────────

function EmptyCourseState({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center">
          <Lumo size={120} expression="excited" float />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink mt-3">
          Pick a course to start
        </h2>
        <p className="text-[#6b4f1d] mt-2 max-w-md mx-auto">
          Choose from 3 languages and begin your learning journey. You can switch anytime.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        {COURSES.map((c, i) => {
          const lessonCount = totalLessonCount(c);
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 220 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(c.id)}
              className="relative rounded-3xl bg-white border-2 border-[#e8dcc4] p-6 text-center shadow-[0_4px_0_0_#e8dcc4] transition hover:border-[#58cc8d] hover:-translate-y-0.5"
              style={{ ["--btn-shadow" as any]: "#e8dcc4" }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl"
                style={{ backgroundColor: c.iconColor }}
              />
              <div className="text-6xl mb-3">{languageFlag(c.languageId)}</div>
              <div className="font-display text-lg font-extrabold text-ink">
                {languageName(c.languageId)}
              </div>
              <div className="text-xs text-[#8b7d6b] mt-1">
                {c.units.length} units • {lessonCount} lessons
              </div>
              <div
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full text-white"
                style={{ backgroundColor: c.iconColor }}
              >
                <Play size={12} fill="currentColor" /> Start learning
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// End-of-path card
// ─────────────────────────────────────────────────────────────

function EndOfPathCard({ onPractice }: { onPractice: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 mx-auto max-w-md rounded-3xl bg-gradient-to-br from-[#fff0d6] to-[#ffe9d4] p-6 text-center border-2 border-[#e8dcc4] shadow-[0_4px_0_0_#e8dcc4]"
    >
      <div className="flex justify-center">
        <Lumo size={88} expression="wave" float />
      </div>
      <h3 className="font-display text-xl font-extrabold text-ink mt-2">
        You&apos;ve reached the end of available content!
      </h3>
      <p className="text-sm text-[#6b4f1d] mt-1">
        Amazing work! More lessons are on the way. Keep your streak alive by practicing what
        you&apos;ve learned.
      </p>
      <Button3D variant="primary" size="md" className="mt-4" onClick={onPractice}>
        <RefreshCw size={16} /> Practice what you&apos;ve learned
      </Button3D>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────

export function LearnView() {
  const {
    activeCourseId,
    coursesProgress,
    setView,
    setActiveCourse,
    pushToast,
  } = useApp();

  const [pickerOpen, setPickerOpen] = React.useState(false);

  const course = React.useMemo(
    () => (activeCourseId ? COURSES.find((c) => c.id === activeCourseId) : undefined),
    [activeCourseId],
  );

  // Empty state: no course picked yet.
  if (!course) {
    return (
      <div className="min-h-[80vh] bg-background">
        <EmptyCourseState
          onPick={(id) => {
            setActiveCourse(id);
          }}
        />
      </div>
    );
  }

  const cp = coursesProgress[course.id] ?? defaultProgress(course.id);
  const totalLessons = totalLessonCount(course);
  const completedCount = cp.completedLessons.filter((id) =>
    course.units.some((u) => u.lessons.some((l) => l.id === id)),
  ).length;
  const overallPct = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const handleLessonClick = (lesson: LessonSpec) => {
    setView("lesson", { lessonId: lesson.id });
  };

  const handleLockedClick = () => {
    pushToast({
      text: "Complete previous lessons first",
      emoji: "🔒",
      variant: "info",
    });
  };

  const allLessonsDone = completedCount >= totalLessons;

  return (
    <div className="min-h-[80vh] bg-background pb-16">
      {/* Header */}
      <header className="max-w-[600px] mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <motion.span
              className="text-4xl shrink-0"
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              aria-hidden
            >
              {languageFlag(course.languageId)}
            </motion.span>
            <div className="min-w-0">
              <h1 className="font-display text-lg md:text-xl font-extrabold text-ink leading-tight truncate">
                {course.title}
              </h1>
              <div className="text-xs text-[#8b7d6b] font-semibold">
                {completedCount} / {totalLessons} lessons complete
              </div>
            </div>
          </div>
          <Button3D
            variant="secondary"
            size="sm"
            onClick={() => setPickerOpen(true)}
            className="shrink-0"
            aria-label="Switch course"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Switch</span>
            <ChevronDown size={14} />
          </Button3D>
        </div>
        <ProgressBar value={overallPct} color={course.iconColor} height={14} />
      </header>

      {/* Path */}
      <main className="max-w-[600px] mx-auto px-4 mt-6">
        {course.units.map((unit, idx) => (
          <UnitSection
            key={unit.id}
            course={course}
            unit={unit}
            unitIndex={idx}
            cp={cp}
            onLessonClick={handleLessonClick}
            onLockedClick={handleLockedClick}
          />
        ))}

        {allLessonsDone && (
          <EndOfPathCard onPractice={() => setView("practice")} />
        )}

        {!allLessonsDone && (
          <div className="mt-2 mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#e8dcc4] text-xs font-bold text-[#8b7d6b]">
              <LumoFace size={18} />
              Keep going — you&apos;re doing great!
            </div>
          </div>
        )}
      </main>

      <CoursePickerModal
        open={pickerOpen}
        activeCourseId={activeCourseId}
        onPick={(id) => {
          setActiveCourse(id);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
