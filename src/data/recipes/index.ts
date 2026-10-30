import type { Category, Recipe } from "@/types";
import { asiaRecipes } from "./asia";
import { asiaRecipes2 } from "./asia2";
import { europeRecipes } from "./europe";
import { europeRecipes2 } from "./europe2";
import { europeRecipes3 } from "./europe3";
import { americasRecipes } from "./americas";
import { americasRecipes2 } from "./americas2";
import { africaOceaniaRecipes } from "./africa-oceania";
import { africaOceaniaRecipes2 } from "./africa-oceania2";
import { catalogRecipes } from "@/data/catalog";
import { dualHeatFor } from "@/data/catalog/build";
import { validateCatalog } from "@/data/catalog/validate";
import { pluralizeUnit } from "@/lib/utils";

/**
 * Старое ядро каталога писалось до появления двухтенового режима.
 * Достраиваем профиль по шагам: если в приготовлении просят перевернуть —
 * блюду нужен переворот, иначе оно готовится без него. Заодно согласуем
 * штучные единицы («2 зубчика», «6 зубчиков»).
 */
const prepare = (recipe: Recipe): Recipe => {
  const base = recipe.dualHeat
    ? recipe
    : {
        ...recipe,
        dualHeat: dualHeatFor(
          recipe.category,
          !recipe.steps.some((step) =>
            /переверн/i.test(`${step.title} ${step.text}`),
          ),
        ),
      };

  return {
    ...base,
    ingredients: base.ingredients.map((item) => ({
      ...item,
      unit: pluralizeUnit(item.amount, item.unit),
    })),
  };
};

const prepareAll = (list: Recipe[]): Recipe[] => list.map(prepare);

export const recipes: Recipe[] = prepareAll([
  ...asiaRecipes,
  ...asiaRecipes2,
  ...europeRecipes,
  ...europeRecipes2,
  ...europeRecipes3,
  ...americasRecipes,
  ...americasRecipes2,
  ...africaOceaniaRecipes,
  ...africaOceaniaRecipes2,
  ...catalogRecipes,
]).sort((a, b) => a.title.localeCompare(b.title, "ru"));

if (import.meta.env.DEV) {
  validateCatalog(recipes);
}

export const categoryMeta: Record<
  Category,
  { emoji: string; description: string }
> = {
  Птица: {
    emoji: "🍗",
    description: "Крылья, филе, целые тушки — от карааге до табака",
  },
  Мясо: {
    emoji: "🥩",
    description: "Свинина, говядина и баранина с корочкой",
  },
  Рыба: {
    emoji: "🐟",
    description: "Стейки, филе и котлеты без сухости",
  },
  Овощи: {
    emoji: "🥕",
    description: "Гарниры и самостоятельные блюда",
  },
  Выпечка: {
    emoji: "🥟",
    description: "Пироги, булочки и сырные шарики",
  },
  Закуски: {
    emoji: "🌮",
    description: "На компанию, к фильму и к бокалу вина",
  },
  Субпродукты: {
    emoji: "🍢",
    description: "Сердце, печень и другие смелые блюда",
  },
};

export const categories = Object.keys(categoryMeta) as Category[];

export const cuisines = Array.from(new Set(recipes.map((r) => r.cuisine))).sort(
  (a, b) => a.localeCompare(b, "ru"),
);

export const countries = Array.from(
  new Set(recipes.map((r) => r.country)),
).sort((a, b) => a.localeCompare(b, "ru"));

export const stats = {
  recipes: recipes.length,
  cuisines: cuisines.length,
  countries: countries.length,
  categories: categories.length,
  dualHeat: recipes.filter((recipe) => recipe.dualHeat).length,
  noFlip: recipes.filter((recipe) => recipe.dualHeat?.noFlip).length,
};

export function getRecipeBySlug(slug: string | undefined): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function getRelatedRecipes(recipe: Recipe, limit = 3): Recipe[] {
  const sameCategory = recipes.filter(
    (item) => item.id !== recipe.id && item.category === recipe.category,
  );
  const sameCuisine = recipes.filter(
    (item) =>
      item.id !== recipe.id &&
      item.cuisine === recipe.cuisine &&
      item.category !== recipe.category,
  );
  const rest = recipes.filter(
    (item) =>
      item.id !== recipe.id &&
      item.category !== recipe.category &&
      item.cuisine !== recipe.cuisine,
  );

  return [...sameCuisine, ...sameCategory, ...rest].slice(0, limit);
}

export function categoryCount(category: Category): number {
  return recipes.filter((recipe) => recipe.category === category).length;
}
