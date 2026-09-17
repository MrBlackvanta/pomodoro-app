import { CloseIcon } from "@/components/icons";
import { modes, type Accent, type Font, type Mode, type Settings } from "@/lib";

import ColorChoice from "./color-choice";
import DurationField from "./duration-field";
import FontChoice from "./font-choice";

type SettingsDialogProps = {
  ref: React.RefObject<HTMLDialogElement | null>;
  draft: Settings;
  onDraftChange: (draft: Settings) => void;
  onApply: () => void;
  onCancel: () => void;
};

const headingClass =
  "text-section md:text-section-md v-tracked-section text-midnight text-center uppercase md:ps-0 md:text-left";

export default function SettingsDialog({
  ref,
  draft,
  onDraftChange,
  onApply,
  onCancel,
}: SettingsDialogProps) {
  function dismiss() {
    onCancel();
    ref.current?.close();
  }

  function setMinutes(mode: Mode, minutes: number) {
    onDraftChange({ ...draft, minutes: { ...draft.minutes, [mode]: minutes } });
  }

  function setFont(font: Font) {
    onDraftChange({ ...draft, font });
  }

  function setAccent(accent: Accent) {
    onDraftChange({ ...draft, accent });
  }

  return (
    <dialog
      ref={ref}
      data-accent={draft.accent}
      aria-labelledby="settings-title"
      onCancel={onCancel}
      className="v-modal m-auto w-full max-w-93.75 bg-transparent px-6 pt-0 pb-6.75 md:max-w-147"
    >
      <form
        method="dialog"
        onSubmit={onApply}
        className="rounded-modal md:rounded-modal-md relative bg-white pb-12.75 md:pb-14.75"
      >
        <header className="border-hairline flex h-18 items-center justify-between border-b px-6 md:h-23.25 md:px-10">
          <h2
            id="settings-title"
            className="text-modal-title md:text-modal-title-md text-midnight"
          >
            Settings
          </h2>
          <button
            type="button"
            onClick={dismiss}
            className="text-navy/50 hover:text-navy relative transition-colors duration-150 ease-out after:absolute after:-inset-3"
          >
            <CloseIcon />
            <span className="sr-only">Close settings</span>
          </button>
        </header>

        <div className="px-6 md:px-10">
          <div
            role="group"
            aria-labelledby="time-heading"
            className="pt-6.25 pb-6 md:pt-7.25"
          >
            <h3 id="time-heading" className={headingClass}>
              Time (Minutes)
            </h3>
            <div className="mt-4.5 flex flex-col gap-2 md:mt-6 md:flex-row md:justify-between">
              {modes.map(({ id, label }) => (
                <DurationField
                  key={id}
                  id={`${id}-minutes`}
                  label={label}
                  minutes={draft.minutes[id]}
                  onChange={(minutes) => setMinutes(id, minutes)}
                />
              ))}
            </div>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="font-heading"
            className="border-hairline flex flex-col items-center gap-4.5 border-t pt-6.25 pb-6 md:flex-row md:justify-between"
          >
            <h3 id="font-heading" className={headingClass}>
              Font
            </h3>
            <FontChoice value={draft.font} onChange={setFont} />
          </div>

          <div
            role="radiogroup"
            aria-labelledby="color-heading"
            className="border-hairline flex flex-col items-center gap-4.5 border-t pt-6.25 md:flex-row md:justify-between"
          >
            <h3 id="color-heading" className={headingClass}>
              Color
            </h3>
            <ColorChoice value={draft.accent} onChange={setAccent} />
          </div>
        </div>

        <button
          type="submit"
          className="text-apply bg-accent hover:bg-accent-light text-navy absolute bottom-0 left-1/2 h-13.25 w-35 -translate-x-1/2 translate-y-1/2 rounded-full transition-colors duration-250 ease-out"
        >
          Apply
        </button>
      </form>
    </dialog>
  );
}
