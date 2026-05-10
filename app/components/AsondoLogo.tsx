"use client"

import { motion } from "framer-motion"

interface AsondoLogoProps {
  variant?: "full" | "mark" | "stacked"
  size?: "sm" | "md" | "lg" | "xl"
  color?: "white" | "orange" | "forest"
  animated?: boolean
  className?: string
}

const sizeMap = {
  sm: { mark: 28, text: "text-sm", gap: "gap-2" },
  md: { mark: 40, text: "text-lg", gap: "gap-2.5" },
  lg: { mark: 56, text: "text-2xl", gap: "gap-3" },
  xl: { mark: 96, text: "text-5xl", gap: "gap-4" },
}

const colorMap = {
  white: { stroke: "#FFFFFF", text: "text-white" },
  orange: { stroke: "#E8833D", text: "text-[#E8833D]" },
  forest: { stroke: "#1F3D2F", text: "text-[#1F3D2F]" },
}

/**
 * Asondo brand mark: stylized cocoa pod with three bean lines.
 * Reproduces the official Asondo identity (oval pod silhouette + three horizontal strokes).
 */
export function AsondoMark({ size = 40, color = "#FFFFFF", animated = false }: { size?: number; color?: string; animated?: boolean }) {
  const Component = animated ? motion.svg : "svg"
  const animProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      }
    : {}

  return (
    <Component
      width={size}
      height={size * 0.65}
      viewBox="0 0 100 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Asondo"
      {...animProps}
    >
      {/* Cocoa pod outline (pointed oval) */}
      <path
        d="M 4 32.5 Q 25 4, 50 4 Q 75 4, 96 32.5 Q 75 61, 50 61 Q 25 61, 4 32.5 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Three bean lines */}
      <path
        d="M 14 24 Q 50 18, 86 24"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 10 32.5 L 90 32.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 14 41 Q 50 47, 86 41"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </Component>
  )
}

export function AsondoLogo({ variant = "full", size = "md", color = "white", animated = false, className = "" }: AsondoLogoProps) {
  const s = sizeMap[size]
  const c = colorMap[color]
  const strokeColor = color === "white" ? "#FFFFFF" : color === "orange" ? "#E8833D" : "#1F3D2F"

  if (variant === "mark") {
    return <AsondoMark size={s.mark} color={strokeColor} animated={animated} />
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center ${s.gap} ${className}`}>
        <AsondoMark size={s.mark} color={strokeColor} animated={animated} />
        <span className={`${s.text} ${c.text} font-bold tracking-[0.2em] uppercase`}>
          Asondo
        </span>
      </div>
    )
  }

  // full: horizontal
  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <AsondoMark size={s.mark} color={strokeColor} animated={animated} />
      <span className={`${s.text} ${c.text} font-bold tracking-[0.15em] uppercase`}>
        Asondo
      </span>
    </div>
  )
}
