import { Link } from "react-router-dom";
import { Flame, MoveUpRight } from "lucide-react";
import { categories, stats } from "@/data/recipes";
import { plural } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-24 bg-forest-deep text-cream">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[15px] bg-cream/10 text-cream ring-1 ring-cream/15">
                <Flame className="size-5" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block font-display text-[22px] leading-none">
                  AirFry Atlas
                </span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.22em] text-cream/45">
                  мировая кухня · аэрогриль
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-cream/60">
              {stats.recipes}{" "}
              {plural(stats.recipes, "рецепт", "рецепта", "рецептов")} из{" "}
              {stats.countries} стран, проверенных под аэрогриль 4–6 литров. Все
              адаптированы под два тена, {stats.noFlip}{" "}
              {plural(stats.noFlip, "готовится", "готовятся", "готовятся")} без
              переворота. Скажите, что есть в холодильнике, — и мы соберём ужин.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-cream/35">
              Демо-проект · 2026
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/40">
              Навигация
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-cream/75">
              <li>
                <Link className="transition hover:text-cream" to="/#catalog">
                  Каталог рецептов
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-cream" to="/pantry">
                  Подбор по продуктам
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-cream" to="/#cuisines">
                  Кухни мира
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-cream" to="/#how">
                  Как это работает
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/40">
              Категории
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-cream/75">
              {categories.slice(0, 5).map((category) => (
                <li key={category}>
                  <Link
                    className="transition hover:text-cream"
                    to={`/#catalog`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/40">
              О проекте
            </h3>
            <p className="mt-4 text-[13px] leading-relaxed text-cream/60">
              Температуры и время ориентировочные: мощность и объём корзины
              вашего аэрогриля могут отличаться. Первые 2–3 приготовления
              проверяйте блюдо за 2 минуты до конца.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold transition hover:text-cream"
            >
              Исходный код
              <MoveUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[11.5px] text-cream/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AirFry Atlas. Готовьте с удовольствием.</p>
          <p>Соль, перец и масло всегда считаются базовыми продуктами.</p>
        </div>
      </div>
    </footer>
  );
}
