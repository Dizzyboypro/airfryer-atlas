import { cn } from "@/lib/utils";
import type { Tone } from "@/types";

const palettes: Record<
  Tone,
  { from: string; via: string; to: string; ink: string }
> = {
  ember: { from: "#fbe6d7", via: "#f2bd9b", to: "#c65b34", ink: "#8f3d1d" },
  olive: { from: "#f1f2e0", via: "#d5ddb2", to: "#5d7041", ink: "#3f512b" },
  ocean: { from: "#e5f0f3", via: "#b9d7de", to: "#356b7a", ink: "#234f5b" },
  saffron: { from: "#fdf0d3", via: "#f2d493", to: "#b57c28", ink: "#8a5a16" },
  gold: { from: "#fae9c4", via: "#ebc979", to: "#a47124", ink: "#7d5314" },
  berry: { from: "#f5e2e3", via: "#dfb6ba", to: "#7e3943", ink: "#5f2a32" },
  clay: { from: "#f2e6d8", via: "#dcbfa1", to: "#7f5539", ink: "#5f3d27" },
};

interface DishArtProps {
  emoji: string;
  tone: Tone;
  label: string;
  className?: string;
  emojiClassName?: string;
}

/**
 * Процедурная «фотография» блюда: детерминированная композиция без внешних
 * изображений. Работает офлайн и держит единый визуальный язык каталога.
 */
export function DishArt({
  emoji,
  tone,
  label,
  className,
  emojiClassName,
}: DishArtProps) {
  const palette = palettes[tone];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 100%)`,
      }}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute -right-[18%] -top-[22%] size-[70%] rounded-full opacity-25"
        style={{ backgroundColor: palette.to }}
      />
      <div
        className="absolute -bottom-[30%] -left-[12%] size-[66%] rounded-full opacity-15"
        style={{ backgroundColor: palette.ink }}
      />
      <div
        className="absolute left-1/2 top-1/2 size-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45"
        style={{ boxShadow: `inset 0 0 0 1px ${palette.to}22` }}
      />
      <div
        className="absolute left-1/2 top-1/2 size-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
      />
      <div
        className="absolute left-[-8%] top-[18%] h-[18%] w-[60%] -rotate-12 rounded-full opacity-20 blur-[1px]"
        style={{ backgroundColor: palette.to }}
      />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${palette.ink} 1px, transparent 0)`,
          backgroundSize: "14px 14px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "relative select-none text-[clamp(3.4rem,8vw,6rem)] leading-none drop-shadow-[0_18px_20px_rgba(43,31,18,0.25)]",
            emojiClassName,
          )}
          style={{ transform: "rotate(-5deg)" }}
        >
          {emoji}
        </span>
      </div>
      <div
        className="absolute bottom-[9%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-[50%] opacity-25 blur-md"
        style={{ backgroundColor: palette.ink }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 55%, ${palette.ink}14 100%)`,
        }}
      />
    </div>
  );
}
