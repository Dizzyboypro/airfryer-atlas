import type { Recipe } from "@/types";

/** Проверка целостности каталога в dev-режиме. Возвращает список проблем. */
export function validateCatalog(recipes: Recipe[]): string[] {
  const problems: string[] = [];
  const slugCount = new Map<string, number>();
  const titleCount = new Map<string, string[]>();

  for (const recipe of recipes) {
    slugCount.set(recipe.slug, (slugCount.get(recipe.slug) ?? 0) + 1);
    titleCount.set(recipe.title, [
      ...(titleCount.get(recipe.title) ?? []),
      recipe.country,
    ]);

    if (!/^[a-z0-9-]+$/.test(recipe.slug)) {
      problems.push(`slug: ${recipe.slug}`);
    }
    if (!recipe.dualHeat) problems.push(`dualHeat: ${recipe.slug}`);
    if (recipe.temp < 150 || recipe.temp > 230) {
      problems.push(`temp ${recipe.temp}: ${recipe.slug}`);
    }
    if (recipe.time < 4 || recipe.time > 60) {
      problems.push(`time ${recipe.time}: ${recipe.slug}`);
    }
    if (recipe.prepTime < 3 || recipe.prepTime > 60) {
      problems.push(`prepTime ${recipe.prepTime}: ${recipe.slug}`);
    }
    if (recipe.totalTime < recipe.time) {
      problems.push(`totalTime: ${recipe.slug}`);
    }
    if (recipe.kcal < 80 || recipe.kcal > 900) {
      problems.push(`kcal ${recipe.kcal}: ${recipe.slug}`);
    }
    if (recipe.ingredients.length < 3) {
      problems.push(`ingredients: ${recipe.slug}`);
    }
    if (recipe.steps.length < 2) {
      problems.push(`steps: ${recipe.slug}`);
    }
    if (
      !recipe.steps.some(
        (step) => step.temp !== undefined || step.time !== undefined,
      )
    ) {
      problems.push(`no timed step: ${recipe.slug}`);
    }
    if (recipe.tips.length === 0) {
      problems.push(`no tips: ${recipe.slug}`);
    }
  }

  for (const [slug, count] of slugCount) {
    if (count > 1) problems.push(`duplicate slug x${count}: ${slug}`);
  }

  for (const [title, countries] of titleCount) {
    if (countries.length > 1) {
      problems.push(`duplicate title x${countries.length}: ${title}`);
    }
  }

  if (problems.length > 0) {
    console.warn(`[catalog] ${problems.length} problems`, problems);
  }

  return problems;
}
