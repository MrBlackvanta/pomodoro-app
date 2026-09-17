import { modes, type Mode } from "@/lib";

type ModeTabsProps = {
  mode: Mode;
  panelId: string;
  onModeChange: (mode: Mode) => void;
};

export function tabId(mode: Mode) {
  return `${mode}-tab`;
}

function tabAfter(key: string, from: number, last: number) {
  if (key === "ArrowRight") return from === last ? 0 : from + 1;
  if (key === "ArrowLeft") return from === 0 ? last : from - 1;
  if (key === "Home") return 0;
  if (key === "End") return last;

  return undefined;
}

function moveFocus(event: React.KeyboardEvent<HTMLDivElement>) {
  const tabs = [...event.currentTarget.querySelectorAll("button")];
  const from = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (from < 0) return;

  const to = tabAfter(event.key, from, tabs.length - 1);
  if (to === undefined) return;

  event.preventDefault();
  tabs[to].focus();
}

export default function ModeTabs({
  mode,
  panelId,
  onModeChange,
}: ModeTabsProps) {
  const activeTab = modes.findIndex((entry) => entry.id === mode);

  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      onKeyDown={moveFocus}
      className="bg-midnight relative z-10 mt-11 flex h-16 w-full max-w-93.25 rounded-full px-1.5 py-2 md:mt-13.75"
    >
      <span aria-hidden="true" className="absolute inset-x-1.5 inset-y-2 flex">
        <span
          style={{ "--tab": activeTab } as React.CSSProperties}
          className="v-tab-pill bg-accent w-1/3 rounded-full"
        />
      </span>
      {modes.map(({ id, label }) => {
        const selected = id === mode;
        const tone = selected
          ? "text-navy"
          : "text-periwinkle/55 hover:text-periwinkle";

        return (
          <button
            key={id}
            id={tabId(id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onModeChange(id)}
            className={`${tone} v-tab-label text-tab md:text-tab-md mono:md:text-tab-mono-md relative flex-1 rounded-full`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
