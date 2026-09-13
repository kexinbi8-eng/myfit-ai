"use client";

import { useState } from "react";
import { ArrowLeft, Check, Dumbbell, TimerReset } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

type WorkoutRecord = { date: string; exercise: string; sets: Array<{ weight: number; reps: number }> };

export default function WorkoutPage() {
  const [records, setRecords] = useLocalStorage<WorkoutRecord[]>("myfit-workout-records", []);
  const [sets, setSets] = useState([false, false, false, false]);
  const [weight, setWeight] = useState(["60", "60", "60", "60"]);
  const [reps, setReps] = useState(["10", "8", "8", "8"]);
  const completed = sets.filter(Boolean).length;
  function finishWorkout() { setRecords((current) => [{ date: new Date().toISOString(), exercise: "卧推", sets: weight.map((value, index) => ({ weight: Number(value), reps: Number(reps[index]) })).filter((_, index) => sets[index]) }, ...current]); window.location.href = "/"; }
  return <main className="page-shell"><header className="inner-topbar"><button onClick={() => window.location.href = "/"} className="back-button"><ArrowLeft size={20} /></button><h1>训练模式</h1><span className="live-pill">进行中</span></header><div className="inner-content"><div className="workout-hero"><span>胸 + 三头 · 今日训练</span><h2>把注意力放在<br /><em>这一组。</em></h2><div className="workout-progress"><span>{completed} / 4 组完成</span><div><i style={{ width: `${completed * 25}%` }} /></div></div></div><div className="page-card"><div className="exercise-header"><div><span className="eyebrow">动作 1 / 4</span><h2>卧推</h2></div><Dumbbell size={22} /></div>{sets.map((done, index) => <div className={done ? "set-row completed" : "set-row"} key={index}><span>第 {index + 1} 组</span><input value={weight[index]} onChange={(event) => setWeight((current) => current.map((item, i) => i === index ? event.target.value : item))} inputMode="decimal" aria-label="重量" /><b>kg ×</b><input value={reps[index]} onChange={(event) => setReps((current) => current.map((item, i) => i === index ? event.target.value : item))} inputMode="numeric" aria-label="次数" /><button onClick={() => setSets((current) => current.map((item, i) => i === index ? !item : item))}>{done ? <Check size={18} /> : "完成"}</button></div>)}</div><div className="rest-card"><TimerReset size={19} /><div><strong>休息时间</strong><span>建议 90 秒</span></div><b>01:30</b></div><button className="primary-button large-button" onClick={finishWorkout}>完成训练</button><p className="muted-copy workout-history-note">已保存训练记录：{records.length} 次</p></div><BottomNav active="训练" /></main>;
}

function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}>{label}</button>)}</nav>; }
