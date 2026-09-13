import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "app/page.tsx", "app/food/page.tsx", "app/workout/page.tsx", "app/data/page.tsx", "app/profile/page.tsx", "app/coach/page.tsx",
  "app/api/ai/chat/route.ts", "lib/ai/tools.ts", "lib/storage.ts", "supabase/schema.sql", "supabase/seed.sql",
  "public/manifest.webmanifest", "public/sw.js", "public/icon.svg", ".env.example", "lib/supabase/env.ts",
];
const failures = [];
for (const file of required) if (!fs.existsSync(path.join(root, file))) failures.push(`缺少文件: ${file}`);

const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/manifest.webmanifest"), "utf8"));
for (const key of ["name", "short_name", "start_url", "display", "theme_color", "icons"]) if (!(key in manifest)) failures.push(`PWA manifest 缺少字段: ${key}`);

const schema = fs.readFileSync(path.join(root, "supabase/schema.sql"), "utf8").toLowerCase();
for (const table of ["profiles", "goals", "ingredients", "inventory", "recipes", "recipe_ingredients", "daily_logs", "meal_records", "meal_items", "workout_plans", "workout_exercises", "workout_records", "workout_sets", "body_metrics", "sleep_records", "ai_conversations", "ai_messages"]) if (!schema.includes(`create table if not exists ${table}`)) failures.push(`Schema 缺少表: ${table}`);
if (!schema.includes("quantity >= 0") || !schema.includes("consume_inventory") || !schema.includes("consume_recipe_inventory") || !schema.includes("当前库存不足")) failures.push("库存防负数或食谱扣减约束不完整");

const route = fs.readFileSync(path.join(root, "app/api/ai/chat/route.ts"), "utf8");
if (!route.includes("process.env.OPENAI_API_KEY")) failures.push("AI API 未从服务端环境变量读取密钥");
if (route.includes("NEXT_PUBLIC_OPENAI_API_KEY")) failures.push("AI 密钥疑似暴露为 NEXT_PUBLIC 环境变量");
if (!route.includes("function_call") || !route.includes("function_call_output")) failures.push("AI function calling 闭环缺失");

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`MyFit AI validation passed: ${required.length} required files, PWA, schema, AI boundary and inventory invariants.`);
