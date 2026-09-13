import type { Ingredient, TodaySnapshot } from "./domain";

export const demoInventory: Ingredient[] = [
  { id: "chicken", name: "鸡胸肉", category: "禽类", quantity: 400, unit: "g", purchasePrice: 9, expiryDate: "2026-09-14", caloriesPer100g: 133, proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 3 },
  { id: "broccoli", name: "西兰花", category: "蔬菜", quantity: 300, unit: "g", purchasePrice: 4, expiryDate: "2026-09-13", caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4 },
  { id: "carrot", name: "胡萝卜", category: "蔬菜", quantity: 200, unit: "g", purchasePrice: 2, expiryDate: "2026-09-16", caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2 },
  { id: "egg", name: "鸡蛋", category: "蛋类", quantity: 6, unit: "个", purchasePrice: 6, expiryDate: "2026-09-20", caloriesPer100g: 143, proteinPer100g: 12.6, carbsPer100g: 0.7, fatPer100g: 9.5 },
  { id: "pumpkin", name: "贝贝南瓜", category: "蔬菜", quantity: 500, unit: "g", purchasePrice: 5, expiryDate: "2026-09-18", caloriesPer100g: 45, proteinPer100g: 1.1, carbsPer100g: 10, fatPer100g: 0.1 },
];

export const demoToday: TodaySnapshot = {
  calories: 1420, protein: 96, steps: 7820, sleepHours: 7.5,
  meals: {
    breakfast: [{ foodName: "鸡蛋 + 贝贝南瓜 + 西兰花", quantity: 1, unit: "份", calories: 420, protein: 24, carbs: 38, fat: 16 }],
    lunch: [{ foodName: "公司解决", quantity: 1, unit: "份", calories: 600, protein: 38, carbs: 68, fat: 18 }],
    dinner: [], snack: [],
  },
};
