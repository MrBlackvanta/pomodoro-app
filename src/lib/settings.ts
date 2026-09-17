export const modes = [
  { id: "pomodoro", label: "pomodoro" },
  { id: "shortBreak", label: "short break" },
  { id: "longBreak", label: "long break" },
] as const;

export const fonts = ["sans", "serif", "mono"] as const;
export const accents = ["coral", "cyan", "purple"] as const;

export type Mode = (typeof modes)[number]["id"];
export type Font = (typeof fonts)[number];
export type Accent = (typeof accents)[number];

export type Settings = {
  minutes: Record<Mode, number>;
  font: Font;
  accent: Accent;
};

export const shortestSession = 1;
export const longestSession = 90;

export const settingsKey = "pomodoro.settings";

export const defaultSettings: Settings = {
  minutes: { pomodoro: 25, shortBreak: 5, longBreak: 15 },
  font: "sans",
  accent: "coral",
};

export function clampSession(minutes: number) {
  return Math.min(
    Math.max(Math.round(minutes), shortestSession),
    longestSession,
  );
}

function storedMinutes(stored: Partial<Settings>) {
  const minutes = { ...defaultSettings.minutes };

  for (const mode of modes) {
    const value = stored.minutes?.[mode.id];
    if (Number.isFinite(value)) minutes[mode.id] = clampSession(Number(value));
  }

  return minutes;
}

function reviveSettings(raw: string): Settings {
  const stored = JSON.parse(raw) as Partial<Settings>;

  return {
    minutes: storedMinutes(stored),
    font: fonts.find((font) => font === stored.font) ?? defaultSettings.font,
    accent:
      accents.find((accent) => accent === stored.accent) ??
      defaultSettings.accent,
  };
}

function readSettings() {
  try {
    const raw = localStorage.getItem(settingsKey);

    return raw ? reviveSettings(raw) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function rememberSettings(next: Settings) {
  try {
    localStorage.setItem(settingsKey, JSON.stringify(next));
  } catch {}
}

let settings = defaultSettings;
const listeners = new Set<() => void>();

function announce() {
  for (const listener of listeners) listener();
}

function adoptStoredSettings() {
  settings = readSettings();
  announce();
}

export function subscribeToSettings(listener: () => void) {
  if (listeners.size === 0) {
    settings = readSettings();
    window.addEventListener("storage", adoptStoredSettings);
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", adoptStoredSettings);
    }
  };
}

export function getSettings() {
  return settings;
}

export function getDefaultSettings() {
  return defaultSettings;
}

export function saveSettings(next: Settings) {
  settings = { ...next, minutes: storedMinutes(next) };
  document.documentElement.dataset.font = settings.font;
  document.documentElement.dataset.accent = settings.accent;
  rememberSettings(settings);
  announce();
}
