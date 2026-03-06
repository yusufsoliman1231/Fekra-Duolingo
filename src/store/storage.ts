import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const mmkv = createMMKV({
  id: "duolingo-lesson-storage",
});

/**
 * Zustand-compatible StateStorage adapter for MMKV.
 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkv.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkv.remove(name);
  },
};

/**
 * Helper to clear all persisted lesson data.
 */
export function clearLessonStorage(): void {
  mmkv.clearAll();
}
