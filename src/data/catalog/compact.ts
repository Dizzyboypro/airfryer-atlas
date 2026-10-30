import type { Category, Difficulty, Tone } from "@/types";
import type { Seed, SeedIngredient, SeedStep, SeedTip } from "./seed";

/**
 * Компактная запись рецепта — та же Seed, но позиционными полями.
 * Порядок: slug, title, country, cuisine, category, flag, emoji, tone,
 * subtitle, description, difficulty, servings, prepTime, time, temp, kcal,
 * noFlip, ingredients, steps, tags, note?, tips?.
 */
export type CompactSeed = [
  string,
  string,
  string,
  string,
  Category,
  string,
  string,
  Tone,
  string,
  string,
  Difficulty,
  number,
  number,
  number,
  number,
  number,
  boolean,
  SeedIngredient[],
  SeedStep[],
  string[],
  string?,
  SeedTip[]?,
];

export function fromCompact(tuple: CompactSeed): Seed {
  const [
    slug,
    title,
    country,
    cuisine,
    category,
    flag,
    emoji,
    tone,
    subtitle,
    description,
    difficulty,
    servings,
    prepTime,
    time,
    temp,
    kcal,
    noFlip,
    ingredients,
    steps,
    tags,
    note,
    tips,
  ] = tuple;

  return {
    slug,
    title,
    country,
    cuisine,
    category,
    flag,
    emoji,
    tone,
    subtitle,
    description,
    difficulty,
    servings,
    prepTime,
    time,
    temp,
    kcal,
    noFlip,
    ingredients,
    steps,
    tags,
    ...(note ? { note } : {}),
    ...(tips ? { tips } : {}),
  };
}
