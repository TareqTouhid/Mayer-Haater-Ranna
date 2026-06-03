export type IngredientImportance = "must" | "medium" | "optional";

export interface Ingredient {
  name: string;
  nameEn: string;
  amount: string;
  unit: string;
  importance: IngredientImportance;
  keywords: string[];
}

export interface RecipeStep {
  step: number;
  instruction: string;
  timeMinutes: number;
  image: string | null;
}

export interface RecipeLayers {
  motherVoice: {
    text: string;
    note: string;
  };
  kitchenReality: {
    steps: RecipeStep[];
  };
  aiBridge: {
    text: string;
    tips: string[];
  };
}

export interface Recipe {
  id: string;
  motherId: string;
  name: string;
  nameEn: string;
  difficulty: number;
  timeMinutes: number;
  servings: number;
  tags: string[];
  coverImage: string | null;
  stepImages: string[];
  ingredients: Ingredient[];
  layers: RecipeLayers;
}

export interface Mother {
  id: string;
  name: string;
  nameEn: string;
  age: number;
  zilla: string;
  zillaEn: string;
  philosophy: string;
  philosophyEn: string;
  story: string;
  storyEn: string;
  specialties: string[];
  motivation: "legacy" | "income" | "recognition";
  recipeIds: string[];
  avatar: string | null;
  verified: boolean;
}

export interface UserPreferences {
  ingredients: string[];
  spice: "mild" | "medium" | "high";
  mealWeight: "light" | "heavy" | "any";
  rice: "yes" | "no" | "any";
  timeAvailable: number | null;
}

export interface MatchResult {
  recipe: Recipe;
  mother: Mother;
  score: number;
  matchPercent: number;
  coveredIngredients: string[];
  missingMust: string[];
  missingMedium: string[];
  excellenceTips: string[];
}

export interface CookingReview {
  recipeId: string;
  motherId: string;
  rating: number;
  motherRating: number;
  comment: string;
  cookedAt: string;
}
