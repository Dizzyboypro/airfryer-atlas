import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { stats } from "@/data/recipes";
import { plural } from "@/lib/utils";

export function NotFoundPage() {
  return (
    <section className="container-page flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-gold-soft text-[#8a5a16]">
        <Search className="size-7" strokeWidth={1.7} />
      </span>
      <p className="mt-6 font-display text-[clamp(3rem,8vw,5rem)] leading-none text-line-strong">
        404
      </p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">
        Такого рецепта нет в атласе
      </h1>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
        Возможно, ссылка устарела или в адресе опечатка. Вернитесь в каталог —
        там {stats.recipes}{" "}
        {plural(stats.recipes, "блюдо", "блюда", "блюд")} из {stats.countries}{" "}
        стран.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-bold text-cream transition hover:bg-forest"
        >
          <ArrowLeft className="size-3.5" />
          На главную
        </Link>
        <Link
          to="/pantry"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2.5 text-[12.5px] font-bold text-ink transition hover:border-forest"
        >
          <Sparkles className="size-3.5 text-terracotta" />
          Подобрать по продуктам
        </Link>
      </div>
    </section>
  );
}
