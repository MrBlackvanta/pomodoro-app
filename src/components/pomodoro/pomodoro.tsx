"use client";

import { SettingsIcon } from "@/components/icons";
import { saveSettings } from "@/lib";
import { useRef, useState } from "react";

import ModeTabs, { tabId } from "./mode-tabs";
import SettingsDialog from "./settings-dialog";
import TimerDial from "./timer-dial";
import { useSettings } from "./use-settings";
import { useTimer } from "./use-timer";

const panelId = "timer";

export default function Pomodoro() {
  const settings = useSettings();
  const timer = useTimer(settings);
  const [draft, setDraft] = useState(settings);
  const dialog = useRef<HTMLDialogElement>(null);

  function openSettings() {
    setDraft(settings);
    dialog.current?.showModal();
  }

  function applySettings() {
    saveSettings(draft);
    timer.reset();
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
        onDraftChange={setDraft}
        onApply={applySettings}
      />
    </>
  );
}
