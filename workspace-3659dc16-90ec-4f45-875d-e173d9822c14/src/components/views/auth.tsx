"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Mail, Lock, User as UserIcon, Eye, EyeOff, ChevronRight, Sparkles } from "lucide-react";
import { Button3D } from "@/components/brand/button";
import { Lumo, LumoFace } from "@/components/brand/lumo";
import { Logo } from "@/components/brand/logo";
import { useApp } from "@/lib/store";
import { LANGUAGES, COURSES } from "@/data/courses";

// ─── Shared auth shell ─────────────────────────────────────────
function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const { setView } = useApp();
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 md:px-12">
        <button onClick={() => setView("landing")} className="inline-flex items-center gap-2 text-[#8b7d6b] hover:text-[#2c2334] font-bold text-sm mb-8">
          <ArrowLeft size={16} /> Back to home
        </button>
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-6 md:hidden">
            <Logo size={36} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#2c2334] mb-2">{title}</h1>
          {subtitle && <p className="text-[#8b7d6b] mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
      {/* Right: hero illustration */}
      <div className="hidden md:flex bg-gradient-to-br from-[#ffc93c] via-[#ff8c42] to-[#ff6b6b] relative items-center justify-center p-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lumo size={260} expression="excited" />
        </motion.div>
        <div className="absolute bottom-10 left-12 right-12 text-white">
          <h2 className="font-display text-3xl font-extrabold leading-tight">"Hola, bonjour, こんにちは."</h2>
          <p className="mt-2 text-white/80">Your first words await. Lumo is ready when you are.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────
export function LoginView() {
  const { setView, loginDemo } = useApp();
  const [email, setEmail] = React.useState("demo@lingoland.app");
  const [password, setPassword] = React.useState("demo1234");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      loginDemo();
    }, 700);
  }

  return (
    <AuthShell title="Welcome back!" subtitle="Log in to continue your streak.">
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Email"
          icon={<Mail size={18} />}
          input={
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-transparent outline-none font-bold text-[#2c2334]"
            />
          }
        />
        <Field
          label="Password"
          icon={<Lock size={18} />}
          input={
            <div className="flex items-center w-full">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent outline-none font-bold text-[#2c2334]"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-[#8b7d6b] hover:text-[#2c2334]" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          }
        />
        {error && <div className="text-sm text-[#ff4757] font-bold bg-[#ffe3e3] rounded-xl px-3 py-2">{error}</div>}
        <div className="flex justify-end">
          <button type="button" onClick={() => setView("forgot")} className="text-sm font-bold text-[#4d96ff] hover:underline">
            Forgot password?
          </button>
        </div>
        <Button3D variant="primary" size="lg" full type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button3D>
        <div className="text-center text-sm text-[#8b7d6b]">
          Don't have an account?{" "}
          <button type="button" onClick={() => setView("signup")} className="font-bold text-[#58cc8d] hover:underline">
            Sign up free
          </button>
        </div>
        <div className="text-center text-xs text-[#8b7d6b] mt-4 bg-[#fff0d6] rounded-xl p-3">
          💡 Demo mode is pre-filled. Just hit <strong>Log in</strong> to explore.
        </div>
      </form>
    </AuthShell>
  );
}

// ─── Signup ────────────────────────────────────────────────────
export function SignupView() {
  const { setView, loginDemo, pushToast } = useApp();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agree) {
      setError("Please accept the terms to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      pushToast({ text: "Account created! Welcome to Lingoland.", emoji: "🎉", variant: "success" });
      setView("onboarding-welcome");
    }, 800);
  }

  return (
    <AuthShell title="Create your free account" subtitle="It takes 30 seconds. No card required.">
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Your name"
          icon={<UserIcon size={18} />}
          input={
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="María García"
              autoComplete="name"
              className="w-full bg-transparent outline-none font-bold text-[#2c2334]"
            />
          }
        />
        <Field
          label="Email"
          icon={<Mail size={18} />}
          input={
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-transparent outline-none font-bold text-[#2c2334]"
            />
          }
        />
        <Field
          label="Password"
          icon={<Lock size={18} />}
          input={
            <div className="flex items-center w-full">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full bg-transparent outline-none font-bold text-[#2c2334]"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-[#8b7d6b] hover:text-[#2c2334]">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          }
        />
        <label className="flex items-start gap-2 cursor-pointer text-sm text-[#6b4f1d]">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#58cc8d]" />
          <span>I agree to Lingoland's Terms of Service and Privacy Policy.</span>
        </label>
        {error && <div className="text-sm text-[#ff4757] font-bold bg-[#ffe3e3] rounded-xl px-3 py-2">{error}</div>}
        <Button3D variant="primary" size="lg" full type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button3D>
        <div className="text-center text-sm text-[#8b7d6b]">
          Already have an account?{" "}
          <button type="button" onClick={() => setView("login")} className="font-bold text-[#58cc8d] hover:underline">
            Log in
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

// ─── Forgot password ───────────────────────────────────────────
export function ForgotView() {
  const { setView, pushToast } = useApp();
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  return (
    <AuthShell title="Reset password" subtitle="We'll send a magic link to your inbox.">
      {sent ? (
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="w-20 h-20 mx-auto rounded-full bg-[#58cc8d] grid place-items-center text-white mb-4">
            <Check size={36} />
          </motion.div>
          <h3 className="font-display text-2xl font-extrabold mb-2">Check your inbox</h3>
          <p className="text-[#8b7d6b] mb-5">If an account exists for {email}, a reset link is on its way.</p>
          <Button3D variant="primary" size="lg" full onClick={() => setView("login")}>
            Back to login
          </Button3D>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            setSent(true);
            pushToast({ text: "Reset link sent!", emoji: "📧", variant: "success" });
          }}
          className="space-y-4"
        >
          <Field
            label="Email"
            icon={<Mail size={18} />}
            input={<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent outline-none font-bold text-[#2c2334]" />}
          />
          <Button3D variant="primary" size="lg" full type="submit">
            Send reset link
          </Button3D>
          <div className="text-center text-sm text-[#8b7d6b]">
            <button type="button" onClick={() => setView("login")} className="font-bold text-[#58cc8d] hover:underline">
              Back to login
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

function Field({ label, icon, input }: { label: string; icon: React.ReactNode; input: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-[#8b7d6b] mb-1.5">{label}</label>
      <div className="flex items-center gap-2 px-3 py-3 rounded-2xl border-2 border-[#e8dcc4] focus-within:border-[#4d96ff] bg-white transition">
        <span className="text-[#8b7d6b]">{icon}</span>
        {input}
      </div>
    </div>
  );
}

// ─── Onboarding flow ───────────────────────────────────────────
const GOALS = [
  { id: "travel", emoji: "✈️", label: "Travel", desc: "Order food, ask directions, make friends abroad." },
  { id: "career", emoji: "💼", label: "Career", desc: "Boost your resume and ace international interviews." },
  { id: "culture", emoji: "🎭", label: "Culture", desc: "Watch films, read books, understand the music." },
  { id: "family", emoji: "👨‍👩‍👧", label: "Family", desc: "Connect with relatives in their mother tongue." },
  { id: "school", emoji: "🎓", label: "School", desc: "Ace your language class and exams." },
  { id: "brain", emoji: "🧠", label: "Brain training", desc: "Keep your mind sharp with daily practice." },
];

const TARGETS = [
  { id: "casual", xp: 10, mins: "5 min", label: "Casual", desc: "10 XP / day" },
  { id: "regular", xp: 20, mins: "10 min", label: "Regular", desc: "20 XP / day" },
  { id: "serious", xp: 30, mins: "15 min", label: "Serious", desc: "30 XP / day" },
  { id: "intense", xp: 50, mins: "30 min", label: "Intense", desc: "50 XP / day" },
];

const MOTIVATIONS = [
  { id: "streak", emoji: "🔥", label: "Streaks" },
  { id: "leagues", emoji: "🏆", label: "Leagues" },
  { id: "achievements", emoji: "🎖️", label: "Achievements" },
  { id: "ai", emoji: "🤖", label: "AI Tutor" },
];

export function OnboardingWelcome() {
  const { setView } = useApp();
  return (
    <OnboardingShell step={1} total={6}>
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mx-auto mb-6">
          <Lumo size={200} expression="wave" float />
        </motion.div>
        <h1 className="font-display text-4xl font-extrabold text-[#2c2334]">¡Hola! I'm Lumo 🦊</h1>
        <p className="text-lg text-[#6b4f1d] mt-3 max-w-md mx-auto">
          Your friendly language guide. I'll be with you every step of the way — celebrating wins, explaining mistakes, and cheering you on.
        </p>
        <div className="mt-8">
          <Button3D variant="primary" size="xl" onClick={() => setView("onboarding-language")}>
            Let's go! <ArrowRight size={18} />
          </Button3D>
        </div>
      </div>
    </OnboardingShell>
  );
}

export function OnboardingLanguage() {
  const { setView, setActiveCourse, activeCourseId } = useApp();
  return (
    <OnboardingShell step={2} total={6} title="Which language do you want to learn?">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LANGUAGES.map((lang) => {
          const course = COURSES.find((c) => c.languageId === lang.id);
          const active = activeCourseId === course?.id;
          return (
            <button
              key={lang.id}
              onClick={() => course && setActiveCourse(course.id)}
              className={`relative text-left p-5 rounded-2xl border-2 transition ${
                active ? "border-[#58cc8d] bg-[#d7ffe5]" : "border-[#e8dcc4] bg-white hover:border-[#58cc8d]"
              }`}
            >
              <div className="text-5xl mb-2">{lang.flag}</div>
              <div className="font-display text-xl font-extrabold text-[#2c2334]">{lang.name}</div>
              <div className="text-sm text-[#8b7d6b] font-bold">{lang.nativeName}</div>
              {active && <Check className="absolute top-3 right-3 text-[#58cc8d]" size={22} />}
            </button>
          );
        })}
      </div>
      <OnboardingNav
        onBack={() => setView("onboarding-welcome")}
        onNext={() => setView("onboarding-goal")}
        nextLabel="Continue"
        disabled={!activeCourseId}
      />
    </OnboardingShell>
  );
}

export function OnboardingGoal() {
  const { setView } = useApp();
  const [selected, setSelected] = React.useState<string>("travel");
  return (
    <OnboardingShell step={3} total={6} title="What's your main goal?">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            className={`text-left p-4 rounded-2xl border-2 transition flex items-start gap-3 ${
              selected === g.id ? "border-[#58cc8d] bg-[#d7ffe5]" : "border-[#e8dcc4] bg-white hover:border-[#58cc8d]"
            }`}
          >
            <div className="text-3xl">{g.emoji}</div>
            <div className="flex-1">
              <div className="font-bold text-[#2c2334]">{g.label}</div>
              <div className="text-sm text-[#8b7d6b]">{g.desc}</div>
            </div>
            {selected === g.id && <Check className="text-[#58cc8d]" size={20} />}
          </button>
        ))}
      </div>
      <OnboardingNav onBack={() => setView("onboarding-language")} onNext={() => setView("onboarding-target")} />
    </OnboardingShell>
  );
}

export function OnboardingTarget() {
  const { setView, gamification } = useApp();
  void gamification;
  const [selected, setSelected] = React.useState<string>("regular");
  return (
    <OnboardingShell step={4} total={6} title="Set your daily target">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`text-left p-5 rounded-2xl border-2 transition flex items-center gap-4 ${
              selected === t.id ? "border-[#58cc8d] bg-[#d7ffe5]" : "border-[#e8dcc4] bg-white hover:border-[#58cc8d]"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#fff0d6] grid place-items-center font-extrabold text-[#6b4f1d] text-sm">{t.mins}</div>
            <div>
              <div className="font-display text-lg font-extrabold text-[#2c2334]">{t.label}</div>
              <div className="text-sm text-[#8b7d6b]">{t.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <OnboardingNav onBack={() => setView("onboarding-goal")} onNext={() => setView("onboarding-motivation")} />
    </OnboardingShell>
  );
}

export function OnboardingMotivation() {
  const { setView } = useApp();
  const [selected, setSelected] = React.useState<string[]>(["streak", "achievements"]);
  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  return (
    <OnboardingShell step={5} total={6} title="What motivates you?">
      <p className="text-[#8b7d6b] mb-4">Pick all that apply — we'll tailor your experience.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MOTIVATIONS.map((m) => {
          const active = selected.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className={`p-5 rounded-2xl border-2 transition flex flex-col items-center gap-2 ${
                active ? "border-[#58cc8d] bg-[#d7ffe5]" : "border-[#e8dcc4] bg-white hover:border-[#58cc8d]"
              }`}
            >
              <div className="text-4xl">{m.emoji}</div>
              <div className="font-bold text-[#2c2334] text-sm">{m.label}</div>
            </button>
          );
        })}
      </div>
      <OnboardingNav onBack={() => setView("onboarding-target")} onNext={() => setView("onboarding-placement")} />
    </OnboardingShell>
  );
}

export function OnboardingPlacement() {
  const { setView } = useApp();
  const [choice, setChoice] = React.useState<"beginner" | "test" | null>(null);
  return (
    <OnboardingShell step={6} total={6} title="Are you new to this language?">
      <div className="space-y-3">
        <button
          onClick={() => setChoice("beginner")}
          className={`w-full text-left p-5 rounded-2xl border-2 transition flex items-center gap-4 ${
            choice === "beginner" ? "border-[#58cc8d] bg-[#d7ffe5]" : "border-[#e8dcc4] bg-white hover:border-[#58cc8d]"
          }`}
        >
          <div className="text-4xl">🌱</div>
          <div className="flex-1">
            <div className="font-display text-lg font-extrabold text-[#2c2334]">Yes, I'm a beginner</div>
            <div className="text-sm text-[#8b7d6b]">Start from the very first lesson — no prior knowledge needed.</div>
          </div>
          {choice === "beginner" && <Check className="text-[#58cc8d]" size={22} />}
        </button>
        <button
          onClick={() => setChoice("test")}
          className={`w-full text-left p-5 rounded-2xl border-2 transition flex items-center gap-4 ${
            choice === "test" ? "border-[#58cc8d] bg-[#d7ffe5]" : "border-[#e8dcc4] bg-white hover:border-[#58cc8d]"
          }`}
        >
          <div className="text-4xl">⚡</div>
          <div className="flex-1">
            <div className="font-display text-lg font-extrabold text-[#2c2334]">I know a little — place me</div>
            <div className="text-sm text-[#8b7d6b]">Take a quick placement test (5 questions) and skip ahead.</div>
          </div>
          {choice === "test" && <Check className="text-[#58cc8d]" size={22} />}
        </button>
      </div>
      <OnboardingNav
        onBack={() => setView("onboarding-motivation")}
        onNext={() => setView("onboarding-plan")}
        nextLabel="See my plan"
        disabled={!choice}
      />
    </OnboardingShell>
  );
}

export function OnboardingPlan() {
  const { setView, activeCourseId } = useApp();
  const course = COURSES.find((c) => c.id === activeCourseId);
  const lang = LANGUAGES.find((l) => l.id === course?.languageId);
  return (
    <OnboardingShell step={6} total={6}>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto mb-4"
        >
          <Lumo size={170} expression="excited" />
        </motion.div>
        <h2 className="font-display text-3xl font-extrabold text-[#2c2334]">Your learning plan is ready!</h2>
        <p className="text-[#6b4f1d] mt-2">Here's what we set up for you.</p>

        <div className="mt-6 bg-white rounded-2xl border-2 border-[#e8dcc4] p-5 text-left max-w-md mx-auto space-y-3">
          <PlanRow icon={lang?.flag ?? "🌍"} label="Language" value={`${lang?.name} (${lang?.nativeName})`} />
          <PlanRow icon="🎯" label="Daily target" value="20 XP / day (~10 min)" />
          <PlanRow icon="🔥" label="Streak" value="Starting today!" />
          <PlanRow icon="🤖" label="AI tutor" value="Restaurant scenario unlocked" />
          <PlanRow icon="🏆" label="League" value="Bronze — climb to Diamond" />
        </div>

        <div className="mt-6">
          <Button3D variant="primary" size="xl" onClick={() => setView("home")}>
            Take me to my dashboard <ArrowRight size={18} />
          </Button3D>
        </div>
      </div>
    </OnboardingShell>
  );
}

function PlanRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#fff0d6] grid place-items-center text-xl">{icon}</div>
      <div className="flex-1">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8b7d6b]">{label}</div>
        <div className="font-bold text-[#2c2334]">{value}</div>
      </div>
    </div>
  );
}

function OnboardingShell({
  step,
  total,
  title,
  children,
}: {
  step: number;
  total: number;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="max-w-2xl mx-auto w-full px-4 py-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full overflow-hidden bg-[#fff0d6]">
              <motion.div
                className="h-full bg-[#58cc8d]"
                initial={{ width: 0 }}
                animate={{ width: i < step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
      </header>
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-4 py-8">
        {title && <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#2c2334] mb-6">{title}</h1>}
        {children}
      </div>
    </div>
  );
}

function OnboardingNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  disabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <Button3D variant="ghost" size="lg" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </Button3D>
      <div className="flex-1" />
      <Button3D variant="primary" size="lg" onClick={onNext} disabled={disabled}>
        {nextLabel} <ChevronRight size={18} />
      </Button3D>
    </div>
  );
}
