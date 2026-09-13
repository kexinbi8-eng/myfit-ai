"use client";

import { useState } from "react";
import { ArrowLeft, ChefHat, Plus, Sparkles, Utensils } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";
import type { Ingredient } from "@/lib/domain";

type MealRecord = { date: string; name: string; calories: number; protein: number };
const recipes = [{ name: "鸡胸肉西兰花炒胡萝卜", calories: 520, protein: 48, cost: "约 ¥8.5", used: ["鸡胸肉", "西兰花", "胡萝卜"] }, { name: "西兰花鸡蛋南瓜碗", calories: 460, protein: 26, cost: "约 ¥5.5", used: ["西兰花", "鸡蛋", "贝贝南瓜"] }];

export default function FoodPage() {
  const [tab, setTab] = useState("今日");
  const [inventory, setInventory] = useLocalStorage<Ingredient[]>("myfit-inventory", []);
  const [meals, setMeals] = useLocalStorage<MealRecord[]>("myfit-meal-records", []);
  const [foodName, setFoodName] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  const dinner = meals.find((meal) => meal.date.slice(0, 10) === new Date().toISOString().slice(0, 10));
  function addIngredient() { if (!foodName.trim() || !foodWeight) return; setInventory((items) => [{ id: crypto.randomUUID(), name: foodName.trim(), category: "未分类", quantity: Number(foodWeight), unit: "g", caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 }, ...items]); setFoodName(""); setFoodWeight(""); }
  function addRecipe(recipe: typeof recipes[number]) { const missing = recipe.used.filter((name) => !inventory.some((item) => item.name === name && item.quantity > 0)); if (missing.length) { window.alert(`当前库存不足：${missing.join("、")}`); return; } setMeals((current) => [{ date: new Date().toISOString(), name: recipe.name, calories: recipe.calories, protein: recipe.protein }, ...current]); setTab("今日"); }
  return <Page title="饮食" onBack={() => window.location.href = "/"}><div className="subtabs">{["今日", "食材", "食谱", "营养"].map((item) => <button key={item} className={tab === item ? "subtab active" : "subtab"} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === "今日" && <><div className="nutrition-hero"><div><span>今日摄入</span><strong>{dinner?.calories || 0}<small> / 1,900 kcal</small></strong></div><div><span>蛋白质</span><strong>{dinner?.protein || 0}<small> / 130 g</small></strong></div></div><div className="page-card"><h3>三餐记录</h3>{[["早餐", "还没有记录"], ["午餐", "还没有记录"], ["晚餐", dinner?.name || "还没有记录"]].map(([name, food]) => <div className="food-row" key={name}><div><span>{name}</span><strong>{food}</strong></div>{name === "晚餐" && !dinner ? <button className="small-button" onClick={() => setTab("食谱")}>添加</button> : null}</div>)}</div><button className="ai-card food-ai" onClick={() => setTab("食谱")}><span className="ai-icon"><Sparkles size={17} /></span><span><b>AI 帮我做饭</b><small>根据你自己添加的库存生成建议</small></span><span>›</span></button></>}
    {tab === "食材" && <><div className="page-card"><div className="card-title"><div><span className="eyebrow">库存管理</span><h3>我的食材</h3></div><span className="count-badge">{inventory.length} 种</span></div>{inventory.length === 0 ? <p className="empty-state">还没有食材，请在下方添加。</p> : inventory.map((item) => <div className="inventory-row" key={item.id}><div className="ingredient-dot"><ChefHat size={16} /></div><div><strong>{item.name}</strong><span>{item.category}</span></div><b>{item.quantity}{item.unit}</b></div>)}</div><div className="add-ingredient"><input value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="食材名称" /><input value={foodWeight} onChange={(e) => setFoodWeight(e.target.value)} inputMode="numeric" placeholder="重量" /><button onClick={addIngredient}><Plus size={18} /> 保存</button></div></>}
    {tab === "食谱" && <><div className="section-heading"><h3>根据库存选择</h3><span className="muted-label">已有 {inventory.length} 种食材</span></div>{recipes.map((recipe) => <div className="recipe-card" key={recipe.name}><div className="recipe-art"><Utensils size={25} /></div><div className="recipe-info"><span>减脂 · 高蛋白</span><h3>{recipe.name}</h3><p>{recipe.calories} kcal · 蛋白质 {recipe.protein}g · {recipe.cost}</p></div><button onClick={() => addRecipe(recipe)}>加入晚餐</button></div>)}</>}
    {tab === "营养" && <div className="page-card"><h3>今日营养分布</h3><div className="macro-grid"><div><strong>{dinner?.calories || 0}</strong><span>热量 kcal</span></div><div><strong>{dinner?.protein || 0}g</strong><span>蛋白质</span></div><div><strong>—</strong><span>碳水</span></div><div><strong>—</strong><span>脂肪</span></div></div><p className="muted-copy">记录饮食后，这里会显示今日营养数据。</p></div>}
  </Page>;
}
function Page({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) { return <main className="page-shell"><header className="inner-topbar"><button onClick={onBack} className="back-button"><ArrowLeft size={20} /></button><h1>{title}</h1><span /></header><div className="inner-content">{children}</div><BottomNav active="饮食" /></main>; }
function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}><span>{label}</span></button>)}</nav>; }
