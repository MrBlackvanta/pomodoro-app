import { CheckIcon } from "@/components/icons";
import { accents, type Accent } from "@/lib";

type ColorChoiceProps = {
  value: Accent;
  onChange: (accent: Accent) => void;
};

const swatches: Record<Accent, { name: string; fill: string }> = {
  coral: { name: "Coral", fill: "bg-coral" },
  cyan: { name: "Cyan", fill: "bg-cyan" },
  purple: { name: "Purple", fill: "bg-purple" },
};

export default function ColorChoice({ value, onChange }: ColorChoiceProps) {
  return (
    <div className="flex gap-4">
      {accents.map((accent) => (
        <label
          key={accent}
          className={`${swatches[accent].fill} text-midnight has-focus-visible:outline-ring hover:outline-mist grid size-10 cursor-pointer place-items-center rounded-full outline-offset-4 hover:outline-1 has-focus-visible:outline-2`}
        >
          <input
            type="radio"
            name="accent"
            value={accent}
            checked={value === accent}
            onChange={() => onChange(accent)}
            className="peer sr-only"
          />
          <CheckIcon className="invisible peer-checked:visible" />
          <span className="sr-only">{swatches[accent].name}</span>
        </label>
      ))}
    </div>
  );
}
