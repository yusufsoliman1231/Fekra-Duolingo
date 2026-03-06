export const Colors = {
  // Brand colors
  primary: "#58CC02",
  primaryDark: "#46A302",
  secondary: "#1CB0F6",
  secondaryDark: "#0095D9",

  // Feedback colors
  correct: "#58CC02",
  correctLight: "#D7FFB8",
  correctBg: "#D7FFB8",
  incorrect: "#FF4B4B",
  incorrectLight: "#FFDFE0",
  incorrectBg: "#FFDFE0",

  // Accent colors
  orange: "#FF9600",
  purple: "#CE82FF",
  pink: "#FF86D0",

  // Hearts / streak
  heartRed: "#FF4B4B",
  streakOrange: "#FF9600",

  // XP
  xpPurple: "#CE82FF",

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  darkText: "#3C3C3C",
  mediumText: "#777777",
  lightText: "#AFAFAF",

  // Backgrounds
  backgroundLight: "#FFFFFF",
  backgroundDark: "#131F24",
  surfaceLight: "#F7F7F7",
  surfaceDark: "#1A2C32",

  // Borders
  borderLight: "#E5E5E5",
  borderDark: "#2D3F45",

  // Progress bar
  progressBg: "#E5E5E5",
  progressFill: "#58CC02",

  // Button
  buttonPrimary: "#58CC02",
  buttonPrimaryPressed: "#46A302",
  buttonSecondary: "#1CB0F6",
  buttonDisabled: "#E5E5E5",
  buttonDisabledText: "#AFAFAF",

  // Card
  cardLight: "#FFFFFF",
  cardDark: "#1A2C32",
  cardBorderLight: "#E5E5E5",
  cardBorderDark: "#2D3F45",

  // Word bank chips
  chipBg: "#E5E5E5",
  chipBgActive: "#DDF4FF",
  chipBorder: "#CDCDCD",
  chipBorderActive: "#1CB0F6",

  // Match pairs
  matchDefault: "#E5E5E5",
  matchSelected: "#DDF4FF",
  matchCorrect: "#D7FFB8",
  matchIncorrect: "#FFDFE0",

  // Theme variants (for backward compat)
  light: {
    text: "#3C3C3C",
    background: "#FFFFFF",
    tint: "#58CC02",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#58CC02",
  },
  dark: {
    text: "#ECEDEE",
    background: "#131F24",
    tint: "#58CC02",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#58CC02",
  },
} as const;
