import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Плавно округляет количество до кулинарной дроби. */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";

  const rounded = Math.round(value * 100) / 100;
  if (rounded >= 20) return String(Math.round(rounded));
  if (Number.isInteger(rounded)) return String(rounded);

  const whole = Math.floor(rounded);
  const fraction = rounded - whole;
  const fractions: Array<[number, string]> = [
    [0, ""],
    [0.125, "⅛"],
    [0.2, "⅕"],
    [0.25, "¼"],
    [0.333, "⅓"],
    [0.375, "⅜"],
    [0.4, "⅖"],
    [0.5, "½"],
    [0.6, "⅗"],
    [0.625, "⅝"],
    [0.666, "⅔"],
    [0.75, "¾"],
    [0.8, "⅘"],
    [0.875, "⅞"],
    [1, ""],
  ];

  let closest = fractions[0];
  for (const candidate of fractions) {
    if (
      Math.abs(candidate[0] - fraction) <
      Math.abs(closest[0] - fraction)
    ) {
      closest = candidate;
    }
  }

  const pretty = closest[1] || (whole > 0 ? "" : "—");
  if (!pretty) {
    return whole > 0 ? String(whole) : String(Math.round(rounded * 10) / 10);
  }
  return whole > 0 ? `${whole}${pretty}` : pretty;
}

/** Пересчитывает количество ингредиента под новое число порций. */
export function scaleAmount(
  amount: number,
  baseServings: number,
  servings: number,
): number {
  if (!amount || !baseServings) return amount;
  return (amount * servings) / baseServings;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} ч ${rest} мин` : `${hours} ч`;
}

export function plural(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const unitForms: Record<string, [string, string, string]> = {
  "зубчик": ["зубчик", "зубчика", "зубчиков"],
  "лист": ["лист", "листа", "листьев"],
  "пучок": ["пучок", "пучка", "пучков"],
  "перо": ["перо", "пера", "перьев"],
  "стебель": ["стебель", "стебля", "стеблей"],
  "веточка": ["веточка", "веточки", "веточек"],
  "початок": ["початок", "початка", "початков"],
  // формы, которыми единицы записаны в данных
  "зубчика": ["зубчик", "зубчика", "зубчиков"],
  "листа": ["лист", "листа", "листьев"],
  "листов": ["лист", "листа", "листьев"],
  "пучка": ["пучок", "пучка", "пучков"],
  "пера": ["перо", "пера", "перьев"],
  "стебля": ["стебель", "стебля", "стеблей"],
  "веточки": ["веточка", "веточки", "веточек"],
  "початка": ["початок", "початка", "початков"],
};

/** Согласует штучную единицу с количеством: 1 зубчик, 3 зубчика, 6 зубчиков. */
export function pluralizeUnit(amount: number, unit: string): string {
  const forms = unitForms[unit];
  if (!forms) return unit;
  if (!Number.isInteger(amount)) return forms[1];
  return plural(amount, forms[0], forms[1], forms[2]);
}

export function joinList(items: string[], limit = 3): string {
  const visible = items.slice(0, limit);
  const rest = items.length - visible.length;
  const base = visible.join(", ");
  return rest > 0 ? `${base} и ещё ${rest}` : base;
}
