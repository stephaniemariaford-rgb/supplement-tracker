import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// ── Supplement Database ──────────────────────────────────────────────────────
const SUPPLEMENT_DB = [
  { name: "Magnesium Glycinate", category: "Minerals", typicalDose: "200–400mg", doseOptions: ["200mg","400mg"], notes: "Evening — supports sleep & muscle relaxation" },
  { name: "Magnesium L-Threonate", category: "Minerals", typicalDose: "1,500–2,000mg", doseOptions: ["1,500mg","2,000mg"], notes: "Crosses blood-brain barrier; cognitive support" },
  { name: "Vitamin D3", category: "Vitamins", typicalDose: "1,000–5,000 IU", doseOptions: ["1,000 IU","2,000 IU","5,000 IU"], notes: "Take with fat; often paired with K2" },
  { name: "Vitamin K2 (MK-7)", category: "Vitamins", typicalDose: "90–200mcg", doseOptions: ["90mcg","100mcg","200mcg"], notes: "Directs calcium; take with D3" },
  { name: "Omega-3 Fish Oil", category: "Essential Fats", typicalDose: "1,000–3,000mg EPA+DHA", doseOptions: ["1,000mg","2,000mg","3,000mg"], notes: "With meals to reduce fishy burps" },
  { name: "Vitamin C", category: "Vitamins", typicalDose: "500–2,000mg", doseOptions: ["500mg","1,000mg","2,000mg"], notes: "Split doses for better absorption" },
  { name: "Zinc", category: "Minerals", typicalDose: "15–30mg", doseOptions: ["15mg","25mg","30mg"], notes: "Take with food; avoid with copper-rich meals" },
  { name: "Iron", category: "Minerals", typicalDose: "18–45mg", doseOptions: ["18mg","27mg","45mg"], notes: "Take on empty stomach with Vitamin C" },
  { name: "B12 (Methylcobalamin)", category: "Vitamins", typicalDose: "500–1,000mcg", doseOptions: ["500mcg","1,000mcg"], notes: "Sublingual for best absorption" },
  { name: "Folate (5-MTHF)", category: "Vitamins", typicalDose: "400–800mcg", doseOptions: ["400mcg","800mcg"], notes: "Active form; preferred over folic acid" },
  { name: "Vitamin B Complex", category: "Vitamins", typicalDose: "1 capsule", doseOptions: ["1 capsule"], notes: "Morning — energy metabolism" },
  { name: "Ashwagandha (KSM-66)", category: "Adaptogens", typicalDose: "300–600mg", doseOptions: ["300mg","400mg","600mg"], notes: "Reduces cortisol; take with food" },
  { name: "Rhodiola Rosea", category: "Adaptogens", typicalDose: "200–600mg", doseOptions: ["200mg","400mg","600mg"], notes: "Morning on empty stomach; stimulating" },
  { name: "Lion's Mane Mushroom", category: "Nootropics", typicalDose: "500–1,000mg", doseOptions: ["500mg","1,000mg"], notes: "Cognitive support; NGF promotion" },
  { name: "Reishi Mushroom", category: "Adaptogens", typicalDose: "1,000–2,000mg", doseOptions: ["1,000mg","2,000mg"], notes: "Evening — immune & stress support" },
  { name: "Creatine Monohydrate", category: "Performance", typicalDose: "3–5g", doseOptions: ["3g","5g"], notes: "Any time; consistent daily use matters" },
  { name: "Collagen Peptides", category: "Structural", typicalDose: "10–20g", doseOptions: ["10g","15g","20g"], notes: "With Vitamin C for synthesis; morning" },
  { name: "Probiotics", category: "Gut Health", typicalDose: "10–50 billion CFU", doseOptions: ["10B CFU","25B CFU","50B CFU"], notes: "Morning on empty stomach or with food" },
  { name: "Prebiotics (Inulin)", category: "Gut Health", typicalDose: "5–10g", doseOptions: ["5g","10g"], notes: "Feeds beneficial gut bacteria" },
  { name: "CoQ10 (Ubiquinol)", category: "Antioxidants", typicalDose: "100–300mg", doseOptions: ["100mg","200mg","300mg"], notes: "With fatty meal; mitochondrial support" },
  { name: "NAD+ (NMN)", category: "Longevity", typicalDose: "250–500mg", doseOptions: ["250mg","500mg"], notes: "Morning — cellular energy & aging" },
  { name: "Resveratrol", category: "Longevity", typicalDose: "100–500mg", doseOptions: ["100mg","250mg","500mg"], notes: "With fat; pairs with NMN" },
  { name: "Alpha-Lipoic Acid", category: "Antioxidants", typicalDose: "200–600mg", doseOptions: ["200mg","400mg","600mg"], notes: "Universal antioxidant; on empty stomach" },
  { name: "Quercetin", category: "Antioxidants", typicalDose: "500–1,000mg", doseOptions: ["500mg","1,000mg"], notes: "Anti-inflammatory; with bromelain" },
  { name: "Berberine", category: "Metabolic", typicalDose: "500mg (2–3x/day)", doseOptions: ["500mg"], notes: "With meals; blood sugar regulation" },
  { name: "Inositol (Myo)", category: "Metabolic", typicalDose: "2–4g", doseOptions: ["2g","4g"], notes: "Supports insulin sensitivity & mood" },
  { name: "N-Acetyl Cysteine (NAC)", category: "Antioxidants", typicalDose: "600–1,800mg", doseOptions: ["600mg","900mg","1,800mg"], notes: "Glutathione precursor; liver support" },
  { name: "L-Theanine", category: "Nootropics", typicalDose: "100–400mg", doseOptions: ["100mg","200mg","400mg"], notes: "Often with caffeine; calm focus" },
  { name: "Caffeine + L-Theanine", category: "Nootropics", typicalDose: "100mg + 200mg", doseOptions: ["100mg + 200mg"], notes: "Classic stack; clean energy" },
  { name: "5-HTP", category: "Mood", typicalDose: "50–200mg", doseOptions: ["50mg","100mg","200mg"], notes: "Evening; serotonin precursor" },
  { name: "GABA", category: "Mood", typicalDose: "250–750mg", doseOptions: ["250mg","500mg","750mg"], notes: "Evening; relaxation & sleep" },
  { name: "Melatonin", category: "Sleep", typicalDose: "0.5–3mg", doseOptions: ["0.5mg","1mg","2mg","3mg"], notes: "30–60 min before bed; low dose preferred" },
  { name: "Glycine", category: "Sleep", typicalDose: "3g", doseOptions: ["3g"], notes: "Before bed; improves sleep quality" },
  { name: "Taurine", category: "Performance", typicalDose: "500–2,000mg", doseOptions: ["500mg","1,000mg","2,000mg"], notes: "Cardiovascular & exercise performance" },
  { name: "L-Carnitine", category: "Performance", typicalDose: "500–2,000mg", doseOptions: ["500mg","1,000mg","2,000mg"], notes: "Fat metabolism; with carbs post-workout" },
  { name: "Electrolytes", category: "Minerals", typicalDose: "Per product label", doseOptions: ["Per label"], notes: "Post-exercise or with fasting" },
  { name: "Selenium", category: "Minerals", typicalDose: "55–200mcg", doseOptions: ["55mcg","100mcg","200mcg"], notes: "Thyroid & antioxidant support" },
  { name: "Iodine", category: "Minerals", typicalDose: "150–300mcg", doseOptions: ["150mcg","300mcg"], notes: "Thyroid hormone production" },
  { name: "Copper", category: "Minerals", typicalDose: "1–2mg", doseOptions: ["1mg","2mg"], notes: "Balance with zinc; enzyme function" },
  { name: "Biotin", category: "Vitamins", typicalDose: "2,500–5,000mcg", doseOptions: ["2,500mcg","5,000mcg"], notes: "Hair, skin & nail support" },
  { name: "Hyaluronic Acid", category: "Structural", typicalDose: "120–240mg", doseOptions: ["120mg","200mg","240mg"], notes: "Joint lubrication & skin hydration" },
  { name: "Turmeric / Curcumin", category: "Anti-inflammatory", typicalDose: "500–1,500mg", doseOptions: ["500mg","1,000mg","1,500mg"], notes: "With piperine & fat for absorption" },
  { name: "Boswellia", category: "Anti-inflammatory", typicalDose: "300–500mg", doseOptions: ["300mg","500mg"], notes: "Joint & inflammatory support" },
  { name: "Spirulina", category: "Superfoods", typicalDose: "3–10g", doseOptions: ["3g","5g","10g"], notes: "Protein, iron & antioxidants" },
  { name: "Chlorella", category: "Superfoods", typicalDose: "3–5g", doseOptions: ["3g","5g"], notes: "Detox & heavy metal binding" },
  { name: "Milk Thistle (Silymarin)", category: "Liver", typicalDose: "140–420mg", doseOptions: ["140mg","280mg","420mg"], notes: "Liver protection & regeneration" },
  { name: "Saw Palmetto", category: "Hormonal", typicalDose: "160–320mg", doseOptions: ["160mg","320mg"], notes: "DHT inhibition; hair & hormonal health" },
  { name: "Vitex (Chaste Tree)", category: "Hormonal", typicalDose: "400–500mg", doseOptions: ["400mg","500mg"], notes: "Morning; progesterone support" },
  { name: "Evening Primrose Oil", category: "Essential Fats", typicalDose: "500–1,500mg", doseOptions: ["500mg","1,000mg","1,500mg"], notes: "GLA for hormonal & skin balance" },
  { name: "Vitamin A (Retinol)", category: "Vitamins", typicalDose: "2,500–5,000 IU", doseOptions: ["2,500 IU","5,000 IU"], notes: "With fat; not to exceed upper limits" },
  { name: "Vitamin E (Mixed Tocopherols)", category: "Antioxidants", typicalDose: "400 IU", doseOptions: ["400 IU"], notes: "With fat; antioxidant & skin support" },
];

const CATEGORIES = [...new Set(SUPPLEMENT_DB.map(s => s.category))].sort();
const TIMES_OF_DAY = ["Morning", "Midday", "Evening", "Night", "As Needed"];
const FREQUENCIES = ["Daily", "Every other day", "2x / week", "Weekly", "As needed"];
const MOOD_EMOTIONS = [
  { key: "happy", label: "Happy" }, { key: "content", label: "Content" },
  { key: "calm", label: "Calm" }, { key: "anxious", label: "Anxious" },
  { key: "irritable", label: "Irritable" }, { key: "sad", label: "Sad" },
];
const MOOD_METRICS = [
  { key: "energy", label: "Energy", low: "Drained", high: "Wired" },
  { key: "motivation", label: "Motivation", low: "None", high: "Peak" },
  { key: "focus", label: "Focus", low: "Foggy", high: "Sharp" },
  { key: "sleep", label: "Sleep Quality", low: "Poor", high: "Restful" },
  { key: "mood_overall", label: "Overall Mood", low: "Low", high: "High" },
];
const ACCENT_COLORS = ["#e879a0","#c084fc","#60a5fa","#34d399","#fb923c","#f59e0b","#f472b6","#a78bfa","#38bdf8","#4ade80"];

// Research-backed onset windows (days) per supplement
const ONSET_WINDOWS = {
  "Magnesium Glycinate":7,"Melatonin":7,"L-Theanine":7,"Caffeine + L-Theanine":7,
  "Glycine":7,"GABA":7,"Electrolytes":7,"Magnesium L-Threonate":14,
  "Vitamin C":14,"Taurine":14,
  "B12 (Methylcobalamin)":21,"Folate (5-MTHF)":21,"Vitamin B Complex":21,"5-HTP":21,
  "Rhodiola Rosea":21,"Zinc":21,"L-Carnitine":21,"Quercetin":21,"Alpha-Lipoic Acid":21,
  "Creatine Monohydrate":21,"Spirulina":21,"Chlorella":21,
  "Ashwagandha (KSM-66)":28,"Lion's Mane Mushroom":28,"Reishi Mushroom":28,
  "Omega-3 Fish Oil":28,"Probiotics":28,"Prebiotics (Inulin)":28,"Inositol (Myo)":28,
  "N-Acetyl Cysteine (NAC)":28,"Berberine":28,"Turmeric / Curcumin":28,"Boswellia":28,
  "Evening Primrose Oil":28,"Selenium":28,"Iodine":28,"Copper":28,
  "Vitamin D3":42,"Vitamin K2 (MK-7)":42,"Iron":42,"CoQ10 (Ubiquinol)":42,
  "NAD+ (NMN)":42,"Resveratrol":42,"Collagen Peptides":42,"Hyaluronic Acid":42,
  "Biotin":42,"Milk Thistle (Silymarin)":42,"Saw Palmetto":42,
  "Vitamin A (Retinol)":42,"Vitamin E (Mixed Tocopherols)":42,
  "Vitex (Chaste Tree)":56,
};
const DEFAULT_WINDOW = 21;

function getToday() { return new Date().toISOString().split("T")[0]; }
function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function getOnsetWindow(name) { return ONSET_WINDOWS[name] ?? DEFAULT_WINDOW; }
function getOnsetLabel(d) {
  if (d <= 7) return "Fast-acting";
  if (d <= 21) return "Medium-acting";
  if (d <= 42) return "Slow-acting";
  return "Very slow-acting";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Slider({ value, onChange }) {
  const color = value >= 7 ? "#d6477e" : value >= 4 ? "#9d6dc4" : "#b0869a";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <input type="range" min={1} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex:1, accentColor:"#d6477e", cursor:"pointer" }} />
      <span style={{ fontFamily:"var(--mono)", fontSize:12, color, minWidth:22, textAlign:"right", fontWeight:600 }}>{value}</span>
    </div>
  );
}

function Tag({ children, color="#c96b8e" }) {
  return (
    <span style={{ fontSize:10, fontFamily:"var(--mono)", fontWeight:500, letterSpacing:"0.05em",
      padding:"3px 9px", borderRadius:4, background:`${color}18`, color,
      border:`1px solid ${color}40`, whiteSpace:"nowrap" }}>{children}</span>
  );
}

function NameAutofill({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const suggestions = value.trim().length > 0
    ? SUPPLEMENT_DB.filter(s => s.name.toLowerCase().includes(value.toLowerCase())).slice(0, 7)
    : [];
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <input className="input" placeholder="Type to search database..." value={value} autoComplete="off"
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.trim() && setOpen(true)} />
      {open && suggestions.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:999,
          background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:10,
          boxShadow:"0 8px 32px rgba(180,80,120,0.13)", overflow:"hidden" }}>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={e => { e.preventDefault(); onSelect(s); setOpen(false); }}
              style={{ padding:"11px 14px", cursor:"pointer",
                borderBottom: i < suggestions.length-1 ? "1px solid var(--border)" : "none" }}
              onMouseEnter={e => e.currentTarget.style.background="var(--surface2)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:4 }}>{s.name}</div>
              <div style={{ display:"flex", gap:6 }}>
                <Tag color="var(--pink)">{s.typicalDose}</Tag>
                <Tag color="#9d6dc4">{s.category}</Tag>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoseSelector({ dbEntry, value, onChange }) {
  const hasOpts = dbEntry?.doseOptions?.length > 0;
  const isCustom = hasOpts && value && !dbEntry.doseOptions.includes(value);
  return (
    <div>
      {hasOpts && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
          {dbEntry.doseOptions.map(opt => (
            <button key={opt} type="button" onClick={() => onChange(opt)} style={{
              padding:"7px 16px", borderRadius:20, fontFamily:"var(--mono)", fontSize:12,
              cursor:"pointer", transition:"all 0.15s", letterSpacing:"0.04em",
              border:`1.5px solid ${value===opt?"var(--pink)":"var(--border)"}`,
              background: value===opt?"var(--surface2)":"var(--surface)",
              color: value===opt?"var(--pink)":"var(--text3)",
              fontWeight: value===opt?600:400,
              boxShadow: value===opt?"0 0 0 3px rgba(214,71,126,0.1)":"none",
            }}>{opt}</button>
          ))}
          <button type="button" onClick={() => onChange("")} style={{
            padding:"7px 16px", borderRadius:20, fontFamily:"var(--mono)", fontSize:12,
            cursor:"pointer", transition:"all 0.15s", letterSpacing:"0.04em",
            border:`1.5px solid ${isCustom||(!value&&hasOpts)?"var(--pink)":"var(--border)"}`,
            background: isCustom||(!value&&hasOpts)?"var(--surface2)":"var(--surface)",
            color: isCustom||(!value&&hasOpts)?"var(--pink)":"var(--text3)",
          }}>Custom</button>
        </div>
      )}
      {(!hasOpts || isCustom || (!value && hasOpts)) && (
        <input className="input" placeholder={hasOpts?"Enter custom dose...":"e.g. 400mg"}
          value={isCustom?value:""} onChange={e => onChange(e.target.value)}
          autoFocus={isCustom||(!value&&hasOpts)} />
      )}
      {!hasOpts && value && (
        <input className="input" placeholder="e.g. 400mg" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("stack");
  const [supplements, setSupplements] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [suppHistory, setSuppHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:"", dose:"", frequency:"Daily", times:["Morning"], notes:"" });
  const [formDbEntry, setFormDbEntry] = useState(null);
  const [moodForm, setMoodForm] = useState({ emotion:"", energy:5, motivation:5, focus:5, sleep:5, mood_overall:5, notes:"" });
  const [dbQuery, setDbQuery] = useState("");
  const [dbCategory, setDbCategory] = useState("All");

  // ── Auth state ──
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const uid = session?.user?.id;

  async function sendMagicLink() {
    if (!email.trim()) return;
    setAuthLoading(true);
    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.href }
    });
    setMagicSent(true);
    setAuthLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSupplements([]); setMoodLogs([]); setSuppHistory([]); setLoaded(false);
  }

  // ── Load from Supabase ──
  useEffect(() => {
    if (!uid) return;
    async function load() {
      const [{ data: supps }, { data: moods }, { data: hist }] = await Promise.all([
        supabase.from("supplements").select("*").eq("user_id", uid).order("id"),
        supabase.from("mood_logs").select("*").eq("user_id", uid).order("timestamp"),
        supabase.from("supp_history").select("*").eq("user_id", uid).order("id"),
      ]);
      if (supps) setSupplements(supps.map(s => ({ ...s, startDate: s.start_date, endDate: s.end_date })));
      if (moods) setMoodLogs(moods.map(m => ({ ...m, date: m.log_date })));
      if (hist) setSuppHistory(hist.map(h => ({ ...h, suppId: h.supp_id, suppName: h.supp_name })));
      setLoaded(true);
    }
    load();
  }, [uid]);

  // ── Actions ──
  async function addSupplement() {
    if (!form.name.trim()) return;
    setSaving(true);
    const id = Date.now();
    const color = ACCENT_COLORS[supplements.length % ACCENT_COLORS.length];
    const row = {
      id, user_id: uid, name: form.name.trim(), dose: form.dose.trim(),
      frequency: form.frequency, times: form.times, notes: form.notes.trim(),
      start_date: getToday(), active: true, color,
    };
    const histRow = {
      user_id: uid, type: "added", supp_id: id, supp_name: form.name.trim(),
      date: getToday(), dose: form.dose.trim(), frequency: form.frequency, times: form.times,
    };
    await Promise.all([
      supabase.from("supplements").insert([row]),
      supabase.from("supp_history").insert([histRow]),
    ]);
    setSupplements(p => [...p, { ...row, startDate: row.start_date }]);
    setSuppHistory(p => [...p, { ...histRow, suppId: id, suppName: form.name.trim() }]);
    setSaving(false);
    setModal(null);
  }

  async function dropSupplement(id) {
    const s = supplements.find(x => x.id === id);
    const histRow = { user_id: uid, type: "dropped", supp_id: id, supp_name: s.name, date: getToday() };
    await Promise.all([
      supabase.from("supplements").update({ active: false, end_date: getToday() }).eq("id", id),
      supabase.from("supp_history").insert([histRow]),
    ]);
    setSupplements(p => p.map(x => x.id === id ? { ...x, active: false, endDate: getToday() } : x));
    setSuppHistory(p => [...p, { ...histRow, suppId: id, suppName: s.name }]);
  }

  async function reactivate(id) {
    const s = supplements.find(x => x.id === id);
    const histRow = { user_id: uid, type: "restarted", supp_id: id, supp_name: s.name, date: getToday() };
    await Promise.all([
      supabase.from("supplements").update({ active: true, end_date: null }).eq("id", id),
      supabase.from("supp_history").insert([histRow]),
    ]);
    setSupplements(p => p.map(x => x.id === id ? { ...x, active: true, endDate: undefined } : x));
    setSuppHistory(p => [...p, { ...histRow, suppId: id, suppName: s.name }]);
  }

  async function logMood() {
    if (!moodForm.emotion) return;
    setSaving(true);
    const ts = Date.now();
    const row = {
      user_id: uid, emotion: moodForm.emotion, energy: moodForm.energy,
      motivation: moodForm.motivation, focus: moodForm.focus, sleep: moodForm.sleep,
      mood_overall: moodForm.mood_overall, notes: moodForm.notes,
      log_date: getToday(), timestamp: ts,
    };
    await supabase.from("mood_logs").insert([row]);
    setMoodLogs(p => [...p, { ...row, date: row.log_date }]);
    setMoodForm({ emotion:"", energy:5, motivation:5, focus:5, sleep:5, mood_overall:5, notes:"" });
    setSaving(false);
    setModal(null);
  }

  function openAdd(prefill = {}, dbEntry = null) {
    setForm({ name:"", dose:"", frequency:"Daily", times:["Morning"], notes:"", ...prefill });
    setFormDbEntry(dbEntry);
    setModal("add");
  }
  function handleNameChange(val) { setForm(f => ({ ...f, name:val, dose:"", notes:"" })); setFormDbEntry(null); }
  function handleSelectDB(s) {
    const defaultDose = s.doseOptions?.length ? s.doseOptions[0] : s.typicalDose;
    setForm(f => ({ ...f, name:s.name, dose:defaultDose, notes:s.notes }));
    setFormDbEntry(s);
  }

  // ── Derived state ──
  const activeSupps = supplements.filter(s => s.active);
  const inactiveSupps = supplements.filter(s => !s.active);
  const recentMoods = [...moodLogs].sort((a,b) => b.timestamp - a.timestamp).slice(0, 50);
  const sortedHistory = [...suppHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
  const avgMetrics = MOOD_METRICS.map(m => {
    const vals = recentMoods.map(e => e[m.key]).filter(Boolean);
    return { ...m, avg: vals.length ? vals.reduce((a,b) => a+b,0)/vals.length : null };
  });

  // Trend analysis engine
  const trendInsights = (() => {
    if (moodLogs.length < 3 || suppHistory.length === 0) return [];
    const insights = [];
    [...suppHistory]
      .filter(h => h.type==="added"||h.type==="dropped")
      .sort((a,b) => new Date(a.date)-new Date(b.date))
      .forEach(event => {
        const onsetDays = getOnsetWindow(event.suppName);
        const pivot = new Date(event.date + "T12:00:00");
        const beforeStart = new Date(pivot); beforeStart.setDate(pivot.getDate()-onsetDays);
        const afterStart = new Date(pivot); afterStart.setDate(pivot.getDate()+1);
        const afterEnd = new Date(pivot); afterEnd.setDate(pivot.getDate()+onsetDays);
        const before = moodLogs.filter(m => { const d=new Date(m.date+"T12:00:00"); return d>=beforeStart&&d<pivot; });
        const after  = moodLogs.filter(m => { const d=new Date(m.date+"T12:00:00"); return d>=afterStart&&d<=afterEnd; });
        if (before.length<2||after.length<2) return;
        const avg = (arr,key) => arr.reduce((s,e)=>s+(e[key]||0),0)/arr.length;
        MOOD_METRICS.forEach(metric => {
          const bAvg=avg(before,metric.key), aAvg=avg(after,metric.key), delta=aAvg-bAvg;
          if (Math.abs(delta)>=1.0) insights.push({
            suppName:event.suppName, eventType:event.type, eventDate:event.date,
            metric:metric.label, before:bAvg, after:aAvg, delta,
            beforeN:before.length, afterN:after.length,
            onsetDays, onsetLabel:getOnsetLabel(onsetDays),
          });
        });
      });
    return insights.sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
  })();

  const moodTrajectory = (() => {
    const sorted = [...moodLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    if (sorted.length<4) return null;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-30);
    const recent = sorted.filter(m=>new Date(m.date+"T12:00:00")>=cutoff);
    if (recent.length<4) return null;
    const mid=Math.floor(recent.length/2);
    const avg=(arr,key)=>arr.reduce((s,e)=>s+(e[key]||0),0)/arr.length;
    return MOOD_METRICS.map(m=>({
      ...m,
      firstAvg:avg(recent.slice(0,mid),m.key),
      secondAvg:avg(recent.slice(mid),m.key),
      delta:avg(recent.slice(mid),m.key)-avg(recent.slice(0,mid),m.key),
    }));
  })();

  const filteredDB = SUPPLEMENT_DB.filter(s => {
    const q=dbQuery.toLowerCase();
    return (!q||s.name.toLowerCase().includes(q)||s.category.toLowerCase().includes(q)||s.notes.toLowerCase().includes(q))
      &&(dbCategory==="All"||s.category===dbCategory);
  });

  if (!authChecked) return (
    <div style={{ minHeight:"100vh", background:"#fdf4f7", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontStyle:"italic", color:"#b07a90" }}>Loading…</div>
    </div>
  );

  // ── Login screen ──
  if (!session) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#fdf4f7,#fce8ef)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ width:"100%", maxWidth:380, textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:500, color:"#3d1a28", letterSpacing:"-0.01em", marginBottom:8 }}>Rosette</h1>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#b07a90", letterSpacing:"0.14em", marginBottom:40 }}>WELLNESS & SUPPLEMENT JOURNAL</p>
        <div style={{ height:1, background:"linear-gradient(90deg,transparent,#d6477e,transparent)", marginBottom:40 }} />
        {!magicSent ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:"#7a4058", marginBottom:4 }}>Sign in to sync across all your devices</p>
            <input
              type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key==="Enter" && sendMagicLink()}
              style={{ background:"#fff", border:"1px solid #f0d0dc", borderRadius:8, padding:"12px 16px", color:"#3d1a28", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", textAlign:"center" }}
            />
            <button onClick={sendMagicLink} disabled={authLoading||!email.trim()} style={{ background:"#d6477e", color:"#fff", border:"none", borderRadius:8, padding:"13px 24px", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", opacity:authLoading||!email.trim()?0.4:1, boxShadow:"0 3px 14px rgba(214,71,126,0.28)" }}>
              {authLoading ? "Sending…" : "Send magic link"}
            </button>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#b07a90", letterSpacing:"0.06em", lineHeight:1.7 }}>No password needed. We'll email you a link — tap it and you're in.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16, alignItems:"center" }}>
            <div style={{ fontSize:40 }}>📩</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontStyle:"italic", color:"#3d1a28" }}>Check your email</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#7a4058", lineHeight:1.6 }}>We sent a magic link to <strong>{email}</strong>.<br/>Tap it to sign in — no password needed.</p>
            <button onClick={() => { setMagicSent(false); setEmail(""); }} style={{ background:"transparent", border:"1px solid #f0d0dc", borderRadius:8, padding:"10px 20px", fontFamily:"'DM Mono',monospace", fontSize:11, color:"#b07a90", cursor:"pointer", letterSpacing:"0.06em" }}>Use a different email</button>
          </div>
        )}
      </div>
    </div>
  );

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"#fdf4f7", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontStyle:"italic", color:"#b07a90" }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", fontFamily:"var(--sans)", color:"var(--text)", paddingBottom:90 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        :root {
          --bg:#fdf4f7; --surface:#ffffff; --surface2:#fce8ef;
          --border:#f0d0dc; --border2:#e4b0c4;
          --pink:#d6477e; --pink-light:#e879a0; --pink-dim:#c07090;
          --text:#3d1a28; --text2:#7a4058; --text3:#b07a90;
          --sans:'DM Sans',sans-serif; --serif:'Cormorant Garamond',serif; --mono:'DM Mono',monospace;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:var(--bg)} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;animation:fadeUp .22s ease;box-shadow:0 2px 12px rgba(200,80,120,.06)}
        .supp-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;transition:border-color .2s,box-shadow .2s,transform .15s;animation:fadeUp .22s ease;box-shadow:0 2px 12px rgba(200,80,120,.05)}
        .supp-card:hover{border-color:var(--border2);box-shadow:0 4px 20px rgba(200,80,120,.1);transform:translateY(-1px)}
        .tab{flex:1;padding:14px 6px;border:none;background:none;font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);cursor:pointer;border-bottom:1.5px solid var(--border);transition:all .2s}
        .tab.active{color:var(--pink);border-bottom-color:var(--pink)}
        .btn-primary{background:var(--pink);color:#fff;border:none;border-radius:8px;padding:13px 24px;font-family:var(--sans);font-size:13px;font-weight:600;letter-spacing:.04em;cursor:pointer;width:100%;transition:opacity .2s,transform .15s;box-shadow:0 3px 14px rgba(214,71,126,.28)}
        .btn-primary:hover{opacity:.9;transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.35;cursor:default;transform:none;box-shadow:none}
        .btn-sm{background:transparent;border:1px solid var(--border2);color:var(--text3);border-radius:6px;padding:5px 14px;font-family:var(--mono);font-size:10px;letter-spacing:.06em;cursor:pointer;transition:all .18s;white-space:nowrap}
        .btn-sm:hover{border-color:var(--pink-dim);color:var(--pink);background:var(--surface2)}
        .input{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--text);font-family:var(--sans);font-size:14px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s}
        .input:focus{border-color:var(--pink-dim);box-shadow:0 0 0 3px rgba(214,71,126,.08)}
        .input::placeholder{color:var(--text3)}
        .select{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--text);font-family:var(--sans);font-size:14px;width:100%;outline:none;cursor:pointer}
        .pill{border:1px solid var(--border);background:var(--surface);color:var(--text3);padding:6px 14px;border-radius:20px;font-size:11px;font-family:var(--mono);cursor:pointer;transition:all .18s;letter-spacing:.04em}
        .pill:hover,.pill.on{border-color:var(--pink-dim);color:var(--pink);background:var(--surface2)}
        .emotion-btn{border:1px solid var(--border);background:var(--surface);color:var(--text2);border-radius:8px;padding:9px 10px;font-family:var(--sans);font-size:12px;cursor:pointer;transition:all .18s;text-align:center;font-weight:500}
        .emotion-btn:hover,.emotion-btn.on{border-color:var(--pink-dim);color:var(--pink);background:var(--surface2)}
        .modal-wrap{position:fixed;inset:0;background:rgba(60,15,30,.35);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end;justify-content:center}
        .modal-box{background:var(--surface);border:1px solid var(--border2);border-radius:20px 20px 0 0;padding:28px 24px 52px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 -8px 40px rgba(200,80,120,.12)}
        .field-label{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:8px}
        .db-row{padding:14px 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:6px;cursor:pointer;transition:all .15s}
        .db-row:last-child{border-bottom:none}
        .db-row:hover{background:var(--surface2);margin:0 -20px;padding:14px 20px;border-radius:8px;border-bottom-color:transparent}
        .stat-box{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 10px;text-align:center;box-shadow:0 2px 8px rgba(200,80,120,.05)}
        .progress-bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
        .progress-fill{height:100%;border-radius:2px;transition:width .5s ease}
        input[type=range]{height:3px}
        .section-title{font-family:var(--serif);font-size:20px;font-weight:400;font-style:italic;color:var(--text)}
      `}</style>

      {/* Header */}
      <div style={{ maxWidth:480, margin:"0 auto", padding:"40px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <h1 style={{ fontFamily:"var(--serif)", fontSize:36, fontWeight:500, color:"var(--text)", letterSpacing:"-0.01em", lineHeight:1 }}>Rosette</h1>
            <p style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", marginTop:7, letterSpacing:"0.14em" }}>WELLNESS & SUPPLEMENT JOURNAL</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn-sm" onClick={() => setModal("database")}>DATABASE</button>
            <button onClick={() => setModal("mood")} style={{ background:"var(--pink)", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:11, fontFamily:"var(--mono)", fontWeight:500, letterSpacing:"0.07em", cursor:"pointer", boxShadow:"0 3px 12px rgba(214,71,126,.25)" }}>LOG MOOD</button>
            <button className="btn-sm" onClick={signOut} title={`Signed in as ${session.user.email}`}>SIGN OUT</button>
          </div>
        </div>
        <div style={{ height:1, background:"linear-gradient(90deg,var(--pink) 0%,transparent 55%)", marginTop:20 }} />
      </div>

      {/* Tabs */}
      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 20px" }}>
        <div style={{ display:"flex" }}>
          {[["stack","My Stack"],["log","Mood Log"],["trends","Trends"],["history","History"]].map(([k,l]) => (
            <button key={k} className={`tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"22px 20px 0" }}>

        {/* ── STACK ── */}
        {tab==="stack" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", gap:8 }}>
              {[{label:"Active",val:activeSupps.length,color:"var(--pink)"},{label:"Logged Today",val:moodLogs.filter(m=>m.date===getToday()).length,color:"#9d6dc4"},{label:"Total Moods",val:moodLogs.length,color:"var(--text2)"}].map(s=>(
                <div key={s.label} className="stat-box">
                  <div style={{ fontSize:26, fontFamily:"var(--serif)", color:s.color, fontWeight:500, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", marginTop:5, letterSpacing:"0.08em" }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4 }}>
              <span className="section-title">Active Supplements</span>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn-sm" onClick={() => setModal("database")}>Browse DB</button>
                <button onClick={() => openAdd()} style={{ background:"var(--pink)", color:"#fff", border:"none", borderRadius:6, padding:"6px 16px", fontSize:11, fontFamily:"var(--mono)", fontWeight:500, letterSpacing:"0.07em", cursor:"pointer" }}>+ ADD</button>
              </div>
            </div>
            {activeSupps.length===0 && (
              <div style={{ padding:"52px 0", textAlign:"center" }}>
                <div style={{ fontFamily:"var(--serif)", fontSize:22, fontStyle:"italic", color:"var(--text2)", marginBottom:8 }}>Your stack is empty</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text3)", letterSpacing:"0.06em" }}>Browse the database or add manually</div>
              </div>
            )}
            {activeSupps.map(s => (
              <div key={s.id} className="supp-card" style={{ borderLeft:`2.5px solid ${s.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:14, color:"var(--text)", marginBottom:6 }}>{s.name}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {s.dose&&<Tag color={s.color}>{s.dose}</Tag>}
                      <Tag color="#9d6dc4">{s.frequency}</Tag>
                      {s.times?.map(t=><Tag key={t} color="var(--text3)">{t}</Tag>)}
                    </div>
                  </div>
                  <button className="btn-sm" onClick={() => dropSupplement(s.id)}>DROP</button>
                </div>
                <div style={{ marginTop:10, fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:"0.04em" }}>Since {formatDate(s.startDate||s.start_date)}</div>
                {s.notes&&<div style={{ fontFamily:"var(--sans)", fontSize:12, color:"var(--text3)", marginTop:8, paddingTop:10, borderTop:"1px solid var(--border)", lineHeight:1.6 }}>{s.notes}</div>}
              </div>
            ))}
            {inactiveSupps.length>0&&(
              <>
                <span className="section-title" style={{ marginTop:6 }}>Dropped</span>
                {inactiveSupps.map(s=>(
                  <div key={s.id} className="supp-card" style={{ opacity:0.5 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontFamily:"var(--sans)", fontWeight:500, fontSize:14, textDecoration:"line-through", color:"var(--text2)" }}>{s.name}</div>
                        <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", marginTop:4 }}>Dropped {formatDate(s.endDate||s.end_date)}</div>
                      </div>
                      <button className="btn-sm" onClick={()=>reactivate(s.id)} style={{opacity:3}}>RESTART</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── MOOD LOG ── */}
        {tab==="log" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="card">
              <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.12em", color:"var(--text3)", marginBottom:18 }}>AVERAGES — LAST {recentMoods.length} ENTRIES</div>
              {avgMetrics.map(m=>(
                <div key={m.key} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--text2)", fontWeight:500 }}>{m.label}</span>
                    <span style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--pink)", fontWeight:500 }}>{m.avg?m.avg.toFixed(1):"—"}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:m.avg?`${(m.avg/10)*100}%`:"0%", background:m.avg>=7?"var(--pink)":m.avg>=4?"#9d6dc4":"var(--text3)" }} /></div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span className="section-title">Entries</span>
              <button onClick={()=>setModal("mood")} style={{ background:"var(--pink)", color:"#fff", border:"none", borderRadius:6, padding:"6px 16px", fontSize:11, fontFamily:"var(--mono)", fontWeight:500, letterSpacing:"0.07em", cursor:"pointer" }}>+ LOG</button>
            </div>
            {recentMoods.length===0&&<div style={{ padding:"52px 0", textAlign:"center" }}><div style={{ fontFamily:"var(--serif)", fontSize:22, fontStyle:"italic", color:"var(--text2)" }}>Nothing logged yet</div></div>}
            {recentMoods.map((e,i)=>{
              const emo=MOOD_EMOTIONS.find(x=>x.key===e.emotion);
              return (
                <div key={i} className="card" style={{ padding:"16px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontFamily:"var(--serif)", fontSize:18, fontStyle:"italic", color:"var(--pink)", fontWeight:500 }}>{emo?.label}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:"0.06em" }}>{formatDate(e.date||e.log_date)}</div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:e.notes?10:0 }}>
                    {MOOD_METRICS.map(m=><Tag key={m.key} color={e[m.key]>=7?"var(--pink)":e[m.key]>=4?"#9d6dc4":"var(--text3)"}>{m.label.split(" ")[0].toUpperCase()} {e[m.key]}</Tag>)}
                  </div>
                  {e.notes&&<div style={{ fontFamily:"var(--sans)", fontSize:12, color:"var(--text3)", borderTop:"1px solid var(--border)", paddingTop:10, lineHeight:1.6 }}>{e.notes}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TRENDS ── */}
        {tab==="trends" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {moodLogs.length<3&&(
              <div style={{ padding:"52px 0", textAlign:"center" }}>
                <div style={{ fontFamily:"var(--serif)", fontSize:22, fontStyle:"italic", color:"var(--text2)", marginBottom:8 }}>Not enough data yet</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text3)", letterSpacing:"0.06em", lineHeight:1.6 }}>Log at least a few mood entries<br/>to start seeing patterns emerge</div>
              </div>
            )}
            {moodTrajectory&&(
              <div className="card">
                <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.12em", color:"var(--text3)", marginBottom:4 }}>30-DAY TRAJECTORY</div>
                <div style={{ fontFamily:"var(--serif)", fontSize:14, fontStyle:"italic", color:"var(--text2)", marginBottom:18 }}>First half vs. second half of the past month</div>
                {moodTrajectory.map(m=>{
                  const isUp=m.delta>=0.3, isDown=m.delta<=-0.3;
                  const c=isUp?"var(--pink)":isDown?"var(--text3)":"var(--text3)";
                  const arrow=isUp?"↑":isDown?"↓":"→";
                  return (
                    <div key={m.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:12, marginBottom:12, borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--text2)", fontWeight:500, flex:1 }}>{m.label}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text3)" }}>{m.firstAvg.toFixed(1)}</span>
                        <span style={{ fontFamily:"var(--mono)", fontSize:16, color:c, fontWeight:600 }}>{arrow}</span>
                        <span style={{ fontFamily:"var(--mono)", fontSize:11, color:c, fontWeight:600 }}>{m.secondAvg.toFixed(1)}</span>
                        <span style={{ fontFamily:"var(--mono)", fontSize:10, color:c, minWidth:40, textAlign:"right" }}>{m.delta>0?"+":""}{m.delta.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {moodLogs.length>=3&&suppHistory.length>0&&(
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span className="section-title">Supplement Correlations</span>
                  <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.08em" }}>RESEARCH-BACKED WINDOWS</span>
                </div>
                {trendInsights.length===0&&(
                  <div className="card" style={{ textAlign:"center", padding:"32px 20px" }}>
                    <div style={{ fontFamily:"var(--serif)", fontSize:18, fontStyle:"italic", color:"var(--text2)", marginBottom:8 }}>No strong correlations yet</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text3)", lineHeight:1.7, letterSpacing:"0.04em" }}>Correlations appear when mood shifts of 1+ point follow a supplement change within its expected onset window (7–56 days). Keep logging consistently.</div>
                  </div>
                )}
                {trendInsights.map((ins,i)=>{
                  const isPos=ins.delta>0;
                  const ac=isPos?"#d6477e":"#9d6dc4";
                  const bg=isPos?"#fff0f5":"#f5f0ff";
                  const bc=isPos?"#f0c0d4":"#ddd0f8";
                  const dAbs=Math.abs(ins.delta);
                  const strength=dAbs>=2.5?"Strong":dAbs>=1.5?"Moderate":"Mild";
                  return (
                    <div key={i} style={{ background:bg, border:`1px solid ${bc}`, borderLeft:`3px solid ${ac}`, borderRadius:14, padding:"16px 18px", animation:"fadeUp .22s ease" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                        <div>
                          <div style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:3 }}>{ins.suppName}</div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.08em", padding:"2px 8px", borderRadius:4, background:`${ac}18`, color:ac, border:`1px solid ${ac}33` }}>{ins.eventType==="added"?"ADDED":"DROPPED"}</span>
                            <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>{formatDate(ins.eventDate)}</span>
                            <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", padding:"2px 8px", borderRadius:4, background:"var(--border)", border:"1px solid var(--border2)" }}>{ins.onsetLabel} · {ins.onsetDays}d window</span>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"var(--mono)", fontSize:18, fontWeight:600, color:ac, lineHeight:1 }}>{isPos?"+":""}{ins.delta.toFixed(1)}</div>
                          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", marginTop:2, letterSpacing:"0.06em" }}>{strength.toUpperCase()}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontFamily:"var(--sans)", fontSize:12, color:"var(--text2)", fontWeight:500 }}>{ins.metric}</span>
                          <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text3)" }}>{ins.before.toFixed(1)} → <span style={{ color:ac, fontWeight:600 }}>{ins.after.toFixed(1)}</span></span>
                        </div>
                        <div style={{ height:6, background:"rgba(200,80,120,0.1)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${(ins.before/10)*100}%`, background:"var(--border2)", borderRadius:3 }} />
                        </div>
                        <div style={{ height:6, background:"rgba(200,80,120,0.1)", borderRadius:3, overflow:"hidden", marginTop:3 }}>
                          <div style={{ height:"100%", width:`${(ins.after/10)*100}%`, background:ac, borderRadius:3, transition:"width .5s ease" }} />
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                          <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>Before ({ins.beforeN} entries)</span>
                          <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>After ({ins.afterN} entries)</span>
                        </div>
                      </div>
                      <div style={{ fontFamily:"var(--serif)", fontSize:14, fontStyle:"italic", color:"var(--text2)", lineHeight:1.5, borderTop:`1px solid ${bc}`, paddingTop:10 }}>
                        {ins.eventType==="added"?"After adding":"After dropping"} {ins.suppName}, your {ins.metric.toLowerCase()} {isPos?"improved":"declined"} by {dAbs.toFixed(1)} points on average over the following {ins.onsetDays} days — the expected onset window for this supplement.
                      </div>
                    </div>
                  );
                })}
                {trendInsights.length>0&&(
                  <div style={{ padding:"12px 16px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10 }}>
                    <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", lineHeight:1.8, letterSpacing:"0.05em" }}>DISCLAIMER — Correlations are not causation. Mood shifts may reflect many factors beyond supplements. Use these patterns as a starting point for reflection, not medical guidance.</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab==="history" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div className="card">
              <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.12em", color:"var(--text3)", marginBottom:18 }}>SUPPLEMENT TIMELINE</div>
              {sortedHistory.length===0&&<div style={{ textAlign:"center", padding:"24px 0", fontFamily:"var(--serif)", fontSize:18, fontStyle:"italic", color:"var(--text3)" }}>No changes recorded</div>}
              {sortedHistory.map((h,i)=>(
                <div key={i} style={{ display:"flex", gap:14, paddingBottom:14, borderBottom:i<sortedHistory.length-1?"1px solid var(--border)":"none", marginBottom:i<sortedHistory.length-1?14:0 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", marginTop:6, flexShrink:0, background:h.type==="added"?"var(--pink)":h.type==="dropped"?"var(--text3)":"#9d6dc4" }} />
                  <div>
                    <div style={{ fontSize:13, fontFamily:"var(--sans)", fontWeight:500 }}>
                      <span style={{ color:h.type==="added"?"var(--pink)":h.type==="dropped"?"var(--text3)":"#9d6dc4" }}>{h.type.charAt(0).toUpperCase()+h.type.slice(1)}</span>
                      {" — "}<span style={{ color:"var(--text)" }}>{h.suppName||h.supp_name}</span>
                    </div>
                    {h.dose&&<div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", marginTop:3 }}>{h.dose} · {h.frequency}</div>}
                    <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", marginTop:2 }}>{formatDate(h.date)}</div>
                  </div>
                </div>
              ))}
            </div>
            {activeSupps.length>0&&(
              <div className="card">
                <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.12em", color:"var(--text3)", marginBottom:16 }}>CURRENT STACK</div>
                {activeSupps.map((s,i)=>(
                  <div key={s.id} style={{ display:"flex", justifyContent:"space-between", paddingBottom:12, marginBottom:12, borderBottom:i<activeSupps.length-1?"1px solid var(--border)":"none" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:s.color, flexShrink:0 }} />
                      <span style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:500, color:"var(--text)" }}>{s.name}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--pink)" }}>{s.frequency}</div>
                      <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>since {formatDate(s.startDate||s.start_date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── ADD MODAL ── */}
      {modal==="add"&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
              <h2 style={{ fontFamily:"var(--serif)", fontSize:26, fontWeight:400, fontStyle:"italic", color:"var(--text)" }}>Add to Stack</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"none", color:"var(--text3)", fontSize:22, cursor:"pointer", lineHeight:1 }}>×</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div>
                <span className="field-label">Supplement Name</span>
                <NameAutofill value={form.name} onChange={handleNameChange} onSelect={handleSelectDB} />
              </div>
              <div>
                <span className="field-label">Dose{formDbEntry&&<span style={{ marginLeft:8, color:"var(--pink)", fontWeight:400, textTransform:"none", letterSpacing:0 }}>— typical: {formDbEntry.typicalDose}</span>}</span>
                <DoseSelector dbEntry={formDbEntry} value={form.dose} onChange={v=>setForm(f=>({...f,dose:v}))} />
              </div>
              <div>
                <span className="field-label">Frequency</span>
                <select className="select" value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))}>
                  {FREQUENCIES.map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <span className="field-label">Time of Day</span>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {TIMES_OF_DAY.map(t=>(
                    <button key={t} className={`pill ${form.times.includes(t)?"on":""}`}
                      onClick={()=>setForm(f=>({...f,times:f.times.includes(t)?f.times.filter(x=>x!==t):[...f.times,t]}))}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="field-label">Notes</span>
                <input className="input" placeholder="Optional..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
              </div>
              <button className="btn-primary" onClick={addSupplement} disabled={!form.name.trim()||saving} style={{ marginTop:4 }}>
                {saving?"Saving…":"Add to Stack"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOOD MODAL ── */}
      {modal==="mood"&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
              <h2 style={{ fontFamily:"var(--serif)", fontSize:26, fontWeight:400, fontStyle:"italic", color:"var(--text)" }}>How are you feeling?</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"none", color:"var(--text3)", fontSize:22, cursor:"pointer", lineHeight:1 }}>×</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
              <div>
                <span className="field-label">Emotion</span>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {MOOD_EMOTIONS.map(e=>(
                    <button key={e.key} className={`emotion-btn ${moodForm.emotion===e.key?"on":""}`} onClick={()=>setMoodForm(f=>({...f,emotion:e.key}))}>{e.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <span className="field-label">Daily Metrics — 1 to 10</span>
                <div style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:16, display:"flex", flexDirection:"column", gap:16 }}>
                  {MOOD_METRICS.map(m=>(
                    <div key={m.key}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--text2)", fontWeight:500 }}>{m.label}</span>
                        <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>{m.low} · {m.high}</span>
                      </div>
                      <Slider value={moodForm[m.key]} onChange={v=>setMoodForm(f=>({...f,[m.key]:v}))} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="field-label">Notes</span>
                <input className="input" placeholder="Anything on your mind..." value={moodForm.notes} onChange={e=>setMoodForm(f=>({...f,notes:e.target.value}))} />
              </div>
              <button className="btn-primary" onClick={logMood} disabled={!moodForm.emotion||saving}>{saving?"Saving…":"Save Entry"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DATABASE MODAL ── */}
      {modal==="database"&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box" style={{ maxHeight:"94vh" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"var(--serif)", fontSize:26, fontWeight:400, fontStyle:"italic", color:"var(--text)" }}>Supplement Database</h2>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"none", color:"var(--text3)", fontSize:22, cursor:"pointer", lineHeight:1 }}>×</button>
            </div>
            <input className="input" placeholder="Search by name, category, or effect..." value={dbQuery} onChange={e=>setDbQuery(e.target.value)} style={{ marginBottom:12 }} />
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12, marginBottom:8 }}>
              {["All",...CATEGORIES].map(c=>(
                <button key={c} className={`pill ${dbCategory===c?"on":""}`} style={{ flexShrink:0, fontSize:10 }} onClick={()=>setDbCategory(c)}>{c}</button>
              ))}
            </div>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:4 }}>{filteredDB.length} RESULTS — TAP TO ADD</div>
            <div>
              {filteredDB.map((s,i)=>(
                <div key={i} className="db-row" onClick={()=>{ openAdd({name:s.name,dose:s.doseOptions?.[0]||s.typicalDose,notes:s.notes},s); }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div>
                      <div style={{ fontFamily:"var(--sans)", fontSize:14, fontWeight:500, color:"var(--text)", marginBottom:5 }}>{s.name}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}><Tag color="var(--pink)">{s.typicalDose}</Tag><Tag color="#9d6dc4">{s.category}</Tag></div>
                    </div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--pink)", flexShrink:0, marginTop:2, letterSpacing:"0.04em" }}>+ ADD</div>
                  </div>
                  <div style={{ fontFamily:"var(--sans)", fontSize:12, color:"var(--text3)", lineHeight:1.6 }}>{s.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
