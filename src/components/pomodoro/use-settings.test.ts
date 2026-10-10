import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { defaultSettings, saveSettings, settingsKey } from "@/lib";

import { useSettings } from "./use-settings";

describe("useSettings", () => {
  it("starts from the defaults when nothing is stored", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current).toEqual(defaultSettings);
  });

  it("picks up settings already in storage", () => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({ ...defaultSettings, accent: "cyan" }),
    );

    const { result } = renderHook(() => useSettings());

    expect(result.current.accent).toBe("cyan");
  });

  it("re-renders when the settings are saved", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      saveSettings({ ...defaultSettings, font: "serif" });
    });

    expect(result.current.font).toBe("serif");
  });

  it("re-renders when another tab writes", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      localStorage.setItem(
        settingsKey,
        JSON.stringify({ ...defaultSettings, accent: "purple" }),
      );
      window.dispatchEvent(new StorageEvent("storage", { key: settingsKey }));
    });

    expect(result.current.accent).toBe("purple");
  });
});
