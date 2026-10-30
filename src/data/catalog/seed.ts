import type { Category, Difficulty, TipKind, Tone } from "@/types";

/** [название, количество, единица, необязательный?] */
export type SeedIngredient = [
  name: string,
  amount: number,
  unit: string,
  optional?: boolean,
];

/** [заголовок, текст, температура?, время?, совет?] */
export type SeedStep = [
  title: string,
  text: string,
  temp?: number,
  time?: number,
  tip?: string,
];

/** [тип совета, текст] */
export type SeedTip = [kind: TipKind, text: string];

/**
 * Компактное описание реального блюда национальной кухни,
 * адаптированного под аэрогриль с верхним и нижним теном.
 */
export interface Seed {
  /** Уникальный латинский slug с префиксом региона, например "eu-it-pizza". */
  slug: string;
  title: string;
  country: string;
  /** Прилагательное: «Итальянская». */
  cuisine: string;
  category: Category;
  flag: string;
  emoji: string;
  tone: Tone;
  subtitle: string;
  description: string;
  difficulty: Difficulty;
  servings: number;
  /** Минуты активной подготовки. */
  prepTime: number;
  /** Минуты в аэрогриле. */
  time: number;
  /** °C. */
  temp: number;
  /** ккал на порцию. */
  kcal: number;
  /** true — нижний тен прогревает низ, переворачивать не нужно. */
  noFlip: boolean;
  /** Как ведут себя два тена. Если не задано — шаблон по категории. */
  note?: string;
  tags: string[];
  /** 4–10 основных продуктов, без соли/перца/масла. */
  ingredients: SeedIngredient[];
  /** 3–5 шагов; у шага приготовления указать temp/time. */
  steps: SeedStep[];
  /** 2–4 совета. Если не задано — шаблон по категории. */
  tips?: SeedTip[];
  /** По умолчанию true. */
  preheat?: boolean;
}
