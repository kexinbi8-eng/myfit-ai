export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type Goal = {
  targetWeight?: number; targetWaist?: number; targetBodyFat?: number;
  dailyCalorieTarget: number; dailyProteinTarget: number; dailyStepTarget: number; weeklyWorkoutTarget: number;
};

export type Ingredient = {
  id: string; name: string; category: string; quantity: number; unit: string;
  purchasePrice?: number; expiryDate?: string; caloriesPer100g: number; proteinPer100g: number;
  carbsPer100g: number; fatPer100g: number; storageMethod?: string;
};

export type MealItem = { foodName: string; quantity: number; unit: string; calories: number; protein: number; carbs: number; fat: number };
export type TodaySnapshot = { calories: number; protein: number; steps: number; sleepHours: number; meals: Record<MealType, MealItem[]> };

export const DEFAULT_GOAL: Goal = { dailyCalorieTarget: 1900, dailyProteinTarget: 130, dailyStepTarget: 8000, weeklyWorkoutTarget: 4 };
