import type { TimerStatus } from "./use-timer";

type TimerDialProps = {
  id: string;
  labelledBy: string;
  status: TimerStatus;
  remaining: number;
  total: number;
  onToggle: () => void;
};

const ringRadius = 164;
const ringLength = 2 * Math.PI * ringRadius;

const actions: Record<TimerStatus, string> = {
  idle: "start",
  running: "pause",
  paused: "start",
  done: "restart",
};

function clockFace(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  return [minutes, seconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

export default function TimerDial({
  id,
  labelledBy,
  status,
  remaining,
  total,
  onToggle,
}: TimerDialProps) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className="bg-dial shadow-dial relative mt-12 aspect-square w-75 max-w-full rounded-full md:mt-27 md:w-102.5 lg:mt-11"
    >
      <svg viewBox="0 0 410 410" className="size-full" aria-hidden="true">
        <circle cx="205" cy="205" r="183" className="fill-midnight" />
        <circle
          cx="205"
          cy="205"
          r={ringRadius}
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={ringLength}
          strokeDashoffset={ringLength * (remaining / total)}
          transform="rotate(-90 205 205)"
          className="stroke-accent v-ring-sweep"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pt-8 md:gap-5 md:pt-12">
        <p
          id={`${id}-remaining`}
          role="timer"
          className="text-timer md:text-timer-md tracking-timer serif:tracking-normal mono:tracking-timer-mono mono:font-normal"
        >
          {clockFace(remaining)}
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-describedby={`${id}-remaining`}
          className="text-action md:text-action-md v-tracked-action hover:text-accent uppercase transition-colors duration-150 ease-out after:absolute after:inset-0 after:rounded-full"
        >
          {actions[status]}
        </button>
      </div>
    </div>
  );
}
