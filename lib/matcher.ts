import type { Recipe, Mother, UserPreferences, MatchResult } from "./types";

function normalizeInput(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

function ingredientMatches(userIngredients: string[], keywords: string[]): boolean {
  const normalized = userIngredients.map(normalizeInput);
  return keywords.some((kw) =>
    normalized.some((ui) => ui.includes(normalizeInput(kw)) || normalizeInput(kw).includes(ui))
  );
}

export function scoreRecipe(
  recipe: Recipe,
  prefs: UserPreferences
): {
  score: number;
  matchPercent: number;
  coveredIngredients: string[];
  missingMust: string[];
  missingMedium: string[];
  excellenceTips: string[];
} {
  const must = recipe.ingredients.filter((i) => i.importance === "must");
  const medium = recipe.ingredients.filter((i) => i.importance === "medium");
  const optional = recipe.ingredients.filter((i) => i.importance === "optional");

  const coveredMust = must.filter((i) => ingredientMatches(prefs.ingredients, i.keywords));
  const coveredMedium = medium.filter((i) => ingredientMatches(prefs.ingredients, i.keywords));
  const coveredOptional = optional.filter((i) => ingredientMatches(prefs.ingredients, i.keywords));

  const missingMust = must.filter((i) => !ingredientMatches(prefs.ingredients, i.keywords));
  const missingMedium = medium.filter((i) => !ingredientMatches(prefs.ingredients, i.keywords));
  const missingOptional = optional.filter((i) => !ingredientMatches(prefs.ingredients, i.keywords));

  // Score: must = 3pts, medium = 1.5pts, optional = 0.5pts
  const maxScore =
    must.length * 3 + medium.length * 1.5 + optional.length * 0.5;
  const earnedScore =
    coveredMust.length * 3 +
    coveredMedium.length * 1.5 +
    coveredOptional.length * 0.5;

  // If missing any must-have, heavily penalize
  const mustPenalty = missingMust.length > 0 ? missingMust.length * 2 : 0;
  const rawScore = maxScore > 0 ? (earnedScore - mustPenalty) / maxScore : 0;
  const score = Math.max(0, rawScore);

  // Match % based on covered ingredients out of total non-optional
  const totalCore = must.length + medium.length;
  const coveredCore = coveredMust.length + coveredMedium.length;
  const matchPercent = totalCore > 0 ? Math.round((coveredCore / totalCore) * 100) : 0;

  // Time constraint
  if (prefs.timeAvailable && recipe.timeMinutes > prefs.timeAvailable + 10) {
    // soft penalty
  }

  // Excellence tips: what missing medium/optional items would improve the dish
  const excellenceTips: string[] = [];
  missingMedium.forEach((i) => {
    excellenceTips.push(`${i.name} (${i.nameEn}) থাকলে আরও ভালো হতো`);
  });
  missingOptional.forEach((i) => {
    excellenceTips.push(`${i.name} (${i.nameEn}) দিলে স্বাদে আলাদা মাত্রা আসতো`);
  });

  const coveredIngredients = [
    ...coveredMust.map((i) => i.name),
    ...coveredMedium.map((i) => i.name),
    ...coveredOptional.map((i) => i.name),
  ];

  return {
    score,
    matchPercent,
    coveredIngredients,
    missingMust: missingMust.map((i) => `${i.name} (${i.nameEn})`),
    missingMedium: missingMedium.map((i) => i.name),
    excellenceTips,
  };
}

export function findBestMatch(
  recipes: Recipe[],
  mothers: Mother[],
  prefs: UserPreferences
): MatchResult | null {
  if (prefs.ingredients.length === 0) return null;

  const results = recipes
    .map((recipe) => {
      const mother = mothers.find((m) => m.id === recipe.motherId);
      if (!mother) return null;
      const scored = scoreRecipe(recipe, prefs);
      // Must have at least one must-have ingredient covered to be viable
      const mustIngredients = recipe.ingredients.filter((i) => i.importance === "must");
      const coveredMustCount = mustIngredients.filter((i) =>
        ingredientMatches(prefs.ingredients, i.keywords)
      ).length;
      if (coveredMustCount === 0) return null;
      return { recipe, mother, ...scored };
    })
    .filter(Boolean) as MatchResult[];

  if (results.length === 0) return null;

  results.sort((a, b) => b.score - a.score);
  return results[0];
}

export function findAlternatives(
  recipes: Recipe[],
  mothers: Mother[],
  prefs: UserPreferences,
  excludeId: string
): MatchResult[] {
  const results = recipes
    .filter((r) => r.id !== excludeId)
    .map((recipe) => {
      const mother = mothers.find((m) => m.id === recipe.motherId);
      if (!mother) return null;
      const scored = scoreRecipe(recipe, prefs);
      const mustIngredients = recipe.ingredients.filter((i) => i.importance === "must");
      const coveredMustCount = mustIngredients.filter((i) =>
        ingredientMatches(prefs.ingredients, i.keywords)
      ).length;
      if (coveredMustCount === 0) return null;
      return { recipe, mother, ...scored };
    })
    .filter(Boolean) as MatchResult[];

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 3);
}
