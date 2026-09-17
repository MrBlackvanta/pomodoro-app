import { ArrowDownIcon, ArrowUpIcon } from "@/components/icons";
import { clampSession, longestSession, shortestSession } from "@/lib";

type DurationFieldProps = {
  id: string;
  label: string;
  minutes: number;
  onChange: (minutes: number) => void;
};

export default function DurationField({
  id,
  label,
  minutes,
  onChange,
}: DurationFieldProps) {
  function step(by: number) {
    onChange(
      clampSession(Number.isFinite(minutes) ? minutes + by : shortestSession),
    );
  }

  return (
    <div className="flex items-center justify-between md:block">
      <label
        htmlFor={id}
        className="text-field-label text-navy/62 md:mb-2 md:block"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          required
          min={shortestSession}
          max={longestSession}
          value={Number.isFinite(minutes) ? minutes : ""}
          onChange={(event) => onChange(event.target.valueAsNumber)}
          className="text-field bg-mist rounded-field v-number-field text-navy h-10 w-35 ps-4 pe-10 md:h-12"
        />
        <span className="absolute inset-y-0 right-1.5 flex w-8 flex-col">
          <button
            type="button"
            onClick={() => step(1)}
            className="text-stepper hover:text-navy flex flex-1 items-end justify-center pb-1 transition-colors duration-150 ease-out"
          >
            <ArrowUpIcon />
            <span className="sr-only">Increase {label}</span>
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="text-stepper hover:text-navy flex flex-1 items-start justify-center pt-1 transition-colors duration-150 ease-out"
          >
            <ArrowDownIcon />
            <span className="sr-only">Decrease {label}</span>
          </button>
        </span>
      </div>
    </div>
  );
}
