export type Category =
  | "Мясо"
  | "Рыба"
  | "Птица"
  | "Выпечка"
  | "Овощи"
  | "Закуски"
  | "Субпродукты";

export type Difficulty = "Легко" | "Средне" | "Сложно";

export type Tone =
  | "ember"
  | "olive"
  | "ocean"
  | "saffron"
  | "gold"
  | "berry"
  | "clay";

export type TipKind =
  | "paper"
  | "foil"
  | "flip"
  | "oil"
  | "space"
  | "rest";

export interface Ingredient {
  /** Каноническое название продукта — используется в подборе. */
  name: string;
  /** Количество на базовое число порций. 0 — «по вкусу». */
  amount: number;
  /** г, мл, шт, ст. л., ч. л., зубчик… */
  unit: string;
  /** Продукт не обязателен: не мешает строгому совпадению. */
  optional?: boolean;
  note?: string;
}

export interface Step {
  title: string;
  text: string;
  temp?: number;
  time?: number;
  tip?: string;
}

export interface Tip {
  kind: TipKind;
  text: string;
}

/** Режим для аэрогриля с верхним и нижним нагревательным элементом. */
export interface DualHeatProfile {
  /** Нижний тен прогревает блюдо снизу — переворачивать не нужно. */
  noFlip: boolean;
  /** Как настроить тены и что изменится по сравнению с одним теном. */
  note: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  country: string;
  flag: string;
  cuisine: string;
  category: Category;
  difficulty: Difficulty;
  /** Минуты с учётом подготовки. */
  totalTime: number;
  /** Минуты активной подготовки. */
  prepTime: number;
  /** ккал на одну порцию. */
  kcal: number;
  servings: number;
  /** Температура по умолчанию, °C. */
  temp: number;
  /** Время по умолчанию, мин. */
  time: number;
  preheat: boolean;
  /** Заполнено, если блюдо адаптировано под модели с двумя тенами. */
  dualHeat?: DualHeatProfile;
  tags: string[];
  emoji: string;
  tone: Tone;
  ingredients: Ingredient[];
  steps: Step[];
  tips: Tip[];
}

export interface MatchResult {
  recipe: Recipe;
  /** Доля найденных обязательных ингредиентов, 0–100. */
  percent: number;
  have: string[];
  missing: string[];
  baseUsed: string[];
}
