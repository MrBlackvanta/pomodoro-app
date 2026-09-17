"use client";

import { SITE_TITLE } from "@/app/site";
import { SettingsIcon } from "@/components/icons";
import {
  clockFace,
  modeLabel,
  previewFont,
  saveSettings,
  type Mode,
  type Settings,
} from "@/lib";
import { useEffect, useRef, useState } from "react";

import ModeTabs, { tabId } from "./mode-tabs";
import SettingsDialog from "./settings-dialog";
import TimerDial from "./timer-dial";
import { useSettings } from "./use-settings";
import { useTimer, type TimerStatus } from "./use-timer";

const panelId = "timer";

function tabTitle(status: TimerStatus, remaining: number, mode: Mode) {
  if (status === "running") {
    return `${clockFace(remaining)} · ${modeLabel(mode)}`;
  }

  if (status === "done") return `Time's up · ${modeLabel(mode)}`;

  return SITE_TITLE;
}

export default function Pomodoro() {
  const settings = useSettings();
  const timer = useTimer(settings);
  const [draft, setDraft] = useState(settings);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.title = tabTitle(timer.status, timer.remaining, timer.mode);
  }, [timer.status, timer.remaining, timer.mode]);

  function openSettings() {
    setDraft(settings);
    dialog.current?.showModal();
  }

  function changeDraft(next: Settings) {
    setDraft(next);
    previewFont(next.font);
  }

  function applySettings() {
    saveSettings(draft);
    timer.reset();
  }

  function cancelSettings() {
    previewFont(settings.font);
  }

  return (
    <>
      <ModeTabs
        mode={timer.mode}
        panelId={panelId}
        onModeChange={timer.changeMode}
      />
      <TimerDial
        id={panelId}
        labelledBy={tabId(timer.mode)}
        status={timer.status}
        remaining={timer.remaining}
        total={timer.total}
        onToggle={timer.toggle}
      />
      <button
        type="button"
        onClick={openSettings}
        className="text-periwinkle/50 hover:text-periwinkle relative mt-19.75 transition-colors duration-150 ease-out after:absolute after:-inset-2 md:mt-36 lg:mt-15.75"
      >
        <SettingsIcon />
        <span className="sr-only">Settings</span>
      </button>
      <SettingsDialog
        ref={dialog}
        draft={draft}
        onDraftChange={changeDraft}
        onApply={applySettings}
        onCancel={cancelSettings}
      />
    </>
  );
}
