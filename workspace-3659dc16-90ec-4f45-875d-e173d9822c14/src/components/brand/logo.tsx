import * as React from "react";

/**
 * Lingoland wordmark + logo.
 * A speech bubble containing a stylized leaf/sprout — original mark, no Duolingo IP.
 */
export function Logo({
  size = 32,
  withWordmark = true,
  className = "",
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        {/* Speech bubble */}
        <path
          d="M24 4C12.954 4 4 11.61 4 21c0 5.06 2.78 9.6 7.16 12.66.27.19.41.51.36.84l-1.18 7.05a.7.7 0 0 0 1.02.74l8.07-4.46c.21-.12.46-.16.71-.1 1.27.27 2.59.41 3.94.41 11.046 0 20-7.61 20-17S35.046 4 24 4Z"
          fill="#58cc8d"
          stroke="#2c2334"
          strokeWidth="2.5"
        />
        {/* Sprout */}
        <path
          d="M24 33c0-5 0-9 0-9M24 24c-2-3-6-5-9-4 1 4 4 6 9 4ZM24 22c2-3 6-5 9-4-1 4-4 6-9 4Z"
          stroke="#fff8ee"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="24" cy="33" r="2.2" fill="#fff8ee" />
      </svg>
      {withWordmark && (
        <span
          className="font-display font-extrabold tracking-tight text-ink"
          style={{ fontSize: size * 0.62 }}
        >
          Lingoland
        </span>
      )}
    </div>
  );
}
