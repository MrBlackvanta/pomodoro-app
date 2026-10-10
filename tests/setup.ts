import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class SilentAudioContext {
  currentTime = 0;
  destination = {};

  createOscillator() {
    return {
      type: "",
      frequency: { value: 0 },
      onended: null,
      connect: (node: unknown) => node,
      start: () => {},
      stop: () => {},
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: (node: unknown) => node,
    };
  }

  resume() {
    return Promise.resolve();
  }
}

globalThis.AudioContext ??= SilentAudioContext as unknown as typeof AudioContext;

HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.open = true;
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.open = false;
  this.dispatchEvent(new Event("close"));
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.font;
  delete document.documentElement.dataset.accent;
});
