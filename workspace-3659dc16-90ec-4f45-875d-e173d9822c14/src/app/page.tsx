"use client";

import * as React from "react";
import { useApp } from "@/lib/store";
import { AppShell, ToastViewport } from "@/components/layout/app-shell";
import { LandingView } from "@/components/views/landing";
import {
  LoginView, SignupView, ForgotView,
  OnboardingWelcome, OnboardingLanguage, OnboardingGoal,
  OnboardingTarget, OnboardingMotivation, OnboardingPlacement, OnboardingPlan,
} from "@/components/views/auth";
import { HomeView } from "@/components/views/home";
import { LearnView } from "@/components/views/learn";
import { LessonView, LessonCompleteView } from "@/components/views/lesson";
import {
  LeaderboardView, QuestsView, AchievementsView, ShopView, ProfileView,
  StatsView, InsightsView, MistakesView, PracticeView, AITutorView, AIChatView,
  FriendsView, NotificationsView, SettingsView, SubscriptionView, AdminView,
  StoriesView,
} from "@/components/views/app";

export default function Home() {
  const { view, user } = useApp();

  // Auth-gated views: if not logged in, only allow landing/auth/onboarding
  const PUBLIC_VIEWS = new Set([
    "landing", "login", "signup", "forgot",
    "onboarding-welcome", "onboarding-language", "onboarding-goal",
    "onboarding-target", "onboarding-motivation", "onboarding-placement", "onboarding-plan",
  ]);
  const isPublic = PUBLIC_VIEWS.has(view);

  // If trying to access protected view without auth, redirect to landing
  if (!user && !isPublic) {
    return <LandingView />;
  }

  // Render
  let content: React.ReactNode;
  switch (view) {
    case "landing": content = <LandingView />; break;
    case "login": content = <LoginView />; break;
    case "signup": content = <SignupView />; break;
    case "forgot": content = <ForgotView />; break;
    case "onboarding-welcome": content = <OnboardingWelcome />; break;
    case "onboarding-language": content = <OnboardingLanguage />; break;
    case "onboarding-goal": content = <OnboardingGoal />; break;
    case "onboarding-target": content = <OnboardingTarget />; break;
    case "onboarding-motivation": content = <OnboardingMotivation />; break;
    case "onboarding-placement": content = <OnboardingPlacement />; break;
    case "onboarding-plan": content = <OnboardingPlan />; break;
    // App views (auth-gated)
    case "home": content = <HomeView />; break;
    case "learn": content = <LearnView />; break;
    case "lesson": content = <LessonView />; break;
    case "lesson-complete": content = <LessonCompleteView />; break;
    case "practice": content = <PracticeView />; break;
    case "stories": content = <StoriesView />; break;
    case "leaderboard": content = <LeaderboardView />; break;
    case "quests": content = <QuestsView />; break;
    case "shop": content = <ShopView />; break;
    case "profile": content = <ProfileView />; break;
    case "achievements": content = <AchievementsView />; break;
    case "stats": content = <StatsView />; break;
    case "insights": content = <InsightsView />; break;
    case "mistakes": content = <MistakesView />; break;
    case "ai-tutor": content = <AITutorView />; break;
    case "ai-chat": content = <AIChatView />; break;
    case "friends": content = <FriendsView />; break;
    case "notifications": content = <NotificationsView />; break;
    case "settings": content = <SettingsView />; break;
    case "subscription": content = <SubscriptionView />; break;
    case "admin": content = <AdminView />; break;
    default: content = <HomeView />;
  }

  // Public views render full-screen without the app shell
  if (isPublic) {
    return (
      <>
        {content}
        <ToastViewport />
      </>
    );
  }

  return (
    <AppShell>
      {content}
      <ToastViewport />
    </AppShell>
  );
}
