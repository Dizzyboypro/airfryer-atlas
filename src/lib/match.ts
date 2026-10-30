import { recipes } from "@/data/recipes";
import type { MatchResult, Recipe } from "@/types";

/**
 * Базовые продукты, которые есть на любой кухне.
 * Они не участвуют в расчёте совпадения и не попадают в «не хватает».
 */
export const BASE_INGREDIENTS = new Set([
  "соль",
  "перец черный",
  "масло растительное",
  "оливковое масло",
  "сливочное масло",
  "вода",
  "сахар",
]);

/** Обобщающие слова, которые пользователь может ввести вручную. */
const SYNONYMS: Record<string, string[]> = {
  курица: [
    "куриное филе",
    "куриное бедро",
    "куриные крылья",
    "куриный фарш",
    "цыплёнок",
  ],
  "куриная грудка": ["куриное филе"],
  картошка: ["картофель"],
  помидоры: ["помидор"],
  томаты: ["помидор"],
  яйца: ["яйцо"],
  сыр: ["сыр", "моцарелла", "пармезан", "сыр проволоне"],
  рыба: ["треска", "лосось", "филе белой рыбы"],
  фарш: ["куриный фарш", "говяжий фарш", "бараний фарш"],
  зелень: ["петрушка", "укроп", "кинза", "базилик", "зелёный лук"],
  перец: ["болгарский перец"],
  масло: ["сливочное масло", "оливковое масло", "масло растительное"],
  булочка: ["булочки"],
  оливка: ["оливки"],
  кабачок: ["цукини"],
  "лук репчатый": ["лук"],
  "куриная печень": ["печень куриная"],
  печень: ["печень куриная"],
  сердечки: ["куриные сердечки"],
  ребрышки: ["свиные рёбрышки"],
  "свиные ребра": ["свиные рёбрышки"],
  "капуста цветная": ["цветная капуста"],
  горох: ["горошек"],
  "зеленый горошек": ["горошек"],
  "фасоль красная": ["фасоль"],
  "кукуруза в початках": ["кукуруза"],
  кумара: ["батат"],
  тесто: ["слоёное тесто"],
  барбекю: ["соус барбекю"],
  "пери-пери": ["соус пери-пери"],
};

export function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[().,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBaseIngredient(name: string): boolean {
  return BASE_INGREDIENTS.has(normalizeIngredient(name));
}

/**
 * Ищет канонические названия продуктов с учётом синонимов и частичного ввода.
 * Например, «картош» находит «картофель», а «курица» — все виды курицы.
 */
export function searchIngredientNames(query: string, names: string[]): string[] {
  const q = normalizeIngredient(query);
  if (!q) return [];

  const targets = new Set<string>([q]);

  for (const [key, values] of Object.entries(SYNONYMS)) {
    const synonymKey = normalizeIngredient(key);
    if (synonymKey.startsWith(q)) {
      targets.add(synonymKey);
      for (const value of values) targets.add(normalizeIngredient(value));
    }
  }

  for (const value of SYNONYMS[q] ?? []) {
    targets.add(normalizeIngredient(value));
  }

  return names
    .filter((name) => {
      const normalized = normalizeIngredient(name);
      return normalized.includes(q) || targets.has(normalized);
    })
    .sort((a, b) => {
      const aStarts = normalizeIngredient(a).startsWith(q) ? 0 : 1;
      const bStarts = normalizeIngredient(b).startsWith(q) ? 0 : 1;
      return aStarts - bStarts || a.localeCompare(b, "ru");
    });
}

/** Разворачивает введённые продукты с учётом синонимов. */
export function expandPantry(items: string[]): Set<string> {
  const available = new Set<string>();

  for (const item of items) {
    const key = normalizeIngredient(item);
    if (!key) continue;
    available.add(key);
    for (const synonym of SYNONYMS[key] ?? []) {
      available.add(normalizeIngredient(synonym));
    }
  }

  return available;
}

export function matchRecipe(recipe: Recipe, pantry: string[]): MatchResult {
  const available = expandPantry(pantry);
  const required = recipe.ingredients.filter(
    (ingredient) =>
      !ingredient.optional && !isBaseIngredient(ingredient.name),
  );

  const have: string[] = [];
  const missing: string[] = [];

  for (const ingredient of required) {
    if (available.has(normalizeIngredient(ingredient.name))) {
      have.push(ingredient.name);
    } else {
      missing.push(ingredient.name);
    }
  }

  const percent =
    required.length === 0
      ? 100
      : Math.round((have.length / required.length) * 100);

  return {
    recipe,
    percent,
    have,
    missing,
    baseUsed: recipe.ingredients
      .filter((ingredient) => isBaseIngredient(ingredient.name))
      .map((ingredient) => ingredient.name),
  };
}

/**
 * Подбирает рецепты по продуктам.
 * @param pantry — список продуктов пользователя
 * @param minPercent — порог совпадения (100 для строгого режима, 70 для мягкого)
 */
export function findMatches(pantry: string[], minPercent = 70): MatchResult[] {
  if (pantry.length === 0) return [];

  return recipes
    .map((recipe) => matchRecipe(recipe, pantry))
    .filter((result) => result.percent >= minPercent)
    .sort((a, b) => {
      if (b.percent !== a.percent) return b.percent - a.percent;
      if (a.missing.length !== b.missing.length) {
        return a.missing.length - b.missing.length;
      }
      return a.recipe.totalTime - b.recipe.totalTime;
    });
}

export function missingLabel(missing: string[]): string {
  if (missing.length === 0) return "Всё есть";
  return `Не хватает: ${missing.join(", ")}`;
}
