"use client";

import { ArrowRight, CircleUserRound, Dumbbell, Sparkle, Utensils } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

type Profile = { height: number | ""; weight: number | "" };

export default function Home() {
  const [profile] = useLocalStorage<Profile>("myfit-profile", { height: "", weight: "" });
  const bmi = typeof profile.height === "number" && profile.height > 0 && typeof profile.weight === "number" && profile.weight > 0 ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "—";
  const date = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());

  return <main className="app-shell"><section className="app-frame">
    <header className="topbar"><div><p className="eyebrow">MyFit AI</p><h1>{date}</h1></div><button className="avatar-button" aria-label="打开个人资料" onClick={() => window.location.href = "/profile"}><span>我</span></button></header>
    <div className="page-content home-simple-content">
      <section className="hero-card simple-hero"><div className="hero-copy"><span className="status-pill"><Sparkle size={14} /> 今日计划</span><h2>从今天开始，<br /><em>照顾好自己。</em></h2><p>先设置个人数据，再开始你的健康计划。</p></div></section>
      <PlanCard href="/workout" icon={<Dumbbell size={22} />} title="健身计划" description="查看今天的训练安排，记录每一次进步。" action="进入训练" tone="green" />
      <PlanCard href="/food" icon={<Utensils size={22} />} title="饮食计划" description="管理你的食材库存，安排每天的饮食。" action="进入饮食" tone="orange" />
      <section className="personal-summary"><div className="section-heading"><div><span className="eyebrow">我的数据</span><h3>个人身体数据</h3></div><button className="text-button" onClick={() => window.location.href = "/profile"}>编辑 <ArrowRight size={15} /></button></div><div className="personal-metrics"><div><span>身高</span><strong>{profile.height || "—"}<small>{profile.height ? " cm" : ""}</small></strong></div><div><span>体重</span><strong>{profile.weight || "—"}<small>{profile.weight ? " kg" : ""}</small></strong></div><div><span>BMI</span><strong>{bmi}</strong></div></div>{bmi === "—" && <p className="setup-hint"><CircleUserRound size={16} /> 点击“编辑”填写身高和体重，BMI 会自动计算。</p>}</section>
    </div>
    <BottomNav active="首页" />
  </section></main>;
}

function PlanCard({ href, icon, title, description, action, tone }: { href: string; icon: React.ReactNode; title: string; description: string; action: string; tone: string }) { return <button className={`plan-card ${tone}`} onClick={() => window.location.href = href}><span className="plan-icon">{icon}</span><span className="plan-copy"><strong>{title}</strong><small>{description}</small><em>{action} <ArrowRight size={14} /></em></span></button>; }
function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}><span>{label}</span></button>)}</nav>; }
