import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  Droplets,
  Flame,
  Gauge,
  Heart,
  Layers,
  Minus,
  MoveHorizontal,
  Plus,
  Printer,
  RefreshCw,
  ScrollText,
  Share2,
  Sparkles,
  Thermometer,
  Timer,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DishArt } from "@/components/DishArt";
import { RecipeCard } from "@/components/RecipeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getRecipeBySlug, getRelatedRecipes } from "@/data/recipes";
import { useFavorites } from "@/lib/favorites";
import {
  cn,
  formatAmount,
  formatMinutes,
  plural,
  pluralizeUnit,
  scaleAmount,
} from "@/lib/utils";
import type { Recipe, TipKind } from "@/types";
import { NotFoundPage } from "./NotFound";

const tipMeta: Record<
  TipKind,
  { label: string; icon: LucideIcon; tint: string }
> = {
  paper: { label: "Пергамент", icon: ScrollText, tint: "bg-gold-soft text-[#8a5a16]" },
  foil: { label: "Фольга", icon: Layers, tint: "bg-[#e7e9ee] text-[#4d5a6b]" },
  flip: { label: "Переворот", icon: RefreshCw, tint: "bg-terracotta-soft text-terracotta-deep" },
  oil: { label: "Масло", icon: Droplets, tint: "bg-[#f3ecd2] text-[#7d6a24]" },
  space: { label: "Пространство", icon: MoveHorizontal, tint: "bg-forest-soft text-forest" },
  rest: { label: "Отдых", icon: Timer, tint: "bg-[#efe6f2] text-[#6b4b7a]" },
};

export function RecipePage() {
  const { slug } = useParams();
  const recipe = getRecipeBySlug(slug);

  if (!recipe) return <NotFoundPage />;

  return <RecipeView key={recipe.id} recipe={recipe} />;
}

function RecipeView({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const [copied, setCopied] = useState(false);
  const { has, toggle } = useFavorites();
  const favorite = has(recipe.id);

  const related = getRelatedRecipes(recipe, 3);

  const toggleIngredient = (index: number) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const changeServings = (delta: number) => {
    setServings((current) => Math.min(12, Math.max(1, current + delta)));
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Пользователь отменил системный диалог — ничего не делаем.
    }
  };

  return (
    <>
      <div className="container-page pt-5">
        <nav className="flex flex-wrap items-center gap-2 text-[11.5px] font-semibold text-muted">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 transition hover:border-line-strong hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Каталог
          </Link>
          <span className="text-line-strong">/</span>
          <Link to="/#catalog" className="transition hover:text-ink">
            {recipe.category}
          </Link>
          <span className="text-line-strong">/</span>
          <span className="text-ink">{recipe.title}</span>
        </nav>

        <section className="mt-5 grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[540px] lg:max-w-none"
          >
            <div className="overflow-hidden rounded-[32px] border border-line shadow-lift">
              <DishArt
                emoji={recipe.emoji}
                tone={recipe.tone}
                label={recipe.title}
                className="aspect-[4/3] w-full sm:aspect-[5/4]"
                emojiClassName="text-[clamp(7rem,18vw,12rem)]"
              />
            </div>
            <div className="absolute -bottom-4 left-5 flex items-center gap-2 rounded-2xl border border-line bg-cream px-4 py-2.5 shadow-lift">
              <span className="grid size-8 place-items-center rounded-xl bg-forest text-cream">
                <Thermometer className="size-4" strokeWidth={1.9} />
              </span>
              <span className="text-[12px] font-bold text-ink">
                {recipe.temp} °C
                <span className="mx-1.5 text-line-strong">·</span>
                {recipe.time} мин
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
              <span className="text-base leading-none">{recipe.flag}</span>
              {recipe.country}
              <span className="size-1 rounded-full bg-line-strong" />
              {recipe.cuisine} кухня
              <span className="size-1 rounded-full bg-line-strong" />
              {recipe.category}
              {recipe.dualHeat && (
                <>
                  <span className="size-1 rounded-full bg-line-strong" />
                  <span className="inline-flex items-center gap-1 text-terracotta-deep">
                    <Zap className="size-3" strokeWidth={2.4} />2 тена
                  </span>
                </>
              )}
            </div>

            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.02] tracking-[-0.03em] text-ink">
              {recipe.title}
            </h1>
            <p className="mt-3 font-display text-[19px] leading-snug text-terracotta-deep">
              {recipe.subtitle}
            </p>
            <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed text-muted sm:text-[15px]">
              {recipe.description}
            </p>

            <dl className="mt-6 grid max-w-[520px] grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Clock3, value: formatMinutes(recipe.totalTime), label: "всего" },
                { icon: Flame, value: `${recipe.kcal}`, label: "ккал/порция" },
                { icon: Gauge, value: recipe.difficulty, label: "сложность" },
                { icon: Users, value: String(recipe.servings), label: "порций" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-line bg-cream px-3.5 py-3"
                >
                  <item.icon className="size-4 text-muted" strokeWidth={1.8} />
                  <dt className="mt-2 text-[13.5px] font-bold leading-none text-ink">
                    {item.value}
                  </dt>
                  <dd className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted/70">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(recipe.id)}
                aria-pressed={favorite}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px] font-bold transition",
                  favorite
                    ? "bg-terracotta text-cream hover:bg-terracotta-deep"
                    : "border border-line bg-cream text-ink hover:border-terracotta/40 hover:text-terracotta-deep",
                )}
              >
                <Heart
                  className={cn("size-4", favorite && "fill-current")}
                  strokeWidth={1.9}
                />
                {favorite ? "В избранном" : "В избранное"}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2.5 text-[12.5px] font-bold text-ink transition hover:border-line-strong"
              >
                <Printer className="size-4" strokeWidth={1.9} />
                Распечатать
              </button>

              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2.5 text-[12.5px] font-bold text-ink transition hover:border-line-strong"
              >
                {copied ? (
                  <Check className="size-4 text-forest" strokeWidth={2.4} />
                ) : (
                  <Share2 className="size-4" strokeWidth={1.9} />
                )}
                {copied ? "Ссылка скопирована" : "Поделиться"}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-paper px-2.5 py-1 text-[10.5px] font-semibold text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      <div className="container-page mt-12 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="min-w-0 space-y-8">
          <section className="rounded-[26px] border border-line bg-cream p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">
                  <span className="h-px w-5 bg-terracotta" />
                  Ингредиенты
                </p>
                <h2 className="mt-2 font-display text-[27px] text-ink">
                  Список покупок
                </h2>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full border border-line bg-paper p-1">
                <button
                  type="button"
                  onClick={() => changeServings(-1)}
                  disabled={servings <= 1}
                  aria-label="Уменьшить число порций"
                  className="grid size-8 place-items-center rounded-full text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="min-w-[86px] text-center text-[12px] font-bold text-ink">
                  {servings} {plural(servings, "порция", "порции", "порций")}
                </span>
                <button
                  type="button"
                  onClick={() => changeServings(1)}
                  disabled={servings >= 12}
                  aria-label="Увеличить число порций"
                  className="grid size-8 place-items-center rounded-full text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-1 text-[12px] text-muted">
              Количество пересчитано с {recipe.servings}{" "}
              {plural(recipe.servings, "порции", "порций", "порций")} из
              оригинального рецепта.
            </p>

            <ul className="mt-4 divide-y divide-line/80">
              {recipe.ingredients.map((ingredient, index) => {
                const isChecked = checked.has(index);
                const scaled = scaleAmount(
                  ingredient.amount,
                  recipe.servings,
                  servings,
                );
                const amountLabel =
                  ingredient.amount === 0
                    ? "по вкусу"
                    : `${formatAmount(scaled)} ${pluralizeUnit(scaled, ingredient.unit)}`.trim();

                return (
                  <li key={`${ingredient.name}-${index}`}>
                    <button
                      type="button"
                      onClick={() => toggleIngredient(index)}
                      aria-pressed={isChecked}
                      className="flex w-full items-center gap-3 py-2.5 text-left transition"
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border transition",
                          isChecked
                            ? "border-forest bg-forest text-cream"
                            : "border-line-strong bg-cream text-transparent",
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 text-[13.5px] transition",
                          isChecked ? "text-muted line-through" : "text-ink",
                        )}
                      >
                        {ingredient.name}
                        {ingredient.optional && (
                          <span className="ml-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted/60">
                            по желанию
                          </span>
                        )}
                        {ingredient.note && (
                          <span className="ml-1.5 text-[11.5px] text-muted">
                            ({ingredient.note})
                          </span>
                        )}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-[12.5px] font-bold tabular-nums",
                          isChecked ? "text-muted/60" : "text-ink",
                        )}
                      >
                        {amountLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 rounded-xl bg-paper px-3.5 py-2.5 text-[11.5px] leading-relaxed text-muted">
              Соль, перец и масло можно добавлять по вкусу — они не влияют на
              подбор по продуктам.
            </p>
          </section>

          <section className="rounded-[26px] border border-line bg-cream p-5 shadow-card sm:p-6">
            <p className="eyebrow">
              <span className="h-px w-5 bg-terracotta" />
              Приготовление
            </p>
            <h2 className="mt-2 font-display text-[27px] text-ink">
              Пошаговый режим
            </h2>

            <ol className="relative mt-5 space-y-5 border-l border-line pl-6">
              {recipe.steps.map((step, index) => (
                <li key={`${step.title}-${index}`} className="relative">
                  <span className="absolute -left-[35px] top-0 grid size-6 place-items-center rounded-full border border-line bg-cream font-display text-[12px] font-semibold text-ink">
                    {index + 1}
                  </span>
                  <div className="rounded-2xl border border-line/80 bg-paper/50 px-4 py-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-[19px] leading-tight text-ink">
                        {step.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {step.temp !== undefined && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10.5px] font-bold text-cream">
                            <Thermometer className="size-3" strokeWidth={2.1} />
                            {step.temp} °C
                          </span>
                        )}
                        {step.time !== undefined && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-[10.5px] font-bold text-cream">
                            <Timer className="size-3" strokeWidth={2.1} />
                            {step.time} мин
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">
                      {step.text}
                    </p>
                    {step.tip && (
                      <p className="mt-2.5 flex gap-2 rounded-xl bg-gold-soft/70 px-3 py-2 text-[11.5px] leading-relaxed text-[#7d5314]">
                        <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                        {step.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionHeading
              eyebrow="Особенности"
              title="Советы для аэрогриля"
              description="Мелочи, которые решают: прилипание, циркуляция воздуха и момент переворота."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {recipe.tips.map((tip, index) => {
                const meta = tipMeta[tip.kind];
                return (
                  <article
                    key={`${tip.kind}-${index}`}
                    className="rounded-2xl border border-line bg-cream p-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-8 place-items-center rounded-xl",
                          meta.tint,
                        )}
                      >
                        <meta.icon className="size-4" strokeWidth={1.9} />
                      </span>
                      <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
                        {meta.label}
                      </h3>
                    </div>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">
                      {tip.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-[92px]">
          <div className="relative overflow-hidden rounded-[26px] bg-forest p-5 text-cream shadow-lift">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-16 size-40 rounded-full border border-cream/10"
            />
            <div className="flex items-center gap-2">
              <ChefHat className="size-4 text-gold" strokeWidth={1.9} />
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream/55">
                Настройки аэрогриля
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-cream/[0.07] px-3.5 py-3">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-cream/45">
                  Температура
                </p>
                <p className="mt-1 font-display text-[30px] leading-none text-gold">
                  {recipe.temp}°
                </p>
              </div>
              <div className="rounded-2xl bg-cream/[0.07] px-3.5 py-3">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-cream/45">
                  Время
                </p>
                <p className="mt-1 font-display text-[30px] leading-none text-gold">
                  {recipe.time}
                  <span className="ml-1 text-[13px] text-cream/60">мин</span>
                </p>
              </div>
            </div>

            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex items-center justify-between gap-3 border-b border-cream/10 pb-2">
                <dt className="text-cream/55">Предварительный разогрев</dt>
                <dd className="font-bold">
                  {recipe.preheat ? "Да, 3–5 мин" : "Не требуется"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-cream/10 pb-2">
                <dt className="text-cream/55">Всего с подготовкой</dt>
                <dd className="font-bold">{formatMinutes(recipe.totalTime)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-cream/10 pb-2">
                <dt className="text-cream/55">Активная подготовка</dt>
                <dd className="font-bold">{recipe.prepTime} мин</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-cream/55">Калорийность</dt>
                <dd className="font-bold">{recipe.kcal} ккал / порция</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-xl bg-cream/[0.06] px-3 py-2.5 text-[10.5px] leading-relaxed text-cream/50">
              Режимы указаны для корзины 4–6 л. В первый раз проверьте блюдо за
              2 минуты до конца.
            </p>

            <Link
              to="/pantry"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cream px-4 py-2.5 text-[12px] font-bold text-forest transition hover:bg-gold-soft"
            >
              <Sparkles className="size-3.5 text-terracotta" />
              Подобрать по продуктам
            </Link>
          </div>

          {recipe.dualHeat && (
            <div className="rounded-[26px] border border-line bg-gold-soft/50 p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest text-cream">
                  <Zap className="size-4" strokeWidth={2.1} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Аэрогриль с двумя тенами
                  </p>
                  <p className="mt-1 text-[13px] font-bold leading-snug text-ink">
                    {recipe.dualHeat.noFlip
                      ? "Переворачивать не нужно"
                      : "Один переворот на середине"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                {recipe.dualHeat.note}
              </p>
            </div>
          )}

          <div className="rounded-[26px] border border-line bg-cream p-5 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Кратко
            </p>
            <div className="mt-3 space-y-2.5 text-[12px]">
              <div className="flex items-center gap-2 text-muted">
                <Clock3 className="size-3.5" strokeWidth={1.9} />
                {formatMinutes(recipe.totalTime)} от начала до подачи
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Flame className="size-3.5" strokeWidth={1.9} />
                {recipe.kcal} ккал на порцию
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Gauge className="size-3.5" strokeWidth={1.9} />
                {recipe.difficulty} · {recipe.steps.length}{" "}
                {plural(recipe.steps.length, "шаг", "шага", "шагов")}
              </div>
            </div>
            <button
              type="button"
              onClick={share}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[12px] font-bold text-ink transition hover:border-line-strong"
            >
              <ArrowRight className="size-3.5" />
              {copied ? "Ссылка скопирована" : "Поделиться рецептом"}
            </button>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-page mt-16">
          <SectionHeading
            eyebrow="Дальше"
            title="Похожие блюда"
            description="Ещё несколько идей из той же категории и соседних кухонь."
            action={
              <Link
                to="/#catalog"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-cream px-4 py-2.5 text-[12px] font-bold text-ink transition hover:border-forest hover:text-forest"
              >
                Весь каталог
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <RecipeCard key={item.id} recipe={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
