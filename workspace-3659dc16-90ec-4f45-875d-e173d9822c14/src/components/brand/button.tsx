"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "sun" | "sky" | "grape" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

export interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const VARIANTS: Record<Variant, { bg: string; shadow: string; text: string }> = {
  primary: { bg: "bg-[#58cc8d]", shadow: "#44b277", text: "text-white" },
  secondary: { bg: "bg-white", shadow: "#e8dcc4", text: "text-[#2c2334]" },
  danger: { bg: "bg-[#ff4757]", shadow: "#d63545", text: "text-white" },
  ghost: { bg: "bg-transparent", shadow: "transparent", text: "text-[#2c2334]" },
  sun: { bg: "bg-[#ffc93c]", shadow: "#e0a91a", text: "text-[#5b3f00]" },
  sky: { bg: "bg-[#4d96ff]", shadow: "#2f7ee0", text: "text-white" },
  grape: { bg: "bg-[#a06bd6]", shadow: "#7c4bb0", text: "text-white" },
  outline: { bg: "bg-white", shadow: "#e8dcc4", text: "text-[#4d96ff] border-2 border-[#e8dcc4]" },
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-4 py-2.5 text-base rounded-2xl",
  lg: "px-5 py-3 text-base rounded-2xl",
  xl: "px-7 py-4 text-lg rounded-2xl",
};

export const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ variant = "primary", size = "md", full, className, children, style, ...rest }, ref) => {
    const v = VARIANTS[variant];
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide no-tap-highlight select-none transition-transform duration-100 active:translate-y-[2px] disabled:opacity-55 disabled:cursor-not-allowed disabled:active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#58cc8d]/30",
          SIZES[size],
          v.bg,
          v.text,
          full && "w-full",
          className
        )}
        style={
          {
            ...(style as React.CSSProperties),
            // Used by .shadow-chunk utility
            ["--btn-shadow" as any]: v.shadow,
            boxShadow: variant === "ghost" ? "none" : `0 4px 0 0 ${v.shadow}`,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </button>
    );
  }
);
Button3D.displayName = "Button3D";

/** Pill-style small button */
export function Pill({
  active,
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "px-4 py-1.5 rounded-full font-bold text-sm transition-colors",
        active ? "bg-[#58cc8d] text-white shadow-[0_3px_0_#44b277]" : "bg-white text-[#8b7d6b] hover:bg-[#fff0d6]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
