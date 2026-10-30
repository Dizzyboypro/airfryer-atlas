import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Flame,
  Plus,
  Search,
  Sparkles,
  Thermometer,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DishArt } from "@/components/DishArt";
import {
  ingredientCatalog,
  ingredientGroups,
  popularIngredients,
} from "@/data/ingredients";
import { recipes } from "@/data/recipes";
import { findMatches, normalizeIngredient, searchIngredientNames } from "@/lib/match";
import { useStoredState } from "@/lib/useStoredState";
import { cn, plural } from "@/lib/utils";
import type { MatchResult } from "@/types";

type MatchMode = "soft" | "strict";

const PAGE_SIZE = 20;

const examplePantry = ["куриное филе", "картофель", "сыр", "сметана", "чеснок"];
const catalogByName = new Map(
  ingredientCatalog.map((item) => [item.name, item]),
);

export function PantryPage() {
  const [pantry, setPantry] = useStoredState<string[]>(
    "airfry-atlas:pantry",
    [],
  );
  const [mode, setMode] = useState<MatchMode>("soft");
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ingredientGroups.map((group) => [group.title, true])),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [pantry, mode]);

  const selected = useMemo(() => new Set(pantry), [pantry]);
  const threshold = mode === "strict" ? 100 : 70;

  const matches = useMemo(() => findMatches(pantry, threshold), [pantry, threshold]);
  const nearMisses = useMemo(
    () => (matches.length === 0 && pantry.length > 0 ? findMatches(pantry, 30).slice(0, 3) : []),
    [matches.length, pantry],
  );

  const query = normalizeIngredient(search);
  const searchHits = useMemo(() => {
    if (!query) return [];
    return searchIngredientNames(
      query,
      ingredientCatalog.map((item) => item.name),
    )
      .slice(0, 18)
      .map((name) => catalogByName.get(name))
      .filter((item) => item !== undefined);
  }, [query]);

  const addItems = (items: string[]) => {
    setPantry((current) => Array.from(new Set([...current, ...items])));
  };

  const toggleItem = (name: string) => {
    setPantry((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  };

  const clearPantry = () => setPantry([]);

  const readyCount = matches.filter((result) => result.percent === 100).length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 size-[460px] rounded-full border border-cream/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-44 left-1/4 size-[380px] rounded-full bg-cream/[0.04]"
        />
        <div className="container-page relative py-12 sm:py-16">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow text-gold/80">
                <span className="h-px w-6 bg-gold/60" />
                Smart Pantry
              </p>
              <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">
                Что в холодильнике?
              </h1>
              <p className="mt-4 max-w-[54ch] text-[14.5px] leading-relaxed text-cream/65 sm:text-[15.5px]">
                Отметьте продукты, которые уже есть. Мы посчитаем совпадения по
                обязательным ингредиентам, покажем, чего не хватает, и предложим
                блюдо из любой точки мира. Соль, перец и масло считаются
                базовыми.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-3">
              {[
                { value: pantry.length, label: "продуктов" },
                { value: readyCount, label: "готовы сейчас" },
                { value: recipes.length, label: "рецептов" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-cream/12 bg-cream/[0.06] px-4 py-4 backdrop-blur-sm"
                >
                  <dt className="font-display text-[30px] leading-none text-gold">
                    {item.value}
                  </dt>
                  <dd className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-cream/50">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[380px_1fr] lg:items-start lg:py-14">
        <aside className="lg:sticky lg:top-[92px]">
          <div className="overflow-hidden rounded-[26px] border border-line bg-cream shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  Мои продукты
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-ink">
                  {pantry.length}{" "}
                  {plural(pantry.length, "продукт", "продукта", "продуктов")}
                </p>
              </div>
              {pantry.length > 0 && (
                <button
                  type="button"
                  onClick={clearPantry}
                  className="rounded-full px-3 py-1.5 text-[11.5px] font-bold text-muted transition hover:bg-paper hover:text-terracotta-deep"
                >
                  Очистить
                </button>
              )}
            </div>

            <div className="max-h-[calc(100dvh-180px)] overflow-y-auto px-4 py-4">
              {pantry.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {pantry.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem(item)}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-forest-soft px-2.5 py-1.5 text-[11.5px] font-semibold text-forest transition hover:border-terracotta/30 hover:bg-terracotta-soft hover:text-terracotta-deep"
                      title="Убрать из набора"
                    >
                      {item}
                      <X className="size-3 text-forest/40 transition group-hover:text-terracotta" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-line-strong bg-paper/60 px-4 py-5 text-center">
                  <Sparkles className="mx-auto size-5 text-terracotta" />
                  <p className="mt-2 text-[12.5px] font-semibold text-ink">
                    Начните с 3–5 продуктов
                  </p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                    Чем точнее набор, тем честнее совпадения.
                  </p>
                  <button
                    type="button"
                    onClick={() => addItems(examplePantry)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11.5px] font-bold text-cream transition hover:bg-forest"
                  >
                    <Sparkles className="size-3.5 text-gold" />
                    Взять пример
                  </button>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 transition focus-within:border-line-strong">
                  <Search className="size-4 shrink-0 text-muted" strokeWidth={1.9} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Найти продукт…"
                    aria-label="Поиск продукта"
                    className="w-full bg-transparent py-2.5 text-[13px] text-ink outline-none placeholder:text-muted/60"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Очистить поиск продукта"
                      className="grid size-6 shrink-0 place-items-center rounded-full text-muted transition hover:bg-line/60 hover:text-ink"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {query ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {searchHits.length > 0 ? (
                      searchHits.map((item) => {
                        const active = selected.has(item.name);
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => toggleItem(item.name)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11.5px] font-semibold transition",
                              active
                                ? "border-forest bg-forest text-cream"
                                : "border-line bg-cream text-ink hover:border-line-strong hover:bg-paper",
                            )}
                          >
                            {active ? (
                              <Check className="size-3" strokeWidth={2.6} />
                            ) : (
                              <Plus className="size-3" strokeWidth={2.6} />
                            )}
                            {item.name}
                          </button>
                        );
                      })
                    ) : (
                      <>
                        <p className="rounded-xl bg-paper px-3 py-2.5 text-[12px] text-muted">
                          В каталоге такого продукта нет — можно добавить его
                          вручную. На подбор это не повлияет, если блюд с ним
                          пока нет.
                        </p>
                        <button
                          type="button"
                          onClick={() => addItems([search.trim()])}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-line-strong bg-cream px-2.5 py-1.5 text-[11.5px] font-bold text-ink transition hover:border-forest hover:text-forest"
                        >
                          <Plus className="size-3" strokeWidth={2.6} />
                          Добавить «{search.trim()}»
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-[9.5px] font-bold uppercase tracking-[0.14em] text-muted/70">
                      Часто используют
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {popularIngredients.map((name) => {
                        const active = selected.has(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => toggleItem(name)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition",
                              active
                                ? "border-forest bg-forest text-cream"
                                : "border-line bg-cream text-muted hover:border-line-strong hover:text-ink",
                            )}
                          >
                            {active ? (
                              <Check className="size-3" strokeWidth={2.6} />
                            ) : (
                              <Plus className="size-3" strokeWidth={2.6} />
                            )}
                            {name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 space-y-2">
                      {ingredientGroups.map((group) => {
                        const open = openGroups[group.title] ?? true;
                        const selectedInGroup = group.items.filter((item) =>
                          selected.has(item.name),
                        ).length;

                        return (
                          <div
                            key={group.title}
                            className="overflow-hidden rounded-2xl border border-line"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenGroups((current) => ({
                                  ...current,
                                  [group.title]: !open,
                                }))
                              }
                              aria-expanded={open}
                              className="flex w-full items-center justify-between gap-2 bg-paper/70 px-3.5 py-2.5 text-left transition hover:bg-paper"
                            >
                              <span className="text-[12px] font-bold text-ink">
                                {group.title}
                                <span className="ml-1.5 font-semibold text-muted">
                                  {group.items.length}
                                </span>
                              </span>
                              <span className="flex items-center gap-2">
                                {selectedInGroup > 0 && (
                                  <span className="rounded-full bg-forest px-1.5 py-0.5 text-[9.5px] font-bold text-cream">
                                    {selectedInGroup}
                                  </span>
                                )}
                                <ChevronDown
                                  className={cn(
                                    "size-3.5 text-muted transition-transform",
                                    open && "rotate-180",
                                  )}
                                />
                              </span>
                            </button>

                            {open && (
                              <div className="flex flex-wrap gap-1.5 px-3 py-3">
                                {group.items.map((item) => {
                                  const active = selected.has(item.name);
                                  return (
                                    <button
                                      key={item.name}
                                      type="button"
                                      onClick={() => toggleItem(item.name)}
                                      className={cn(
                                        "rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition",
                                        active
                                          ? "border-forest bg-forest text-cream"
                                          : "border-line bg-cream text-muted hover:border-line-strong hover:text-ink",
                                      )}
                                    >
                                      {item.name}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 px-2 text-[11px] leading-relaxed text-muted">
            Набор сохраняется в браузере — можно вернуться к нему позже.
          </p>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("matches")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl bg-forest px-4 py-3 text-cream shadow-card transition hover:bg-forest-deep lg:hidden"
          >
            <span className="text-[12.5px] font-bold">
              {matches.length > 0
                ? `Показать подбор · ${matches.length}`
                : "К результатам"}
            </span>
            <ArrowRight className="size-4 text-gold" />
          </button>
        </aside>

        <div id="matches" className="min-w-0 scroll-mt-24">
          <div className="flex flex-col gap-4 rounded-[22px] border border-line bg-cream p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[22px] leading-tight text-ink">
                {pantry.length === 0
                  ? "Подберём ужин"
                  : matches.length > 0
                    ? `${matches.length} ${plural(matches.length, "рецепт", "рецепта", "рецептов")} по вашему набору`
                    : "Пока точных совпадений нет"}
              </p>
              <p className="mt-1 text-[12px] text-muted">
                {mode === "strict"
                  ? "Строгий режим: только блюда, для которых всё уже есть."
                  : "Мягкий режим: совпадение от 70%, недостающее показано списком."}
              </p>
            </div>

            <div className="inline-flex shrink-0 rounded-full border border-line bg-paper p-1">
              {(
                [
                  { value: "soft", label: "Мягкий · 70%" },
                  { value: "strict", label: "Строгий · 100%" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMode(option.value)}
                  aria-pressed={mode === option.value}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[11.5px] font-bold transition",
                    mode === option.value
                      ? "bg-ink text-cream shadow-sm"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {pantry.length === 0 ? (
            <div className="mt-5 flex flex-col items-center rounded-[26px] border border-dashed border-line-strong bg-cream/60 px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-forest-soft text-forest">
                <Sparkles className="size-6" strokeWidth={1.7} />
              </span>
              <h2 className="mt-4 font-display text-[26px] text-ink">
                Отметьте продукты слева
              </h2>
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
                Можно ввести вручную или выбрать из списка. Синонимы тоже
                работают: «курица» найдёт филе, бёдра и крылья, «картошка» —
                картофель.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {examplePantry.slice(0, 3).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => addItems([name])}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-2 text-[12px] font-bold text-ink transition hover:border-forest"
                  >
                    <Plus className="size-3.5" />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ) : matches.length > 0 ? (
            <>
              <div className="mt-5 grid gap-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {matches.slice(0, visibleCount).map((result) => (
                    <MatchCard
                      key={result.recipe.id}
                      result={result}
                      onAddMissing={addItems}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {matches.length > visibleCount && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((count) => count + PAGE_SIZE)
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-cream transition hover:bg-forest"
                  >
                    Показать ещё{" "}
                    {Math.min(PAGE_SIZE, matches.length - visibleCount)}
                    <ChevronDown className="size-4" />
                  </button>
                  <p className="text-[11.5px] font-semibold text-muted">
                    Показано {Math.min(visibleCount, matches.length)} из{" "}
                    {matches.length}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="mt-5">
              <div className="rounded-[26px] border border-dashed border-line-strong bg-cream/60 px-6 py-10 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-gold-soft text-[#8a5a16]">
                  <Search className="size-6" strokeWidth={1.7} />
                </span>
                <h2 className="mt-4 font-display text-[24px] text-ink">
                  {mode === "strict"
                    ? "Ни одного блюда «под ключ»"
                    : "Совпадений пока нет"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
                  {mode === "strict"
                    ? "Попробуйте мягкий режим — он покажет блюда, для которых не хватает одного-двух продуктов."
                    : "Не хватает слишком многого. Добавьте ещё пару продуктов или посмотрите ближайшие варианты ниже."}
                </p>
                {mode === "strict" && (
                  <button
                    type="button"
                    onClick={() => setMode("soft")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-bold text-cream transition hover:bg-forest"
                  >
                    <Sparkles className="size-3.5 text-gold" />
                    Включить мягкий режим
                  </button>
                )}
              </div>

              {nearMisses.length > 0 && (
                <div className="mt-6">
                  <h3 className="px-1 font-display text-[21px] text-ink">
                    Ближе всего к вашему набору
                  </h3>
                  <div className="mt-3 grid gap-4">
                    {nearMisses.map((result) => (
                      <MatchCard
                        key={result.recipe.id}
                        result={result}
                        onAddMissing={addItems}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function MatchCard({
  result,
  onAddMissing,
}: {
  result: MatchResult;
  onAddMissing: (items: string[]) => void;
}) {
  const { recipe, percent, have, missing } = result;
  const ready = missing.length === 0;
  const total = have.length + missing.length;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
      className="group overflow-hidden rounded-[24px] border border-line bg-cream p-4 shadow-card transition hover:border-line-strong hover:shadow-lift sm:p-5"
    >
      <div className="flex gap-4">
        <Link
          to={`/recipe/${recipe.slug}`}
          className="w-[86px] shrink-0 overflow-hidden rounded-2xl sm:w-24"
        >
          <DishArt
            emoji={recipe.emoji}
            tone={recipe.tone}
            label={recipe.title}
            className="aspect-square w-full"
            emojiClassName="text-[2.4rem]"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            <span className="text-[13px] leading-none">{recipe.flag}</span>
            <span className="truncate">{recipe.country}</span>
            <span className="size-1 shrink-0 rounded-full bg-line-strong" />
            <span className="shrink-0">{recipe.category}</span>
          </div>
          <Link to={`/recipe/${recipe.slug}`}>
            <h3 className="mt-1.5 font-display text-[21px] leading-[1.15] text-ink transition group-hover:text-terracotta-deep sm:text-[23px]">
              {recipe.title}
            </h3>
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11.5px] font-medium text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Thermometer className="size-3.5" strokeWidth={1.9} />
              {recipe.temp} °C
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-3.5" strokeWidth={1.9} />
              {recipe.time} мин
            </span>
            <span>{recipe.kcal} ккал</span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end sm:flex">
          <span
            className={cn(
              "font-display text-[30px] leading-none",
              ready ? "text-forest" : percent >= 70 ? "text-terracotta" : "text-muted",
            )}
          >
            {percent}%
          </span>
          <span className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted/70">
            совпадение
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-muted">
            Есть {have.length} из {total}
          </span>
          <span className="text-ink sm:hidden">{percent}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/70">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              ready ? "bg-forest" : "bg-terracotta",
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {ready ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft px-2.5 py-1.5 text-[11px] font-bold text-forest">
            <CircleCheck className="size-3.5" />
            Всё есть — можно готовить
          </span>
        ) : (
          <>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted/70">
              Не хватает
            </span>
            {missing.slice(0, 4).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onAddMissing([name])}
                title={`Добавить «${name}» в набор`}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2 py-1 text-[10.5px] font-semibold text-muted transition hover:border-forest/30 hover:bg-forest-soft hover:text-forest"
              >
                <Plus className="size-2.5" strokeWidth={3} />
                {name}
              </button>
            ))}
            {missing.length > 4 && (
              <span className="text-[10.5px] font-semibold text-muted">
                +{missing.length - 4}
              </span>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/80 pt-3">
        <span className="text-[11px] text-muted">
          {recipe.prepTime} мин подготовки · {recipe.servings}{" "}
          {plural(recipe.servings, "порция", "порции", "порций")}
        </span>
        <Link
          to={`/recipe/${recipe.slug}`}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-bold text-ink transition hover:text-terracotta-deep"
        >
          Открыть рецепт
          <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
