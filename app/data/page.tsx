"use client";

import { ArrowLeft, ChartNoAxesCombined, Scale } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

type Profile = { height: number | ""; weight: number | "" };
type WeightEntry = { date: string; weight: number };

export default function DataPage() {
  const [profile] = useLocalStorage<Profile>("myfit-profile", { height: "", weight: "" });
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>("myfit-weight-history", []);
  const bmi = typeof profile.height === "number" && profile.height > 0 && typeof profile.weight === "number" && profile.weight > 0 ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "—";
  function recordWeight() { if (typeof profile.weight === "number" && profile.weight > 0) setEntries((items) => [{ date: new Date().toISOString().slice(0, 10), weight: profile.weight as number }, ...items.filter((item) => item.date !== new Date().toISOString().slice(0, 10))]); }
  return <main className="page-shell"><header className="inner-topbar"><button onClick={() => window.location.href = "/"} className="back-button"><ArrowLeft size={20} /></button><h1>身体数据</h1><span /></header><div className="inner-content"><div className="data-grid"><DataCard icon={<Scale />} title="当前体重" value={profile.weight ? `${profile.weight} kg` : "—"} note="在“我的”中修改" /><DataCard icon={<ChartNoAxesCombined />} title="BMI" value={bmi} note="根据身高体重计算" /></div><div className="page-card data-entry"><div className="card-title"><div><span className="eyebrow">Weight history</span><h3>体重记录</h3></div><span className="count-badge">{entries.length} 次</span></div><p className="muted-copy">先在“我的”页面填写身高和体重，再回来记录每天的体重变化。</p><button className="primary-button" onClick={recordWeight}>记录今天体重</button>{entries.length > 0 && entries.slice(0, 7).map((entry) => <div className="food-row" key={entry.date}><span>{entry.date}</span><strong>{entry.weight} kg</strong></div>)}</div></div><BottomNav active="数据" /></main>;
}
function DataCard({ icon, title, value, note }: { icon: React.ReactNode; title: string; value: string; note: string }) { return <div className="data-card"><span>{icon}</span><small>{title}</small><strong>{value}</strong><em>{note}</em></div>; }
function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}><span>{label}</span></button>)}</nav>; }
