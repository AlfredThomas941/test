"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame, Heart, Gem, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakBadge({ value, size = 24 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-extrabold text-[#ff6b6b]" style={{ fontSize: size * 0.7 }}>
      <motion.span
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block"
      >
        <Flame size={size} fill="#ff6b6b" stroke="#ff4757" strokeWidth={1.5} />
      </motion.span>
      {value}
    </span>
  );
}

export function HeartsBadge({ value, max = 5, size = 22 }: { value: number; max?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-extrabold text-[#ff4757]">
      <Heart size={size} fill={value > 0 ? "#ff4757" : "#e8dcc4"} stroke={value > 0 ? "#d63545" : "#c4b8a0"} strokeWidth={1.5} />
      <span className="text-base tabular-nums">
        {value}<span className="text-[#8b7d6b]">/{max}</span>
      </span>
    </span>
  );
}

export function GemsBadge({ value, size = 22 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-extrabold text-[#4d96ff]">
      <Gem size={size} fill="#4d96ff" stroke="#2f7ee0" strokeWidth={1.5} />
      <span className="text-base tabular-nums">{value}</span>
    </span>
  );
}

export function XPBadge({ value, size = 22 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-extrabold text-[#ffc93c]">
      <Zap size={size} fill="#ffc93c" stroke="#e0a91a" strokeWidth={1.5} />
      <span className="text-base tabular-nums">{value}</span>
    </span>
  );
}

/** Animated circular progress ring */
export function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  color = "#58cc8d",
  trackColor = "#e8dcc4",
  children,
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** Linear progress bar (chunky, animated) */
export function ProgressBar({
  value,
  color = "#58cc8d",
  trackColor = "#fff0d6",
  height = 12,
  className,
}: {
  value: number; // 0..100
  color?: string;
  trackColor?: string;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative w-full rounded-full overflow-hidden", className)}
      style={{ height, backgroundColor: trackColor }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

export function StarRow({ count, max = 3, size = 18 }: { count: number; max?: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15 * i, type: "spring", stiffness: 200, damping: 12 }}
        >
          <Star
            size={size}
            className={i < count ? "fill-[#ffc93c] text-[#ffc93c]" : "fill-[#e8dcc4] text-[#e8dcc4]"}
            strokeWidth={1}
          />
        </motion.div>
      ))}
    </div>
  );
}
