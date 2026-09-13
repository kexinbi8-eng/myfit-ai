"use client";

import { useState } from "react";
import { ArrowLeft, Check, Dumbbell, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

type Exercise = { id: string; name: string; sets: number; reps: number };
type WorkoutPlan = { name: string; duration: number | ""; exercises: Exercise[] };
type WorkoutRecord = { date: string; name: string; exercises: Exercise[] };

export default function WorkoutPage() {
  const [plan, setPlan] = useLocalStorage<WorkoutPlan>("myfit-workout-plan", { name: "", duration: "", exercises: [] });
  const [records, setRecords] = useLocalStorage<WorkoutRecord[]>("myfit-workout-records", []);
  const [draft, setDraft] = useState({ name: "", sets: 3, reps: 10 });
  const [completed, setCompleted] = useState<string[]>([]);
  const [editing, setEditing] = useState(true);

  function addExercise() { if (!draft.name.trim()) return; setPlan({ ...plan, exercises: [...plan.exercises, { id: crypto.randomUUID(), name: draft.name.trim(), sets: draft.sets, reps: draft.reps }] }); setDraft({ name: "", sets: 3, reps: 10 }); }
  function finishWorkout() { setRecords((current) => [{ date: new Date().toISOString(), name: plan.name || "我的训练", exercises: plan.exercises }, ...current]); setCompleted([]); window.location.href = "/"; }
  const doneCount = completed.length;

  return <main className="page-shell"><header className="inner-topbar"><button onClick={() => window.location.href = "/"} className="back-button"><ArrowLeft size={20} /></button><h1>训练计划</h1><button className="text-button" onClick={() => setEditing(!editing)}>{editing ? "完成设置" : "编辑"}</button></header><div className="inner-content">
    {editing && <div className="page-card workout-editor"><div className="card-title"><div><span className="eyebrow">Custom plan</span><h3>设置我的训练</h3></div><Dumbbell size={20} /></div><label className="form-field">训练名称<input value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} placeholder="例如：下肢力量训练" /></label><label className="form-field">预计时长（分钟）<input value={plan.duration} onChange={(e) => setPlan({ ...plan, duration: e.target.value === "" ? "" : Number(e.target.value) })} inputMode="numeric" placeholder="例如：45" /></label><div className="exercise-add-row"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="动作名称，例如：深蹲" /><input value={draft.sets} onChange={(e) => setDraft({ ...draft, sets: Number(e.target.value) })} inputMode="numeric" aria-label="组数" /><span>组</span><input value={draft.reps} onChange={(e) => setDraft({ ...draft, reps: Number(e.target.value) })} inputMode="numeric" aria-label="次数" /><span>次</span><button onClick={addExercise} aria-label="添加动作"><Plus size={18} /></button></div>{plan.exercises.map((exercise) => <div className="custom-exercise" key={exercise.id}><span>{exercise.name}</span><small>{exercise.sets} 组 × {exercise.reps} 次</small><button onClick={() => setPlan({ ...plan, exercises: plan.exercises.filter((item) => item.id !== exercise.id) })} aria-label={`删除${exercise.name}`}><Trash2 size={15} /></button></div>)}</div>}
    <div className="workout-hero"><span>{plan.name || "我的训练计划"}{plan.duration ? ` · ${plan.duration} 分钟` : ""}</span><h2>{plan.exercises.length ? "开始你的训练" : "先添加训练动作"}</h2><div className="workout-progress"><span>{doneCount} / {plan.exercises.length} 个动作完成</span><div><i style={{ width: `${plan.exercises.length ? (doneCount / plan.exercises.length) * 100 : 0}%` }} /></div></div></div>
    {plan.exercises.length > 0 && <div className="page-card"><div className="exercise-header"><div><span className="eyebrow">今日训练</span><h2>{plan.name || "我的训练"}</h2></div><Dumbbell size={22} /></div>{plan.exercises.map((exercise) => { const done = completed.includes(exercise.id); return <button className={done ? "custom-workout-row completed" : "custom-workout-row"} key={exercise.id} onClick={() => setCompleted((current) => done ? current.filter((id) => id !== exercise.id) : [...current, exercise.id])}><span className="exercise-check">{done && <Check size={15} />}</span><span><strong>{exercise.name}</strong><small>{exercise.sets} 组 × {exercise.reps} 次</small></span><em>{done ? "已完成" : "完成"}</em></button>; })}</div>}
    {plan.exercises.length > 0 && <button className="primary-button large-button" onClick={finishWorkout}>完成训练</button>}
    <p className="muted-copy workout-history-note">已保存训练记录：{records.length} 次</p>
  </div><BottomNav active="训练" /></main>;
}
function BottomNav({ active }: { active: string }) { return <nav className="bottom-nav">{[["首页", "/"], ["饮食", "/food"], ["训练", "/workout"], ["数据", "/data"], ["我的", "/profile"]].map(([label, href]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => window.location.href = href}><span>{label}</span></button>)}</nav>; }
