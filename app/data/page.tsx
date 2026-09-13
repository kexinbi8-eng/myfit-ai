"use client";

import { useState } from "react";
import { ArrowLeft, ChartNoAxesCombined, Moon, Scale, Target } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

type BodyEntry = { date: string; weight: number; waist: number; steps: number; sleep: number };
const initialEntry: BodyEntry = { date: "2026-09-12", weight: 68.4, waist: 78, steps: 7820, sleep: 7.5 };

export default function DataPage() {
  const [entries, setEntries] = useLocalStorage<BodyEntry[]>("myfit-body-entries", [initialEntry]);
  const [range, setRange] = useState("7天");
  const [form, setForm] = useState(initialEntry);
  function saveEntry() { setEntries((current) => [{ ...form, date: new Date().toISOString().slice(0, 10) }, ...current.filter((entry) => entry.date !== form.date)]); }
  const latest = entries[0] || initialEntry;
  return <main className="page-shell"><header className="inner-topbar"><button onClick={() => window.location.href = "/"} className="back-button"><ArrowLeft size={20} /></button><h1>数据趋势</h1><span /></header><div className="inner-content"><div className="range-tabs">{["7天", "30天", "90天"].map((item) => <button key={item} className={range === item ? "active" : ""} onClick={() => setRange(item)}>{item}</button>)}</div><div className="page-card chart-card"><div className="card-title"><div><span className="eyebrow">体重趋势 · {range}</span><h2>{latest.weight} <small>kg</small></h2></div><span className="trend-down">记录 {entries.length} 次</span></div><div className="fake-chart"><div className="chart-line" /><span className="chart-label l1">69.2</span><span className="chart-label l2">68.4</span><span className="chart-label l3">67.8</span></div><p className="muted-copy">趋势建议结合 7 日平均观察，不根据单日波动下结论。</p></div><div className="data-grid"><DataCard icon={<Scale />} title="腰围" value={`${latest.waist} cm`} note="持续记录观察变化" /><DataCard icon={<Moon />} title="睡眠" value={`${latest.sleep} h`} note="目标 8 小时" /><DataCard icon={<Target />} title="步数" value={latest.steps.toLocaleString()} note="目标 8,000 步" /><DataCard icon={<ChartNoAxesCombined />} title="记录天数" value={`${entries.length} 天`} note="保持连续记录" /></div><div className="page-card data-entry"><div className="card-title"><div><span className="eyebrow">快速记录</span><h3>今天的身体数据</h3></div></div><div className="entry-grid"><EntryInput label="体重 kg" value={form.weight} onChange={(value) => setForm({ ...form, weight: value })} /><EntryInput label="腰围 cm" value={form.waist} onChange={(value) => setForm({ ...form, waist: value })} /><EntryInput label="步数" value={form.steps} onChange={(value) => setForm({ ...form, steps: value })} /><EntryInput label="睡眠 h" value={form.sleep} onChange={(value) => setForm({ ...form, sleep: value })} /></div><button className="primary-button" onClick={saveEntry}>保存今天记录</button></div></div><BottomNav active="数据" /></main>;
}

function EntryInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="entry-input"><span>{label}</span><input value={value} onChange={(event) => onChange(Number(event.target.value))} inputMode="decimal" /></label>; }
function DataCard({ icon, title, value, note }: { icon: React.ReactNode; title: string; value: string; note: string }) { return <div className="data-card"><span>{icon}</span><small>{title}</small><strong>{value}</strong><em>{note}</em></div>; }
function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}>{label}</button>)}</nav>; }
