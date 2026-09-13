import { demoInventory, demoToday } from "../demo-data";
import { DEFAULT_GOAL } from "../domain";
import { getSupabaseGoals, getSupabaseInventory, getSupabaseToday } from "../repositories/supabase-health-repository";
import { getSupabaseConfig } from "../supabase/env";

export const HEALTH_TOOLS = [
  "get_user_profile", "get_goals", "get_today_log", "get_recent_logs", "get_inventory",
  "get_expiring_ingredients", "get_recipe", "get_workout_plan", "get_today_workout",
  "get_workout_history", "get_body_metrics", "get_nutrition_summary", "create_meal_plan",
  "create_recipe", "recommend_workout",
].map((name) => ({ type: "function" as const, name, description: `读取或规划 MyFit AI 的${name}数据。`, parameters: { type: "object", properties: {}, additionalProperties: false, required: [] }, strict: true }));

export async function runHealthTool(name: string, _rawArguments?: string) {
  const useSupabase = getSupabaseConfig().configured;
  switch (name) {
    case "get_goals": return useSupabase ? getSupabaseGoals() : DEFAULT_GOAL;
    case "get_inventory": return useSupabase ? getSupabaseInventory() : demoInventory;
    case "get_expiring_ingredients": { const inventory = useSupabase ? await getSupabaseInventory() : demoInventory; return inventory.filter((item) => item.expiryDate && item.expiryDate <= new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)); }
    case "get_today_log": return useSupabase ? getSupabaseToday() : demoToday;
    case "get_nutrition_summary": { const [goal, today] = await Promise.all([useSupabase ? getSupabaseGoals() : DEFAULT_GOAL, useSupabase ? getSupabaseToday() : demoToday]); return { calories: today.calories, protein: today.protein, remainingCalories: goal.dailyCalorieTarget - today.calories, remainingProtein: goal.dailyProteinTarget - today.protein }; }
    case "get_user_profile": return { displayName: "我的账户", timezone: "Asia/Shanghai" };
    case "get_today_workout": return { focus: "胸 + 三头", exercises: [{ name: "卧推", sets: 4, reps: "8-12" }, { name: "上斜哑铃卧推", sets: 3, reps: "10-12" }] };
    default: return { status: "暂无真实数据", tool: name };
  }
}

export async function buildHealthContext() {
  const useSupabase = getSupabaseConfig().configured;
  const [goals, today, inventory] = await Promise.all([
    useSupabase ? getSupabaseGoals() : DEFAULT_GOAL,
    useSupabase ? getSupabaseToday() : demoToday,
    useSupabase ? getSupabaseInventory() : demoInventory,
  ]);
  return JSON.stringify({ profile: { displayName: "我的账户", timezone: "Asia/Shanghai" }, goals, today, inventory }, null, 2);
}
