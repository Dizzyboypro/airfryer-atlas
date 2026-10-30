import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Flame, Heart, Menu, Sparkles, X } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

const links = [
  { label: "Каталог", to: "/#catalog" },
  { label: "Кухни мира", to: "/#cuisines" },
  { label: "Как это работает", to: "/#how" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition duration-300",
        scrolled
          ? "border-line/80 bg-paper/90 shadow-[0_8px_30px_-24px_rgba(43,31,18,0.5)] backdrop-blur-xl"
          : "border-transparent bg-paper/60 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-[74px] items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative grid size-10 shrink-0 place-items-center rounded-[14px] bg-forest text-cream shadow-[0_10px_20px_-12px_rgba(20,61,49,0.9)] transition group-hover:bg-forest-deep">
            <Flame className="size-5" strokeWidth={1.8} />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-terracotta ring-2 ring-paper" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[20px] tracking-[-0.03em] text-ink">
              AirFry Atlas
            </span>
            <span className="mt-1 block text-[9.5px] font-bold uppercase tracking-[0.2em] text-muted">
              мировая кухня · аэрогриль
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-[13.5px] font-semibold text-muted transition hover:bg-cream hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/favorites"
            aria-label="Избранное"
            title="Избранное"
            className="relative grid size-10 place-items-center rounded-full border border-line bg-cream text-ink transition hover:border-terracotta/40 hover:text-terracotta-deep"
          >
            <Heart className="size-[18px]" strokeWidth={1.8} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full bg-terracotta px-1 py-0.5 text-[9px] font-bold leading-none text-cream ring-2 ring-paper">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to="/pantry"
            className="group hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream transition hover:bg-forest sm:inline-flex"
          >
            <Sparkles className="size-4 text-gold" strokeWidth={1.9} />
            Что в холодильнике
            <ArrowUpRight
              className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="grid size-10 place-items-center rounded-full border border-line bg-cream text-ink transition hover:border-line-strong lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-line bg-paper/98 transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr] border-t-0",
        )}
      >
        <div className="min-h-0">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl px-3 py-3 text-[15px] font-semibold text-ink transition hover:bg-cream"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/pantry"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-[14px] font-bold text-cream"
            >
              <Sparkles className="size-4 text-gold" />
              Подобрать по продуктам
            </Link>
            <Link
              to="/favorites"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-cream px-4 py-3 text-[14px] font-bold text-ink"
            >
              <Heart className="size-4 text-terracotta" />
              Избранное
              {favorites.length > 0 && (
                <span className="rounded-full bg-terracotta px-1.5 py-0.5 text-[10px] font-bold text-cream">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
