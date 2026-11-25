/**
 * Aurelle Spaces — Canonical Design Tokens
 * 
 * Centralized, typed design tokens representing the architectural and luxury
 * visual identity for Aurelle Spaces.
 * 
 * Rules:
 * - All repeated design values derive from this canonical source.
 * - Colors match the specified brand palette (Part 4 Spec):
 *   Warm Ivory #F7F5F1, Pure White #FFFFFF, Deep Charcoal #242421,
 *   Muted Charcoal #62615D, Muted Bronze #A17C55, Dark Feature Sections #222320,
 *   Subtle Borders #E6E0D8.
 */

export const designTokens = {
  colors: {
    brand: {
      warmIvory: "#F7F5F1",
      deepCharcoal: "#242421",
      mutedBronze: "#A17C55",
      softStone: "#E6E0D8",
      pureWhite: "#FFFFFF",
      supportingText: "#62615D",
      darkSection: "#222320",
    },
    semantic: {
      bgPrimary: "#F7F5F1",
      bgSurface: "#FFFFFF",
      bgSurfaceMuted: "#F0ECE4",
      bgDark: "#222320",
      textPrimary: "#242421",
      textSecondary: "#62615D",
      textMuted: "#7E7F7A",
      textInverse: "#F7F5F1",
      textBronze: "#A17C55",
      borderSubtle: "#E6E0D8",
      borderMedium: "#DCD5CB",
      borderDark: "#383935",
      accentBronze: "#A17C55",
      accentHover: "#8A6742",
      accentLight: "#F4ECE3",
      focusRing: "#A17C55",
      error: "#A83E3E",
      success: "#3B6E4C",
    },
  },
  typography: {
    fonts: {
      serif: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
      sans: "var(--font-sans), var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "var(--font-mono), var(--font-geist-mono), monospace",
    },
    tracking: {
      tight: "-0.025em",
      normal: "-0.01em",
      wide: "0.05em",
      wider: "0.15em",
      widest: "0.25em",
    },
    leading: {
      tight: "1.12",
      snug: "1.22",
      normal: "1.5",
      relaxed: "1.65",
      loose: "1.75",
    },
  },
  layout: {
    containers: {
      reading: "max-w-[680px]",
      standard: "max-w-[1120px]",
      wide: "max-w-[1360px]",
      max: "max-w-[1536px]",
    },
    gutters: {
      mobile: "px-4",
      tablet: "sm:px-6",
      desktop: "lg:px-8",
      wide: "xl:px-12",
    },
    sectionSpacing: {
      sm: "py-10 sm:py-14",
      md: "py-16 sm:py-24",
      lg: "py-20 sm:py-28",
      xl: "py-28 sm:py-36",
    },
  },
  borders: {
    subtle: "1px solid #E6E0D8",
    medium: "1px solid #DCD5CB",
    bronze: "1px solid #A17C55",
    dark: "1px solid #383935",
    radius: {
      none: "0px",
      sm: "2px",
      md: "4px",
      full: "9999px",
    },
  },
  shadows: {
    subtle: "0 1px 3px rgba(36, 36, 33, 0.03)",
    elevated: "0 4px 16px rgba(36, 36, 33, 0.05)",
    focus: "0 0 0 2px #F7F5F1, 0 0 0 4px #A17C55",
  },
  motion: {
    duration: {
      fast: "150ms",
      base: "250ms",
      slow: "350ms",
    },
    easing: {
      standard: "cubic-bezier(0.16, 1, 0.3, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
