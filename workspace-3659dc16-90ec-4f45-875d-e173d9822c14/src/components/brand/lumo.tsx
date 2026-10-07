"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Expression = "happy" | "excited" | "sad" | "thinking" | "wave" | "sleep" | "cheer" | "wave2";

/**
 * Lumo the Fox — original mascot for Lingoland.
 * A friendly orange fox with cream belly, big curious eyes, fluffy tail.
 * Distinct from Duolingo's green owl.
 */
export function Lumo({
  size = 160,
  expression = "happy",
  float = false,
  className = "",
}: {
  size?: number;
  expression?: Expression;
  float?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={
        float
          ? { y: [0, -8, 0] }
          : expression === "wave" || expression === "wave2"
          ? { rotate: [0, expression === "wave2" ? -6 : 6, 0] }
          : expression === "cheer"
          ? { y: [0, -10, 0], rotate: [0, 2, -2, 0] }
          : {}
      }
      transition={{
        duration: expression === "cheer" ? 0.6 : float ? 4 : 1.2,
        repeat: float || expression === "wave" || expression === "wave2" ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size} aria-label="Lumo the fox">
        {/* Tail */}
        <g>
          <path
            d="M158 110c14-6 28-2 32 12 4 14-6 28-22 30-10 1.5-22-3-26-12-3-7 4-22 16-30Z"
            fill="#ff8c42"
            stroke="#2c2334"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M170 116c8-3 16 0 18 8 2 8-3 16-12 17-6 1-13-2-15-8-1.5-5 1-13 9-17Z"
            fill="#fff8ee"
          />
        </g>

        {/* Body */}
        <ellipse
          cx="100"
          cy="140"
          rx="48"
          ry="40"
          fill="#ff8c42"
          stroke="#2c2334"
          strokeWidth="3"
        />
        {/* Belly */}
        <ellipse cx="100" cy="150" rx="28" ry="24" fill="#fff8ee" />

        {/* Arms */}
        <ellipse
          cx="62"
          cy="142"
          rx="11"
          ry="18"
          fill="#ff8c42"
          stroke="#2c2334"
          strokeWidth="3"
          transform="rotate(-12 62 142)"
        />
        <ellipse
          cx="138"
          cy="142"
          rx="11"
          ry="18"
          fill="#ff8c42"
          stroke="#2c2334"
          strokeWidth="3"
          transform="rotate(12 138 142)"
        />

        {/* Head */}
        <circle cx="100" cy="78" r="52" fill="#ff8c42" stroke="#2c2334" strokeWidth="3" />

        {/* Ears */}
        <path
          d="M62 50 L48 14 L92 38 Z"
          fill="#ff8c42"
          stroke="#2c2334"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M64 44 L56 24 L80 38 Z" fill="#fff8ee" />
        <path
          d="M138 50 L152 14 L108 38 Z"
          fill="#ff8c42"
          stroke="#2c2334"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M136 44 L144 24 L120 38 Z" fill="#fff8ee" />

        {/* Face mask (cream) */}
        <ellipse cx="100" cy="86" rx="38" ry="28" fill="#fff8ee" />

        {/* Cheeks (rosy) */}
        <circle cx="68" cy="92" r="6" fill="#ffb3b3" opacity="0.7" />
        <circle cx="132" cy="92" r="6" fill="#ffb3b3" opacity="0.7" />

        {/* Eyes */}
        {expression === "sleep" ? (
          <>
            <path d="M78 80 Q 84 86 90 80" stroke="#2c2334" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M110 80 Q 116 86 122 80" stroke="#2c2334" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : expression === "excited" || expression === "cheer" ? (
          <>
            <circle cx="84" cy="80" r="6" fill="#2c2334" />
            <circle cx="116" cy="80" r="6" fill="#2c2334" />
            <circle cx="86" cy="78" r="2" fill="#fff8ee" />
            <circle cx="118" cy="78" r="2" fill="#fff8ee" />
          </>
        ) : (
          <>
            <ellipse cx="84" cy="80" rx="5" ry="6.5" fill="#2c2334" />
            <ellipse cx="116" cy="80" rx="5" ry="6.5" fill="#2c2334" />
            <circle cx="86" cy="78" r="1.7" fill="#fff8ee" />
            <circle cx="118" cy="78" r="1.7" fill="#fff8ee" />
          </>
        )}

        {/* Eyebrows (thinking) */}
        {expression === "thinking" && (
          <>
            <path d="M76 68 L92 70" stroke="#2c2334" strokeWidth="3" strokeLinecap="round" />
            <path d="M108 70 L124 68" stroke="#2c2334" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="92" rx="4" ry="3" fill="#2c2334" />

        {/* Mouth */}
        {expression === "sad" ? (
          <path
            d="M92 104 Q 100 98 108 104"
            stroke="#2c2334"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
        ) : expression === "thinking" ? (
          <path d="M96 104 L 104 104" stroke="#2c2334" strokeWidth="2.6" strokeLinecap="round" />
        ) : expression === "cheer" || expression === "excited" ? (
          <path
            d="M86 100 Q 100 116 114 100 Q 100 108 86 100 Z"
            fill="#2c2334"
            stroke="#2c2334"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M90 100 Q 100 110 110 100"
            stroke="#2c2334"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Wave arm */}
        {(expression === "wave" || expression === "wave2") && (
          <g
            style={{
              transformOrigin: "138px 142px",
              animation: "wiggle 0.6s ease-in-out infinite alternate",
            }}
          >
            <ellipse
              cx="158"
              cy="108"
              rx="10"
              ry="16"
              fill="#ff8c42"
              stroke="#2c2334"
              strokeWidth="3"
              transform="rotate(30 158 108)"
            />
            <circle cx="170" cy="92" r="8" fill="#ff8c42" stroke="#2c2334" strokeWidth="3" />
          </g>
        )}

        {/* Thought bubble for thinking */}
        {expression === "thinking" && (
          <g>
            <circle cx="156" cy="40" r="10" fill="#fff8ee" stroke="#2c2334" strokeWidth="2.5" />
            <circle cx="172" cy="22" r="5" fill="#fff8ee" stroke="#2c2334" strokeWidth="2.5" />
            <text
              x="151"
              y="45"
              fontFamily="var(--font-baloo)"
              fontWeight="700"
              fontSize="12"
              fill="#2c2334"
            >
              ?
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/** Smaller standalone fox face icon — used in headers/avatars */
export function LumoFace({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Lumo"
    >
      <circle cx="50" cy="52" r="36" fill="#ff8c42" stroke="#2c2334" strokeWidth="2.5" />
      <path
        d="M22 32 L14 8 L42 22 Z"
        fill="#ff8c42"
        stroke="#2c2334"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M78 32 L86 8 L58 22 Z"
        fill="#ff8c42"
        stroke="#2c2334"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="58" rx="22" ry="16" fill="#fff8ee" />
      <ellipse cx="42" cy="52" rx="3" ry="4" fill="#2c2334" />
      <ellipse cx="58" cy="52" rx="3" ry="4" fill="#2c2334" />
      <circle cx="43" cy="51" r="1" fill="#fff8ee" />
      <circle cx="59" cy="51" r="1" fill="#fff8ee" />
      <ellipse cx="50" cy="62" rx="2.4" ry="1.8" fill="#2c2334" />
      <path d="M45 68 Q 50 73 55 68" stroke="#2c2334" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="62" r="3" fill="#ffb3b3" opacity="0.7" />
      <circle cx="66" cy="62" r="3" fill="#ffb3b3" opacity="0.7" />
    </svg>
  );
}
