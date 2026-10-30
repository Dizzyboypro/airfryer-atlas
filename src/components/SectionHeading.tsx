import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-terracotta" />
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.02] text-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
