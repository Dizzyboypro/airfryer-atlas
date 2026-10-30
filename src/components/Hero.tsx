import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Search,
  Sparkles,
  Thermometer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getRecipeBySlug, stats } from "@/data/recipes";
import { plural } from "@/lib/utils";
import { DishArt } from "./DishArt";

const quickTags = ["курица", "картофель", "сыр", "треска", "яблоко"];

export function Hero({
  query,
  onQueryChange,
  onSearch,
  onQuickPick,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onQuickPick: (value: string) => void;
}) {
  const main = getRecipeBySlug("korean-wings");
  const small = getRecipeBySlug("karaage");

  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-48 size-[560px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(198,91,52,0.16) 0%, rgba(246,240,230,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-52 top-40 size-[460px] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(20,61,49,0.12) 0%, rgba(246,240,230,0) 70%)",
        }}
      />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-cream/80 py-1.5 pl-2 pr-4 shadow-sm backdrop-blur">
            <span className="grid size-6 place-items-center rounded-full bg-terracotta-soft text-terracotta">
              <Sparkles className="size-3.5" strokeWidth={2} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              {stats.recipes}{" "}
              {plural(stats.recipes, "рецепт", "рецепта", "рецептов")} ·{" "}
              {stats.cuisines}{" "}
              {plural(stats.cuisines, "кухня", "кухни", "кухонь")} мира
            </span>
          </div>

          <h1 className="mt-6 max-w-[15ch] font-display text-[clamp(2.7rem,6.2vw,4.9rem)] leading-[0.98] tracking-[-0.035em] text-ink">
            Весь мир — в одной корзине{" "}
            <span className="relative inline-block text-terracotta">
              аэрогриля
              <svg
                aria-hidden
                viewBox="0 0 240 14"
                className="absolute -bottom-1 left-0 h-3 w-full text-terracotta/35"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9c42-6 92-7 140-4 34 2 63 4 96 1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted sm:text-[16px]">
            Проверенные блюда из {stats.countries} стран для аэрогриля с двумя
            тенами: точные температуры, время и советы. {stats.noFlip}{" "}
            {plural(stats.noFlip, "рецепт", "рецепта", "рецептов")}{" "}
            {plural(stats.noFlip, "готовится", "готовятся", "готовятся")} без
            переворота. Скажите, что есть в холодильнике, — соберём ужин без
            похода в магазин.
          </p>

          <form
            className="mt-8 flex max-w-[560px] items-center gap-2 rounded-2xl border border-line bg-cream p-2 shadow-card transition focus-within:border-line-strong focus-within:shadow-lift"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch();
            }}
            role="search"
          >
            <Search
              className="ml-2.5 size-5 shrink-0 text-muted"
              strokeWidth={1.8}
            />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Блюдо, страна или продукт — например, «курица»"
              aria-label="Поиск по каталогу"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[14px] text-ink outline-none placeholder:text-muted/70"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-terracotta px-4 py-3 text-[13px] font-bold text-cream transition hover:bg-terracotta-deep"
            >
              Найти
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">
              Часто ищут
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onQuickPick(tag)}
                className="rounded-full border border-line bg-cream/60 px-3 py-1 text-[11.5px] font-semibold text-muted transition hover:border-terracotta/30 hover:bg-terracotta-soft hover:text-terracotta-deep"
              >
                {tag}
              </button>
            ))}
          </div>

          <dl className="mt-10 grid max-w-[520px] grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              { value: stats.recipes, label: "рецептов" },
              { value: stats.countries, label: "стран" },
              { value: "180–200°", label: "температура" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-display text-[28px] leading-none text-ink">
                  {item.value}
                </dt>
                <dd className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {main && small && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[440px] pb-10 sm:pb-0"
          >
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line-strong/80"
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/80"
            />

            <Link
              to={`/recipe/${main.slug}`}
              className="group relative z-10 block overflow-hidden rounded-[32px] border border-line bg-cream shadow-lift transition duration-500 hover:-translate-y-1"
            >
              <DishArt
                emoji={main.emoji}
                tone={main.tone}
                label={main.title}
                className="aspect-[4/5] w-full"
                emojiClassName="text-[clamp(7rem,14vw,9.5rem)]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b1915f2] via-[#1b1915a8] to-transparent p-6 pt-24 text-cream">
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-cream/70">
                  <span className="text-base leading-none">{main.flag}</span>
                  {main.country}
                  <span className="size-1 rounded-full bg-cream/30" />
                  {main.cuisine}
                </div>
                <h2 className="mt-2 font-display text-[27px] leading-tight">
                  {main.title}
                </h2>
                <div className="mt-3 flex items-center gap-4 text-[12px] text-cream/75">
                  <span className="inline-flex items-center gap-1.5">
                    <Thermometer className="size-3.5" /> {main.temp} °C
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" /> {main.time} мин
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
                    Рецепт
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to={`/recipe/${small.slug}`}
              className="absolute -left-5 top-16 z-20 hidden w-[180px] -rotate-[5deg] overflow-hidden rounded-2xl border border-line bg-cream shadow-lift transition hover:rotate-0 sm:block"
            >
              <DishArt
                emoji={small.emoji}
                tone={small.tone}
                label={small.title}
                className="aspect-[4/3] w-full"
              />
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  {small.flag} {small.country}
                </p>
                <p className="mt-1 font-display text-[15px] leading-tight text-ink">
                  {small.title}
                </p>
              </div>
            </Link>

            <div className="absolute -right-3 top-[44%] z-20 hidden w-[236px] rotate-[4deg] rounded-2xl border border-line bg-cream p-4 shadow-lift sm:block">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-forest-soft text-forest">
                  <Sparkles className="size-3.5" />
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink">
                  Умный подбор
                </span>
                <span className="ml-auto rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-cream">
                  83%
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["курица", "картофель", "сыр"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-paper px-2 py-1 text-[10px] font-semibold text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                <div className="h-full w-[83%] rounded-full bg-forest" />
              </div>
              <p className="mt-2 text-[10px] font-medium text-muted">
                Не хватает: паприка
              </p>
            </div>

            <div className="absolute -right-2 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11px] font-bold text-cream shadow-lift">
              <span className="size-1.5 animate-pulse rounded-full bg-gold" />
              200 °C · 22 мин
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
