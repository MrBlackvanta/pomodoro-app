"use client";

import { getDefaultSettings, getSettings, subscribeToSettings } from "@/lib";
import { useSyncExternalStore } from "react";

export function useSettings() {
  return useSyncExternalStore(
    subscribeToSettings,
    getSettings,
    getDefaultSettings,
  );
}
