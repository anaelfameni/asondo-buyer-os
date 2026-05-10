"use client";

/**
 * Logos officiels recréés en SVG natif pour des raisons de performance et fidélité.
 * Ces logos représentent des standards reconnus de l'industrie cacao.
 */

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Logo Federation of Cocoa Commerce (FCC) — recréation stylisée
 * Source: https://www.cocoafederation.com/
 */
export function FCCLogo({ className = "", width = 120, height = 40 }: LogoProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Federation of Cocoa Commerce"
    >
      {/* Cocoa pod icon */}
      <g transform="translate(8, 12)">
        <ellipse cx="28" cy="28" rx="22" ry="26" fill="currentColor" opacity="0.9" />
        <path
          d="M 28 4 L 28 52 M 14 8 L 14 48 M 42 8 L 42 48 M 20 6 L 20 50 M 36 6 L 36 50"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
          strokeLinecap="round"
        />
      </g>
      {/* Text "FCC" */}
      <text
        x="68"
        y="40"
        fill="currentColor"
        fontFamily="serif"
        fontSize="32"
        fontWeight="700"
        letterSpacing="2"
      >
        FCC
      </text>
      {/* Subtitle */}
      <text
        x="68"
        y="58"
        fill="currentColor"
        fontFamily="sans-serif"
        fontSize="9"
        fontWeight="500"
        letterSpacing="1"
        opacity="0.85"
      >
        FEDERATION OF
      </text>
      <text
        x="68"
        y="69"
        fill="currentColor"
        fontFamily="sans-serif"
        fontSize="9"
        fontWeight="500"
        letterSpacing="1"
        opacity="0.85"
      >
        COCOA COMMERCE
      </text>
    </svg>
  );
}

/**
 * Logo Rainforest Alliance — recréation stylisée de la grenouille verte iconique
 * Source: https://www.rainforest-alliance.org/
 */
export function RainforestAllianceLogo({ className = "", width = 140, height = 40 }: LogoProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rainforest Alliance"
    >
      {/* Iconic green frog seal */}
      <g transform="translate(8, 8)">
        {/* Outer circle seal */}
        <circle cx="32" cy="32" r="32" fill="#3F9C35" />
        <circle cx="32" cy="32" r="29" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
        {/* Frog silhouette stylized */}
        <g fill="white">
          {/* Body */}
          <ellipse cx="32" cy="38" rx="14" ry="11" />
          {/* Head */}
          <ellipse cx="32" cy="24" rx="10" ry="8" />
          {/* Eyes (left) */}
          <circle cx="27" cy="20" r="3.5" fill="white" />
          <circle cx="27" cy="20" r="2" fill="#3F9C35" />
          {/* Eyes (right) */}
          <circle cx="37" cy="20" r="3.5" fill="white" />
          <circle cx="37" cy="20" r="2" fill="#3F9C35" />
          {/* Legs - back */}
          <ellipse cx="20" cy="42" rx="5" ry="8" transform="rotate(-30 20 42)" />
          <ellipse cx="44" cy="42" rx="5" ry="8" transform="rotate(30 44 42)" />
          {/* Front feet */}
          <ellipse cx="22" cy="48" rx="4" ry="3" />
          <ellipse cx="42" cy="48" rx="4" ry="3" />
        </g>
        {/* Leaf accent */}
        <path
          d="M 50 14 Q 56 18, 54 26 Q 48 24, 50 14 Z"
          fill="white"
          opacity="0.9"
        />
      </g>
      {/* Text */}
      <text
        x="78"
        y="32"
        fill="currentColor"
        fontFamily="sans-serif"
        fontSize="14"
        fontWeight="700"
        letterSpacing="0.5"
      >
        RAINFOREST
      </text>
      <text
        x="78"
        y="48"
        fill="currentColor"
        fontFamily="sans-serif"
        fontSize="14"
        fontWeight="400"
        letterSpacing="0.5"
      >
        ALLIANCE
      </text>
      {/* Tagline */}
      <text
        x="78"
        y="62"
        fill="currentColor"
        fontFamily="sans-serif"
        fontSize="7"
        fontWeight="500"
        letterSpacing="1.5"
        opacity="0.75"
      >
        CERTIFIED
      </text>
    </svg>
  );
}

/**
 * Logo CCC (Coffee and Cocoa Council Côte d'Ivoire)
 */
export function CCCLogo({ className = "", width = 120, height = 40 }: LogoProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Conseil Café-Cacao Côte d'Ivoire"
    >
      <g transform="translate(8, 8)">
        {/* Shield base */}
        <path
          d="M 32 4 L 56 12 L 56 38 Q 56 56, 32 64 Q 8 56, 8 38 L 8 12 Z"
          fill="currentColor"
        />
        {/* Cocoa pod silhouette */}
        <ellipse cx="32" cy="32" rx="10" ry="14" fill="white" opacity="0.95" />
        <path
          d="M 32 18 L 32 46 M 26 22 L 26 42 M 38 22 L 38 42"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>
      <text x="76" y="34" fill="currentColor" fontFamily="serif" fontSize="20" fontWeight="700">
        CCC
      </text>
      <text x="76" y="50" fill="currentColor" fontFamily="sans-serif" fontSize="8" fontWeight="500" opacity="0.85">
        COFFEE & COCOA
      </text>
      <text x="76" y="60" fill="currentColor" fontFamily="sans-serif" fontSize="8" fontWeight="500" opacity="0.85">
        COUNCIL
      </text>
    </svg>
  );
}

/**
 * EUDR badge — Union européenne EUDR Ready
 */
export function EUDRBadge({ className = "", width = 100, height = 40 }: LogoProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EUDR Ready"
    >
      <g transform="translate(8, 8)">
        {/* EU stars circle */}
        <circle cx="32" cy="32" r="28" fill="#003399" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const cx = 32 + Math.cos(angle) * 18;
          const cy = 32 + Math.sin(angle) * 18;
          return (
            <text
              key={i}
              x={cx}
              y={cy + 3}
              textAnchor="middle"
              fill="#FFCC00"
              fontSize="10"
              fontWeight="900"
            >
              ★
            </text>
          );
        })}
      </g>
      <text x="76" y="34" fill="currentColor" fontFamily="sans-serif" fontSize="18" fontWeight="800">
        EUDR
      </text>
      <text x="76" y="52" fill="currentColor" fontFamily="sans-serif" fontSize="9" fontWeight="600" letterSpacing="1">
        READY
      </text>
    </svg>
  );
}
