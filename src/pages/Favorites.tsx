import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { RecipeCard } from "@/components/RecipeCard";
import { recipes } from "@/data/recipes";
import { useFavorites } from "@/lib/favorites";
import { plural } from "@/lib/utils";
import type { Recipe } from "@/types";

export function FavoritesPage() {
  const { favorites } = useFavorites();

  const saved = [...favorites]
    .reverse()
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe));

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-cream/60">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(198,91,52,0.16) 0%, rgba(246,240,230,0) 70%)",
          }}
        />
        <div className="container-page relative py-12 sm:py-14">
          <p className="eyebrow">
            <span className="h-px w-6 bg-terracotta" />
            Личная коллекция
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-[clamp(2.3rem,4.6vw,3.6rem)] leading-[1.02] text-ink">
                Избранное
              </h1>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted">
                Рецепты, которые вы отметили сердечком. Список хранится в
                браузере — можно возвращаться к нему с любого устройства,
                где открыт этот каталог.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-[12px] font-bold text-ink">
              <Heart className="size-4 fill-terracotta text-terracotta" />
              {saved.length}{" "}
              {plural(saved.length, "рецепт", "рецепта", "рецептов")}
            </span>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        {saved.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-[28px] border border-dashed border-line-strong bg-cream/60 px-6 py-16 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-terracotta-soft text-terracotta">
              <Heart className="size-7" strokeWidth={1.7} />
            </span>
            <h2 className="mt-5 font-display text-[27px] text-ink">
              Пока пусто
            </h2>
            <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
              Нажмите на сердечко у любого рецепта в каталоге — он появится
              здесь. Или начните с подбора по продуктам, которые уже есть дома.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link
                to="/#catalog"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-bold text-cream transition hover:bg-forest"
              >
                Открыть каталог
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                to="/pantry"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2.5 text-[12.5px] font-bold text-ink transition hover:border-forest"
              >
                <Sparkles className="size-3.5 text-terracotta" />
                Подобрать по продуктам
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
