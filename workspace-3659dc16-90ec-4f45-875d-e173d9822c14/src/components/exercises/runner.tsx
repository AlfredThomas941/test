"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X, Mic, Lightbulb, ChevronRight, RotateCw } from "lucide-react";
import { Button3D } from "@/components/brand/button";
import { cn } from "@/lib/utils";
import type { ExerciseSpec } from "@/data/courses";
import { useApp } from "@/lib/store";

interface ExerciseRunnerProps {
  exercise: ExerciseSpec;
  index: number;
  total: number;
  onAnswered: (correct: boolean, userAnswer: string, xp: number) => void;
  onNext: () => void;
  onQuit: () => void;
  languageId: string;
}

export function ExerciseRunner({
  exercise,
  index,
  total,
  onAnswered,
  onNext,
  onQuit,
  languageId,
}: ExerciseRunnerProps) {
  const [userAnswer, setUserAnswer] = React.useState<string>("");
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = React.useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = React.useState<string | null>(null);
  const [selectedRight, setSelectedRight] = React.useState<string | null>(null);
  const [shuffledRight, setShuffledRight] = React.useState<{ left: string; right: string }[]>([]);
  const [tokensPlaced, setTokensPlaced] = React.useState<string[]>([]);
  const [tokensPool, setTokensPool] = React.useState<string[]>([]);
  const [feedback, setFeedback] = React.useState<null | "correct" | "incorrect">(null);
  const [showHint, setShowHint] = React.useState(false);
  const [feedbackShown, setFeedbackShown] = React.useState(false);
  const [_, forceRerender] = React.useState(0);
  void _;

  // Reset state on exercise change
  React.useEffect(() => {
    setUserAnswer("");
    setSelectedIdx(null);
    setMatchedPairs({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setTokensPlaced([]);
    setFeedback(null);
    setShowHint(false);
    setFeedbackShown(false);
    if (exercise.pairs) {
      setShuffledRight([...exercise.pairs].sort(() => Math.random() - 0.5));
    }
    if (exercise.tokens) {
      // For word_order, also shuffle the pool
      setTokensPool([...exercise.tokens].sort(() => Math.random() - 0.5));
    }
  }, [exercise.id]);

  const { pushToast, loseHeart, addMistake, addReviewItem, updateConfidence, gamification } = useApp();

  const xp = exercise.xp ?? 2;

  // ─── Validation ────────────────────────────────────────────
  function validate(): { correct: boolean; userAnswerStr: string } {
    switch (exercise.type) {
      case "multiple_choice":
      case "image_select":
      case "true_false":
      case "listening":
      case "dialogue": {
        if (selectedIdx === null) return { correct: false, userAnswerStr: "" };
        const correctIdx = Array.isArray(exercise.correctIndex)
          ? exercise.correctIndex.includes(selectedIdx)
          : selectedIdx === exercise.correctIndex;
        const options = exercise.options ?? exercise.images ?? [];
        return { correct: correctIdx, userAnswerStr: options[selectedIdx] ?? "" };
      }
      case "translation":
      case "word_order": {
        const joined = tokensPlaced.join(" ").replace(/\s+/g, " ").trim();
        const correct = joined.toLowerCase() === (exercise.correctOrder ?? "").toLowerCase();
        return { correct, userAnswerStr: joined };
      }
      case "fill_blank": {
        const ans = userAnswer.trim().toLowerCase();
        const correct = ans === (exercise.blankAnswer ?? "").toLowerCase();
        return { correct, userAnswerStr: userAnswer };
      }
      case "matching": {
        const total = exercise.pairs?.length ?? 0;
        const matchedCount = Object.keys(matchedPairs).length;
        const correct = matchedCount === total;
        const allCorrect =
          correct &&
          exercise.pairs!.every((p) => matchedPairs[p.left] === p.right);
        return { correct: allCorrect, userAnswerStr: JSON.stringify(matchedPairs) };
      }
      case "speaking": {
        // Speaking is simulated; always mark correct (we don't have STT here)
        return { correct: true, userAnswerStr: "[spoken]" };
      }
      default:
        return { correct: false, userAnswerStr: userAnswer };
    }
  }

  function handleCheck() {
    if (feedback) return;
    // For matching, auto-evaluate as user matches; we still require Check to confirm
    const { correct, userAnswerStr } = validate();
    setFeedback(correct ? "correct" : "incorrect");
    setFeedbackShown(true);
    onAnswered(correct, userAnswerStr, correct ? xp : 0);
    if (!correct) {
      loseHeart();
      // Add to mistakes notebook
      addMistake({
        languageId,
        category: exercise.type === "listening" ? "listening" : exercise.type === "speaking" ? "speaking" : "vocab",
        prompt: exercise.prompt,
        userAnswer: userAnswerStr || "(no answer)",
        correctAnswer: getCorrectAnswerString(),
        explanation: exercise.explanation,
      });
      // Reduce confidence
      updateConfidence(exercise.type === "listening" ? "listening" : exercise.type === "speaking" ? "speaking" : "vocab", -3);
      pushToast({ text: "Hearts -1", emoji: "💔", variant: "error" });
    } else {
      updateConfidence(exercise.type === "listening" ? "listening" : exercise.type === "speaking" ? "speaking" : "vocab", 2);
    }
  }

  function getCorrectAnswerString(): string {
    if (exercise.type === "multiple_choice" || exercise.type === "image_select" || exercise.type === "true_false" || exercise.type === "listening" || exercise.type === "dialogue") {
      const options = exercise.options ?? exercise.images ?? [];
      const idx = Array.isArray(exercise.correctIndex) ? exercise.correctIndex[0] : exercise.correctIndex;
      return options[idx ?? 0] ?? "";
    }
    if (exercise.type === "translation" || exercise.type === "word_order") return exercise.correctOrder ?? "";
    if (exercise.type === "fill_blank") return exercise.blankAnswer ?? "";
    if (exercise.type === "matching") return "all pairs matched";
    if (exercise.type === "speaking") return exercise.targetPhrase ?? "";
    return "";
  }

  function handleSkip() {
    setFeedback("incorrect");
    setFeedbackShown(true);
    onAnswered(false, "(skipped)", 0);
    loseHeart();
  }

  function canCheck(): boolean {
    switch (exercise.type) {
      case "multiple_choice":
      case "image_select":
      case "true_false":
      case "listening":
      case "dialogue":
        return selectedIdx !== null;
      case "translation":
      case "word_order":
        return tokensPlaced.length > 0;
      case "fill_blank":
        return userAnswer.trim().length > 0;
      case "matching":
        return Object.keys(matchedPairs).length === (exercise.pairs?.length ?? 0);
      case "speaking":
        return true;
      default:
        return false;
    }
  }

  // ─── Token interactions (word order) ────────────────────────
  function addToken(token: string, fromPool: boolean) {
    if (feedback) return;
    if (fromPool) {
      setTokensPool((p) => p.filter((t, i) => i !== p.indexOf(token) || p.indexOf(token) !== p.lastIndexOf(token) ? false : true).slice(0, p.length - 1) );
      // simpler: remove first occurrence
      const idx = tokensPool.indexOf(token);
      if (idx >= 0) {
        const newPool = [...tokensPool];
        newPool.splice(idx, 1);
        setTokensPool(newPool);
        setTokensPlaced((p) => [...p, token]);
      }
    } else {
      const idx = tokensPlaced.indexOf(token);
      if (idx >= 0) {
        const newPlaced = [...tokensPlaced];
        newPlaced.splice(idx, 1);
        setTokensPlaced(newPlaced);
        setTokensPool((p) => [...p, token]);
      }
    }
  }

  // ─── Matching interactions ────────────────────────────────
  function handleLeftClick(left: string) {
    if (feedback) return;
    if (matchedPairs[left]) return;
    setSelectedLeft(left);
    if (selectedRight) {
      // Check pair
      const pair = exercise.pairs?.find((p) => p.left === left);
      if (pair && pair.right === selectedRight) {
        const next = { ...matchedPairs, [left]: selectedRight };
        setMatchedPairs(next);
        setSelectedLeft(null);
        setSelectedRight(null);
        pushToast({ text: "Match!", emoji: "✨", variant: "success" });
      } else {
        // wrong — flash and reset
        setSelectedRight(null);
        pushToast({ text: "Try again", emoji: "🤔", variant: "info" });
      }
    }
  }
  function handleRightClick(right: string) {
    if (feedback) return;
    if (Object.values(matchedPairs).includes(right)) return;
    setSelectedRight(right);
    if (selectedLeft) {
      const pair = exercise.pairs?.find((p) => p.left === selectedLeft);
      if (pair && pair.right === right) {
        const next = { ...matchedPairs, [selectedLeft]: right };
        setMatchedPairs(next);
        setSelectedLeft(null);
        setSelectedRight(null);
        pushToast({ text: "Match!", emoji: "✨", variant: "success" });
      } else {
        setSelectedLeft(null);
        pushToast({ text: "Try again", emoji: "🤔", variant: "info" });
      }
    }
  }

  // ─── Audio (use Web Speech API) ────────────────────────────
  function speak(text: string, lang: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { es: "es-ES", ja: "ja-JP", fr: "fr-FR" };
      u.lang = langMap[lang] ?? "en-US";
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {
      // ignore
    }
  }

  // ─── Speaking (simulate; record + auto-confirm) ─────────────
  const [recording, setRecording] = React.useState(false);
  function handleSpeak() {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setFeedback("correct");
      setFeedbackShown(true);
      onAnswered(true, "[spoken]", xp);
      pushToast({ text: "Great pronunciation!", emoji: "🎙️", variant: "success" });
    }, 1500);
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top bar: progress + quit */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onQuit}
          className="w-9 h-9 rounded-full grid place-items-center text-[#8b7d6b] hover:bg-[#fff0d6] transition"
          aria-label="Quit lesson"
        >
          <X size={20} />
        </button>
        <div className="flex-1 h-3 bg-[#fff0d6] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#58cc8d] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center gap-1 font-bold text-[#ff4757]">
          <span aria-hidden>❤️</span>
          <span className="tabular-nums">{gamification.hearts}</span>
        </div>
      </div>

      {/* Exercise prompt */}
      <ExerciseHeader exercise={exercise} languageId={languageId} speak={speak} />

      {/* Exercise body */}
      <div className="mt-6 mb-6 min-h-[260px]">
        <ExerciseBody
          exercise={exercise}
          selectedIdx={selectedIdx}
          setSelectedIdx={(i) => !feedback && setSelectedIdx(i)}
          userAnswer={userAnswer}
          setUserAnswer={(v) => !feedback && setUserAnswer(v)}
          matchedPairs={matchedPairs}
          selectedLeft={selectedLeft}
          selectedRight={selectedRight}
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
          tokensPlaced={tokensPlaced}
          tokensPool={tokensPool}
          onAddToken={(t, p) => addToken(t, p)}
          feedback={feedback}
          languageId={languageId}
          speak={speak}
          recording={recording}
          onSpeak={handleSpeak}
        />
      </div>

      {/* Hint toggle */}
      {exercise.hint && !feedback && (
        <button
          onClick={() => setShowHint((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#4d96ff] hover:underline mb-2"
        >
          <Lightbulb size={16} /> {showHint ? "Hide hint" : "Show hint"}
        </button>
      )}
      {showHint && exercise.hint && (
        <div className="text-sm bg-[#fff0d6] rounded-xl p-3 mb-2 text-[#6b4f1d] font-semibold">
          💡 {exercise.hint}
        </div>
      )}

      {/* Feedback panel */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={cn(
              "fixed bottom-0 inset-x-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-20",
              "p-4 md:rounded-t-3xl border-t-4 shadow-2xl",
              feedback === "correct" ? "bg-[#d7ffe5] border-[#58cc8d]" : "bg-[#ffe3e3] border-[#ff4757]"
            )}
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full grid place-items-center text-white",
                    feedback === "correct" ? "bg-[#58cc8d]" : "bg-[#ff4757]"
                  )}
                >
                  {feedback === "correct" ? <Check size={22} /> : <X size={22} />}
                </div>
                <div className="flex-1">
                  <div className={cn("font-extrabold text-lg", feedback === "correct" ? "text-[#2a8a4f]" : "text-[#c83243]")}>
                    {feedback === "correct" ? "Nicely done!" : "Not quite..."}
                  </div>
                  {feedback === "correct" && (
                    <div className="text-sm font-bold text-[#2a8a4f]/80">+{xp} XP</div>
                  )}
                </div>
              </div>
              {feedback === "incorrect" && (
                <div className="bg-white rounded-xl p-3 mb-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#8b7d6b] mb-1">Correct answer</div>
                  <div className="font-bold text-[#2c2334]">{getCorrectAnswerString()}</div>
                  {exercise.explanation && (
                    <div className="text-sm text-[#8b7d6b] mt-2">{exercise.explanation}</div>
                  )}
                </div>
              )}
              {feedback === "correct" && exercise.explanation && (
                <div className="bg-white/50 rounded-xl p-3 mb-3 text-sm text-[#2a8a4f]">
                  {exercise.explanation}
                </div>
              )}
              <Button3D
                variant={feedback === "correct" ? "primary" : "danger"}
                size="lg"
                full
                onClick={onNext}
                style={
                  feedback === "correct"
                    ? ({ ["--btn-shadow" as any]: "#44b277" } as React.CSSProperties)
                    : ({ ["--btn-shadow" as any]: "#d63545" } as React.CSSProperties)
                }
              >
                Continue <ChevronRight size={18} />
              </Button3D>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom action bar (when no feedback) */}
      {!feedback && (
        <div className="flex items-center gap-3 mt-4">
          <Button3D variant="ghost" size="lg" onClick={handleSkip} className="text-[#8b7d6b]">
            Skip
          </Button3D>
          <div className="flex-1" />
          <Button3D
            variant={canCheck() ? "primary" : "secondary"}
            size="lg"
            disabled={!canCheck()}
            onClick={handleCheck}
            style={
              canCheck()
                ? ({ ["--btn-shadow" as any]: "#44b277" } as React.CSSProperties)
                : ({ ["--btn-shadow" as any]: "#e8dcc4" } as React.CSSProperties)
            }
          >
            Check
          </Button3D>
        </div>
      )}
    </div>
  );
}

function ExerciseHeader({
  exercise,
  languageId,
  speak,
}: {
  exercise: ExerciseSpec;
  languageId: string;
  speak: (text: string, lang: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#8b7d6b]">
          {EXERCISE_LABELS[exercise.type]}
        </span>
        {exercise.instruction && (
          <span className="text-xs text-[#8b7d6b]">{exercise.instruction}</span>
        )}
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#2c2334] leading-tight">
        {exercise.prompt}
      </h2>
      {exercise.promptTranslation && (
        <p className="text-base text-[#8b7d6b] mt-1">{exercise.promptTranslation}</p>
      )}
      {exercise.type === "listening" && exercise.audioText && (
        <button
          onClick={() => speak(exercise.audioText!, languageId)}
          className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#fff0d6] hover:bg-[#ffe6b8] transition shadow-chunk-sm"
          style={{ ["--btn-shadow" as any]: "#e8dcc4" } as React.CSSProperties}
          aria-label="Play audio"
        >
          <Volume2 size={24} className="text-[#4d96ff]" />
          <span className="font-bold text-[#2c2334]">Play</span>
        </button>
      )}
    </div>
  );
}

const EXERCISE_LABELS: Record<ExerciseSpec["type"], string> = {
  multiple_choice: "Choose the answer",
  translation: "Translate",
  word_order: "Order the words",
  fill_blank: "Fill in the blank",
  matching: "Match the pairs",
  listening: "Tap what you hear",
  speaking: "Speak the phrase",
  image_select: "Choose the image",
  dialogue: "Reply to Lumo",
  spell: "Spell the word",
  true_false: "True or False",
};

function ExerciseBody({
  exercise,
  selectedIdx,
  setSelectedIdx,
  userAnswer,
  setUserAnswer,
  matchedPairs,
  selectedLeft,
  selectedRight,
  onLeftClick,
  onRightClick,
  tokensPlaced,
  tokensPool,
  onAddToken,
  feedback,
  languageId,
  speak,
  recording,
  onSpeak,
}: {
  exercise: ExerciseSpec;
  selectedIdx: number | null;
  setSelectedIdx: (i: number) => void;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  matchedPairs: Record<string, string>;
  selectedLeft: string | null;
  selectedRight: string | null;
  onLeftClick: (l: string) => void;
  onRightClick: (r: string) => void;
  tokensPlaced: string[];
  tokensPool: string[];
  onAddToken: (t: string, fromPool: boolean) => void;
  feedback: null | "correct" | "incorrect";
  languageId: string;
  speak: (text: string, lang: string) => void;
  recording: boolean;
  onSpeak: () => void;
}) {
  switch (exercise.type) {
    case "multiple_choice":
    case "true_false":
    case "listening":
    case "dialogue":
      return (
        <div className="grid gap-3">
          {(exercise.options ?? []).map((opt, i) => {
            const selected = selectedIdx === i;
            const correctIdx = Array.isArray(exercise.correctIndex) ? exercise.correctIndex[0] : exercise.correctIndex;
            const showCorrect = feedback && i === correctIdx;
            const showWrong = feedback === "incorrect" && selected && i !== correctIdx;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                disabled={!!feedback}
                className={cn(
                  "relative text-left px-5 py-4 rounded-2xl border-2 font-bold text-lg transition-all no-tap-highlight flex items-center gap-3",
                  showCorrect
                    ? "border-[#58cc8d] bg-[#d7ffe5] text-[#2a8a4f]"
                    : showWrong
                    ? "border-[#ff4757] bg-[#ffe3e3] text-[#c83243]"
                    : selected
                    ? "border-[#4d96ff] bg-[#e6f0ff] text-[#2c2334]"
                    : "border-[#e8dcc4] bg-white text-[#2c2334] hover:border-[#4d96ff] hover:bg-[#f5f9ff]"
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 shrink-0 rounded-lg grid place-items-center border-2 font-bold text-sm",
                    selected ? "border-[#4d96ff] bg-[#4d96ff] text-white" : "border-[#e8dcc4] text-[#8b7d6b]"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {showCorrect && <Check className="text-[#58cc8d]" size={22} />}
                {showWrong && <X className="text-[#ff4757]" size={22} />}
              </button>
            );
          })}
          {exercise.type === "listening" && exercise.audioText && (
            <button
              onClick={() => speak(exercise.audioText!, languageId)}
              className="inline-flex items-center gap-2 text-[#4d96ff] font-bold text-sm hover:underline mt-2"
            >
              <RotateCw size={14} /> Replay audio
            </button>
          )}
        </div>
      );

    case "image_select":
      return (
        <div className="grid grid-cols-2 gap-3">
          {(exercise.images ?? []).map((img, i) => {
            const selected = selectedIdx === i;
            const correctIdx = exercise.correctImageIndex ?? 0;
            const showCorrect = feedback && i === correctIdx;
            const showWrong = feedback === "incorrect" && selected && i !== correctIdx;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                disabled={!!feedback}
                className={cn(
                  "relative aspect-square rounded-2xl border-2 grid place-items-center text-6xl transition-all hover:scale-[1.02] no-tap-highlight",
                  showCorrect
                    ? "border-[#58cc8d] bg-[#d7ffe5]"
                    : showWrong
                    ? "border-[#ff4757] bg-[#ffe3e3]"
                    : selected
                    ? "border-[#4d96ff] bg-[#e6f0ff]"
                    : "border-[#e8dcc4] bg-white"
                )}
              >
                <span>{img}</span>
                {showCorrect && (
                  <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#58cc8d] text-white grid place-items-center">
                    <Check size={16} />
                  </span>
                )}
                {showWrong && (
                  <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#ff4757] text-white grid place-items-center">
                    <X size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );

    case "matching":
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            {exercise.pairs?.map((p) => {
              const matched = matchedPairs[p.left];
              const selected = selectedLeft === p.left;
              return (
                <button
                  key={p.left}
                  onClick={() => onLeftClick(p.left)}
                  disabled={!!matched || !!feedback}
                  className={cn(
                    "w-full px-4 py-4 rounded-2xl border-2 font-bold text-lg transition-all no-tap-highlight",
                    matched
                      ? "border-[#58cc8d] bg-[#d7ffe5] text-[#2a8a4f] opacity-70"
                      : selected
                      ? "border-[#4d96ff] bg-[#e6f0ff]"
                      : "border-[#e8dcc4] bg-white hover:border-[#4d96ff]"
                  )}
                >
                  {p.left}
                </button>
              );
            })}
          </div>
          <div className="space-y-3">
            {[...(exercise.pairs ?? [])]
              .sort(() => 0.5 - Math.random())
              .map((p) => {
                const matched = Object.entries(matchedPairs).find(([_, r]) => r === p.right);
                const selected = selectedRight === p.right;
                return (
                  <button
                    key={p.right}
                    onClick={() => onRightClick(p.right)}
                    disabled={!!matched || !!feedback}
                    className={cn(
                      "w-full px-4 py-4 rounded-2xl border-2 font-bold text-lg transition-all no-tap-highlight",
                      matched
                        ? "border-[#58cc8d] bg-[#d7ffe5] text-[#2a8a4f] opacity-70"
                        : selected
                        ? "border-[#4d96ff] bg-[#e6f0ff]"
                        : "border-[#e8dcc4] bg-white hover:border-[#4d96ff]"
                    )}
                  >
                    {p.right}
                  </button>
                );
              })}
          </div>
        </div>
      );

    case "translation":
    case "word_order":
      return (
        <div>
          {/* Answer slot */}
          <div className="min-h-[80px] border-b-2 border-dashed border-[#e8dcc4] p-3 mb-4 flex flex-wrap gap-2 items-start">
            {tokensPlaced.length === 0 && (
              <span className="text-[#8b7d6b] text-sm italic">Tap words below to build your answer</span>
            )}
            {tokensPlaced.map((t, i) => (
              <button
                key={i}
                onClick={() => onAddToken(t, false)}
                disabled={!!feedback}
                className="px-3 py-2 rounded-xl bg-white border-2 border-[#e8dcc4] font-bold text-[#2c2334] hover:border-[#ff4757] transition"
              >
                {t}
              </button>
            ))}
          </div>
          {/* Token pool */}
          <div className="flex flex-wrap gap-2">
            {tokensPool.map((t, i) => (
              <button
                key={i}
                onClick={() => onAddToken(t, true)}
                disabled={!!feedback}
                className="px-3 py-2 rounded-xl bg-white border-2 border-[#e8dcc4] font-bold text-[#2c2334] hover:border-[#58cc8d] hover:bg-[#f5fcf8] transition shadow-chunk-sm"
                style={{ ["--btn-shadow" as any]: "#e8dcc4" } as React.CSSProperties}
              >
                {t}
              </button>
            ))}
            {tokensPool.length === 0 && !feedback && (
              <span className="text-[#8b7d6b] text-sm italic">All words used!</span>
            )}
          </div>
          {feedback && (
            <div className="mt-4 text-sm">
              <div className="font-bold text-[#8b7d6b]">You said:</div>
              <div className={cn("font-bold", feedback === "correct" ? "text-[#2a8a4f]" : "text-[#c83243]")}>
                {tokensPlaced.join(" ")}
              </div>
              {exercise.tokensTranslation && (
                <div className="mt-2 text-[#8b7d6b] italic">Meaning: {exercise.tokensTranslation}</div>
              )}
            </div>
          )}
        </div>
      );

    case "fill_blank":
      return (
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#2c2334] mb-4 leading-relaxed">
            {renderSentenceWithBlank(exercise.sentence ?? "", userAnswer)}
          </div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!feedback}
            autoFocus
            className="w-full px-4 py-3 rounded-2xl border-2 border-[#e8dcc4] focus:border-[#4d96ff] outline-none font-bold text-lg bg-white"
            placeholder="Type your answer..."
            aria-label="Your answer"
          />
          {feedback && exercise.blankAnswer && (
            <div className="mt-3 text-sm">
              <span className="font-bold text-[#8b7d6b]">Correct: </span>
              <span className="font-bold text-[#58cc8d]">{exercise.blankAnswer}</span>
            </div>
          )}
        </div>
      );

    case "speaking":
      return (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#2c2334]">{exercise.targetPhrase}</div>
            {exercise.promptTranslation && (
              <div className="text-[#8b7d6b] mt-1">{exercise.promptTranslation}</div>
            )}
            {exercise.hint && (
              <div className="text-sm text-[#4d96ff] font-bold mt-2">/ {exercise.hint} /</div>
            )}
          </div>
          <button
            onClick={onSpeak}
            disabled={recording || !!feedback}
            className={cn(
              "w-28 h-28 rounded-full grid place-items-center transition shadow-chunk",
              recording
                ? "bg-[#ff4757] animate-pulse"
                : "bg-[#58cc8d] hover:bg-[#44b277]"
            )}
            style={{ ["--btn-shadow" as any]: recording ? "#d63545" : "#44b277" } as React.CSSProperties}
            aria-label={recording ? "Listening..." : "Hold to speak"}
          >
            <Mic size={42} className="text-white" />
          </button>
          <p className="text-sm text-[#8b7d6b]">{recording ? "Listening..." : "Tap and speak the phrase"}</p>
        </div>
      );

    default:
      return <div className="text-[#8b7d6b]">Unknown exercise type.</div>;
  }
}

function renderSentenceWithBlank(sentence: string, answer: string) {
  // Render the sentence with __BLANK__ replaced by an inline answer box
  const parts = sentence.split(/_{2,}/);
  if (parts.length === 1) return sentence;
  return (
    <>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < parts.length - 1 && (
            <span
              className={cn(
                "inline-block min-w-[100px] mx-1 px-2 py-0.5 rounded-lg border-b-2 align-baseline",
                answer
                  ? "border-[#58cc8d] bg-[#d7ffe5]/30 text-[#2a8a4f]"
                  : "border-[#4d96ff] bg-[#e6f0ff]/30"
              )}
            >
              {answer || "\u00A0"}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
