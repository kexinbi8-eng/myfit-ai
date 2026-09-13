"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Settings2, Target, UserRound } from "lucide-react";
import { DEFAULT_GOAL } from "@/lib/domain";
import { useLocalStorage } from "@/lib/storage";

type Profile = { height: number | ""; weight: number | "" };

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useLocalStorage<Profile>("myfit-profile", { height: "", weight: "" });
  const [goal, setGoal] = useLocalStorage("myfit-goals", DEFAULT_GOAL);
  const bmi = useMemo(() => typeof profile.height === "number" && profile.height > 0 && typeof profile.weight === "number" && profile.weight > 0 ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "—", [profile]);
  function update(field: keyof Profile, value: string) { setProfile({ ...profile, [field]: value === "" ? "" : Number(value) }); setSaved(false); }
  return <main className="page-shell"><header className="inner-topbar"><button onClick={() => window.location.href = "/"} className="back-button"><ArrowLeft size={20} /></button><h1>我的</h1><Settings2 size={20} /></header><div className="inner-content">
    <div className="profile-card"><div className="profile-avatar"><UserRound size={25} /></div><div><span className="eyebrow">个人健康档案</span><h2>我的身体数据</h2><p>数据由你自己填写和修改</p></div></div>
    <div className="page-card body-card"><div className="card-title"><div><span className="eyebrow">Body</span><h3>身高与体重</h3></div><span className="bmi-badge">BMI {bmi}</span></div><div className="body-input-grid"><label>身高（cm）<input value={profile.height} onChange={(e) => update("height", e.target.value)} inputMode="decimal" placeholder="例如 165" /></label><label>体重（kg）<input value={profile.weight} onChange={(e) => update("weight", e.target.value)} inputMode="decimal" placeholder="例如 55" /></label></div><p className="muted-copy">BMI 会根据身高和体重自动计算，仅供健康管理参考。</p><button className="primary-button" onClick={() => setSaved(true)}>{saved ? <><Check size={17} /> 已保存</> : "保存身体数据"}</button></div>
    <div className="page-card goals-card"><div className="card-title"><div><span className="eyebrow">Goals</span><h3>我的目标</h3></div><Target size={20} /></div><label>每日热量目标<input value={goal.dailyCalorieTarget} onChange={(e) => setGoal({ ...goal, dailyCalorieTarget: Number(e.target.value) })} inputMode="numeric" /><span>kcal</span></label><label>每日蛋白质目标<input value={goal.dailyProteinTarget} onChange={(e) => setGoal({ ...goal, dailyProteinTarget: Number(e.target.value) })} inputMode="numeric" /><span>g</span></label><label>每日步数目标<input value={goal.dailyStepTarget} onChange={(e) => setGoal({ ...goal, dailyStepTarget: Number(e.target.value) })} inputMode="numeric" /><span>步</span></label><button className="primary-button" onClick={() => setSaved(true)}>保存目标</button></div>
    <div className="settings-list"><button>通知与提醒 <ChevronRight size={18} /></button><button>数据备份与同步 <ChevronRight size={18} /></button><button>健康安全说明 <ChevronRight size={18} /></button></div>
  </div><BottomNav active="我的" /></main>;
}
function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}><span>{label}</span></button>)}</nav>; }
