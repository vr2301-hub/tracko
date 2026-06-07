import { useState, useEffect, useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// THEME / FONT / ACCENT SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

const THEMES = {
  midnight: { id:"midnight", label:"Midnight", dark:true,  bg:"#0F0F13", surface:"#1A1A24", surfaceAlt:"#13131A", surfaceUp:"#222230", border:"#2A2A3A", text:"#F0EDF8", textMuted:"#6B6B80", textSub:"#BEBACF" },
  obsidian: { id:"obsidian", label:"Obsidian", dark:true,  bg:"#080B10", surface:"#101520", surfaceAlt:"#0C1018", surfaceUp:"#182030", border:"#1E2A40", text:"#E8EDF8", textMuted:"#4A5870", textSub:"#8BA0C0" },
  slate:    { id:"slate",    label:"Slate",    dark:true,  bg:"#0D1117", surface:"#161B26", surfaceAlt:"#0A0F16", surfaceUp:"#1E2535", border:"#252D3A", text:"#E6EDF6", textMuted:"#50586A", textSub:"#8B96A8" },
  graphite: { id:"graphite", label:"Graphite", dark:true,  bg:"#111111", surface:"#1C1C1C", surfaceAlt:"#161616", surfaceUp:"#252525", border:"#2E2E2E", text:"#EEEEEE", textMuted:"#666666", textSub:"#AAAAAA" },
  ivory:    { id:"ivory",    label:"Ivory",    dark:false, bg:"#F5F2EC", surface:"#FFFFFF", surfaceAlt:"#EDE9E1", surfaceUp:"#FAF8F4", border:"#DDD9D0", text:"#1A1714", textMuted:"#8A8680", textSub:"#4A4744" },
  paper:    { id:"paper",    label:"Paper",    dark:false, bg:"#F0F0EB", surface:"#FFFFFF", surfaceAlt:"#E8E8E2", surfaceUp:"#F8F8F4", border:"#D8D8D2", text:"#1E1E1E", textMuted:"#808080", textSub:"#505050" },
  cloud:    { id:"cloud",    label:"Cloud",    dark:false, bg:"#EAF0F8", surface:"#FFFFFF", surfaceAlt:"#DDEAF6", surfaceUp:"#F2F7FD", border:"#C8D8EC", text:"#18253A", textMuted:"#6880A0", textSub:"#304060" },
};

const FONTS = {
  sans:    { id:"sans",    label:"Sans",    import:"Inter:wght@400;500;600;700",                                         family:"'Inter',sans-serif",              display:"'Inter',sans-serif",            weight:"700" },
  jakarta: { id:"jakarta", label:"Jakarta", import:"Plus+Jakarta+Sans:wght@400;500;600;700",                              family:"'Plus Jakarta Sans',sans-serif",  display:"'Plus Jakarta Sans',sans-serif", weight:"700" },
  rounded: { id:"rounded", label:"Rounded", import:"Nunito:wght@400;600;700;800",                                         family:"'Nunito',sans-serif",             display:"'Nunito',sans-serif",            weight:"800" },
  mono:    { id:"mono",    label:"Mono",    import:"DM+Mono:wght@400;500",                                                family:"'DM Mono',monospace",             display:"'DM Mono',monospace",            weight:"500" },
  retro:   { id:"retro",   label:"Retro",   import:"Space+Grotesk:wght@400;500;600;700",                                 family:"'Space Grotesk',sans-serif",      display:"'Space Grotesk',sans-serif",     weight:"700" },
};

const ACCENTS = [
  { id:"ember",  label:"Ember",  color:"#F0623A", text:"#fff" },
  { id:"ocean",  label:"Ocean",  color:"#2563EB", text:"#fff" },
  { id:"violet", label:"Violet", color:"#7C3AED", text:"#fff" },
  { id:"jade",   label:"Jade",   color:"#059669", text:"#fff" },
  { id:"gold",   label:"Gold",   color:"#D97706", text:"#fff" },
  { id:"rose",   label:"Rose",   color:"#E11D48", text:"#fff" },
  { id:"cyan",   label:"Cyan",   color:"#0891B2", text:"#fff" },
  { id:"coral",  label:"Coral",  color:"#F43F5E", text:"#fff" },
];

const DEFAULT_APPEARANCE = { themeId:"midnight", fontId:"jakarta", accentId:"ember" };

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { id:"food",          label:"Food & Drink",   icon:"🍜", color:"#F0623A", isDefault:true },
  { id:"transport",     label:"Transport",      icon:"🚇", color:"#2563EB", isDefault:true },
  { id:"shopping",      label:"Shopping",       icon:"🛍️", color:"#7C3AED", isDefault:true },
  { id:"health",        label:"Health",         icon:"💊", color:"#059669", isDefault:true },
  { id:"entertainment", label:"Entertainment",  icon:"🎬", color:"#D97706", isDefault:true },
  { id:"bills",         label:"Bills",          icon:"🧾", color:"#E11D48", isDefault:true },
  { id:"other",         label:"Other",          icon:"📦", color:"#64748B", isDefault:true },
];

const CURRENCIES = [
  { code:"MYR", symbol:"RM",  label:"Malaysian Ringgit" },
  { code:"USD", symbol:"$",   label:"US Dollar" },
  { code:"SGD", symbol:"S$",  label:"Singapore Dollar" },
  { code:"GBP", symbol:"£",   label:"British Pound" },
  { code:"EUR", symbol:"€",   label:"Euro" },
  { code:"JPY", symbol:"¥",   label:"Japanese Yen" },
  { code:"AUD", symbol:"A$",  label:"Australian Dollar" },
  { code:"IDR", symbol:"Rp",  label:"Indonesian Rupiah" },
];

const RECUR_FREQ = [
  { id:"weekly", label:"Weekly" }, { id:"monthly", label:"Monthly" },
  { id:"quarterly", label:"Quarterly" }, { id:"yearly", label:"Yearly" },
];

const CAT_PALETTE    = ["#F0623A","#2563EB","#7C3AED","#059669","#D97706","#E11D48","#0891B2","#DB2777","#16A34A","#9333EA","#EA580C","#0284C7","#65A30D","#DC2626"];
const ACCOUNT_COLORS = ["#2563EB","#059669","#D97706","#7C3AED","#F0623A","#E11D48","#64748B","#0891B2"];

const DEFAULT_ACCOUNTS = [
  { id:"maybank",  name:"Maybank", icon:"🏦", color:"#D97706" },
  { id:"cash",     name:"Cash",    icon:"💵", color:"#059669" },
  { id:"touchngo", name:"TNG",     icon:"📱", color:"#2563EB" },
];

const APP_VERSION = 1;

const SK = {
  version:"et-version",
  expenses:"et-expenses",
  accounts:"et-accounts",
  recurring:"et-recurring",
  currency:"et-currency",
  categories:"et-categories",
  budgets:"et-budgets",
  appearance:"et-appearance",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fmtAmt(amount, code) {
  const cur = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  if (code === "JPY" || code === "IDR") return `${cur.symbol}${Math.round(amount).toLocaleString()}`;
  return `${cur.symbol}${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
function fmtDate(s) { return new Date(s + "T00:00:00").toLocaleDateString("en-MY", { day:"numeric", month:"short" }); }
function todayStr() { return new Date().toISOString().slice(0,10); }
function thisMonthStr() { return new Date().toISOString().slice(0,7); }
function groupByDate(list) {
  const g = {};
  for (const e of list) { if (!g[e.date]) g[e.date] = []; g[e.date].push(e); }
  return Object.entries(g).sort(([a],[b]) => b.localeCompare(a));
}
function nextDueDate(start, freq) {
  const d = new Date(start + "T00:00:00"), today = new Date(todayStr() + "T00:00:00");
  while (d <= today) {
    if (freq==="weekly") d.setDate(d.getDate()+7);
    else if (freq==="monthly") d.setMonth(d.getMonth()+1);
    else if (freq==="quarterly") d.setMonth(d.getMonth()+3);
    else d.setFullYear(d.getFullYear()+1);
  }
  return d.toISOString().slice(0,10);
}
function isDueSoon(s) {
  const diff = (new Date(s+"T00:00:00") - new Date(todayStr()+"T00:00:00")) / 86400000;
  return diff >= 0 && diff <= 5;
}
function hexAlpha(hex, a) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function lighten(hex, amt) {
  let r=parseInt(hex.slice(1,3),16)+amt, g=parseInt(hex.slice(3,5),16)+amt, b=parseInt(hex.slice(5,7),16)+amt;
  return `rgb(${Math.min(r,255)},${Math.min(g,255)},${Math.min(b,255)})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIE CHART
// ─────────────────────────────────────────────────────────────────────────────

function PieChart({ slices, size=180, T }) {
  const r = size / 2;
  const [hovered, setHovered] = useState(null);
  const paths = useMemo(() => {
    const total = slices.reduce((s,x) => s+x.value, 0);
    if (total === 0) return [];
    let angle = -Math.PI/2;
    return slices.map(sl => {
      const frac=sl.value/total, start=angle;
      angle += frac*2*Math.PI;
      const end=angle;
      const x1=r+r*.82*Math.cos(start), y1=r+r*.82*Math.sin(start);
      const x2=r+r*.82*Math.cos(end),   y2=r+r*.82*Math.sin(end);
      const midA=(start+end)/2;
      return { ...sl, d:`M${r},${r} L${x1},${y1} A${r*.82},${r*.82} 0 ${frac>.5?1:0},1 ${x2},${y2} Z`, frac, midA };
    });
  }, [slices, r]);
  if (!paths.length) return (
    <div style={{width:size,height:size,borderRadius:"50%",background:T.surfaceUp,display:"flex",alignItems:"center",justifyContent:"center",color:T.textMuted,fontSize:11}}>No data</div>
  );
  const hov = hovered !== null ? paths[hovered] : null;
  return (
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} style={{filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))"}}>
        <circle cx={r} cy={r} r={r} fill={T.surface}/>
        {paths.map((p,i) => (
          <path key={i} d={p.d} fill={p.color}
            style={{cursor:"pointer",opacity:hovered===null||hovered===i?1:0.35,transition:"opacity .15s",transform:hovered===i?`translate(${Math.cos(p.midA)*6}px,${Math.sin(p.midA)*6}px)`:"none"}}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            onTouchStart={()=>setHovered(i)} onTouchEnd={()=>setHovered(null)}/>
        ))}
        <circle cx={r} cy={r} r={r*.42} fill={T.bg}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        {hov
          ? <><div style={{fontSize:20}}>{hov.icon}</div><div style={{fontSize:11,color:hov.color,fontWeight:600,marginTop:2}}>{(hov.frac*100).toFixed(0)}%</div></>
          : <div style={{fontSize:9,color:T.textMuted,letterSpacing:2,textTransform:"uppercase"}}>Total</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ExpenseTracker() {
  const [expenses,   setExpenses]   = useState([]);
  const [accounts,   setAccounts]   = useState(DEFAULT_ACCOUNTS);
  const [recurring,  setRecurring]  = useState([]);
  const [currency,   setCurrency]   = useState("MYR");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [budgets,    setBudgets]    = useState({ overall:"", byCategory:{} });
  const [appearance, setAppearance] = useState(DEFAULT_APPEARANCE);

  const [view,     setView]     = useState("log");
  const [filter,   setFilter]   = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const [query, setQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(thisMonthStr());
  const [editingId, setEditingId] = useState(null);

  const blankForm    = () => ({ amount:"", note:"", category:categories[0]?.id??"food", date:todayStr(), accountId:"" });
  const blankAccount = () => ({ name:"", icon:"🏦", color:ACCOUNT_COLORS[0] });
  const blankRecur   = () => ({ name:"", amount:"", category:"bills", accountId:"", freq:"monthly", startDate:todayStr() });
  const blankCat     = () => ({ label:"", icon:"📌", color:CAT_PALETTE[0] });

  const [form,        setForm]        = useState(blankForm());
  const [accForm,     setAccForm]     = useState(blankAccount());
  const [recurForm,   setRecurForm]   = useState(blankRecur());
  const [catForm,     setCatForm]     = useState(blankCat());
  const [budgetDraft, setBudgetDraft] = useState({ overall:"", byCategory:{} });
  const [appDraft,    setAppDraft]    = useState(DEFAULT_APPEARANCE);

  const amountRef = useRef();

  useEffect(() => {
    const load = (k,set) => { try { const s=localStorage.getItem(k); if(s) set(JSON.parse(s)); } catch {} };
    load(SK.expenses, setExpenses); load(SK.accounts, setAccounts);
    load(SK.recurring, setRecurring); load(SK.categories, setCategories);
    load(SK.budgets, v => { setBudgets(v); setBudgetDraft(v); });
    load(SK.appearance, v => { setAppearance(v); setAppDraft(v); });
    try { const s=localStorage.getItem(SK.currency); if(s) setCurrency(s); } catch {}
    try { localStorage.setItem(SK.version, String(APP_VERSION)); } catch {}
  }, []);

  useEffect(()=>{ try{localStorage.setItem(SK.expenses,   JSON.stringify(expenses));}   catch{} },[expenses]);
  useEffect(()=>{ try{localStorage.setItem(SK.accounts,   JSON.stringify(accounts));}   catch{} },[accounts]);
  useEffect(()=>{ try{localStorage.setItem(SK.recurring,  JSON.stringify(recurring));}  catch{} },[recurring]);
  useEffect(()=>{ try{localStorage.setItem(SK.categories, JSON.stringify(categories));} catch{} },[categories]);
  useEffect(()=>{ try{localStorage.setItem(SK.budgets,    JSON.stringify(budgets));}    catch{} },[budgets]);
  useEffect(()=>{ try{localStorage.setItem(SK.appearance, JSON.stringify(appearance));} catch{} },[appearance]);
  useEffect(()=>{ try{localStorage.setItem(SK.currency,   currency);}                  catch{} },[currency]);
  useEffect(()=>{ if(view==="add") setTimeout(()=>amountRef.current?.focus(),120); },[view]);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const T = THEMES[appearance.themeId] ?? THEMES.midnight;
  const F = FONTS[appearance.fontId]   ?? FONTS.jakarta;
  const A = ACCENTS.find(a=>a.id===appearance.accentId) ?? ACCENTS[0];
  const accent = A.color;
  const accentText = A.text;

  // ── Actions ───────────────────────────────────────────────────────────────
  function saveExpense() {
    const amount = parseFloat(form.amount);
  
    if (!form.amount || isNaN(amount) || amount <= 0) return;
  
    const payload = {
      amount,
      note:
        form.note.trim() ||
        categories.find(c => c.id === form.category)?.label ||
        "Expense",
      category: form.category,
      date: form.date,
      accountId: form.accountId || accounts[0]?.id || "",
    };
  
    if (editingId) {
      setExpenses(prev =>
        prev.map(e =>
          e.id === editingId
            ? {
                ...e,
                ...payload,
              }
            : e
        )
      );
  
      setEditingId(null);
    } else {
      setExpenses(prev => [
        {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Date.now()),
          ...payload,
        },
        ...prev,
      ]);
    }
  
    setForm(blankForm());
    setView("log");
  }

  function startEditExpense(e) {
    setEditingId(e.id);
  
    setForm({
      amount: String(e.amount),
      note: e.note || "",
      category: e.category,
      date: e.date,
      accountId: e.accountId || accounts[0]?.id || "",
    });
  
    setDeleteId(null);
    setView("add");
  }

  function exportData() {
    const data = {
      appVersion: APP_VERSION,
      expenses,
      accounts,
      recurring,
      currency,
      categories,
      budgets,
      appearance,
      exportedAt: new Date().toISOString(),
    };
  
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
  
    a.href = url;
    a.download = `expense-tracker-backup-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const fmt        = n => fmtAmt(n, currency);
  const curSymbol  = CURRENCIES.find(c=>c.code===currency)?.symbol??"RM";
  const filtered = expenses.filter(e => {
    const cat = categories.find(c => c.id === e.category);
    const acc = accounts.find(a => a.id === e.accountId);
  
    const matchesCategory = filter === "all" || e.category === filter;
  
    const q = query.trim().toLowerCase();
  
    const matchesQuery =
      !q ||
      e.note?.toLowerCase().includes(q) ||
      cat?.label?.toLowerCase().includes(q) ||
      acc?.name?.toLowerCase().includes(q);
  
    return matchesCategory && matchesQuery;
  });
  
  const grouped = groupByDate(filtered);
  
  const monthExp = expenses.filter(e => e.date.startsWith(selectedMonth));
  const monthTotal = monthExp.reduce((s,e)=>s+e.amount,0);
  const catTotals  = categories.map(c=>({...c,total:monthExp.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0)}));
  const catWithData= catTotals.filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  const maxCat     = catWithData[0]?.total||1;
  const accTotals  = accounts.map(a=>({...a,total:monthExp.filter(e=>e.accountId===a.id).reduce((s,e)=>s+e.amount,0)})).filter(a=>a.total>0);
  const dueSoon    = recurring.filter(r=>r.nextDue&&isDueSoon(r.nextDue));
  const overallBudget = parseFloat(budgets.overall)||0;
  const overallRemain = overallBudget>0 ? overallBudget-monthTotal : null;
  const pieSlices  = catWithData.map(c=>({...c,value:c.total}));

  // ── Shared UI Atoms ───────────────────────────────────────────────────────

  // Section label
  const SL = ({children,style={}}) => (
    <div style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:2,marginBottom:10,fontFamily:F.family,...style}}>{children}</div>
  );

  // Solid filled primary button
  const PrimaryBtn = ({label,onClick,disabled,icon,style={}}) => (
    <button onClick={onClick} disabled={disabled}
      style={{width:"100%",padding:"15px 20px",background:disabled?T.surfaceUp:accent,border:"none",borderRadius:14,color:disabled?T.textMuted:accentText,fontSize:14,fontWeight:600,cursor:disabled?"default":"pointer",fontFamily:F.family,transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:disabled?"none":`0 4px 16px ${hexAlpha(accent,.35)}`,letterSpacing:0.3,...style}}>
      {icon&&<span style={{fontSize:16}}>{icon}</span>}{label}
    </button>
  );

  // Solid filled secondary button (smaller)
  const SolidBtn = ({label,onClick,color,textColor="#fff",style={}}) => (
    <button onClick={onClick}
      style={{padding:"8px 16px",background:color,border:"none",borderRadius:10,color:textColor,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F.family,transition:"all .15s",letterSpacing:0.2,boxShadow:`0 2px 8px ${hexAlpha(color,.3)}`,...style}}>
      {label}
    </button>
  );

  // Solid filled tag/chip (no outline, filled bg)
  const Tag = ({active,color,children,onClick,style={}}) => (
    <button onClick={onClick}
      style={{padding:"8px 14px",background:active?color:T.surfaceUp,border:"none",borderRadius:10,color:active?("#fff"):T.textSub,fontSize:12,fontWeight:active?600:400,cursor:"pointer",fontFamily:F.family,transition:"all .15s",whiteSpace:"nowrap",...style}}>
      {children}
    </button>
  );

  // Filled input
  const IB = ({style={}, ...p}) => (
    <input {...p} style={{background:T.surfaceUp,border:`2px solid ${T.border}`,borderRadius:12,padding:"12px 16px",width:"100%",color:T.text,fontSize:14,fontFamily:F.family,transition:"border-color .15s",...style}}
      onFocus={e=>e.target.style.borderColor=accent}
      onBlur={e=>e.target.style.borderColor=T.border}/>
  );

  // Filled select
  const SB = ({children,style={},...p}) => (
    <select {...p} style={{background:T.surfaceUp,border:`2px solid ${T.border}`,borderRadius:12,padding:"12px 16px",width:"100%",color:T.text,fontSize:14,fontFamily:F.family,colorScheme:T.dark?"dark":"light",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",...style}}>
      {children}
    </select>
  );

  // Card
  const Card = ({children,style={}}) => (
    <div style={{background:T.surface,borderRadius:16,padding:"16px",border:`1px solid ${T.border}`,boxShadow:T.dark?"0 2px 12px rgba(0,0,0,0.2)":"0 2px 12px rgba(0,0,0,0.06)",...style}}>{children}</div>
  );

  // Back row
  const BRow = ({label,onBack}) => (
    <div style={{display:"flex",alignItems:"center",marginBottom:24,gap:12}}>
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:T.surfaceUp,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:T.text}}>←</button>
      <span style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:F.family}}>{label}</span>
    </div>
  );

  // Section header row with action
  const SectionRow = ({label,action,onAction}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <SL style={{marginBottom:0}}>{label}</SL>
      {action&&<SolidBtn label={action} onClick={onAction} color={accent} style={{padding:"6px 14px",fontSize:11,boxShadow:"none"}}/>}
    </div>
  );

  // Category toggle grid
  const CatGrid = ({value,onChange}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {categories.map(c=>(
        <button key={c.id} onClick={()=>onChange(c.id)}
          style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",background:value===c.id?c.color:T.surfaceUp,border:`2px solid ${value===c.id?c.color:T.border}`,borderRadius:12,cursor:"pointer",fontFamily:F.family,fontSize:12,fontWeight:value===c.id?600:400,color:value===c.id?"#fff":T.textSub,transition:"all .15s"}}>
          <span style={{fontSize:22}}>{c.icon}</span>{c.label}
        </button>
      ))}
    </div>
  );

  // Account toggle row
  const AccGrid = ({value,onChange}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {accounts.map(a=>(
        <button key={a.id} onClick={()=>onChange(a.id)}
          style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",background:value===a.id?a.color:T.surfaceUp,border:`2px solid ${value===a.id?a.color:T.border}`,borderRadius:12,cursor:"pointer",fontFamily:F.family,fontSize:12,fontWeight:value===a.id?600:400,color:value===a.id?"#fff":T.textSub,transition:"all .15s"}}>
          <span style={{fontSize:22}}>{a.icon}</span>{a.name}
        </button>
      ))}
    </div>
  );

  // CSS injection
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=${F.import}&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    ::-webkit-scrollbar{width:0;}
    input,select,button{outline:none;}
    .fade-in{animation:fi .22s ease;}
    @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .num-input::-webkit-outer-spin-button,.num-input::-webkit-inner-spin-button{-webkit-appearance:none;}
    .entry-row{border-bottom:1px solid ${T.border};transition:background .12s;}
    .entry-row:hover{background:${T.surfaceUp};}
    .del-btn{opacity:1;transition:opacity .2s;}

    @media (hover:hover) {
      .del-btn{opacity:0;}
      .entry-row:hover .del-btn{opacity:1;}
    }
    .add-fab{position:fixed;bottom:86px;right:calc(50% - 210px + 20px);width:56px;height:56px;border-radius:18px;background:${accent};border:none;cursor:pointer;font-size:28px;font-weight:300;display:flex;align-items:center;justify-content:center;color:${accentText};box-shadow:0 6px 24px ${hexAlpha(accent,.45)};transition:transform .15s,box-shadow .15s;z-index:10;}
    .add-fab:hover{transform:scale(1.07);box-shadow:0 8px 28px ${hexAlpha(accent,.6)};}
    .add-fab:active{transform:scale(.93);}
    .nav-btn{background:none;border:none;cursor:pointer;font-family:${F.family};display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .1s;}
    .nav-btn:active{transform:scale(.92);}
    .press:active{transform:scale(.96);}
    input[type=date]::-webkit-calendar-picker-indicator{filter:${T.dark?"invert(1)":"none"};opacity:0.5;}
  `;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:F.family,display:"flex",flexDirection:"column",maxWidth:420,margin:"0 auto",position:"relative"}}>
      <style>{css}</style>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{padding:"24px 20px 16px",background:T.surface,borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>
            {new Date(selectedMonth + "-01T00:00:00").toLocaleDateString("en-MY", { month: "long",year: "numeric",})}
            </div>
            <div style={{fontSize:34,fontWeight:F.weight,color:T.text,letterSpacing:-1,lineHeight:1}}>{fmt(monthTotal)}</div>
            {overallBudget>0&&(
              <div style={{marginTop:10}}>
                <div style={{height:6,width:"100%",maxWidth:200,background:T.surfaceUp,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,background:overallRemain<0?"#E11D48":accent,width:`${Math.min(monthTotal/overallBudget,1)*100}%`,transition:"width .4s"}}/>
                </div>
                <div style={{marginTop:5,fontSize:11,fontWeight:500,color:overallRemain<0?"#E11D48":"#10B981"}}>
                  {overallRemain<0?`${fmt(Math.abs(overallRemain))} over budget`:`${fmt(overallRemain)} remaining`}
                </div>
              </div>
            )}
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            {dueSoon.length>0&&(
              <div style={{background:"#E11D48",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:8,letterSpacing:0.5}}>
                ⏰ {dueSoon.length} DUE
              </div>
            )}
            <div style={{background:T.surfaceUp,borderRadius:10,padding:"6px 12px",fontSize:11,color:T.textMuted,fontWeight:500}}>
              {monthExp.length} entries
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ADD EXPENSE
      ══════════════════════════════════════════════════════════ */}
      {view==="add"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>
        <BRow
          label={editingId ? "Edit Expense" : "Add Expense"}
          onBack={() => {
            setEditingId(null);
            setForm(blankForm());
            setView("log");
          }}
        />
          {/* Amount card */}
          <Card style={{marginBottom:16,textAlign:"center",padding:"24px 20px"}}>
            <div style={{fontSize:11,fontWeight:600,color:T.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Amount</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              <span style={{fontSize:28,fontWeight:F.weight,color:T.textMuted}}>{curSymbol}</span>
              <input ref={amountRef} type="number" className="num-input" placeholder="0.00" value={form.amount}
                onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&saveExpense()}
                style={{background:"none",border:"none",fontSize:44,width:180,color:form.amount?accent:T.textMuted,fontWeight:F.weight,textAlign:"center",fontFamily:F.family}}/>
            </div>
            <div style={{height:2,background:form.amount?accent:T.border,maxWidth:180,margin:"8px auto 0",borderRadius:1,transition:"background .2s"}}/>
            <div style={{
                          display:"flex",
                          gap:8,
                          justifyContent:"center",
                          marginTop:16,
                          flexWrap:"wrap",
                        }}>
                          {[5, 10, 20, 50, 100].map(v => (
                            <button
                              key={v}
                              onClick={() => setForm(f => ({ ...f, amount: String(v) }))}
                              style={{
                                background:T.surfaceUp,
                                border:`1px solid ${T.border}`,
                                borderRadius:10,
                                color:T.textSub,
                                padding:"7px 12px",
                                fontSize:12,
                                fontWeight:600,
                                cursor:"pointer",
                                fontFamily:F.family,
                              }}
                            >
                              {curSymbol}{v}
                            </button>
                          ))}
              </div>
          </Card>

          {/* Account */}
          <div style={{marginBottom:16}}>
            <SL>Account</SL>
            <AccGrid value={form.accountId} onChange={v=>setForm(f=>({...f,accountId:v}))}/>
          </div>

          {/* Category */}
          <div style={{marginBottom:16}}>
            <SL>Category</SL>
            <CatGrid value={form.category} onChange={v=>setForm(f=>({...f,category:v}))}/>
          </div>

          {/* Note */}
          <div style={{ marginBottom: 14 }}>
            <SL>Note</SL>
            <IB
              type="text"
              placeholder="What was this for?"
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && saveExpense()}
            />
          </div>

          {/* Date */}
          <div style={{marginBottom:28}}>
            <SL>Date</SL>
            <IB type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{colorScheme:T.dark?"dark":"light"}}/>
          </div>

          <PrimaryBtn
              label={editingId ? "Save Changes" : "Add Expense"}
              onClick={saveExpense}
              disabled={!form.amount || parseFloat(form.amount) <= 0}
              icon={editingId ? "✓" : "＋"}
            />          
          <div style={{height:40}}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          LOG
      ══════════════════════════════════════════════════════════ */}
      {view==="log"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto"}}>
                    <div style={{
            padding:"12px 16px",
            background:T.surface,
            borderBottom:`1px solid ${T.border}`,
          }}>
            <IB
              type="search"
              placeholder="Search expenses, categories, accounts..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {/* Filter bar */}
          <div style={{padding:"12px 16px",display:"flex",gap:8,overflowX:"auto",background:T.surface,borderBottom:`1px solid ${T.border}`}}>
            <Tag active={filter==="all"} color={accent} onClick={()=>setFilter("all")}>All</Tag>
            {categories.map(c=>(
              <Tag key={c.id} active={filter===c.id} color={c.color} onClick={()=>setFilter(filter===c.id?"all":c.id)}
                style={{padding:"8px 12px"}}>
                {c.icon}
              </Tag>
            ))}
          </div>

          {filtered.length===0?(
            <div style={{textAlign:"center",padding:"60px 20px",color:T.textMuted}}>
              <div style={{fontSize:40,marginBottom:12}}>📋</div>
              <div style={{fontSize:14,fontWeight:500}}>
                  {query || filter !== "all" ? "No matching expenses" : "No expenses yet"}
                </div>
                <div style={{fontSize:12,marginTop:4}}>
                  {query || filter !== "all"
                    ? "Try changing your search or filter"
                    : "Tap + to add your first one"}
                </div>
            </div>
          ):grouped.map(([date,entries])=>(
            <div key={date}>
              {/* Date group header */}
              <div style={{padding:"10px 20px",background:T.surfaceAlt,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:600,color:T.textMuted}}>{fmtDate(date)}</span>
                <span style={{fontSize:12,fontWeight:700,color:T.text}}>{fmt(entries.reduce((s,e)=>s+e.amount,0))}</span>
              </div>
              {entries.map(e=>{
                const cat=categories.find(c=>c.id===e.category)||{icon:"📦",label:"Other",color:"#64748B"};
                const acc=accounts.find(a=>a.id===e.accountId);
                return (
                  <div key={e.id} className="entry-row" style={{display:"flex",alignItems:"center",padding:"14px 20px",gap:14}}>
                    {/* Icon bubble */}
                    <div style={{width:50,height:50,borderRadius:15,background:hexAlpha(cat.color,.15),display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                      {cat.icon}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:500,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note}</div>
                      <div style={{display:"flex",gap:6,marginTop:3,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontSize:10,fontWeight:600,color:"#fff",background:cat.color,padding:"2px 8px",borderRadius:6}}>{cat.label}</span>
                        {acc&&<span style={{fontSize:10,fontWeight:500,color:acc.color,background:hexAlpha(acc.color,.15),padding:"2px 8px",borderRadius:6}}>{acc.icon} {acc.name}</span>}
                      </div>
                    </div>
                    <div style={{fontSize:15,fontWeight:700,color:T.text,flexShrink:0}}>{fmt(e.amount)}</div>
                    {deleteId===e.id?(
                                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                                        <button
                                          onClick={() => startEditExpense(e)}
                                          style={{
                                            background:T.surfaceUp,
                                            border:"none",
                                            borderRadius:8,
                                            padding:"6px 10px",
                                            color:T.text,
                                            fontSize:11,
                                            fontWeight:600,
                                            cursor:"pointer",
                                            fontFamily:F.family,
                                          }}
                                        >
                                          Edit
                                        </button>

                                        <button
                                          onClick={() => {
                                            setExpenses(prev => prev.filter(x => x.id !== e.id));
                                            setDeleteId(null);
                                          }}
                                          style={{
                                            background:"#E11D48",
                                            border:"none",
                                            borderRadius:8,
                                            padding:"6px 10px",
                                            color:"#fff",
                                            fontSize:11,
                                            fontWeight:600,
                                            cursor:"pointer",
                                            fontFamily:F.family,
                                          }}
                                        >
                                          Delete
                                        </button>

                                        <button
                                          onClick={() => setDeleteId(null)}
                                          style={{
                                            background:T.surfaceUp,
                                            border:"none",
                                            borderRadius:8,
                                            padding:"6px 10px",
                                            color:T.text,
                                            fontSize:11,
                                            fontWeight:600,
                                            cursor:"pointer",
                                            fontFamily:F.family,
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ):(
                                      <buttonw
                                        className="del-btn"
                                        onClick={() => setDeleteId(e.id)}
                                        style={{
                                          background:"none",
                                          border:"none",
                                          cursor:"pointer",
                                          color:T.textMuted,
                                          fontSize:18,
                                          padding:"0 2px",
                                          flexShrink:0,
                                        }}
                                      >
                                        ⋯
                                      </button>
                                    )}
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{height:140}}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SUMMARY
      ══════════════════════════════════════════════════════════ */}
      {view==="summary"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>

        <Card style={{marginBottom:16}}>
          <SL>Month</SL>
          <IB
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            style={{colorScheme:T.dark?"dark":"light"}}
          />
        </Card>

          {/* Pie chart card */}
          <Card style={{marginBottom:20}}>
            <SL>Monthly Overview</SL>
            {pieSlices.length===0?(
              <div style={{textAlign:"center",padding:"30px 0",color:T.textMuted,fontSize:13}}>No data this month</div>
            ):(
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <PieChart slices={pieSlices} size={160} T={T}/>
                <div style={{flex:1,minWidth:0}}>
                  {pieSlices.map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{width:10,height:10,borderRadius:3,background:s.color,flexShrink:0}}/>
                      <div style={{fontSize:11,fontWeight:500,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.textSub}}>{s.icon} {s.label}</div>
                      <div style={{fontSize:11,fontWeight:700,color:s.color,flexShrink:0}}>{((s.total/monthTotal)*100).toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Category breakdown */}
          <Card style={{marginBottom:20}}>
            <SL>By Category</SL>
            {catTotals.filter(c=>c.total>0||(budgets.byCategory[c.id]&&parseFloat(budgets.byCategory[c.id])>0)).length===0?(
              <div style={{color:T.textMuted,fontSize:12}}>No data yet.</div>
            ):catTotals.filter(c=>c.total>0||(budgets.byCategory[c.id]&&parseFloat(budgets.byCategory[c.id])>0)).map(c=>{
              const planned=parseFloat(budgets.byCategory[c.id])||0;
              const remain=planned>0?planned-c.total:null;
              const over=remain!==null&&remain<0;
              return (
                <div key={c.id} style={{marginBottom:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:42,height:42,borderRadius:12,background:hexAlpha(c.color,.18),display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{c.icon}</div>
                      <span style={{fontSize:13,fontWeight:500,color:T.text}}>{c.label}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:c.color}}>{fmt(c.total)}</div>
                      {planned>0&&<div style={{fontSize:10,color:T.textMuted}}>of {fmt(planned)}</div>}
                    </div>
                  </div>
                  <div style={{height:6,background:T.surfaceUp,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:3,background:over?"#E11D48":c.color,width:`${(planned>0?Math.min(c.total/planned,1):c.total/maxCat)*100}%`,transition:"width .5s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,fontWeight:500}}>
                    <span style={{color:T.textMuted}}>{((c.total/monthTotal)*100||0).toFixed(0)}% of total</span>
                    {remain!==null&&<span style={{color:over?"#E11D48":"#10B981"}}>{over?`Over by ${fmt(Math.abs(remain))}`:`${fmt(remain)} left`}</span>}
                  </div>
                </div>
              );
            })}
          </Card>

          {/* By Account */}
          {accTotals.length>0&&(
            <Card style={{marginBottom:20}}>
              <SL>By Account</SL>
              {accTotals.map(a=>(
                <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:44,height:44,borderRadius:12,background:hexAlpha(a.color,.18),display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{a.icon}</div>
                    <span style={{fontSize:13,fontWeight:500,color:T.text}}>{a.name}</span>
                  </div>
                  <span style={{fontSize:14,fontWeight:700,color:a.color}}>{fmt(a.total)}</span>
                </div>
              ))}
            </Card>
          )}

          {/* Quick stats */}
          {catWithData.length>0&&(
            <Card>
              <SL>Quick Stats</SL>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[
                  ["Daily Avg", fmt(monthTotal/new Date().getDate()), accent],
                  ["Entries",   monthExp.length.toString(),          accent],
                  ["Top",       catWithData[0]?.icon+" "+catWithData[0]?.label.split(" ")[0], catWithData[0]?.color],
                ].map(([lbl,val,col])=>(
                  <div key={lbl} style={{background:T.surfaceUp,borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
                    <div style={{fontSize:14,fontWeight:700,color:col,marginBottom:4}}>{val}</div>
                    <div style={{fontSize:10,color:T.textMuted,fontWeight:500}}>{lbl}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <div style={{height:120}}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SETTINGS
      ══════════════════════════════════════════════════════════ */}
      {view==="settings"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>

          {/* Currency */}
          <Card style={{marginBottom:16}}>
            <SL>Currency</SL>
            <SB value={currency} onChange={e=>setCurrency(e.target.value)}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}</SB>
          </Card>

          <Card style={{marginBottom:16}}>
  <SectionRow
    label="Backup"
    action="Export"
    onAction={exportData}
  />

  <div style={{
    background:T.surfaceUp,
    borderRadius:12,
    padding:"12px 14px",
  }}>
    <div style={{
      fontSize:13,
      fontWeight:600,
      color:T.text,
      marginBottom:4,
    }}>
      Export your data
    </div>

    <div style={{
      fontSize:11,
      color:T.textMuted,
      lineHeight:1.5,
    }}>
      Download a JSON backup containing expenses, accounts, categories,
      recurring expenses, budgets, currency, and appearance settings.
    </div>
  </div>
</Card>
                   
          {/* Appearance */}
          <Card style={{marginBottom:16}}>
            <SectionRow label="Appearance" action="Customise" onAction={()=>{setAppDraft(appearance);setView("appearance");}}/>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:T.surfaceUp,borderRadius:12}}>
              <div style={{width:24,height:24,borderRadius:8,background:accent,flexShrink:0}}/>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{T.label} · {F.label} · {A.label}</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{T.dark?"Dark theme":"Light theme"}</div>
              </div>
            </div>
          </Card>

          {/* Budget */}
          <Card style={{marginBottom:16}}>
            <SectionRow label="Monthly Budget" action="Edit" onAction={()=>{setBudgetDraft(budgets);setView("editBudget");}}/>
            <div style={{background:T.surfaceUp,borderRadius:12,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:overallBudget>0?8:0}}>
                <span style={{color:T.textMuted,fontWeight:500}}>Overall budget</span>
                <span style={{fontWeight:700,color:T.text}}>{overallBudget>0?fmt(overallBudget):<span style={{color:T.textMuted}}>Not set</span>}</span>
              </div>
              {overallBudget>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:500}}>
                <span style={{color:T.textMuted}}>Spent: {fmt(monthTotal)}</span>
                <span style={{color:overallRemain<0?"#E11D48":"#10B981"}}>{overallRemain<0?`Over by ${fmt(Math.abs(overallRemain))}`:`${fmt(overallRemain)} left`}</span>
              </div>}
            </div>
          </Card>

          {/* Accounts */}
          <Card style={{marginBottom:16}}>
            <SectionRow label="Accounts" action="+ Add" onAction={()=>setView("addAccount")}/>
            {accounts.map((a,i)=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:i>0?`1px solid ${T.border}`:"none"}}>
                <div style={{width:44,height:44,borderRadius:12,background:hexAlpha(a.color,.18),display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{a.icon}</div>
                <span style={{flex:1,fontSize:13,fontWeight:500,color:T.text}}>{a.name}</span>
                <button onClick={()=>setAccounts(prev=>prev.filter(x=>x.id!==a.id))}
                  style={{background:hexAlpha("#E11D48",.12),border:"none",borderRadius:8,padding:"6px 10px",color:"#E11D48",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F.family}}>Remove</button>
              </div>
            ))}
          </Card>

          {/* Categories */}
          <Card style={{marginBottom:16}}>
            <SectionRow label="Categories" action="+ Add" onAction={()=>{setCatForm(blankCat());setView("addCategory");}}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {categories.map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:6,background:hexAlpha(c.color,.15),border:`1.5px solid ${hexAlpha(c.color,.3)}`,borderRadius:10,padding:"7px 12px"}}>
                  <span style={{fontSize:20}}>{c.icon}</span>
                  <span style={{fontSize:12,fontWeight:500,color:c.color}}>{c.label}</span>
                  {!c.isDefault&&<button onClick={()=>setCategories(prev=>prev.filter(x=>x.id!==c.id))}
                    style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:13,padding:0,marginLeft:2,lineHeight:1}}>✕</button>}
                </div>
              ))}
            </div>
          </Card>

          {/* Recurring */}
          <Card style={{marginBottom:16}}>
            <SectionRow label="Recurring" action="+ Add" onAction={()=>setView("addRecurring")}/>
            {recurring.length===0&&<div style={{fontSize:12,color:T.textMuted,padding:"8px 0"}}>No recurring expenses yet.</div>}
            {recurring.map((r,i)=>{
              const cat=categories.find(c=>c.id===r.category)||{icon:"📦",color:"#64748B"};
              const acc=accounts.find(a=>a.id===r.accountId);
              const soon=isDueSoon(r.nextDue);
              return (
                <div key={r.id} style={{padding:"12px 0",borderTop:i>0?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:48,height:48,borderRadius:14,background:hexAlpha(cat.color,.18),display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{cat.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{r.name}</div>
                      <div style={{fontSize:11,color:T.textMuted,fontWeight:500}}>{RECUR_FREQ.find(f=>f.id===r.freq)?.label} · {acc?.icon} {acc?.name??"—"}</div>
                      <div style={{fontSize:11,marginTop:3,display:"flex",alignItems:"center",gap:6}}>
                        <span style={{color:soon?"#E11D48":T.textMuted}}>Next: {fmtDate(r.nextDue)}</span>
                        {soon&&<span style={{background:"#E11D48",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:6}}>DUE SOON</span>}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{fmt(r.amount)}</div>
                      <div style={{display:"flex",gap:6}}>
                        <SolidBtn label="Log" onClick={()=>logRecurringNow(r)} color={accent} style={{padding:"5px 10px",fontSize:10}}/>
                        <button onClick={()=>setRecurring(prev=>prev.filter(x=>x.id!==r.id))}
                          style={{background:hexAlpha("#E11D48",.12),border:"none",borderRadius:8,padding:"5px 10px",color:"#E11D48",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:F.family}}>Del</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
          <div style={{height:120}}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          APPEARANCE
      ══════════════════════════════════════════════════════════ */}
      {view==="appearance"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>
          <BRow label="Appearance" onBack={()=>setView("settings")}/>

          {/* Live preview */}
          {(()=>{
            const pT=THEMES[appDraft.themeId]??THEMES.midnight;
            const pF=FONTS[appDraft.fontId]??FONTS.jakarta;
            const pA=ACCENTS.find(a=>a.id===appDraft.accentId)??ACCENTS[0];
            return (
              <div style={{marginBottom:24,borderRadius:18,overflow:"hidden",boxShadow:`0 8px 32px ${hexAlpha(pA.color,.3)}`,border:`2px solid ${pA.color}`}}>
                <div style={{background:pT.surface,padding:"14px 16px 10px",fontFamily:pF.family,borderBottom:`1px solid ${pT.border}`}}>
                  <div style={{fontSize:10,fontWeight:600,color:pT.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>June 2026</div>
                  <div style={{fontSize:26,fontWeight:pF.weight,color:pT.text,letterSpacing:-1}}>RM 2,400.00</div>
                </div>
                <div style={{background:pT.bg,padding:"12px 16px",fontFamily:pF.family}}>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {[["🍜","Food",pA.color],["🚇","Transport",pT.surfaceUp],["🛍️","Shopping",pT.surfaceUp]].map(([icon,lbl,bg],i)=>(
                      <div key={i} style={{background:bg,borderRadius:10,padding:"7px 12px",fontSize:11,fontWeight:i===0?600:400,color:i===0?pA.text:pT.textSub,display:"flex",alignItems:"center",gap:5}}>
                        <span>{icon}</span>{lbl}
                      </div>
                    ))}
                  </div>
                  {[["🍜","Nasi Lemak","RM 8.50","#F0623A"],["🚇","LRT Pass","RM 60.00","#2563EB"]].map(([icon,note,amt,col],i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i===0?`1px solid ${pT.border}`:"none"}}>
                      <div style={{width:36,height:36,borderRadius:11,background:hexAlpha(col,.15),display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{icon}</div>
                      <span style={{flex:1,fontSize:13,color:pT.text,fontWeight:500}}>{note}</span>
                      <span style={{fontSize:13,fontWeight:700,color:col}}>{amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Theme grid */}
          <Card style={{marginBottom:16}}>
            <SL>Theme</SL>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {Object.values(THEMES).map(t=>(
                <button key={t.id} onClick={()=>setAppDraft(d=>({...d,themeId:t.id}))}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:appDraft.themeId===t.id?hexAlpha(accent,.15):T.surfaceUp,border:`2px solid ${appDraft.themeId===t.id?accent:T.border}`,borderRadius:12,padding:"10px 6px",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{width:36,height:28,borderRadius:8,background:t.bg,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    <div style={{width:18,height:12,borderRadius:4,background:t.surface,border:`1px solid ${t.border}`}}/>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,color:appDraft.themeId===t.id?accent:T.textMuted}}>{t.label}</span>
                  <span style={{fontSize:9,color:T.textMuted,background:T.border,padding:"1px 5px",borderRadius:4}}>{t.dark?"Dark":"Light"}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Font grid */}
          <Card style={{marginBottom:16}}>
            <SL>Font</SL>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {Object.values(FONTS).map(f=>(
                <button key={f.id} onClick={()=>setAppDraft(d=>({...d,fontId:f.id}))}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:appDraft.fontId===f.id?hexAlpha(accent,.15):T.surfaceUp,border:`2px solid ${appDraft.fontId===f.id?accent:T.border}`,borderRadius:12,padding:"12px 6px",cursor:"pointer",transition:"all .15s"}}>
                  <span style={{fontFamily:f.family,fontSize:20,fontWeight:f.weight,color:appDraft.fontId===f.id?accent:T.text}}>Aa</span>
                  <span style={{fontFamily:f.family,fontSize:9,fontWeight:600,color:appDraft.fontId===f.id?accent:T.textMuted}}>{f.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Accent colour */}
          <Card style={{marginBottom:24}}>
            <SL>Accent Colour</SL>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {ACCENTS.map(a=>(
                <button key={a.id} onClick={()=>setAppDraft(d=>({...d,accentId:a.id}))}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:appDraft.accentId===a.id?hexAlpha(a.color,.15):T.surfaceUp,border:`2px solid ${appDraft.accentId===a.id?a.color:T.border}`,borderRadius:12,padding:"10px 6px",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:a.color,boxShadow:appDraft.accentId===a.id?`0 3px 10px ${hexAlpha(a.color,.5)}`:"none",transition:"box-shadow .15s"}}/>
                  <span style={{fontSize:9,fontWeight:600,color:appDraft.accentId===a.id?a.color:T.textMuted}}>{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <PrimaryBtn label="Apply Changes" onClick={saveAppearance}/>
          <div style={{height:40}}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          EDIT BUDGET
      ══════════════════════════════════════════════════════════ */}
      {view==="editBudget"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>
          <BRow label="Monthly Budget" onBack={()=>setView("settings")}/>
          <Card style={{marginBottom:16}}>
            <SL>Overall Budget ({curSymbol})</SL>
            <IB type="number" className="num-input" placeholder="e.g. 3000" value={budgetDraft.overall} onChange={e=>setBudgetDraft(b=>({...b,overall:e.target.value}))}/>
            <div style={{fontSize:11,color:T.textMuted,marginTop:8,fontWeight:500}}>Leave blank to disable overall tracking.</div>
          </Card>
          <Card style={{marginBottom:24}}>
            <SL>Per Category</SL>
            {categories.map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:i>0?`1px solid ${T.border}`:"none"}}>
                <div style={{width:44,height:44,borderRadius:12,background:hexAlpha(c.color,.18),display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{c.icon}</div>
                <span style={{fontSize:13,fontWeight:500,flex:1,color:T.text}}>{c.label}</span>
                <IB type="number" className="num-input" placeholder="—" value={budgetDraft.byCategory[c.id]??""} onChange={e=>setBudgetDraft(b=>({...b,byCategory:{...b.byCategory,[c.id]:e.target.value}}))} style={{width:110,textAlign:"right",padding:"9px 12px"}}/>
              </div>
            ))}
          </Card>
          <PrimaryBtn label="Save Budget" onClick={()=>{setBudgets(budgetDraft);setView("settings");}}/>
          <div style={{height:40}}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADD ACCOUNT
      ══════════════════════════════════════════════════════════ */}
      {view==="addAccount"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>
          <BRow label="New Account" onBack={()=>setView("settings")}/>
          <Card style={{marginBottom:24}}>
            <div style={{marginBottom:16}}><SL>Account Name</SL><IB type="text" placeholder="e.g. CIMB, GrabPay…" value={accForm.name} onChange={e=>setAccForm(f=>({...f,name:e.target.value}))}/></div>
            <div style={{marginBottom:16}}><SL>Icon (emoji)</SL><IB type="text" placeholder="🏦" value={accForm.icon} maxLength={2} onChange={e=>setAccForm(f=>({...f,icon:e.target.value}))} style={{width:80}}/></div>
            <div><SL>Colour</SL>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {ACCOUNT_COLORS.map(col=><button key={col} onClick={()=>setAccForm(f=>({...f,color:col}))} style={{width:34,height:34,borderRadius:10,background:col,border:accForm.color===col?`3px solid ${T.text}`:"3px solid transparent",cursor:"pointer",boxShadow:accForm.color===col?`0 3px 10px ${hexAlpha(col,.5)}`:"none",transition:"all .15s"}}/>)}
              </div>
            </div>
          </Card>
          <PrimaryBtn label="Save Account" onClick={addAccount} disabled={!accForm.name.trim()}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADD CATEGORY
      ══════════════════════════════════════════════════════════ */}
      {view==="addCategory"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>
          <BRow label="New Category" onBack={()=>setView("settings")}/>
          <Card style={{marginBottom:24}}>
            <div style={{marginBottom:16}}><SL>Name</SL><IB type="text" placeholder="e.g. Education, Pets…" value={catForm.label} onChange={e=>setCatForm(f=>({...f,label:e.target.value}))}/></div>
            <div style={{marginBottom:16}}><SL>Icon (emoji)</SL><IB type="text" placeholder="📌" value={catForm.icon} maxLength={2} onChange={e=>setCatForm(f=>({...f,icon:e.target.value}))} style={{width:80}}/></div>
            <div style={{marginBottom:16}}><SL>Colour</SL>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {CAT_PALETTE.map(col=><button key={col} onClick={()=>setCatForm(f=>({...f,color:col}))} style={{width:32,height:32,borderRadius:10,background:col,border:catForm.color===col?`3px solid ${T.text}`:"3px solid transparent",cursor:"pointer",boxShadow:catForm.color===col?`0 3px 10px ${hexAlpha(col,.5)}`:"none",transition:"all .15s"}}/>)}
              </div>
            </div>
            <div style={{background:T.surfaceUp,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:hexAlpha(catForm.color,.2),display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{catForm.icon||"📌"}</div>
              <span style={{fontSize:14,fontWeight:600,color:catForm.color}}>{catForm.label||"Preview"}</span>
            </div>
          </Card>
          <PrimaryBtn label="Save Category" onClick={addCategory} disabled={!catForm.label.trim()}/>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADD RECURRING
      ══════════════════════════════════════════════════════════ */}
      {view==="addRecurring"&&(
        <div className="fade-in" style={{flex:1,overflowY:"auto",padding:20}}>
          <BRow label="New Recurring" onBack={()=>setView("settings")}/>
          <Card style={{marginBottom:24}}>
            <div style={{marginBottom:16}}><SL>Name</SL><IB type="text" placeholder="e.g. Gym membership, Rental…" value={recurForm.name} onChange={e=>setRecurForm(f=>({...f,name:e.target.value}))}/></div>
            <div style={{marginBottom:16}}><SL>Amount ({curSymbol})</SL><IB type="number" className="num-input" placeholder="0.00" value={recurForm.amount} onChange={e=>setRecurForm(f=>({...f,amount:e.target.value}))}/></div>
            <div style={{marginBottom:16}}>
              <SL>Frequency</SL>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {RECUR_FREQ.map(fr=>(
                  <button key={fr.id} onClick={()=>setRecurForm(f=>({...f,freq:fr.id}))}
                    style={{padding:"10px 6px",background:recurForm.freq===fr.id?accent:T.surfaceUp,border:`2px solid ${recurForm.freq===fr.id?accent:T.border}`,borderRadius:10,cursor:"pointer",fontFamily:F.family,fontSize:11,fontWeight:600,color:recurForm.freq===fr.id?"#fff":T.textSub,transition:"all .15s",boxShadow:recurForm.freq===fr.id?`0 3px 10px ${hexAlpha(accent,.35)}`:"none"}}>
                    {fr.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}><SL>Account</SL><AccGrid value={recurForm.accountId} onChange={v=>setRecurForm(f=>({...f,accountId:v}))}/></div>
            <div style={{marginBottom:16}}><SL>Category</SL><CatGrid value={recurForm.category} onChange={v=>setRecurForm(f=>({...f,category:v}))}/></div>
            <div><SL>Start Date</SL><IB type="date" value={recurForm.startDate} onChange={e=>setRecurForm(f=>({...f,startDate:e.target.value}))} style={{colorScheme:T.dark?"dark":"light"}}/></div>
          </Card>
          <PrimaryBtn label="Save Recurring" onClick={addRecurring} disabled={!recurForm.name.trim()||!recurForm.amount}/>
          <div style={{height:40}}/>
        </div>
      )}

      {/* ── FAB ───────────────────────────────────────────────── */}
      {["log","summary","settings"].includes(view)&&(
        <button
                className="add-fab"
                onClick={() => {
                  setEditingId(null);
                  setForm(blankForm());
                  setView("add");
                }}
              >
                +
        </button>


)}

      {/* ── BOTTOM NAV ────────────────────────────────────────── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:T.surface,borderTop:`1px solid ${T.border}`,padding:"10px 0 18px",display:"flex",justifyContent:"space-around",zIndex:9}}>
        {[["log","📋","Log"],["summary","📊","Summary"],["settings","⚙️","Settings"]].map(([id,icon,lbl])=>(
          <button key={id} className="nav-btn" onClick={()=>setView(id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:view===id?accent:T.textMuted,fontSize:10,fontWeight:view===id?700:500,fontFamily:F.family,background:"none",border:"none",cursor:"pointer",padding:"4px 16px"}}>
            <span style={{fontSize:22}}>{icon}</span>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}