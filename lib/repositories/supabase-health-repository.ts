import type { Goal, Ingredient, TodaySnapshot } from "@/lib/domain";
import { supabaseRest } from "@/lib/supabase/env";

type SupabaseIngredient = { id: string; name: string; category: string; calories_per_100g: number; protein_per_100g: number; carbs_per_100g: number; fat_per_100g: number; };
type SupabaseInventory = { id: string; ingredient_id: string; quantity: number; unit: string; purchase_price?: number; expiry_date?: string; ingredients: SupabaseIngredient };

const profileId = () => process.env.MYFIT_PROFILE_ID || "00000000-0000-0000-0000-000000000001";

export async function getSupabaseGoals(): Promise<Goal> {
  const rows = await supabaseRest<Array<{ daily_calorie_target: number; daily_protein_target: number; daily_step_target: number; weekly_workout_target: number; target_weight?: number; target_waist?: number; target_body_fat?: number }>>(`goals?profile_id=eq.${profileId()}&select=*`);
  const goal = rows[0];
  if (!goal) throw new Error("Supabase goals not found");
  return { dailyCalorieTarget: goal.daily_calorie_target, dailyProteinTarget: goal.daily_protein_target, dailyStepTarget: goal.daily_step_target, weeklyWorkoutTarget: goal.weekly_workout_target, targetWeight: goal.target_weight, targetWaist: goal.target_waist, targetBodyFat: goal.target_body_fat };
}

export async function getSupabaseInventory(): Promise<Ingredient[]> {
  const rows = await supabaseRest<SupabaseInventory[]>(`inventory?profile_id=eq.${profileId()}&quantity=gt.0&select=*,ingredients(*)&order=expiry_date.asc.nullslast`);
  return rows.map((row) => ({ id: row.id, name: row.ingredients.name, category: row.ingredients.category, quantity: row.quantity, unit: row.unit, purchasePrice: row.purchase_price, expiryDate: row.expiry_date, caloriesPer100g: row.ingredients.calories_per_100g, proteinPer100g: row.ingredients.protein_per_100g, carbsPer100g: row.ingredients.carbs_per_100g, fatPer100g: row.ingredients.fat_per_100g }));
}

export async function getSupabaseToday(): Promise<TodaySnapshot> {
  const today = new Date().toISOString().slice(0, 10);
  const [logs, meals] = await Promise.all([
    supabaseRest<Array<{ calories: number; protein: number; steps: number }>>(`daily_logs?profile_id=eq.${profileId()}&log_date=eq.${today}&select=calories,protein,steps`),
    supabaseRest<Array<{ meal_type: "breakfast" | "lunch" | "dinner" | "snack"; meal_items: Array<{ food_name: string; quantity: number; unit: string; calories: number; protein: number; carbs: number; fat: number }> }>>(`meal_records?profile_id=eq.${profileId()}&log_date=eq.${today}&select=meal_type,meal_items(*)`),
  ]);
  const snapshot: TodaySnapshot = { calories: logs[0]?.calories || 0, protein: logs[0]?.protein || 0, steps: logs[0]?.steps || 0, sleepHours: 0, meals: { breakfast: [], lunch: [], dinner: [], snack: [] } };
  for (const meal of meals) snapshot.meals[meal.meal_type] = meal.meal_items.map((item) => ({ foodName: item.food_name, quantity: item.quantity, unit: item.unit, calories: item.calories, protein: item.protein, carbs: item.carbs, fat: item.fat }));
  return snapshot;
}
