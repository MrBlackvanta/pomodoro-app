import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { settingsKey } from "@/lib";

import Pomodoro from "./pomodoro";

function storedSettings() {
  return JSON.parse(localStorage.getItem(settingsKey) ?? "{}");
}

async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Settings" }));

  return screen.getByRole("dialog");
}

describe("Pomodoro", () => {
  it("opens on a full pomodoro with its tab selected", () => {
    render(<Pomodoro />);

    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
    expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
      "pomodoro",
    );
    expect(screen.getByRole("button", { name: "start" })).toBeInTheDocument();
  });

  it("loads the break lengths when the mode changes", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    await user.click(screen.getByRole("tab", { name: "short break" }));
    expect(screen.getByRole("timer")).toHaveTextContent("05:00");

    await user.click(screen.getByRole("tab", { name: "long break" }));
    expect(screen.getByRole("timer")).toHaveTextContent("15:00");
  });

  it("offers to pause a running session", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    await user.click(screen.getByRole("button", { name: "start" }));
    expect(screen.getByRole("button", { name: "pause" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "pause" }));
    expect(screen.getByRole("button", { name: "start" })).toBeInTheDocument();
  });

  it("moves tab focus with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    await user.click(screen.getByRole("tab", { name: "pomodoro" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "short break" })).toHaveFocus();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "long break" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "pomodoro" })).toHaveFocus();
  });

  it("applies a new session length to the dial and to storage", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    const dialog = await openSettings(user);
    const minutes = within(dialog).getByRole("spinbutton", {
      name: "pomodoro",
    });

    await user.clear(minutes);
    await user.type(minutes, "30");
    await user.click(within(dialog).getByRole("button", { name: "Apply" }));

    expect(screen.getByRole("timer")).toHaveTextContent("30:00");
    expect(storedSettings().minutes.pomodoro).toBe(30);
  });

  it("will not apply a session longer than ninety minutes", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    const dialog = await openSettings(user);
    const minutes = within(dialog).getByRole("spinbutton", {
      name: "pomodoro",
    });

    expect(minutes).toHaveAttribute("min", "1");
    expect(minutes).toHaveAttribute("max", "90");

    await user.clear(minutes);
    await user.type(minutes, "95");
    await user.click(within(dialog).getByRole("button", { name: "Apply" }));

    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
    expect(localStorage.getItem(settingsKey)).toBeNull();
  });

  it("will not apply an empty session", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    const dialog = await openSettings(user);
    const minutes = within(dialog).getByRole("spinbutton", {
      name: "pomodoro",
    });

    await user.clear(minutes);
    await user.click(within(dialog).getByRole("button", { name: "Apply" }));

    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
    expect(localStorage.getItem(settingsKey)).toBeNull();
  });

  it("steps a session one minute at a time", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    const dialog = await openSettings(user);

    await user.click(
      within(dialog).getByRole("button", { name: "Increase pomodoro" }),
    );
    await user.click(within(dialog).getByRole("button", { name: "Apply" }));

    expect(screen.getByRole("timer")).toHaveTextContent("26:00");
  });

  it("stores the chosen font and accent", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    const dialog = await openSettings(user);

    await user.click(within(dialog).getByRole("radio", { name: /Space Mono/i }));
    await user.click(within(dialog).getByRole("radio", { name: /purple/i }));
    await user.click(within(dialog).getByRole("button", { name: "Apply" }));

    expect(storedSettings().font).toBe("mono");
    expect(storedSettings().accent).toBe("purple");
    expect(document.documentElement.dataset.font).toBe("mono");
    expect(document.documentElement.dataset.accent).toBe("purple");
  });

  it("keeps the saved settings when the dialog is dismissed", async () => {
    const user = userEvent.setup();
    render(<Pomodoro />);

    const dialog = await openSettings(user);
    const minutes = within(dialog).getByRole("spinbutton", {
      name: "pomodoro",
    });

    await user.clear(minutes);
    await user.type(minutes, "45");
    await user.click(
      within(dialog).getByRole("button", { name: "Close settings" }),
    );

    expect(screen.getByRole("timer")).toHaveTextContent("25:00");
    expect(localStorage.getItem(settingsKey)).toBeNull();
  });
});
