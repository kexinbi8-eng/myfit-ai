"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Dumbbell,
  ChevronRight,
  Check,
  ChefHat,
  CircleUserRound,
  Flame,
  Footprints,
  Moon,
  Plus,
  Sparkle,
  Target,
  Utensils,
  X,
} from "lucide-react";

const Barbell = Dumbbell;
const CaretRight = ChevronRight;

const navItems = [
  { label: "首页", icon: Activity },
  { label: "饮食", icon: Utensils },
  { label: "训练", icon: Barbell },
  { label: "数据", icon: Target },
  { label: "我的", icon: CircleUserRound },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("首页");
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <main className="app-shell">
      <section className="app-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">Good evening</p>
            <h1>2026年9月12日</h1>
          </div>
          <button className="avatar-button" aria-label="打开个人资料"><span>毕</span></button>
        </header>

        <div className="page-content">
          <section className="hero-card">
            <div className="hero-copy">
              <span className="status-pill"><Sparkle size={14} weight="fill" /> 今日状态</span>
              <h2>稳稳地，<br /><em>向目标前进。</em></h2>
              <p>今天的节奏很好，继续保持。</p>
            </div>
            <div className="hero-orbit"><div className="orbit-dot" /><div className="orbit-ring" /><div className="hero-flame"><Flame size={22} weight="fill" /></div></div>
          </section>

          <section className="section-block">
            <div className="section-heading"><h3>今天状态</h3><button className="text-button">查看详情 <ArrowRight size={15} /></button></div>
            <div className="metrics-grid">
              <MetricCard icon={<Activity size={18} />} label="体重" value="68.4" unit="kg" tone="green" />
              <MetricCard icon={<Target size={18} />} label="腰围" value="78" unit="cm" tone="orange" />
              <MetricCard icon={<Footprints size={18} />} label="步数" value="7,820" unit="步" tone="blue" />
              <MetricCard icon={<Moon size={18} />} label="睡眠" value="7.5" unit="小时" tone="purple" />
            </div>
          </section>

          <section className="section-block"><div className="section-heading"><h3>今日目标</h3><span className="muted-label">9月12日</span></div><div className="goal-card"><ProgressRow label="饮食" value="1,420" total="1,900 kcal" percent={75} color="lime" /><ProgressRow label="蛋白质" value="96" total="130 g" percent={74} color="orange" /><ProgressRow label="步数" value="7,820" total="8,000" percent={98} color="blue" /></div></section>

          <section className="section-block"><div className="section-heading"><h3>今天吃什么</h3><button className="text-button">饮食记录 <ArrowRight size={15} /></button></div><div className="meal-card"><MealRow time="早餐" title="鸡蛋 + 贝贝南瓜 + 西兰花" done /><MealRow time="午餐" title="公司解决" /><MealRow time="晚餐" title="鸡胸肉 + 西兰花 + 胡萝卜" action /></div></section>

          <section className="section-block"><div className="section-heading"><h3>今天练什么</h3><button className="text-button">训练计划 <ArrowRight size={15} /></button></div><div className="workout-card"><div className="workout-top"><div><span className="workout-tag">力量训练 · 45 min</span><h4>胸 + 三头</h4></div><div className="workout-icon"><Barbell size={22} /></div></div><div className="exercise-list"><Exercise name="卧推" detail="4 × 8–12" /><Exercise name="上斜哑铃卧推" detail="3 × 10–12" /><Exercise name="夹胸" detail="3 × 12–15" /><Exercise name="绳索下压" detail="3 × 10–15" /></div><button className="primary-button"><Barbell size={18} /> 开始训练</button></div></section>

          <section className="ai-card" onClick={() => window.location.href = "/coach"}><div className="ai-icon"><Sparkle size={18} weight="fill" /></div><div className="ai-copy"><span>AI 健身教练</span><h3>今晚想吃什么？</h3><p>根据你的目标和冰箱库存，给你一点灵感。</p></div><button className="round-arrow" aria-label="打开 AI 教练"><CaretRight size={19} /></button></section>
        </div>

        <button className="fab" onClick={() => setQuickOpen(true)} aria-label="快速记录"><Plus size={26} /></button>
        <nav className="bottom-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "nav-item active" : "nav-item"} onClick={() => { setActiveNav(label); if (label === "饮食") window.location.href = "/food"; if (label === "训练") window.location.href = "/workout"; if (label === "数据") window.location.href = "/data"; if (label === "我的") window.location.href = "/profile"; }}><Icon size={21} weight={activeNav === label ? "fill" : "regular"} /><span>{label}</span></button>)}</nav>
        {quickOpen && <div className="modal-backdrop" onClick={() => setQuickOpen(false)}><div className="quick-sheet" onClick={(e) => e.stopPropagation()}><div className="sheet-header"><div><span className="eyebrow">快速记录</span><h2>现在记录一下</h2></div><button className="close-button" onClick={() => setQuickOpen(false)}><X size={20} /></button></div><div className="quick-grid"><QuickAction icon={<Utensils />} label="记录饮食" /><QuickAction icon={<Activity />} label="记录体重" /><QuickAction icon={<Barbell />} label="记录运动" /><QuickAction icon={<Footprints />} label="记录步数" /><QuickAction icon={<Moon />} label="记录睡眠" /><QuickAction icon={<ChefHat />} label="添加食材" /></div></div></div>}
      </section>
    </main>
  );
}

function MetricCard({ icon, label, value, unit, tone }: { icon: React.ReactNode; label: string; value: string; unit: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><span className="metric-label">{label}</span><div className="metric-value">{value}<small>{unit}</small></div></div>; }
function ProgressRow({ label, value, total, percent, color }: { label: string; value: string; total: string; percent: number; color: string }) { return <div className="progress-row"><div className="progress-meta"><span>{label}</span><span><strong>{value}</strong> / {total}</span></div><div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: `${percent}%` }} /></div></div>; }
function MealRow({ time, title, done, action }: { time: string; title: string; done?: boolean; action?: boolean }) { return <div className="meal-row"><div className={`meal-status ${done ? "done" : ""}`}>{done ? <Check size={14} /> : <span />}</div><div className="meal-info"><span>{time}</span><strong>{title}</strong></div>{action ? <button className="small-button">记录晚餐</button> : <CaretRight size={17} className="row-arrow" />}</div>; }
function Exercise({ name, detail }: { name: string; detail: string }) { return <div className="exercise-row"><span>{name}</span><strong>{detail}</strong></div>; }
function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) { return <button className="quick-action" onClick={() => { if (label === "记录饮食" || label === "添加食材") window.location.href = "/food"; if (label === "记录体重" || label === "记录步数" || label === "记录睡眠") window.location.href = "/data"; if (label === "记录运动") window.location.href = "/workout"; }}><span>{icon}</span><strong>{label}</strong></button>; }
