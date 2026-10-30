import type { Recipe } from "@/types";
import { buildRecipes } from "./build";
import { fromCompact, type CompactSeed } from "./compact";
import type { Seed } from "./seed";
import { americasSeeds } from "./seeds-americas";
import { asiaSeeds } from "./seeds-asia";
import { europeSouthSeeds } from "./seeds-europe-south";
import { northOceaniaSeeds } from "./seeds-north";
import { africaSeeds1 } from "./seeds-africa-1";
import { africaSeeds2 } from "./seeds-africa-2";
import { asiaSeeds1 } from "./seeds-asia-1";
import { europeSouthSeeds1 } from "./seeds-europe-south-1";
import { europeCentralSeeds1 } from "./seeds-europe-central-1";
import { europeCentralSeeds2 } from "./seeds-europe-central-2";
import { menaCaucasusSeeds1 } from "./seeds-mena-1";
import { northOceaniaSeeds1 } from "./seeds-north-1";

const compact = (...files: CompactSeed[][]): Seed[] =>
  files.flat().map(fromCompact);

export const catalogRecipes: Recipe[] = buildRecipes([
  ...americasSeeds,
  ...asiaSeeds,
  ...europeSouthSeeds,
  ...northOceaniaSeeds,
  ...compact(
    africaSeeds1,
    africaSeeds2,
    asiaSeeds1,
    europeSouthSeeds1,
    europeCentralSeeds1,
    europeCentralSeeds2,
    menaCaucasusSeeds1,
    northOceaniaSeeds1,
  ),
]);
