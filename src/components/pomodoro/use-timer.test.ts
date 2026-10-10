import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultSettings, type Settings } from "@/lib";

import { useTimer } from "./use-timer";

const pomodoroSeconds = defaultSettings.minutes.pomodoro * 60;

const shortSettings: Settings = {
  ...defaultSettings,
  minutes: { pomodoro: 1, shortBreak: 1, longBreak: 1 },
};

type Timer = ReturnType<typeof useTimer>;

async function advance(seconds: number) {
  for (let second = 0; second < seconds; second += 1) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
  }
}

async function toggle(result: { current: Timer }) {
  await act(async () => {
    result.current.toggle();
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTimer", () => {
  it("opens idle on a full pomodoro", () => {
    const { result } = renderHook(() => useTimer(defaultSettings));

    expect(result.current.mode).toBe("pomodoro");
    expect(result.current.status).toBe("idle");
    expect(result.current.remaining).toBe(pomodoroSeconds);
    expect(result.current.total).toBe(pomodoroSeconds);
  });

  it("counts down one second at a time once started", async () => {
    const { result } = renderHook(() => useTimer(defaultSettings));

    await toggle(result);
    expect(result.current.status).toBe("running");

    await advance(1);
    expect(result.current.remaining).toBe(pomodoroSeconds - 1);

    await advance(4);
    expect(result.current.remaining).toBe(pomodoroSeconds - 5);
  });

  it("holds the remaining time while paused", async () => {
    const { result } = renderHook(() => useTimer(defaultSettings));

    await toggle(result);
    await advance(10);
    await toggle(result);

    expect(result.current.status).toBe("paused");
    expect(result.current.remaining).toBe(pomodoroSeconds - 10);

    await advance(30);
    expect(result.current.remaining).toBe(pomodoroSeconds - 10);
  });

  it("resumes from where it was paused", async () => {
    const { result } = renderHook(() => useTimer(defaultSettings));

    await toggle(result);
    await advance(10);
    await toggle(result);
    await toggle(result);

    expect(result.current.status).toBe("running");

    await advance(5);
    expect(result.current.remaining).toBe(pomodoroSeconds - 15);
  });

  it("finishes at zero and stays there", async () => {
    const { result } = renderHook(() => useTimer(shortSettings));

    await toggle(result);
    await advance(60);

    expect(result.current.status).toBe("done");
    expect(result.current.remaining).toBe(0);

    await advance(5);
    expect(result.current.remaining).toBe(0);
  });

  it("restarts a finished session at the top", async () => {
    const { result } = renderHook(() => useTimer(shortSettings));

    await toggle(result);
    await advance(60);
    await toggle(result);

    expect(result.current.status).toBe("running");
    expect(result.current.remaining).toBe(60);
  });

  it("returns to idle on reset", async () => {
    const { result } = renderHook(() => useTimer(defaultSettings));

    await toggle(result);
    await advance(10);
    await act(async () => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.remaining).toBe(pomodoroSeconds);
  });

  it("abandons a running session when the mode changes", async () => {
    const { result } = renderHook(() => useTimer(defaultSettings));

    await toggle(result);
    await advance(10);
    await act(async () => {
      result.current.changeMode("shortBreak");
    });

    expect(result.current.mode).toBe("shortBreak");
    expect(result.current.status).toBe("idle");
    expect(result.current.remaining).toBe(
      defaultSettings.minutes.shortBreak * 60,
    );
  });

  it("follows a settings change while idle", () => {
    const { rerender, result } = renderHook(
      ({ settings }) => useTimer(settings),
      { initialProps: { settings: defaultSettings } },
    );

    rerender({
      settings: {
        ...defaultSettings,
        minutes: { ...defaultSettings.minutes, pomodoro: 40 },
      },
    });

    expect(result.current.remaining).toBe(40 * 60);
  });
});
