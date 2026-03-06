import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base design dimensions (iPhone 14 / standard design)
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Responsive width — scales a value relative to the screen width.
 * Use for horizontal spacing, widths, font sizes tied to width.
 */
export const rw = (size: number): number => {
  return PixelRatio.roundToNearestPixel(
    (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size,
  );
};

/**
 * Responsive height — scales a value relative to the screen height.
 * Use for vertical spacing, heights, paddings tied to height.
 */
export const rh = (size: number): number => {
  return PixelRatio.roundToNearestPixel(
    (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size,
  );
};

// Common sizes used across the app
export const Sizes = {
  // Spacing
  xs: rw(4),
  sm: rw(8),
  md: rw(16),
  lg: rw(24),
  xl: rw(32),
  xxl: rw(48),

  // Border radius
  radiusSm: rw(8),
  radiusMd: rw(12),
  radiusLg: rw(16),
  radiusXl: rw(24),
  radiusFull: rw(999),

  // Font sizes
  fontXs: rw(12),
  fontSm: rw(14),
  fontMd: rw(16),
  fontLg: rw(20),
  fontXl: rw(24),
  fontXxl: rw(32),
  fontTitle: rw(40),

  // Icon sizes
  iconSm: rw(16),
  iconMd: rw(24),
  iconLg: rw(32),
  iconXl: rw(48),

  // Button heights
  buttonSm: rh(36),
  buttonMd: rh(48),
  buttonLg: rh(56),

  // Screen padding
  screenPadding: rw(20),

  // Progress bar
  progressBarHeight: rh(12),

  // Card
  cardPadding: rw(16),

  // Header
  headerHeight: rh(56),
} as const;

export { SCREEN_HEIGHT, SCREEN_WIDTH };
