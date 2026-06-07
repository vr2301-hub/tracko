import { useState, useEffect, useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// THEME SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

const THEMES = {
  midnight: {
    id: "midnight", label: "Midnight", dark: true,
    bg: "#0F0F13", surface: "#16161C", surfaceAlt: "#0C0C10",
    border: "#1E1E26", borderAlt: "#2A2A36",
    text: "#F0EDE8", textMuted: "#5A5A6E", textSub: "#C0BDB8",
  },
  obsidian: {
    id: "obsidian", label: "Obsidian", dark: true,
    bg: "#080B0F", surface: "#111519", surfaceAlt: "#0A0D11",
    border: "#1A2030", borderAlt: "#243045",
    text: "#E8EDF5", textMuted: "#4A5568", textSub: "#9BB0CC",
  },
  slate: {
    id: "slate", label: "Slate", dark: true,
    bg: "#0D1117", surface: "#161B22", surfaceAlt: "#0A0F14",
    border: "#21262D", borderAlt: "#30363D",
    text: "#E6EDF3", textMuted: "#484F58", textSub: "#8B949E",
  },
  graphite: {
    id: "graphite", label: "Graphite", dark: true,
    bg: "#131313", surface: "#1C1C1C", surfaceAlt: "#0F0F0F",
    border: "#272727", borderAlt: "#333333",
    text: "#EBEBEB", textMuted: "#666666", textSub: "#AAAAAA",
  },
  ivory: {
    id: "ivory", label: "Ivory", dark: false,
    bg: "#FAF8F4", surface: "#FFFFFF", surfaceAlt: "#F2EFE9",
    border: "#E8E4DC", borderAlt: "#D4CFC5",
    text: "#1A1714", textMuted: "#9A9490", textSub: "#5C5855",
  },
  paper: {
    id: "paper", label: "Paper", dark: false,
    bg: "#F5F5F0", surface: "#FEFEFE", surfaceAlt: "#EBEBЕ5",
    border: "#DDDDD8", borderAlt: "#C8C8C2",
    text: "#1F1F1F", textMuted: "#888888", textSub: "#555555",
  },
  cloud: {
    id: "cloud", label: "Cloud", dark: false,
    bg: "#EEF2F7", surface: "#FFFFFF", surfaceAlt: "#E4EAF2",
    border: "#D0DAE8", borderAlt: "#B8C8DC",
    text: "#1A2030", textMuted: "#7A90A8", textSub: "#3A5070",
  },
};

const FONTS = {
  mono:    { id: "mono",    label: "Mono",      import: "DM+Mono:wght@300;400;500",    family: "'DM Mono','Courier New',monospace",           display: "'Playfair Display',serif" },
  sans:    { id: "sans",    label: "Sans",       import: "Plus+Jakarta+Sans:wght@300;400;500;600", family: "'Plus Jakarta Sans',sans-serif",    display: "'Plus Jakarta Sans',sans-serif" },
  rounded: { id: "rounded", label: "Rounded",    import: "Nunito:wght@300;400;600;700", family: "'Nunito',sans-serif",                        display: "'Nunito',sans-serif" },
  elegant: { id: "elegant", label: "Elegant",    import: "Cormorant+Garamond:wght@400;600&family=Jost:wght@300;400;500", family: "'Jost',sans-serif", display: "'Cormorant Garamond',serif" },
  retro:   { id: "retro",   label: "Retro",      import: "Space+Grotesk:wght@300;400;500&family=Space+Mono:wght@400;700", family: "'Space Grotesk',sans-serif", display: "'Space Mono',monospace" },
};

const ACCENTS = [
  { id: "ember",   label: "Ember",   color: "#E8735A" },
  { id: "ocean",   label: "Ocean",   color: "#3B82F6" },
  { id: "violet",  label: "Violet",  color: "#8B5CF6" },
  { id: "jade",    label: "Jade",    color: "#10B981" },
  { id: "gold",    label: "Gold",    color: "#F59E0B" },
  { id: "rose",    label: "Rose",    color: "#F43F5E" },
  { id: "cyan",    label: "Cyan",    color: "#06B6D4" },
  { id: "coral",   label: "Coral",   color: "#FF6B6B" },
];

const DEFAULT_APPEARANCE = { themeId: "midnight", fontId: "mono", accentId: "ember" };

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { id: "food",          label: "Food & Drink",   icon: "🍜", color: "#E8735A", isDefault: true },
  { id: "transport",     label: "Transport",       icon: "🚇", color: "#5B8DEF", isDefault: true },
  { id: "shopping",      label: "Shopping",        icon: "🛍️", color: "#B87FE8", isDefault: true },
  { id: "health",        label: "Health",          icon: "💊", color: "#5EC27B", isDefault: true },
  { id: "entertainment", label: "Entertainment",   icon: "🎬", color: "#F5B942", isDefault: true },
  { id: "bills",         label: "Bills",           icon: "🧾", color: "#EF5B5B", isDefault: true },
  { id: "other",         label: "Other",           icon: "📦", color: "#94A3B8", isDefault: true },
];

const CURRENCIES = [
  { code: "MYR", symbol: "RM",  label: "Malaysian Ringgit" },
  { code: "USD", symbol: "$",   label: "US Dollar" },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar" },
  { code: "GBP", symbol: "£",   label: "British Pound" },
  { code: "EUR", symbol: "€",   label: "Euro" },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen" },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar" },
  { code: "IDR", symbol: "Rp",  label: "Indonesian Rupiah" },
];

const RECUR_FREQ = [
  { id: "weekly", label: "Weekly" }, { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" }, { id: "yearly", label: "Yearly" },
];

const CAT_PALETTE   = ["#E8735A","#5B8DEF","#B87FE8","#5EC27B","#F5B942","#EF5B5B","#38BDF8","#FB7185","#34D399","#FBBF24","#A78BFA","#60A5FA","#F472B6","#4ADE80"];
const ACCOUNT_COLORS = ["#5B8DEF","#5EC27B","#F5B942","#B87FE8","#E8735A","#EF5B5B","#94A3B8","#38BDF8"];

const DEFAULT_ACCOUNTS = [
  { id: "maybank",  name: "Maybank", icon: "🏦", color: "#F5B942" },
  { id: "cash",     name: "Cash",    icon: "💵", color: "#5EC27B" },
  { id: "touchngo", name: "TNG",     icon: "📱", color: "#5B8DEF" },
];

const SK = {
  expenses: "et-expenses", accounts: "et-accounts", recurring: "et-recurring",
  currency: "et-currency", categories: "et-categories", budgets: "et-budgets",
  appearance: "et-appearance",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fmtAmt(amount, code) {
  const cur = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  if (code === "JPY" || code === "IDR") return `${cur.symbol}${Math.round(amount).toLocaleString()}`;
  return `${cur.symbol}${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
function fmtDate(s) { return new Date(s + "T00:00:00").toLocaleDateString("en-MY", { day: "numeric", month: "short" }); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function thisMonthStr() { return new Date().toISOString().slice(0, 7); }
function groupByDate(list) {
  const g = {};
  for (const e of list) { if (!g[e.date]) g[e.date] = []; g[e.date].push(e); }
  return Object.entries(g).sort(([a], [b]) => b.localeCompare(a));
}
function nextDueDate(start, freq) {
  const d = new Date(start + "T00:00:00"), today = new Date(todayStr() + "T00:00:00");
  while (d <= today) {
    if (freq === "weekly") d.setDate(d.getDate() + 7);
    else if (freq === "monthly") d.setMonth(d.getMonth() + 1);
    else if (freq === "quarterly") d.setMonth(d.getMonth() + 3);
    else d.setFullYear(d.getFullYear() + 1);
  }
  return d.toISOString().slice(0, 10);
}
function isDueSoon(s) {
  const diff = (new Date(s + "T00:00:00") - new Date(todayStr() + "T00:00:00")) / 86400000;
  return diff >= 0 && diff <= 5;
}
function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIE CHART
// ─────────────────────────────────────────────────────────────────────────────

function PieChart({ slices, size = 180, T }) {
  const r = size / 2;
  const [hovered, setHovered] = useState(null);
  const paths = useMemo(() => {
    const total = slices.reduce((s, x) => s + x.value, 0);
    if (total === 0) return [];
    let angle = -Math.PI / 2;
    return slices.map(sl => {
      const frac = sl.value / total, start = angle;
      angle += frac * 2 * Math.PI;
      const end = angle, x1 = r + r*.82*Math.cos(start), y1 = r + r*.82*Math.sin(start),
        x2 = r + r*.82*Math.cos(end), y2 = r + r*.82*Math.sin(end), midA = (start+end)/2;
      return { ...sl, d: `M${r},${r} L${x1},${y1} A${r*.82},${r*.82} 0 ${frac>.5?1:0},1 ${x2},${y2} Z`, frac, midA };
    });
  }, [slices, r]);
  if (!paths.length) return <div style={{ width:size,height:size,borderRadius:"50%",background:T.border,display:"flex",alignItems:"center",justifyContent:"center",color:T.textMuted,fontSize:11 }}>No data</div>;
  const hov = hovered !== null ? paths[hovered] : null;
  return (
    <div style={{ position:"relative",width:size,height:size }}>
      <svg width={size} height={size}>
        <circle cx={r} cy={r} r={r} fill={T.surface} />
        {paths.map((p,i) => (
          <path key={i} d={p.d} fill={p.color}
            style={{ cursor:"pointer", opacity: hovered===null||hovered===i?1:0.4, transition:"opacity .15s", transform: hovered===i?`translate(${Math.cos(p.midA)*5}px,${Math.sin(p.midA)*5}px)`:"none" }}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            onTouchStart={()=>setHovered(i)} onTouchEnd={()=>setHovered(null)} />
        ))}
        <circle cx={r} cy={r} r={r*.44} fill={T.bg} />
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
        {hov ? <><div style={{fontSize:18}}>{hov.icon}</div><div style={{fontSize:10,color:hov.color,letterSpacing:1,marginTop:2}}>{(hov.frac*100).toFixed(0)}%</div></> : <div style={{fontSize:9,color:T.textMuted,letterSpacing:1}}>TOTAL</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function ExpenseTracker() {
  const [expenses,   setExpenses]   = useState([]);
  const [accounts,   setAccounts]   = useState(DEFAULT_ACCOUNTS);
  const [recurring,  setRecurring]  = useState([]);
  const [currency,   setCurrency]   = useState("MYR");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [budgets,    setBudgets]    = useState({ overall: "", byCategory: {} });
  const [appearance, setAppearance] = useState(DEFAULT_APPEARANCE);

  const [view,     setView]     = useState("log");
  const [filter,   setFilter]   = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const blankForm    = () => ({ amount:"", note:"", category: categories[0]?.id??"food", date: todayStr(), accountId:"" });
  const blankAccount = () => ({ name:"", icon:"🏦", color: ACCOUNT_COLORS[0] });
  const blankRecur   = () => ({ name:"", amount:"", category:"bills", accountId:"", freq:"monthly", startDate: todayStr() });
  const blankCat     = () => ({ label:"", icon:"📌", color: CAT_PALETTE[0] });

  const [form,        setForm]        = useState(blankForm());
  const [accForm,     setAccForm]     = useState(blankAccount());
  const [recurForm,   setRecurForm]   = useState(blankRecur());
  const [catForm,     setCatForm]     = useState(blankCat());
  const [budgetDraft, setBudgetDraft] = useState({ overall:"", byCategory:{} });
  const [appDraft,    setAppDraft]    = useState(DEFAULT_APPEARANCE);

  const amountRef = useRef();

  useEffect(() => {
    const load = (k, set) => { try { const s=localStorage.getItem(k); if(s) set(JSON.parse(s)); } catch {} };
    load(SK.expenses, setExpenses); load(SK.accounts, setAccounts);
    load(SK.recurring, setRecurring); load(SK.categories, setCategories);
    load(SK.budgets, v => { setBudgets(v); setBudgetDraft(v); });
    load(SK.appearance, v => { setAppearance(v); setAppDraft(v); });
    try { const s=localStorage.getItem(SK.currency); if(s) setCurrency(s); } catch {}
  }, []);

  useEffect(()=>{ try{localStorage.setItem(SK.expenses,   JSON.stringify(expenses));}   catch{} },[expenses]);
  useEffect(()=>{ try{localStorage.setItem(SK.accounts,   JSON.stringify(accounts));}   catch{} },[accounts]);
  useEffect(()=>{ try{localStorage.setItem(SK.recurring,  JSON.stringify(recurring));}  catch{} },[recurring]);
  useEffect(()=>{ try{localStorage.setItem(SK.categories, JSON.stringify(categories));} catch{} },[categories]);
  useEffect(()=>{ try{localStorage.setItem(SK.budgets,    JSON.stringify(budgets));}    catch{} },[budgets]);
  useEffect(()=>{ try{localStorage.setItem(SK.appearance, JSON.stringify(appearance));} catch{} },[appearance]);
  useEffect(()=>{ try{localStorage.setItem(SK.currency,   currency);}                  catch{} },[currency]);
  useEffect(()=>{ if(view==="add") setTimeout(()=>amountRef.current?.focus(),120); },[view]);

  // ── Resolved theme tokens ──────────────────────────────────────────────────
  const T    = THEMES[appearance.themeId]    ?? THEMES.midnight;
  const F    = FONTS[appearance.fontId]      ?? FONTS.mono;
  const A    = ACCENTS.find(a=>a.id===appearance.accentId) ?? ACCENTS[0];
  const accent = A.color;

  // ── Actions ────────────────────────────────────────────────────────────────
  function addExpense() {
    if (!form.amount || isNaN(parseFloat(form.amount))) return;
    setExpenses(prev => [{ id:Date.now(), amount:parseFloat(form.amount), note:form.note.trim()||categories.find(c=>c.id===form.category)?.label, category:form.category, date:form.date, accountId:form.accountId||(accounts[0]?.id??"") }, ...prev]);
    setForm(blankForm()); setView("log");
  }
  function addAccount() {
    if (!accForm.name.trim()) return;
    setAccounts(prev=>[...prev,{id:Date.now().toString(),...accForm,name:accForm.name.trim()}]);
    setAccForm(blankAccount()); setView("settings");
  }
  function addRecurring() {
    if (!recurForm.name.trim()||!recurForm.amount||isNaN(parseFloat(recurForm.amount))) return;
    const r={id:Date.now().toString(),...recurForm,amount:parseFloat(recurForm.amount),name:recurForm.name.trim()};
    r.accountId=r.accountId||(accounts[0]?.id??""); r.nextDue=nextDueDate(r.startDate,r.freq);
    setRecurring(prev=>[...prev,r]); setRecurForm(blankRecur()); setView("settings");
  }
  function addCategory() {
    if (!catForm.label.trim()) return;
    setCategories(prev=>[...prev,{id:`cat_${Date.now()}`,label:catForm.label.trim(),icon:catForm.icon||"📌",color:catForm.color,isDefault:false}]);
    setCatForm(blankCat()); setView("settings");
  }
  function logRecurringNow(r) {
    setExpenses(prev=>[{id:Date.now(),amount:r.amount,note:r.name,category:r.category,date:todayStr(),accountId:r.accountId,recurringId:r.id},...prev]);
    setRecurring(prev=>prev.map(x=>x.id===r.id?{...x,nextDue:nextDueDate(todayStr(),x.freq)}:x));
  }
  function saveAppearance() { setAppearance(appDraft); setView("settings"); }

  // ── Derived ────────────────────────────────────────────────────────────────
  const fmt       = n => fmtAmt(n, currency);
  const curSymbol = CURRENCIES.find(c=>c.code===currency)?.symbol??"RM";
  const filtered  = filter==="all" ? expenses : expenses.filter(e=>e.category===filter);
  const grouped   = groupByDate(filtered);
  const thisMonth = thisMonthStr();
  const monthExp  = expenses.filter(e=>e.date.startsWith(thisMonth));
  const monthTotal= monthExp.reduce((s,e)=>s+e.amount,0);
  const catTotals = categories.map(c=>({...c,total:monthExp.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0)}));
  const catWithData=catTotals.filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  const maxCat    = catWithData[0]?.total||1;
  const accTotals = accounts.map(a=>({...a,total:monthExp.filter(e=>e.accountId===a.id).reduce((s,e)=>s+e.amount,0)})).filter(a=>a.total>0);
  const dueSoon   = recurring.filter(r=>r.nextDue&&isDueSoon(r.nextDue));
  const overallBudget = parseFloat(budgets.overall)||0;
  const overallRemain = overallBudget>0 ? overallBudget-monthTotal : null;
  const pieSlices = catWithData.map(c=>({...c,value:c.total}));

  // ── Shared atoms ──────────────────────────────────────────────────────────
  const fontImportUrl = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=${F.import}&display=swap`;

  const SL = ({ children, style={} }) => (
    <div style={{ fontSize:10, letterSpacing:3, color:T.textMuted, textTransform:"uppercase", marginBottom:8, fontFamily:F.family, ...style }}>{children}</div>
  );
  const IB = ({ style={}, ...p }) => (
    <input {...p} style={{ background:T.surface, border:`1px solid ${T.borderAlt}`, borderRadius:8, padding:"10px 14px", width:"100%", color:T.text, fontSize:13, fontFamily:F.family, ...style }} />
  );
  const SB = ({ children, style={}, ...p }) => (
    <select {...p} style={{ background:T.surface, border:`1px solid ${T.borderAlt}`, borderRadius:8, padding:"10px 14px", width:"100%", color:T.text, fontSize:13, fontFamily:F.family, colorScheme:T.dark?"dark":"light", ...style }}>
      {children}
    </select>
  );
  const BRow = ({ label, onBack }) => (
    <div style={{ display:"flex", alignItems:"center", marginBottom:22, gap:12 }}>
      <button style={{ background:"none",border:"none",cursor:"pointer",fontFamily:F.family,color:T.textMuted,fontSize:20 }} onClick={onBack}>←</button>
      <span style={{ fontSize:10, letterSpacing:3, color:T.textMuted, textTransform:"uppercase", fontFamily:F.family }}>{label}</span>
    </div>
  );
  const Chip = ({ active, color, children, onClick, style={} }) => (
    <button onClick={onClick}
      style={{ border:`1px solid ${color}`, borderRadius:20, cursor:"pointer", fontFamily:F.family, background:active?color:"transparent", color:active?"#0F0F13":color, padding:"6px 12px", fontSize:11, transition:"all .15s", ...style }}>
      {children}
    </button>
  );
  const SaveBtn = ({ label, onClick, disabled }) => (
    <button onClick={onClick}
      style={{ width:"100%", padding:14, background:disabled?T.borderAlt:accent, border:"none", borderRadius:10, color:disabled?T.textMuted:"#fff", fontSize:12, letterSpacing:2, textTransform:"uppercase", cursor:disabled?"default":"pointer", fontFamily:F.family, transition:"background .2s" }}>
      {label}
    </button>
  );
  const CatChips = ({ value, onChange }) => (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {categories.map(c=>(
        <Chip key={c.id} active={value===c.id} color={c.color} onClick={()=>onChange(c.id)}>{c.icon} {c.label}</Chip>
      ))}
    </div>
  );
  const AddBtn = ({ label, onClick }) => (
    <button onClick={onClick} style={{ fontSize:10, letterSpacing:2, color:accent, border:`1px solid ${accent}`, borderRadius:20, padding:"4px 12px", background:"none", cursor:"pointer", fontFamily:F.family }}>
      + {label}
    </button>
  );

  const cs = `
    @import url('${fontImportUrl}');
    *{box-sizing:border-box;margin:0;padding:0;}
    ::-webkit-scrollbar{width:0;}
    input,select{outline:none;}
    .fade-in{animation:fadeIn .25s ease;}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .num-input::-webkit-outer-spin-button,.num-input::-webkit-inner-spin-button{-webkit-appearance:none;}
    .tab-btn{background:none;border:none;cursor:pointer;transition:transform .15s;font-family:${F.family};}
    .tab-btn:active{transform:scale(.95);}
    .entry-row{border-bottom:1px solid ${T.border};transition:background .12s;}
    .entry-row:hover{background:${T.surface};}
    .del-hover{background:none;border:none;cursor:pointer;opacity:0;transition:opacity .2s;}
    .entry-row:hover .del-hover{opacity:1;}
    .add-fab{position:fixed;bottom:80px;right:calc(50% - 210px + 20px);width:52px;height:52px;border-radius:50%;background:${accent};border:none;cursor:pointer;font-size:26px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 20px ${hexAlpha(accent,.4)};transition:transform .15s,box-shadow .15s;z-index:10;}
    .add-fab:hover{transform:scale(1.08);box-shadow:0 6px 24px ${hexAlpha(accent,.55)};}
    .add-fab:active{transform:scale(.94);}
    .due-badge{display:inline-block;background:#EF5B5B;color:#fff;font-size:9px;padding:2px 6px;border-radius:10px;letter-spacing:1px;}
  `;

  // ── RENDER ─────────────────────────────────────────────────────────────────

  const shell = { minHeight:"100vh", background:T.bg, color:T.text, fontFamily:F.family, display:"flex", flexDirection:"column", maxWidth:420, margin:"0 auto", position:"relative" };

  return (
    <div style={shell}>
      <style>{cs}</style>

      {/* ── HEADER ── */}
      <div style={{ padding:"20px 20px 14px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:3, color:T.textMuted, textTransform:"uppercase", marginBottom:4 }}>This Month</div>
            <div style={{ fontFamily:F.display, fontSize:30, fontWeight:700, letterSpacing:-1, color:T.text }}>{fmt(monthTotal)}</div>
            {overallBudget>0 && (
              <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ height:4, width:120, background:T.border, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:2, background:overallRemain<0?"#EF5B5B":"#5EC27B", width:`${Math.min(monthTotal/overallBudget,1)*100}%`, transition:"width .4s" }} />
                </div>
                <span style={{ fontSize:10, color:overallRemain<0?"#EF5B5B":"#5EC27B" }}>
                  {overallRemain<0?`Over ${fmt(Math.abs(overallRemain))}`:`${fmt(overallRemain)} left`}
                </span>
              </div>
            )}
          </div>
          <div style={{ textAlign:"right" }}>
            {dueSoon.length>0 && <div style={{marginBottom:4}}><span className="due-badge">⏰ {dueSoon.length} DUE</span></div>}
            <div style={{ fontSize:10, color:T.textMuted }}>{monthExp.length} entries</div>
            <div style={{ fontSize:10, color:T.textMuted, marginTop:2 }}>{new Date().toLocaleDateString("en-MY",{month:"long",year:"numeric"})}</div>
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, padding:"0 20px" }}>
        {[["log","LOG"],["summary","SUMMARY"],["settings","⚙"]].map(([id,lbl])=>(
          <button key={id} className="tab-btn" onClick={()=>setView(id)}
            style={{ padding:"12px 0", marginRight:20, fontSize:11, letterSpacing:2, color:view===id?accent:T.textMuted, borderBottom:view===id?`1.5px solid ${accent}`:"1.5px solid transparent", fontWeight:view===id?500:400 }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ══════════════════ ADD EXPENSE ══════════════════ */}
      {view==="add" && (
        <div className="fade-in" style={{ padding:20, flex:1, overflowY:"auto" }}>
          <BRow label="New Expense" onBack={()=>setView("log")} />
          <div style={{ marginBottom:28, textAlign:"center" }}>
            <SL style={{textAlign:"left"}}>Amount</SL>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span style={{ fontSize:24, color:T.textMuted, fontFamily:F.display }}>{curSymbol}</span>
              <input ref={amountRef} type="number" className="num-input" placeholder="0.00" value={form.amount}
                onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&addExpense()}
                style={{ background:"none", border:"none", fontSize:40, width:160, color:T.text, fontFamily:F.display, textAlign:"center" }} />
            </div>
            <div style={{ height:1, background:T.borderAlt, margin:"8px auto 0", width:200 }} />
          </div>
          <div style={{marginBottom:16}}><SL>Account</SL>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {accounts.map(a=><Chip key={a.id} active={form.accountId===a.id} color={a.color} onClick={()=>setForm(f=>({...f,accountId:a.id}))}>{a.icon} {a.name}</Chip>)}
            </div>
          </div>
          <div style={{marginBottom:16}}><SL>Category</SL><CatChips value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} /></div>
          <div style={{marginBottom:14}}><SL>Note</SL><IB type="text" placeholder="Optional…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addExpense()} /></div>
          <div style={{marginBottom:28}}><SL>Date</SL><IB type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{colorScheme:T.dark?"dark":"light"}} /></div>
          <SaveBtn label="Add Expense" onClick={addExpense} disabled={!form.amount} />
          <div style={{height:40}} />
        </div>
      )}

      {/* ══════════════════ LOG ══════════════════ */}
      {view==="log" && (
        <div className="fade-in" style={{ flex:1, overflowY:"auto" }}>
          <div style={{ padding:"10px 20px", display:"flex", gap:8, overflowX:"auto", borderBottom:`1px solid ${T.border}` }}>
            <Chip active={filter==="all"} color={T.text} onClick={()=>setFilter("all")} style={{fontSize:10,letterSpacing:1}}>ALL</Chip>
            {categories.map(c=><Chip key={c.id} active={filter===c.id} color={c.color} onClick={()=>setFilter(filter===c.id?"all":c.id)} style={{whiteSpace:"nowrap"}}>{c.icon}</Chip>)}
          </div>
          {filtered.length===0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", color:T.textMuted, fontSize:13 }}>
              <div style={{fontSize:32,marginBottom:12}}>📋</div>No expenses yet.
            </div>
          ) : grouped.map(([date,entries])=>(
            <div key={date}>
              <div style={{ padding:"8px 20px", fontSize:10, letterSpacing:2, color:T.textMuted, textTransform:"uppercase", background:T.surfaceAlt, display:"flex", justifyContent:"space-between" }}>
                <span>{fmtDate(date)}</span><span>{fmt(entries.reduce((s,e)=>s+e.amount,0))}</span>
              </div>
              {entries.map(e=>{
                const cat=categories.find(c=>c.id===e.category)||{icon:"📦",label:"Other",color:"#94A3B8"};
                const acc=accounts.find(a=>a.id===e.accountId);
                return (
                  <div key={e.id} className="entry-row" style={{ display:"flex", alignItems:"center", padding:"12px 20px", gap:12 }}>
                    <div style={{fontSize:18,width:28,textAlign:"center"}}>{cat.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:T.text}}>{e.note}</div>
                      <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center"}}>
                        <span style={{fontSize:9,color:cat.color,letterSpacing:1}}>{cat.label.toUpperCase()}</span>
                        {acc&&<span style={{fontSize:9,color:acc.color,borderLeft:`1px solid ${T.border}`,paddingLeft:8}}>{acc.icon} {acc.name}</span>}
                      </div>
                    </div>
                    <div style={{fontSize:14,fontWeight:500,color:T.text}}>{fmt(e.amount)}</div>
                    {deleteId===e.id ? (
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>{setExpenses(prev=>prev.filter(x=>x.id!==e.id));setDeleteId(null);}} style={{background:"#EF5B5B",border:"none",borderRadius:4,padding:"3px 8px",color:"#fff",fontSize:10,cursor:"pointer",fontFamily:F.family}}>DEL</button>
                        <button onClick={()=>setDeleteId(null)} style={{background:T.borderAlt,border:"none",borderRadius:4,padding:"3px 6px",color:T.text,fontSize:10,cursor:"pointer",fontFamily:F.family}}>✕</button>
                      </div>
                    ):(
                      <button className="del-hover" onClick={()=>setDeleteId(e.id)} style={{color:T.textMuted,fontSize:16,padding:"0 4px"}}>⋯</button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{height:140}} />
        </div>
      )}

      {/* ══════════════════ SUMMARY ══════════════════ */}
      {view==="summary" && (
        <div className="fade-in" style={{ flex:1, overflowY:"auto", padding:20 }}>
          <SL>Overview</SL>
          <div style={{ display:"flex", gap:20, alignItems:"center", marginBottom:28 }}>
            <PieChart slices={pieSlices} size={170} T={T} />
            <div style={{flex:1,minWidth:0}}>
              {pieSlices.length===0 ? <div style={{fontSize:11,color:T.textMuted}}>No data.</div>
                : pieSlices.map(s=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}} />
                    <div style={{fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.textSub}}>{s.icon} {s.label}</div>
                    <div style={{fontSize:10,color:s.color,flexShrink:0}}>{((s.total/monthTotal)*100).toFixed(0)}%</div>
                  </div>
                ))
              }
            </div>
          </div>
          <SL>By Category</SL>
          {catTotals.filter(c=>c.total>0||(budgets.byCategory[c.id]&&parseFloat(budgets.byCategory[c.id])>0)).map(c=>{
            const planned=parseFloat(budgets.byCategory[c.id])||0;
            const remain=planned>0?planned-c.total:null;
            const over=remain!==null&&remain<0;
            return (
              <div key={c.id} style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12,color:T.text}}>
                  <span>{c.icon} {c.label}</span>
                  <div style={{textAlign:"right"}}>
                    <span style={{color:c.color}}>{fmt(c.total)}</span>
                    {planned>0&&<span style={{color:T.textMuted,fontSize:10,marginLeft:6}}>/ {fmt(planned)}</span>}
                  </div>
                </div>
                <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:2,background:over?"#EF5B5B":c.color,width:`${(planned>0?Math.min(c.total/planned,1):c.total/maxCat)*100}%`,transition:"width .5s"}} />
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:9,color:T.textMuted}}>
                  <span>{((c.total/monthTotal)*100||0).toFixed(0)}% of total</span>
                  {remain!==null&&<span style={{color:over?"#EF5B5B":"#5EC27B"}}>{over?`Over ${fmt(Math.abs(remain))}`:`${fmt(remain)} left`}</span>}
                </div>
              </div>
            );
          })}
          {accTotals.length>0&&(
            <><SL style={{marginTop:24}}>By Account</SL>
            {accTotals.map(a=>(
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`,fontSize:13,color:T.text}}>
                <span style={{color:a.color}}>{a.icon} {a.name}</span><span>{fmt(a.total)}</span>
              </div>
            ))}</>
          )}
          {catWithData.length>0&&(
            <div style={{marginTop:24,padding:16,background:T.surface,borderRadius:10,border:`1px solid ${T.border}`}}>
              <SL>Quick Stats</SL>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textMuted}}>
                <div><div style={{fontSize:16,color:T.text,fontFamily:F.display}}>{fmt(monthTotal/new Date().getDate())}</div><div style={{marginTop:2}}>Daily avg</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:16,color:T.text,fontFamily:F.display}}>{monthExp.length}</div><div style={{marginTop:2}}>Entries</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:20}}>{catWithData[0]?.icon}</div><div style={{marginTop:2}}>Top spend</div></div>
              </div>
            </div>
          )}
          <div style={{height:120}} />
        </div>
      )}

      {/* ══════════════════ SETTINGS ══════════════════ */}
      {view==="settings" && (
        <div className="fade-in" style={{ flex:1, overflowY:"auto", padding:20 }}>
          <SL>Currency</SL>
          <SB value={currency} onChange={e=>setCurrency(e.target.value)} style={{marginBottom:24}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}
          </SB>

          {/* Appearance shortcut */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <SL style={{marginBottom:0}}>Appearance</SL>
            <AddBtn label="CUSTOMISE" onClick={()=>{setAppDraft(appearance);setView("appearance");}} />
          </div>
          <div style={{display:"flex",gap:10,marginBottom:24,padding:"12px 14px",background:T.surface,borderRadius:10,border:`1px solid ${T.border}`,alignItems:"center"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:accent}} />
            <span style={{fontSize:12,color:T.textSub,flex:1}}>{T.label} · {F.label} · {A.label}</span>
            <span style={{fontSize:10,color:T.textMuted}}>{T.dark?"Dark":"Light"}</span>
          </div>

          {/* Budget */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <SL style={{marginBottom:0}}>Monthly Budget</SL>
            <AddBtn label="EDIT" onClick={()=>{setBudgetDraft(budgets);setView("editBudget");}} />
          </div>
          <div style={{background:T.surface,borderRadius:10,border:`1px solid ${T.border}`,padding:"12px 14px",marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8,color:T.text}}>
              <span style={{color:T.textMuted}}>Overall Budget</span>
              <span>{overallBudget>0?fmt(overallBudget):<span style={{color:T.textMuted}}>Not set</span>}</span>
            </div>
            {overallBudget>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span style={{color:T.textMuted}}>Spent</span>
              <span style={{color:overallRemain<0?"#EF5B5B":"#5EC27B"}}>{fmt(monthTotal)} → {overallRemain<0?`Over ${fmt(Math.abs(overallRemain))}`:`${fmt(overallRemain)} remaining`}</span>
            </div>}
          </div>

          {/* Accounts */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <SL style={{marginBottom:0}}>Accounts</SL><AddBtn label="ADD" onClick={()=>setView("addAccount")} />
          </div>
          {accounts.map(a=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`,gap:12}}>
              <span style={{fontSize:20}}>{a.icon}</span>
              <span style={{flex:1,fontSize:13,color:a.color}}>{a.name}</span>
              <button onClick={()=>setAccounts(prev=>prev.filter(x=>x.id!==a.id))} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:14}}>🗑</button>
            </div>
          ))}

          {/* Categories */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24,marginBottom:10}}>
            <SL style={{marginBottom:0}}>Categories</SL><AddBtn label="ADD" onClick={()=>{setCatForm(blankCat());setView("addCategory");}} />
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
            {categories.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:6,background:T.surface,border:`1px solid ${hexAlpha(c.color,.4)}`,borderRadius:20,padding:"5px 12px 5px 10px"}}>
                <span style={{fontSize:14}}>{c.icon}</span>
                <span style={{fontSize:11,color:c.color}}>{c.label}</span>
                {!c.isDefault&&<button onClick={()=>setCategories(prev=>prev.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:11,marginLeft:2,padding:0}}>✕</button>}
              </div>
            ))}
          </div>

          {/* Recurring */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <SL style={{marginBottom:0}}>Recurring</SL><AddBtn label="ADD" onClick={()=>setView("addRecurring")} />
          </div>
          {recurring.length===0&&<div style={{fontSize:11,color:T.textMuted,marginBottom:16}}>No recurring expenses yet.</div>}
          {recurring.map(r=>{
            const cat=categories.find(c=>c.id===r.category)||{icon:"📦"};
            const acc=accounts.find(a=>a.id===r.accountId);
            const soon=isDueSoon(r.nextDue);
            return (
              <div key={r.id} style={{background:T.surface,borderRadius:10,padding:"12px 14px",marginBottom:10,border:`1px solid ${soon?"#EF5B5B44":T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,marginBottom:4,color:T.text}}>{cat.icon} {r.name}</div>
                    <div style={{fontSize:10,color:T.textMuted}}>{RECUR_FREQ.find(f=>f.id===r.freq)?.label.toUpperCase()} · {acc?.icon} {acc?.name??"—"}</div>
                    <div style={{fontSize:10,marginTop:4,color:soon?"#EF5B5B":T.textMuted}}>Next: {fmtDate(r.nextDue)} {soon&&<span className="due-badge" style={{marginLeft:4}}>DUE SOON</span>}</div>
                  </div>
                  <div style={{textAlign:"right",marginLeft:12}}>
                    <div style={{fontSize:14,marginBottom:6,color:T.text}}>{fmt(r.amount)}</div>
                    <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                      <button onClick={()=>logRecurringNow(r)} style={{background:accent,border:"none",borderRadius:6,padding:"4px 8px",color:"#fff",fontSize:9,cursor:"pointer",fontFamily:F.family,letterSpacing:1}}>LOG NOW</button>
                      <button onClick={()=>setRecurring(prev=>prev.filter(x=>x.id!==r.id))} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:13}}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{height:120}} />
        </div>
      )}

      {/* ══════════════════ APPEARANCE ══════════════════ */}
      {view==="appearance" && (
        <div className="fade-in" style={{ padding:20, flex:1, overflowY:"auto" }}>
          <BRow label="Appearance" onBack={()=>setView("settings")} />

          {/* Live preview */}
          <div style={{marginBottom:24,borderRadius:12,overflow:"hidden",border:`2px solid ${ACCENTS.find(a=>a.id===appDraft.accentId)?.color??accent}`,boxShadow:`0 4px 24px ${hexAlpha(ACCENTS.find(a=>a.id===appDraft.accentId)?.color??accent,.2)}`}}>
            {(()=>{
              const pT=THEMES[appDraft.themeId]??THEMES.midnight;
              const pF=FONTS[appDraft.fontId]??FONTS.mono;
              const pA=ACCENTS.find(a=>a.id===appDraft.accentId)??ACCENTS[0];
              return (
                <div style={{background:pT.bg,padding:"14px 16px",fontFamily:pF.family}}>
                  <div style={{fontSize:9,letterSpacing:3,color:pT.textMuted,textTransform:"uppercase",marginBottom:4}}>This Month</div>
                  <div style={{fontFamily:pF.display,fontSize:22,fontWeight:700,color:pT.text,letterSpacing:-1,marginBottom:8}}>RM 2,400.00</div>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {["🍜 Food","🚇 Transport","🛍️ Shopping"].map((lbl,i)=>(
                      <div key={i} style={{background:i===0?pA.color:"transparent",border:`1px solid ${i===0?pA.color:pT.borderAlt}`,borderRadius:20,padding:"4px 10px",fontSize:10,color:i===0?"#0F0F13":pT.textMuted,fontFamily:pF.family}}>{lbl}</div>
                    ))}
                  </div>
                  <div style={{height:1,background:pT.border,marginBottom:10}} />
                  {[["🍜","Lunch – Nasi Lemak","RM 8.50","#E8735A"],["🚇","LRT Monthly Pass","RM 60.00","#5B8DEF"]].map(([icon,note,amt,col],i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i===0?`1px solid ${pT.border}`:"none"}}>
                      <span style={{fontSize:16}}>{icon}</span>
                      <span style={{flex:1,fontSize:12,color:pT.text}}>{note}</span>
                      <span style={{fontSize:12,color:col}}>{amt}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Theme */}
          <SL>Theme</SL>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
            {Object.values(THEMES).map(t=>(
              <button key={t.id} onClick={()=>setAppDraft(d=>({...d,themeId:t.id}))}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:appDraft.themeId===t.id?hexAlpha(accent,.15):"transparent",border:`1.5px solid ${appDraft.themeId===t.id?accent:T.borderAlt}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",transition:"all .15s",minWidth:70}}>
                <div style={{width:32,height:32,borderRadius:8,background:t.bg,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:14,height:14,borderRadius:3,background:t.surface,border:`1px solid ${t.borderAlt}`}} />
                </div>
                <span style={{fontSize:10,color:appDraft.themeId===t.id?accent:T.textMuted,letterSpacing:1}}>{t.label}</span>
                <span style={{fontSize:8,color:T.textMuted}}>{t.dark?"Dark":"Light"}</span>
              </button>
            ))}
          </div>

          {/* Font */}
          <SL>Font</SL>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
            {Object.values(FONTS).map(f=>(
              <button key={f.id} onClick={()=>setAppDraft(d=>({...d,fontId:f.id}))}
                style={{background:appDraft.fontId===f.id?hexAlpha(accent,.15):"transparent",border:`1.5px solid ${appDraft.fontId===f.id?accent:T.borderAlt}`,borderRadius:10,padding:"10px 16px",cursor:"pointer",transition:"all .15s",textAlign:"left"}}>
                <div style={{fontFamily:f.family,fontSize:15,color:appDraft.fontId===f.id?accent:T.text,marginBottom:2}}>Aa</div>
                <div style={{fontFamily:f.family,fontSize:10,color:T.textMuted,letterSpacing:1}}>{f.label}</div>
              </button>
            ))}
          </div>

          {/* Accent colour */}
          <SL>Accent Colour</SL>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:28}}>
            {ACCENTS.map(a=>(
              <button key={a.id} onClick={()=>setAppDraft(d=>({...d,accentId:a.id}))}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:"transparent",border:"none",cursor:"pointer",padding:4}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:a.color,border:appDraft.accentId===a.id?`3px solid ${T.text}`:`3px solid transparent`,transition:"border .15s",boxShadow:appDraft.accentId===a.id?`0 0 0 1px ${a.color}`:""}} />
                <span style={{fontSize:9,color:appDraft.accentId===a.id?a.color:T.textMuted,letterSpacing:1}}>{a.label}</span>
              </button>
            ))}
          </div>

          <SaveBtn label="Apply" onClick={saveAppearance} disabled={false} />
          <div style={{height:40}} />
        </div>
      )}

      {/* ══════════════════ EDIT BUDGET ══════════════════ */}
      {view==="editBudget" && (
        <div className="fade-in" style={{ padding:20, flex:1, overflowY:"auto" }}>
          <BRow label="Monthly Budget" onBack={()=>setView("settings")} />
          <div style={{marginBottom:20}}>
            <SL>Overall Monthly Budget ({curSymbol})</SL>
            <IB type="number" className="num-input" placeholder="e.g. 3000" value={budgetDraft.overall} onChange={e=>setBudgetDraft(b=>({...b,overall:e.target.value}))} />
            <div style={{fontSize:10,color:T.textMuted,marginTop:6}}>Leave blank to disable overall tracking.</div>
          </div>
          <SL style={{marginBottom:12}}>Per Category Budget</SL>
          {categories.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <span style={{fontSize:16,width:24}}>{c.icon}</span>
              <span style={{fontSize:12,flex:1,color:c.color}}>{c.label}</span>
              <IB type="number" className="num-input" placeholder="—" value={budgetDraft.byCategory[c.id]??""} onChange={e=>setBudgetDraft(b=>({...b,byCategory:{...b.byCategory,[c.id]:e.target.value}}))} style={{width:110,textAlign:"right"}} />
            </div>
          ))}
          <div style={{marginTop:24}}><SaveBtn label="Save Budget" onClick={()=>{setBudgets(budgetDraft);setView("settings");}} disabled={false} /></div>
          <div style={{height:40}} />
        </div>
      )}

      {/* ══════════════════ ADD ACCOUNT ══════════════════ */}
      {view==="addAccount" && (
        <div className="fade-in" style={{ padding:20, flex:1 }}>
          <BRow label="New Account" onBack={()=>setView("settings")} />
          <div style={{marginBottom:14}}><SL>Name</SL><IB type="text" placeholder="e.g. CIMB, GrabPay…" value={accForm.name} onChange={e=>setAccForm(f=>({...f,name:e.target.value}))} /></div>
          <div style={{marginBottom:14}}><SL>Icon (emoji)</SL><IB type="text" placeholder="🏦" value={accForm.icon} maxLength={2} onChange={e=>setAccForm(f=>({...f,icon:e.target.value}))} style={{width:80}} /></div>
          <div style={{marginBottom:28}}>
            <SL>Colour</SL>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {ACCOUNT_COLORS.map(col=><button key={col} onClick={()=>setAccForm(f=>({...f,color:col}))} style={{width:30,height:30,borderRadius:"50%",background:col,border:accForm.color===col?"2px solid #fff":"2px solid transparent",cursor:"pointer"}} />)}
            </div>
          </div>
          <SaveBtn label="Save Account" onClick={addAccount} disabled={!accForm.name.trim()} />
        </div>
      )}

      {/* ══════════════════ ADD CATEGORY ══════════════════ */}
      {view==="addCategory" && (
        <div className="fade-in" style={{ padding:20, flex:1 }}>
          <BRow label="New Category" onBack={()=>setView("settings")} />
          <div style={{marginBottom:14}}><SL>Name</SL><IB type="text" placeholder="e.g. Education, Pets…" value={catForm.label} onChange={e=>setCatForm(f=>({...f,label:e.target.value}))} /></div>
          <div style={{marginBottom:14}}><SL>Icon (emoji)</SL><IB type="text" placeholder="📌" value={catForm.icon} maxLength={2} onChange={e=>setCatForm(f=>({...f,icon:e.target.value}))} style={{width:80}} /></div>
          <div style={{marginBottom:16}}>
            <SL>Colour</SL>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {CAT_PALETTE.map(col=><button key={col} onClick={()=>setCatForm(f=>({...f,color:col}))} style={{width:28,height:28,borderRadius:"50%",background:col,border:catForm.color===col?"2px solid #fff":"2px solid transparent",cursor:"pointer"}} />)}
            </div>
          </div>
          <div style={{marginBottom:20,padding:"10px 14px",background:T.surface,borderRadius:8,border:`1px solid ${T.borderAlt}`,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{catForm.icon||"📌"}</span>
            <span style={{fontSize:13,color:catForm.color}}>{catForm.label||"Preview"}</span>
          </div>
          <SaveBtn label="Save Category" onClick={addCategory} disabled={!catForm.label.trim()} />
        </div>
      )}

      {/* ══════════════════ ADD RECURRING ══════════════════ */}
      {view==="addRecurring" && (
        <div className="fade-in" style={{ padding:20, flex:1, overflowY:"auto" }}>
          <BRow label="New Recurring" onBack={()=>setView("settings")} />
          <div style={{marginBottom:14}}><SL>Name</SL><IB type="text" placeholder="e.g. Gym, Rental…" value={recurForm.name} onChange={e=>setRecurForm(f=>({...f,name:e.target.value}))} /></div>
          <div style={{marginBottom:14}}><SL>Amount ({curSymbol})</SL><IB type="number" className="num-input" placeholder="0.00" value={recurForm.amount} onChange={e=>setRecurForm(f=>({...f,amount:e.target.value}))} /></div>
          <div style={{marginBottom:14}}>
            <SL>Frequency</SL>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {RECUR_FREQ.map(fr=><Chip key={fr.id} active={recurForm.freq===fr.id} color={accent} onClick={()=>setRecurForm(f=>({...f,freq:fr.id}))}>{fr.label}</Chip>)}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <SL>Account</SL>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {accounts.map(a=><Chip key={a.id} active={recurForm.accountId===a.id} color={a.color} onClick={()=>setRecurForm(f=>({...f,accountId:a.id}))}>{a.icon} {a.name}</Chip>)}
            </div>
          </div>
          <div style={{marginBottom:14}}><SL>Category</SL><CatChips value={recurForm.category} onChange={v=>setRecurForm(f=>({...f,category:v}))} /></div>
          <div style={{marginBottom:28}}><SL>Start Date</SL><IB type="date" value={recurForm.startDate} onChange={e=>setRecurForm(f=>({...f,startDate:e.target.value}))} style={{colorScheme:T.dark?"dark":"light"}} /></div>
          <SaveBtn label="Save Recurring" onClick={addRecurring} disabled={!recurForm.name.trim()||!recurForm.amount} />
          <div style={{height:40}} />
        </div>
      )}

      {/* ── FAB ── */}
      {["log","summary","settings"].includes(view)&&(
        <button className="add-fab" onClick={()=>{setForm(blankForm());setView("add");}}>+</button>
      )}

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:T.bg, borderTop:`1px solid ${T.border}`, padding:"10px 0 16px", display:"flex", justifyContent:"space-around", zIndex:9 }}>
        {[["log","📋","LOG"],["summary","📊","SUMMARY"],["settings","⚙️","SETTINGS"]].map(([id,icon,lbl])=>(
          <button key={id} className="tab-btn" onClick={()=>setView(id)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, color:view===id?accent:T.textMuted, fontSize:9, letterSpacing:2 }}>
            <span style={{fontSize:18}}>{icon}</span>{lbl}
          </button>
        ))}
      </div>
    </div>
  );
}
