"use client";

import {
  askToNotify,
  cancelChime,
  modeLabel,
  notifyDone,
  scheduleChime,
  type Mode,
  type Settings,
} from "@/lib";
import { useEffect, useState } from "react";

type Session =
  | { status: "idle" }
  | { status: "running"; endsAt: number; remaining: number }
  | { status: "paused"; remaining: number }
  | { status: "done" };

export type TimerStatus = Session["status"];

const idle: Session = { status: "idle" };

function untilNextSecond(endsAt: number) {
  return (endsAt - Date.now()) % 1000 || 1000;
}

function secondsLeft(session: Session, total: number) {
  if (session.status === "idle") return total;
  if (session.status === "done") return 0;

  return session.remaining;
}

export function useTimer(settings: Settings) {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [session, setSession] = useState<Session>(idle);

  const total = settings.minutes[mode] * 60;
  const remaining = secondsLeft(session, total);

  useEffect(() => {
    if (session.status !== "running") return;

    const { endsAt } = session;
    const tick = () => {
      const left = Math.ceil((endsAt - Date.now()) / 1000);

      setSession(
        left > 0 ? { ...session, remaining: left } : { status: "done" },
      );
    };

    const timer = setTimeout(tick, untilNextSecond(endsAt));
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [session]);

  function toggle() {
    if (session.status === "running") {
      cancelChime();
      setSession({ status: "paused", remaining });

      return;
    }

    const seconds = session.status === "paused" ? session.remaining : total;

    askToNotify();
    scheduleChime(seconds, () => {
      if (document.hasFocus()) return;

      notifyDone("Time's up", `Your ${modeLabel(mode)} has finished.`);
    });
    setSession({
      status: "running",
      endsAt: Date.now() + seconds * 1000,
      remaining: seconds,
    });
  }

  function reset() {
    cancelChime();
    setSession(idle);
  }

  function changeMode(next: Mode) {
    setMode(next);
    reset();
  }

  return {
    mode,
    status: session.status,
    remaining,
    total,
    toggle,
    reset,
    changeMode,
  };
}
