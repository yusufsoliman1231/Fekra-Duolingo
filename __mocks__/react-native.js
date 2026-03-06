// Mock for react-native
export const Dimensions = {
  get: () => ({ width: 375, height: 812 }),
};

export const PixelRatio = {
  roundToNearestPixel: (value) => Math.round(value),
  get: () => 2,
  getFontScale: () => 1,
};

export const Platform = {
  OS: "ios",
  select: (spec) => spec.ios ?? spec.default,
  Version: "mock",
};

export const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => style,
  absoluteFill: {},
  hairlineWidth: 1,
};

export const View = "View";
export const Text = "Text";
export const Pressable = "Pressable";
export const TextInput = "TextInput";
export const TouchableOpacity = "TouchableOpacity";
export const Image = "Image";
export const ScrollView = "ScrollView";
export const FlatList = "FlatList";
export const SafeAreaView = "SafeAreaView";

export const Animated = {
  View: "Animated.View",
  Text: "Animated.Text",
  Image: "Animated.Image",
  Value: class {
    constructor() {
      this._value = 0;
    }
    setValue(val) {
      this._value = val;
    }
    interpolate() {
      return this;
    }
  },
  timing: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  spring: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  parallel: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  sequence: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  createAnimatedComponent: (comp) => comp,
};

export const AccessibilityInfo = {
  isScreenReaderEnabled: () => Promise.resolve(false),
  addEventListener: () => ({ remove: () => {} }),
};

export const useColorScheme = () => "light";
export const useWindowDimensions = () => ({ width: 375, height: 812 });

export default {
  Dimensions,
  PixelRatio,
  Platform,
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  AccessibilityInfo,
  useColorScheme,
  useWindowDimensions,
};
