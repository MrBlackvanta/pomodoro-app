import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultSettings, settingsKey, type Settings } from "./settings";

type SettingsModule = typeof import("./settings");

let store: SettingsModule;

function subscribeAndRead() {
  const stop = store.subscribeToSettings(() => {});
  const read = store.getSettings();
  stop();

  return read;
}

beforeEach(async () => {
  vi.resetModules();
  store = await import("./settings");
});

describe("clampSession", () => {
  it("rounds fractional minutes", () => {
    expect(store.clampSession(24.4)).toBe(24);
    expect(store.clampSession(24.6)).toBe(25);
  });

  it("holds the session between one and ninety minutes", () => {
    expect(store.clampSession(0)).toBe(1);
    expect(store.clampSession(-30)).toBe(1);
    expect(store.clampSession(91)).toBe(90);
    expect(store.clampSession(1000)).toBe(90);
  });
});

describe("reading stored settings", () => {
  it("falls back to the defaults when nothing is stored", () => {
    expect(subscribeAndRead()).toEqual(defaultSettings);
  });

  it("falls back to the defaults when the stored value is not JSON", () => {
    localStorage.setItem(settingsKey, "not json at all");

    expect(subscribeAndRead()).toEqual(defaultSettings);
  });

  it("keeps a stored session that is in range", () => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({ minutes: { pomodoro: 40 } }),
    );

    expect(subscribeAndRead().minutes.pomodoro).toBe(40);
  });

  it("clamps a stored session that is out of range", () => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({ minutes: { pomodoro: 500, shortBreak: 0 } }),
    );

    const read = subscribeAndRead();

    expect(read.minutes.pomodoro).toBe(90);
    expect(read.minutes.shortBreak).toBe(1);
  });

  it("ignores a stored session that is not a number", () => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({ minutes: { pomodoro: "twenty" } }),
    );

    expect(subscribeAndRead().minutes.pomodoro).toBe(
      defaultSettings.minutes.pomodoro,
    );
  });

  it("rejects a font or accent it does not ship", () => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({ font: "comic", accent: "chartreuse" }),
    );

    const read = subscribeAndRead();

    expect(read.font).toBe(defaultSettings.font);
    expect(read.accent).toBe(defaultSettings.accent);
  });
});

describe("saveSettings", () => {
  const chosen: Settings = {
    minutes: { pomodoro: 30, shortBreak: 8, longBreak: 20 },
    font: "mono",
    accent: "purple",
  };

  it("persists the choice so the next read restores it", () => {
    store.saveSettings(chosen);

    expect(JSON.parse(localStorage.getItem(settingsKey) ?? "{}")).toEqual(
      chosen,
    );
    expect(subscribeAndRead()).toEqual(chosen);
  });

  it("applies the font and accent to the document", () => {
    store.saveSettings(chosen);

    expect(document.documentElement.dataset.font).toBe("mono");
    expect(document.documentElement.dataset.accent).toBe("purple");
  });

  it("clamps an out-of-range session before storing it", () => {
    store.saveSettings({ ...chosen, minutes: { ...chosen.minutes, pomodoro: 400 } });

    expect(store.getSettings().minutes.pomodoro).toBe(90);
  });

  it("notifies subscribers", () => {
    const listener = vi.fn();
    const stop = store.subscribeToSettings(listener);

    store.saveSettings(chosen);
    stop();

    expect(listener).toHaveBeenCalled();
  });
});

describe("cross-tab updates", () => {
  it("adopts settings written by another tab", () => {
    const listener = vi.fn();
    const stop = store.subscribeToSettings(listener);

    localStorage.setItem(
      settingsKey,
      JSON.stringify({ ...defaultSettings, accent: "cyan" }),
    );
    window.dispatchEvent(new StorageEvent("storage", { key: settingsKey }));

    expect(store.getSettings().accent).toBe("cyan");
    expect(listener).toHaveBeenCalled();

    stop();
  });

  it("stops listening once the last subscriber leaves", () => {
    const stop = store.subscribeToSettings(() => {});
    stop();

    localStorage.setItem(
      settingsKey,
      JSON.stringify({ ...defaultSettings, accent: "cyan" }),
    );
    window.dispatchEvent(new StorageEvent("storage", { key: settingsKey }));

    expect(store.getSettings().accent).toBe(defaultSettings.accent);
  });
});
