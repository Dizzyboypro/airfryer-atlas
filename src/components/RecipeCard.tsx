import { Clock3, Flame, Heart, Gauge, Thermometer, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recipe } from "@/types";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";
import { DishArt } from "./DishArt";

export function FavoriteButton({
  recipeId,
  className,
}: {
  recipeId: string;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const active = has(recipeId);

  return (
    <button
      type="button"
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(recipeId);
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-white/60 bg-cream/85 text-ink shadow-sm backdrop-blur transition hover:scale-105 hover:bg-cream active:scale-95",
        active && "border-terracotta/30 bg-terracotta text-cream hover:bg-terracotta-deep",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition", active && "fill-current")}
        strokeWidth={1.8}
      />
    </button>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-cream shadow-card transition duration-300 ease-out hover:-translate-y-1 hover:border-line-strong hover:shadow-lift">
      <Link
        to={`/recipe/${recipe.slug}`}
        className="flex h-full flex-col focus-visible:outline-offset-[-2px]"
      >
        <div className="relative">
          <DishArt
            emoji={recipe.emoji}
            tone={recipe.tone}
            label={recipe.title}
            className="aspect-[5/4] w-full transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-cream/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
            {recipe.category}
          </span>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-semibold text-cream backdrop-blur">
            <Thermometer className="size-3.5" strokeWidth={2} />
            {recipe.temp} °C · {recipe.time} мин
          </span>
          {recipe.dualHeat?.noFlip && (
            <span
              title="Два тена прогревают блюдо снизу и сверху — переворачивать не нужно"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full border border-white/60 bg-cream/85 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-ink backdrop-blur"
            >
              <Zap className="size-3 text-terracotta" strokeWidth={2.4} />
              без переворота
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            <span className="text-sm leading-none">{recipe.flag}</span>
            <span>{recipe.country}</span>
            <span className="size-1 rounded-full bg-line-strong" />
            <span>{recipe.cuisine}</span>
          </div>

          <h3 className="mt-2.5 font-display text-[23px] leading-[1.12] text-ink">
            {recipe.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
            {recipe.subtitle}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/80 pt-4 text-[12px] font-medium text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" strokeWidth={1.9} />
              {recipe.totalTime} мин
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-3.5" strokeWidth={1.9} />
              {recipe.kcal} ккал
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="size-3.5" strokeWidth={1.9} />
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </Link>

      <FavoriteButton recipeId={recipe.id} className="absolute right-4 top-4" />
    </article>
  );
}
