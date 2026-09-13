import type { Goal, Ingredient, TodaySnapshot } from "@/lib/domain";
import { DEFAULT_GOAL } from "@/lib/domain";
import { demoInventory, demoToday } from "@/lib/demo-data";

export type HealthRepository = {
  getGoals(): Promise<Goal>;
  getInventory(): Promise<Ingredient[]>;
  getTodaySnapshot(): Promise<TodaySnapshot>;
  consumeInventory(id: string, quantity: number): Promise<Ingredient[]>;
};

/**
 * The first repository is intentionally local so the app is useful before Supabase credentials exist.
 * Replace this implementation with the Supabase adapter without changing UI or AI tools.
 */
export const localHealthRepository: HealthRepository = {
  async getGoals() { return DEFAULT_GOAL; },
  async getInventory() { return demoInventory; },
  async getTodaySnapshot() { return demoToday; },
  async consumeInventory(id, quantity) {
    const item = demoInventory.find((entry) => entry.id === id);
    if (!item || item.quantity < quantity) throw new Error("当前库存不足");
    return demoInventory.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity - quantity } : entry);
  },
};
