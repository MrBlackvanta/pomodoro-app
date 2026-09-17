import { fonts, type Font } from "@/lib";

type FontChoiceProps = {
  value: Font;
  onChange: (font: Font) => void;
};

const families: Record<Font, { name: string; preview: string }> = {
  sans: { name: "Kumbh Sans", preview: "font-sans" },
  serif: { name: "Roboto Slab", preview: "font-serif" },
  mono: { name: "Space Mono", preview: "font-mono" },
};

export default function FontChoice({ value, onChange }: FontChoiceProps) {
  return (
    <div className="flex gap-4">
      {fonts.map((font) => (
        <label
          key={font}
          className={`${families[font].preview} text-preview bg-mist text-navy/73 has-checked:bg-midnight has-focus-visible:outline-ring hover:outline-mist grid size-10 cursor-pointer place-items-center rounded-full outline-offset-4 transition-colors duration-150 ease-out hover:outline-1 has-checked:text-white has-focus-visible:outline-2`}
        >
          <input
            type="radio"
            name="font"
            value={font}
            checked={value === font}
            onChange={() => onChange(font)}
            className="sr-only"
          />
          <span aria-hidden="true">Aa</span>
          <span className="sr-only">{families[font].name}</span>
        </label>
      ))}
    </div>
  );
}
