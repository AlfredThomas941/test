"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Globe2, Trophy, Bot, Heart, Zap, Star, Check } from "lucide-react";
import { Button3D } from "@/components/brand/button";
import { Lumo, LumoFace } from "@/components/brand/lumo";
import { Logo } from "@/components/brand/logo";
import { useApp } from "@/lib/store";
import { LANGUAGES, COURSES } from "@/data/courses";

export function LandingView() {
  const { setView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8ee] via-[#fff8ee] to-[#ffe9d4]">
      {/* Top nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#fff8ee]/85 border-b border-[#e8dcc4]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size={36} />
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-[#2c2334]">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#58cc8d]">Features</button>
            <button onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#58cc8d]">Courses</button>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#58cc8d]">Pricing</button>
            <button onClick={() => setView("ai-tutor")} className="hover:text-[#58cc8d]">AI Tutor</button>
          </nav>
          <div className="flex items-center gap-2">
            <Button3D variant="ghost" size="sm" onClick={() => setView("login")} className="hidden sm:inline-flex">
              Log in
            </Button3D>
            <Button3D variant="primary" size="sm" onClick={() => setView("signup")}>
              Get started
            </Button3D>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-10 pb-16 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0d6] text-[#6b4f1d] text-xs font-bold mb-4"
            >
              <Sparkles size={14} className="text-[#ffc93c]" />
              Free forever • 3 languages • AI tutor included
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-[#2c2334]"
            >
              Learn a language <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#ff6b6b]">the fun way</span>
                <svg className="absolute -bottom-1 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 8 Q 50 0 100 7 T 198 6" stroke="#ffc93c" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[#2c2334]"> 🦊</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 text-lg md:text-xl text-[#6b4f1d] max-w-md leading-relaxed"
            >
              Bite-sized lessons. Friendly streaks. An AI tutor that actually explains your mistakes.
              Meet <strong className="text-[#ff6b6b]">Lumo the Fox</strong> — your guide to speaking with confidence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-7 flex flex-col sm:flex-row gap-3"
            >
              <Button3D variant="primary" size="xl" onClick={() => setView("signup")} className="font-extrabold">
                Start free <ArrowRight size={20} />
              </Button3D>
              <Button3D variant="secondary" size="xl" onClick={() => setView("login")}>
                I have an account
              </Button3D>
            </motion.div>
            <div className="mt-6 flex items-center gap-5 text-sm text-[#8b7d6b]">
              <div className="flex items-center gap-1.5"><Check size={16} className="text-[#58cc8d]" /> No credit card</div>
              <div className="flex items-center gap-1.5"><Check size={16} className="text-[#58cc8d]" /> 5-min lessons</div>
              <div className="flex items-center gap-1.5"><Check size={16} className="text-[#58cc8d]" /> Cancel anytime</div>
            </div>
          </div>

          {/* Hero illustration cluster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-[420px] md:h-[480px]"
          >
            <div className="absolute inset-0 grid place-items-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <Lumo size={300} expression="wave" float={false} />
              </motion.div>
            </div>
            {/* Floating bubbles */}
            <FloatBubble className="top-4 left-2 md:left-0" emoji="🇪🇸" label="Hola" delay={0} />
            <FloatBubble className="top-2 right-2 md:right-6" emoji="🇯🇵" label="こんにちは" delay={0.5} />
            <FloatBubble className="bottom-20 left-0" emoji="🇫🇷" label="Bonjour" delay={1} />
            <FloatBubble className="bottom-8 right-0" emoji="🔥" label="Streak 7" delay={1.5} color="#ff6b6b" />
            <FloatBubble className="top-32 right-0 md:right-2" emoji="⚡" label="+50 XP" delay={2} color="#ffc93c" />
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
          <Stat value="3" label="Languages" emoji="🌍" />
          <Stat value="180+" label="Bite-sized lessons" emoji="📚" />
          <Stat value="20+" label="Achievements" emoji="🏆" />
          <Stat value="∞" label="AI conversations" emoji="🤖" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white border-y border-[#e8dcc4] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#fff0d6] text-[#6b4f1d] text-xs font-bold uppercase tracking-wide">Why Lingoland</span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#2c2334] mt-3">Built to keep you coming back</h2>
            <p className="text-lg text-[#6b4f1d] mt-3 max-w-2xl mx-auto">
              A delightful mix of game design, learning science, and a friendly fox who believes in you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              emoji="🎯"
              color="#58cc8d"
              title="Bite-sized lessons"
              body="Five-minute lessons that fit between your coffee and your next meeting. Short enough to never skip, deep enough to actually learn."
              icon={<Zap size={18} />}
            />
            <FeatureCard
              emoji="🔥"
              color="#ff6b6b"
              title="Streaks that motivate"
              body="Watch your streak grow. Use streak freezes for off-days. Earn achievements for hitting milestones. The dopamine hits are real."
              icon={<Heart size={18} />}
            />
            <FeatureCard
              emoji="🤖"
              color="#4d96ff"
              title="AI tutor Lumo"
              body="Practice real conversations in restaurants, airports, hotels. Lumo corrects mistakes gently, explains the why, and adapts difficulty."
              icon={<Bot size={18} />}
            />
            <FeatureCard
              emoji="🧠"
              color="#a06bd6"
              title="Spaced repetition"
              body="Words you struggle with come back at the right moment. Smart review queue prioritizes what you're about to forget."
              icon={<Sparkles size={18} />}
            />
            <FeatureCard
              emoji="🏆"
              color="#ffc93c"
              title="Leagues & quests"
              body="Climb from Bronze to Diamond. Complete daily, weekly and monthly quests. Compete with friends in XP races."
              icon={<Trophy size={18} />}
            />
            <FeatureCard
              emoji="🗺️"
              color="#ff8c42"
              title="Personal learning map"
              body="See your strengths and weaknesses across vocab, grammar, listening, speaking. Always know what to practice next."
              icon={<Globe2 size={18} />}
            />
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#fff0d6] text-[#6b4f1d] text-xs font-bold uppercase tracking-wide">Pick a language</span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#2c2334] mt-3">Start with one. Fall in love with all three.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {LANGUAGES.map((lang, i) => {
              const course = COURSES[i];
              const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
              return (
                <motion.button
                  key={lang.id}
                  onClick={() => setView("signup")}
                  whileHover={{ y: -4 }}
                  className="text-left bg-white rounded-3xl p-6 border-2 border-[#e8dcc4] hover:border-[#58cc8d] transition shadow-chunk-sm"
                  style={{ ["--btn-shadow" as any]: "#e8dcc4" } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl grid place-items-center text-4xl"
                      style={{ backgroundColor: `${course.iconColor}22` }}
                    >
                      {lang.flag}
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#fff0d6] text-[#6b4f1d]">
                      {totalLessons} lessons
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-[#2c2334]">{lang.name}</h3>
                  <p className="text-[#6b4f1d] font-bold text-sm mb-1">{lang.nativeName}</p>
                  <p className="text-sm text-[#8b7d6b] mt-2">{course.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[#58cc8d] font-bold text-sm">
                    Start learning <ArrowRight size={14} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white border-y border-[#e8dcc4] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#fff0d6] text-[#6b4f1d] text-xs font-bold uppercase tracking-wide">Pricing</span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#2c2334] mt-3">Free forever. Plus when you're ready.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            <PriceCard
              name="Free"
              price="$0"
              tagline="Everything you need to start"
              color="#58cc8d"
              features={["All lessons", "Daily quests", "5 hearts", "Bronze & Silver leagues", "1 AI chat / day"]}
              cta="Start free"
              onClick={() => setView("signup")}
            />
            <PriceCard
              name="Plus"
              price="$6.99"
              tagline="For serious learners"
              color="#ff6b6b"
              highlighted
              badge="Most popular"
              features={["Everything in Free", "Unlimited hearts", "All leagues", "Unlimited AI tutor", "No ads", "Streak freeze x3 / month"]}
              cta="Try 14 days free"
              onClick={() => setView("signup")}
            />
            <PriceCard
              name="Family"
              price="$9.99"
              tagline="Up to 6 accounts"
              color="#4d96ff"
              features={["Everything in Plus", "6 individual accounts", "Family leaderboard", "Shared streaks", "Parent dashboard (kids)"]}
              cta="Start family plan"
              onClick={() => setView("signup")}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative inline-block mb-6">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <LumoFace size={120} />
            </motion.div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#2c2334]">
            Your first lesson is one tap away.
          </h2>
          <p className="text-lg text-[#6b4f1d] mt-3">
            Join thousands of learners building a daily language habit with Lumo.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button3D variant="primary" size="xl" onClick={() => setView("signup")}>
              Create free account
            </Button3D>
            <Button3D variant="secondary" size="xl" onClick={() => setView("login")}>
              I already have one
            </Button3D>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c2334] text-[#f5ecdd] py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LumoFace size={32} />
              <span className="font-display font-extrabold text-xl">Lingoland</span>
            </div>
            <p className="text-sm text-[#f5ecdd]/70">Learning languages, one fox-step at a time.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Product</h4>
            <ul className="space-y-2 text-sm text-[#f5ecdd]/80">
              <li><button className="hover:text-[#58cc8d]" onClick={() => setView("signup")}>Courses</button></li>
              <li><button className="hover:text-[#58cc8d]" onClick={() => setView("ai-tutor")}>AI Tutor</button></li>
              <li><button className="hover:text-[#58cc8d]" onClick={() => setView("signup")}>Pricing</button></li>
              <li><button className="hover:text-[#58cc8d]" onClick={() => setView("login")}>Log in</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-[#f5ecdd]/80">
              <li>About</li>
              <li>Careers</li>
              <li>Press kit</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-[#f5ecdd]/80">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Cookies</li>
              <li>Accessibility</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-xs text-[#f5ecdd]/60">
          © {new Date().getFullYear()} Lingoland. Lumo and the Lingoland logo are trademarks of Lingoland Inc.
          This is an original product inspired by language-learning UX patterns; not affiliated with any other brand.
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <div className="text-center bg-white rounded-2xl p-4 border-2 border-[#e8dcc4]">
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="font-display text-3xl font-extrabold text-[#2c2334]">{value}</div>
      <div className="text-xs text-[#8b7d6b] font-bold uppercase tracking-wide">{label}</div>
    </div>
  );
}

function FloatBubble({
  className,
  emoji,
  label,
  delay,
  color = "#ffffff",
}: { className: string; emoji: string; label: string; delay: number; color?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{ delay, duration: 0.4, opacity: { delay }, scale: { delay }, y: { duration: 3 + delay, repeat: Infinity, ease: "easeInOut" } }}
    >
      <div
        className="px-3 py-2 rounded-2xl shadow-md flex items-center gap-2 font-bold text-sm"
        style={{ backgroundColor: color, color: color === "#ffffff" ? "#2c2334" : "#fff" }}
      >
        <span className="text-xl">{emoji}</span>
        <span>{label}</span>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  emoji,
  color,
  title,
  body,
  icon,
}: { emoji: string; color: string; title: string; body: string; icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-[#fff8ee] rounded-3xl p-6 border-2 border-[#e8dcc4]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center text-2xl"
          style={{ backgroundColor: `${color}22` }}
        >
          {emoji}
        </div>
        <div className="w-8 h-8 rounded-full grid place-items-center" style={{ backgroundColor: color, color: "#fff" }}>
          {icon}
        </div>
      </div>
      <h3 className="font-display text-xl font-extrabold text-[#2c2334] mb-2">{title}</h3>
      <p className="text-sm text-[#6b4f1d] leading-relaxed">{body}</p>
    </motion.div>
  );
}

function PriceCard({
  name,
  price,
  tagline,
  color,
  features,
  cta,
  highlighted,
  badge,
  onClick,
}: {
  name: string;
  price: string;
  tagline: string;
  color: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative rounded-3xl p-6 border-2 ${
        highlighted ? "border-[#ff6b6b] bg-gradient-to-b from-[#fff5f5] to-white scale-105 z-10" : "border-[#e8dcc4] bg-white"
      }`}
    >
      {badge && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide"
          style={{ backgroundColor: color }}
        >
          {badge}
        </span>
      )}
      <h3 className="font-display text-2xl font-extrabold text-[#2c2334]">{name}</h3>
      <p className="text-sm text-[#8b7d6b] mb-3">{tagline}</p>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="font-display text-4xl font-extrabold" style={{ color }}>{price}</span>
        <span className="text-sm text-[#8b7d6b]">/ month</span>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#2c2334]">
            <Check size={18} className="text-[#58cc8d] shrink-0 mt-0.5" /> {f}
          </li>
        ))}
      </ul>
      <Button3D
        variant={highlighted ? "danger" : "primary"}
        size="lg"
        full
        onClick={onClick}
        style={{ ["--btn-shadow" as any]: highlighted ? "#d63545" : "#44b277" } as React.CSSProperties}
      >
        {cta}
      </Button3D>
    </div>
  );
}
