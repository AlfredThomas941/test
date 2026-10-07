/**
 * Lingoland app store.
 *
 * This is a single-page application. The current "view" is part of app state
 * rather than a URL. We persist user progress in localStorage so the experience
 * survives reloads even without authentication; on login we sync to the backend.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { COURSES, type CourseSpec, type LessonSpec, type ExerciseSpec } from "@/data/courses";
import { ACHIEVEMENTS, QUESTS, BOT_LEARNERS } from "@/data/catalog";

export type View =
  | "landing"
  | "login"
  | "signup"
  | "forgot"
  | "onboarding-welcome"
  | "onboarding-language"
  | "onboarding-goal"
  | "onboarding-target"
  | "onboarding-motivation"
  | "onboarding-placement"
  | "onboarding-plan"
  | "home"
  | "learn" // learning path
  | "lesson" // active lesson
  | "lesson-complete"
  | "practice"
  | "stories"
  | "leaderboard"
  | "quests"
  | "shop"
  | "profile"
  | "achievements"
  | "stats"
  | "ai-tutor"
  | "ai-chat"
  | "mistakes"
  | "insights"
  | "settings"
  | "subscription"
  | "admin"
  | "notifications"
  | "friends";

export interface UserState {
  id: string;
  email: string;
  name: string;
  avatar: string; // emoji
  country: string;
  role: "learner" | "instructor" | "moderator" | "admin";
  isAuthenticated: boolean;
  createdAt: number;
}

export interface GamificationState {
  totalXP: number;
  weeklyXP: number;
  dailyXP: number;
  lastLessonAt: number | null;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  maxHearts: number;
  gems: number;
  league: string;
  leagueRank: number;
  dailyGoalXP: number;
  conversationStreak: number;
  streakFreezes: number;
  boosts: { type: "2x_xp" | "perfect_double"; expiresAt: number }[];
  // Confidence scores (0-100)
  confidence: {
    vocab: number;
    grammar: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  lessonStars: Record<string, number>;
  currentUnitOrder: number;
  currentLessonOrder: number;
  lastVisitedAt: number | null;
}

export interface ReviewItem {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  languageId: string;
  strength: number; // 0..1
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  correctCount: number;
  wrongCount: number;
  lastReviewAt: number | null;
  nextReviewAt: number;
}

export interface MistakeEntry {
  id: string;
  languageId: string;
  category: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  occurrences: number;
  lastAt: number;
}

export interface AchievementProgress {
  id: string;
  unlockedAt: number | null;
}

export interface QuestProgress {
  id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  translation?: string;
  correction?: { said: string; better: string; why: string; example?: string };
  ts: number;
}

export interface AIConversation {
  id: string;
  scenarioId: string;
  languageId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface Toast3D {
  id: string;
  text: string;
  emoji?: string;
  variant: "success" | "error" | "info";
}

interface AppState {
  view: View;
  viewParams: { lessonId?: string; unitId?: string; courseId?: string; scenarioId?: string; conversationId?: string; achievementId?: string };

  user: UserState | null;
  gamification: GamificationState;
  activeCourseId: string | null;
  coursesProgress: Record<string, CourseProgress>;
  reviewItems: ReviewItem[];
  mistakes: MistakeEntry[];
  achievementsProgress: Record<string, AchievementProgress>;
  questsProgress: Record<string, QuestProgress>;
  aiConversations: AIConversation[];
  notifications: NotificationItem[];
  onboardedScenarios: string[];

  // Lesson runtime
  activeLesson: {
    lessonId: string;
    exercises: ExerciseSpec[];
    currentIndex: number;
    correctCount: number;
    wrongCount: number;
    earnedXP: number;
    answers: { exerciseId: string; correct: boolean; userAnswer: string }[];
    startedAt: number;
  } | null;

  // Focus mode
  focusMode: boolean;
  theme: "light" | "dark";
  toasts: Toast3D[];

  // Actions
  setView: (view: View, params?: Partial<AppState["viewParams"]>) => void;
  setUser: (user: UserState | null) => void;
  loginDemo: () => void;
  logout: () => void;
  setActiveCourse: (courseId: string) => void;
  startLesson: (lesson: LessonSpec) => void;
  recordAnswer: (exerciseId: string, correct: boolean, userAnswer: string, xpEarned: number) => void;
  advanceLesson: () => void;
  completeLesson: () => { xpEarned: number; perfect: boolean; stars: number };
  quitLesson: () => void;
  addXP: (amount: number, reason: string) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  buyShopItem: (itemId: string, priceGems: number, name: string) => boolean;
  updateConfidence: (area: keyof GamificationState["confidence"], delta: number) => void;
  addReviewItem: (item: Omit<ReviewItem, "id" | "nextReviewAt" | "lastReviewAt" | "repetitions" | "correctCount" | "wrongCount" | "easeFactor" | "intervalDays" | "strength">) => void;
  reviewItem: (id: string, correct: boolean) => void;
  addMistake: (entry: Omit<MistakeEntry, "id" | "occurrences" | "lastAt">) => void;
  unlockAchievement: (id: string) => boolean;
  progressQuest: (goalType: string, amount: number) => void;
  claimQuest: (id: string) => void;
  saveAIConversation: (conv: AIConversation) => void;
  newAIConversation: (scenarioId: string, languageId: string, title: string) => string;
  pushToast: (toast: Omit<Toast3D, "id">) => void;
  dismissToast: (id: string) => void;
  addNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  setFocusMode: (on: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  resetProgress: () => void;
  setActiveMascot: (mascot: string) => void;
}

export interface NotificationItem {
  id: string;
  type: "friend" | "quest" | "achievement" | "streak" | "leaderboard" | "system";
  title: string;
  body: string;
  icon: string;
  link?: View;
  read: boolean;
  createdAt: number;
}

function genId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialGamification: GamificationState = {
  totalXP: 0,
  weeklyXP: 0,
  dailyXP: 0,
  lastLessonAt: null,
  currentStreak: 0,
  longestStreak: 0,
  hearts: 5,
  maxHearts: 5,
  gems: 50,
  league: "Bronze",
  leagueRank: 0,
  dailyGoalXP: 50,
  conversationStreak: 0,
  streakFreezes: 0,
  boosts: [],
  confidence: {
    vocab: 20,
    grammar: 20,
    listening: 20,
    speaking: 20,
    reading: 20,
    writing: 20,
  },
};

// Check if streak should be reset (more than 1 day since last lesson)
function computeStreakOnLoad(state: GamificationState): GamificationState {
  if (!state.lastLessonAt) return state;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const daysSince = Math.floor((now - state.lastLessonAt) / dayMs);
  if (daysSince <= 1) return state; // still active
  if (state.streakFreezes > 0 && daysSince === 2) {
    return { ...state, streakFreezes: state.streakFreezes - 1 };
  }
  return { ...state, currentStreak: 0, dailyXP: 0 };
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      view: "landing",
      viewParams: {},

      user: null,
      gamification: initialGamification,
      activeCourseId: null,
      coursesProgress: {},
      reviewItems: [],
      mistakes: [],
      achievementsProgress: {},
      questsProgress: {},
      aiConversations: [],
      notifications: [],
      onboardedScenarios: [],

      activeLesson: null,
      focusMode: false,
      theme: "light",
      toasts: [],

      setView: (view, params = {}) =>
        set((s) => ({ view, viewParams: { ...s.viewParams, ...params }, focusMode: view === "lesson" ? s.focusMode : s.focusMode })),

      setUser: (user) => set({ user }),

      loginDemo: () =>
        set({
          user: {
            id: "demo-user",
            email: "demo@lingoland.app",
            name: "Lumo Learner",
            avatar: "🦊",
            country: "🌍",
            role: "learner",
            isAuthenticated: true,
            createdAt: Date.now(),
          },
          view: "home",
        }),

      logout: () => set({ user: null, view: "landing" }),

      setActiveCourse: (courseId) =>
        set((s) => {
          if (!s.coursesProgress[courseId]) {
            const course = COURSES.find((c) => c.id === courseId);
            s.coursesProgress[courseId] = {
              courseId,
              completedLessons: [],
              lessonStars: {},
              currentUnitOrder: 1,
              currentLessonOrder: 1,
              lastVisitedAt: null,
            };
            void course;
          }
          return { activeCourseId: courseId };
        }),

      startLesson: (lesson) =>
        set({
          view: "lesson",
          activeLesson: {
            lessonId: lesson.id,
            exercises: lesson.exercises,
            currentIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            earnedXP: 0,
            answers: [],
            startedAt: Date.now(),
          },
        }),

      recordAnswer: (exerciseId, correct, userAnswer, xpEarned) =>
        set((s) => {
          if (!s.activeLesson) return {};
          const al = { ...s.activeLesson };
          al.answers = [...al.answers, { exerciseId, correct, userAnswer }];
          if (correct) {
            al.correctCount += 1;
            al.earnedXP += xpEarned;
          } else {
            al.wrongCount += 1;
          }
          return { activeLesson: al };
        }),

      advanceLesson: () =>
        set((s) => {
          if (!s.activeLesson) return {};
          return { activeLesson: { ...s.activeLesson, currentIndex: s.activeLesson.currentIndex + 1 } };
        }),

      completeLesson: () => {
        const s = get();
        if (!s.activeLesson) return { xpEarned: 0, perfect: false, stars: 0 };
        const al = s.activeLesson;
        const total = al.exercises.length;
        const correct = al.correctCount;
        const perfect = al.wrongCount === 0;
        const stars = perfect ? 3 : al.wrongCount <= 1 ? 2 : 1;
        const bonus = perfect ? Math.floor(al.earnedXP * 0.5) : 0;
        const xpEarned = al.earnedXP + bonus;
        // Update gamification
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        const lastTs = s.gamification.lastLessonAt;
        const newStreak = lastTs && now - lastTs < dayMs * 2 ? s.gamification.currentStreak + 1 : 1;
        const courseProgress = s.activeCourseId ? s.coursesProgress[s.activeCourseId] : null;
        const newCoursesProgress = { ...s.coursesProgress };
        if (s.activeCourseId && courseProgress) {
          const cp = { ...courseProgress };
          if (!cp.completedLessons.includes(al.lessonId)) {
            cp.completedLessons = [...cp.completedLessons, al.lessonId];
          }
          cp.lessonStars = { ...cp.lessonStars, [al.lessonId]: Math.max(cp.lessonStars[al.lessonId] ?? 0, stars) };
          // Advance pointer
          const course = COURSES.find((c) => c.id === s.activeCourseId);
          if (course) {
            for (const unit of course.units) {
              const idx = unit.lessons.findIndex((l) => l.id === al.lessonId);
              if (idx >= 0) {
                if (idx + 1 < unit.lessons.length) {
                  cp.currentLessonOrder = idx + 2; // 1-indexed
                  cp.currentUnitOrder = unit.order || 1;
                } else {
                  // Move to next unit
                  const uIdx = course.units.findIndex((u) => u.id === unit.id);
                  if (uIdx + 1 < course.units.length) {
                    cp.currentUnitOrder = (course.units[uIdx + 1].order) || (uIdx + 2);
                    cp.currentLessonOrder = 1;
                  }
                }
                break;
              }
            }
          }
          cp.lastVisitedAt = now;
          newCoursesProgress[s.activeCourseId] = cp;
        }
        const newGamification: GamificationState = {
          ...s.gamification,
          totalXP: s.gamification.totalXP + xpEarned,
          weeklyXP: s.gamification.weeklyXP + xpEarned,
          dailyXP: s.gamification.dailyXP + xpEarned,
          lastLessonAt: now,
          currentStreak: newStreak,
          longestStreak: Math.max(s.gamification.longestStreak, newStreak),
          hearts: perfect ? s.gamification.hearts : Math.min(s.gamification.maxHearts, s.gamification.hearts),
        };
        // Auto-unlock achievements
        const newAchievements = { ...s.achievementsProgress };
        const newNotifs: NotificationItem[] = [];
        for (const ach of ACHIEVEMENTS) {
          const already = newAchievements[ach.id]?.unlockedAt;
          if (already) continue;
          let value = 0;
          if (ach.category === "streak") value = newGamification.currentStreak;
          else if (ach.category === "xp") value = newGamification.totalXP;
          else if (ach.category === "lesson") {
            // Count completed lessons (with id prefixes)
            const totalCompleted = Object.values(newCoursesProgress).reduce((acc, p) => acc + p.completedLessons.length, 0);
            value = totalCompleted;
            if (ach.id === "perfect-1") value = perfect ? 1 : (s.achievementsProgress["perfect-1"]?.unlockedAt ? 1 : 0);
            if (ach.id === "perfect-10") value = 0; // we don't track historical; skip
          } else if (ach.category === "skill") {
            if (ach.id === "vocab-100" || ach.id === "vocab-500") value = s.reviewItems.length;
            if (ach.id === "review-50") value = s.reviewItems.reduce((acc, r) => acc + r.correctCount, 0);
          } else if (ach.category === "social") {
            if (ach.id.startsWith("friend")) value = 0;
            if (ach.id === "leaderboard-1") value = 0;
          } else if (ach.category === "special") {
            if (ach.id.startsWith("ai")) value = s.aiConversations.length;
            if (ach.id.startsWith("quest")) {
              value = Object.values(s.questsProgress).filter((q) => q.completed).length;
            }
          }
          if (value >= ach.requirement) {
            newAchievements[ach.id] = { unlockedAt: now };
            newNotifs.push({
              id: genId("ntf"),
              type: "achievement",
              title: `Achievement unlocked: ${ach.title}!`,
              body: ach.description,
              icon: ach.icon,
              link: "achievements",
              read: false,
              createdAt: now,
            });
          }
        }
        // Progress quests
        const newQuests = { ...s.questsProgress };
        for (const q of QUESTS) {
          const qp = newQuests[q.id] ?? { id: q.id, progress: 0, completed: false, claimed: false };
          if (qp.completed) continue;
          if (q.goalType === "xp" || q.goalType === "perfect") qp.progress += xpEarned;
          if (q.goalType === "lessons") qp.progress += 1;
          if (q.goalType === "perfect" && perfect) qp.progress += 1;
          if (qp.progress >= q.goalAmount) {
            qp.progress = q.goalAmount;
            qp.completed = true;
            newNotifs.push({
              id: genId("ntf"),
              type: "quest",
              title: `Quest complete: ${q.title}`,
              body: `Tap to claim ${q.xp} XP and ${q.gems} gems.`,
              icon: q.icon,
              link: "quests",
              read: false,
              createdAt: now,
            });
          }
          newQuests[q.id] = { ...qp };
        }
        set({
          gamification: newGamification,
          coursesProgress: newCoursesProgress,
          achievementsProgress: newAchievements,
          questsProgress: newQuests,
          notifications: [...newNotifs, ...s.notifications],
          view: "lesson-complete",
          activeLesson: { ...al, earnedXP: xpEarned },
        });
        return { xpEarned, perfect, stars };
      },

      quitLesson: () => set({ activeLesson: null, view: "learn" }),

      addXP: (amount, reason) =>
        set((s) => ({
          gamification: {
            ...s.gamification,
            totalXP: s.gamification.totalXP + amount,
            weeklyXP: s.gamification.weeklyXP + amount,
            dailyXP: s.gamification.dailyXP + amount,
          },
        })),

      loseHeart: () =>
        set((s) => ({
          gamification: { ...s.gamification, hearts: Math.max(0, s.gamification.hearts - 1) },
        })),

      refillHearts: () => set((s) => ({ gamification: { ...s.gamification, hearts: s.gamification.maxHearts } })),

      addGems: (amount) => set((s) => ({ gamification: { ...s.gamification, gems: s.gamification.gems + amount } })),

      spendGems: (amount) => {
        const s = get();
        if (s.gamification.gems < amount) return false;
        set({ gamification: { ...s.gamification, gems: s.gamification.gems - amount } });
        return true;
      },

      buyShopItem: (itemId, priceGems, name) => {
        const s = get();
        if (s.gamification.gems < priceGems) return false;
        const newNotif: NotificationItem = {
          id: genId("ntf"),
          type: "system",
          title: `Purchased: ${name}`,
          body: "Your item is ready in your profile.",
          icon: "🛍️",
          link: "profile",
          read: false,
          createdAt: Date.now(),
        };
        // Apply item effects
        let g = { ...s.gamification, gems: s.gamification.gems - priceGems };
        if (itemId === "heart-refill") g.hearts = g.maxHearts;
        if (itemId === "heart-1") g.hearts = Math.min(g.maxHearts, g.hearts + 1);
        if (itemId === "streak-freeze") g.streakFreezes += 1;
        if (itemId === "boost-2x-15") g.boosts = [...g.boosts, { type: "2x_xp", expiresAt: Date.now() + 15 * 60 * 1000 }];
        if (itemId === "boost-perfect-1") g.boosts = [...g.boosts, { type: "perfect_double", expiresAt: Date.now() + 60 * 60 * 1000 }];
        set({ gamification: g, notifications: [newNotif, ...s.notifications] });
        return true;
      },

      updateConfidence: (area, delta) =>
        set((s) => {
          const v = Math.max(0, Math.min(100, s.gamification.confidence[area] + delta));
          return { gamification: { ...s.gamification, confidence: { ...s.gamification.confidence, [area]: v } } };
        }),

      addReviewItem: (item) =>
        set((s) => {
          const exists = s.reviewItems.find((r) => r.word === item.word && r.languageId === item.languageId);
          if (exists) return {};
          const ri: ReviewItem = {
            ...item,
            id: genId("rv"),
            strength: 0.2,
            intervalDays: 1,
            easeFactor: 2.5,
            repetitions: 0,
            correctCount: 0,
            wrongCount: 0,
            lastReviewAt: null,
            nextReviewAt: Date.now(),
          };
          return { reviewItems: [ri, ...s.reviewItems] };
        }),

      reviewItem: (id, correct) =>
        set((s) => {
          const items = s.reviewItems.map((r) => {
            if (r.id !== id) return r;
            const ease = Math.max(1.3, r.easeFactor + (correct ? 0.1 : -0.2));
            const reps = correct ? r.repetitions + 1 : 0;
            const interval = correct ? Math.max(1, Math.round(r.intervalDays * ease)) : 1;
            return {
              ...r,
              easeFactor: ease,
              repetitions: reps,
              intervalDays: interval,
              correctCount: r.correctCount + (correct ? 1 : 0),
              wrongCount: r.wrongCount + (correct ? 0 : 1),
              strength: Math.max(0, Math.min(1, r.strength + (correct ? 0.15 : -0.3))),
              lastReviewAt: Date.now(),
              nextReviewAt: Date.now() + interval * 24 * 60 * 60 * 1000,
            };
          });
          return { reviewItems: items };
        }),

      addMistake: (entry) =>
        set((s) => {
          const existing = s.mistakes.find(
            (m) => m.prompt === entry.prompt && m.userAnswer === entry.userAnswer
          );
          if (existing) {
            return {
              mistakes: s.mistakes.map((m) =>
                m === existing ? { ...m, occurrences: m.occurrences + 1, lastAt: Date.now() } : m
              ),
            };
          }
          return {
            mistakes: [{ ...entry, id: genId("mk"), occurrences: 1, lastAt: Date.now() }, ...s.mistakes],
          };
        }),

      unlockAchievement: (id) => {
        const s = get();
        if (s.achievementsProgress[id]?.unlockedAt) return false;
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        const now = Date.now();
        const notif: NotificationItem = ach
          ? {
              id: genId("ntf"),
              type: "achievement",
              title: `Achievement: ${ach.title}`,
              body: ach.description,
              icon: ach.icon,
              link: "achievements",
              read: false,
              createdAt: now,
            }
          : {
              id: genId("ntf"),
              type: "achievement",
              title: "Achievement unlocked!",
              body: "",
              icon: "🏆",
              link: "achievements",
              read: false,
              createdAt: now,
            };
        set({
          achievementsProgress: { ...s.achievementsProgress, [id]: { unlockedAt: now } },
          notifications: [notif, ...s.notifications],
        });
        return true;
      },

      progressQuest: (goalType, amount) =>
        set((s) => {
          const newQuests = { ...s.questsProgress };
          const now = Date.now();
          const newNotifs: NotificationItem[] = [];
          for (const q of QUESTS) {
            if (q.goalType !== goalType) continue;
            const qp = newQuests[q.id] ?? { id: q.id, progress: 0, completed: false, claimed: false };
            if (qp.completed) continue;
            qp.progress = Math.min(q.goalAmount, qp.progress + amount);
            if (qp.progress >= q.goalAmount && !qp.completed) {
              qp.completed = true;
              newNotifs.push({
                id: genId("ntf"),
                type: "quest",
                title: `Quest complete: ${q.title}`,
                body: `Tap to claim ${q.xp} XP and ${q.gems} gems.`,
                icon: q.icon,
                link: "quests",
                read: false,
                createdAt: now,
              });
            }
            newQuests[q.id] = { ...qp };
          }
          return { questsProgress: newQuests, notifications: [...newNotifs, ...s.notifications] };
        }),

      claimQuest: (id) =>
        set((s) => {
          const qp = s.questsProgress[id];
          if (!qp || !qp.completed || qp.claimed) return {};
          const q = QUESTS.find((qq) => qq.id === id);
          if (!q) return {};
          return {
            questsProgress: { ...s.questsProgress, [id]: { ...qp, claimed: true } },
            gamification: {
              ...s.gamification,
              totalXP: s.gamification.totalXP + q.xp,
              weeklyXP: s.gamification.weeklyXP + q.xp,
              dailyXP: s.gamification.dailyXP + q.xp,
              gems: s.gamification.gems + q.gems,
            },
          };
        }),

      saveAIConversation: (conv) =>
        set((s) => {
          const existing = s.aiConversations.find((c) => c.id === conv.id);
          if (existing) {
            return { aiConversations: s.aiConversations.map((c) => (c.id === conv.id ? conv : c)) };
          }
          return { aiConversations: [conv, ...s.aiConversations] };
        }),

      newAIConversation: (scenarioId, languageId, title) => {
        const id = genId("ai");
        const conv: AIConversation = {
          id,
          scenarioId,
          languageId,
          title,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ aiConversations: [conv, ...s.aiConversations] }));
        return id;
      },

      pushToast: (toast) =>
        set((s) => {
          const id = genId("tst");
          const t: Toast3D = { id, ...toast };
          setTimeout(() => {
            get().dismissToast(id);
          }, 2600);
          return { toasts: [...s.toasts, t] };
        }),

      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      addNotification: (n) =>
        set((s) => ({
          notifications: [{ ...n, id: genId("ntf"), read: false, createdAt: Date.now() }, ...s.notifications],
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      setFocusMode: (on) => set({ focusMode: on }),

      setTheme: (theme) => set({ theme }),

      resetProgress: () =>
        set({
          gamification: initialGamification,
          coursesProgress: {},
          reviewItems: [],
          mistakes: [],
          achievementsProgress: {},
          questsProgress: {},
          aiConversations: [],
          activeLesson: null,
          view: "home",
        }),

      setActiveMascot: (_mascot) => set({}), // placeholder for cosmetics
    }),
    {
      name: "lingoland-app",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.gamification = computeStreakOnLoad(state.gamification);
        }
      },
    }
  )
);

/** Helper: get the active course spec */
export function useActiveCourse(): CourseSpec | null {
  const id = useApp((s) => s.activeCourseId);
  return COURSES.find((c) => c.id === id) ?? null;
}

/** Helper: leaderboard data with current user mixed in */
export function useLeaderboard() {
  const me = useApp((s) => s.gamification.weeklyXP);
  const myName = useApp((s) => s.user?.name ?? "You");
  const myAvatar = useApp((s) => s.user?.avatar ?? "🦊");
  const myLeague = useApp((s) => s.gamification.league);
  // Generate consistent weekly XP for bots based on time of week
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() - now.getDay());
  const dayOfWeek = (now.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000);
  const roster = BOT_LEARNERS.map((b, i) => ({
    name: b.name,
    avatar: b.avatar,
    country: b.country,
    xp: Math.max(20, Math.round(b.baseXP * (0.4 + dayOfWeek / 7 * 0.6) + Math.sin(i * 1.3) * 30)),
    isMe: false,
  }));
  roster.push({ name: myName, avatar: myAvatar, country: "🌍", xp: me, isMe: true });
  roster.sort((a, b) => b.xp - a.xp);
  return { roster, league: myLeague };
}
