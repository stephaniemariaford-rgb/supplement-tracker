import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const UID = "rosette-user-main";

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
  { key: "happy", label: "Happy", color: "#d6477e" },
  { key: "content", label: "Content", color: "#9d6dc4" },
  { key: "calm", label: "Calm", color: "#60a5fa" },
  { key: "anxious", label: "Anxious", color: "#fb923c" },
  { key: "irritable", label: "Irritable", color: "#f59e0b" },
  { key: "sad", label: "Sad", color: "#94a3b8" },
];
const MOOD_METRICS = [
  { key: "energy", label: "Energy", low: "Drained", high: "Wired" },
  { key: "motivation", label: "Motivation", low: "None", high: "Peak" },
  { key: "focus", label: "Focus", low: "Foggy", high: "Sharp" },
  { key: "sleep", label: "Sleep Quality", low: "Poor", high: "Restful" },
  { key: "mood_overall", label: "Overall Mood", low: "Low", high: "High" },
];
const ACCENT_COLORS = ["#e879a0","#c084fc","#60a5fa","#34d399","#fb923c","#f59e0b","#f472b6","#a78bfa","#38bdf8","#4ade80"];
const ONSET_WINDOWS = {
  "Magnesium Glycinate":7,"Melatonin":7,"L-Theanine":7,"Caffeine + L-Theanine":7,"Glycine":7,"GABA":7,"Electrolytes":7,
  "Magnesium L-Threonate":14,"Vitamin C":14,"Taurine":14,
  "B12 (Methylcobalamin)":21,"Folate (5-MTHF)":21,"Vitamin B Complex":21,"5-HTP":21,"Rhodiola Rosea":21,
  "Zinc":21,"L-Carnitine":21,"Quercetin":21,"Alpha-Lipoic Acid":21,"Creatine Monohydrate":21,"Spirulina":21,"Chlorella":21,
  "Ashwagandha (KSM-66)":28,"Lion's Mane Mushroom":28,"Reishi Mushroom":28,"Omega-3 Fish Oil":28,"Probiotics":28,
  "Prebiotics (Inulin)":28,"Inositol (Myo)":28,"N-Acetyl Cysteine (NAC)":28,"Berberine":28,"Turmeric / Curcumin":28,
  "Boswellia":28,"Evening Primrose Oil":28,"Selenium":28,"Iodine":28,"Copper":28,
  "Vitamin D3":42,"Vitamin K2 (MK-7)":42,"Iron":42,"CoQ10 (Ubiquinol)":42,"NAD+ (NMN)":42,"Resveratrol":42,
  "Collagen Peptides":42,"Hyaluronic Acid":42,"Biotin":42,"Milk Thistle (Silymarin)":42,"Saw Palmetto":42,
  "Vitamin A (Retinol)":42,"Vitamin E (Mixed Tocopherols)":42,"Vitex (Chaste Tree)":56,
};
const DEFAULT_WINDOW = 21;

function getToday() { return new Date().toISOString().split("T")[0]; }
function formatDate(d) { return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); }
function getOnsetWindow(n) { return ONSET_WINDOWS[n]??DEFAULT_WINDOW; }
function getOnsetLabel(d) { return d<=7?"Fast-acting":d<=21?"Medium-acting":d<=42?"Slow-acting":"Very slow-acting"; }
function daysSince(d) { return Math.floor((Date.now()-new Date(d+"T12:00:00").getTime())/(1000*60*60*24)); }

// ── Sub-components ────────────────────────────────────────────────────────────
function Slider({ value, onChange }) {
  const color = value>=7?"#d6477e":value>=4?"#9d6dc4":"#b0869a";
  return (
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <input type="range" min={1} max={10} value={value} onChange={e=>onChange(Number(e.target.value))}
        style={{flex:1,accentColor:"#d6477e",cursor:"pointer"}} />
      <span style={{fontFamily:"var(--mono)",fontSize:12,color,minWidth:22,textAlign:"right",fontWeight:600}}>{value}</span>
    </div>
  );
}

function Tag({ children, color="#c96b8e" }) {
  return <span style={{fontSize:10,fontFamily:"var(--mono)",fontWeight:500,letterSpacing:"0.05em",padding:"3px 9px",borderRadius:4,background:`${color}18`,color,border:`1px solid ${color}40`,whiteSpace:"nowrap"}}>{children}</span>;
}

function ConfirmDrop({ name, onConfirm, onCancel }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(60,15,30,.5)",backdropFilter:"blur(4px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:16,padding:28,maxWidth:320,width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"var(--serif)",fontSize:20,fontStyle:"italic",color:"var(--text)",marginBottom:8}}>Drop {name}?</div>
        <div style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--text3)",marginBottom:24,lineHeight:1.5}}>This will move it to your dropped supplements. You can restart it anytime.</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,background:"transparent",border:"1px solid var(--border2)",borderRadius:8,padding:"10px",fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",cursor:"pointer",letterSpacing:"0.06em"}}>CANCEL</button>
          <button onClick={onConfirm} style={{flex:1,background:"var(--pink)",border:"none",borderRadius:8,padding:"10px",fontFamily:"var(--mono)",fontSize:11,color:"#fff",cursor:"pointer",fontWeight:600,letterSpacing:"0.06em"}}>DROP</button>
        </div>
      </div>
    </div>
  );
}

function NameAutofill({ value, onChange, onSelect }) {
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  const suggestions=value.trim().length>0?SUPPLEMENT_DB.filter(s=>s.name.toLowerCase().includes(value.toLowerCase())).slice(0,7):[];
  useEffect(()=>{
    function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);
  return (
    <div ref={ref} style={{position:"relative"}}>
      <input className="input" placeholder="Type to search database..." value={value} autoComplete="off"
        onChange={e=>{onChange(e.target.value);setOpen(true);}} onFocus={()=>value.trim()&&setOpen(true)} />
      {open&&suggestions.length>0&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:999,background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:10,boxShadow:"0 8px 32px rgba(180,80,120,.13)",overflow:"hidden"}}>
          {suggestions.map((s,i)=>(
            <div key={i} onMouseDown={e=>{e.preventDefault();onSelect(s);setOpen(false);}}
              style={{padding:"11px 14px",cursor:"pointer",borderBottom:i<suggestions.length-1?"1px solid var(--border)":"none"}}
              onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{fontFamily:"var(--sans)",fontSize:13,fontWeight:500,color:"var(--text)",marginBottom:4}}>{s.name}</div>
              <div style={{display:"flex",gap:6}}><Tag color="var(--pink)">{s.typicalDose}</Tag><Tag color="#9d6dc4">{s.category}</Tag></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoseSelector({ dbEntry, value, onChange, defaultNotes, onRestoreNotes }) {
  const hasOpts=dbEntry?.doseOptions?.length>0;
  const isCustom=hasOpts&&value&&!dbEntry.doseOptions.includes(value);
  return (
    <div>
      {hasOpts&&(
        <>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
            {dbEntry.doseOptions.map(opt=>(
              <button key={opt} type="button" onClick={()=>onChange(opt)} style={{padding:"7px 16px",borderRadius:20,fontFamily:"var(--mono)",fontSize:12,cursor:"pointer",transition:"all 0.15s",letterSpacing:"0.04em",border:`1.5px solid ${value===opt?"var(--pink)":"var(--border)"}`,background:value===opt?"var(--surface2)":"var(--surface)",color:value===opt?"var(--pink)":"var(--text3)",fontWeight:value===opt?600:400,boxShadow:value===opt?"0 0 0 3px rgba(214,71,126,0.1)":"none"}}>{opt}</button>
            ))}
            <button type="button" onClick={()=>onChange("")} style={{padding:"7px 16px",borderRadius:20,fontFamily:"var(--mono)",fontSize:12,cursor:"pointer",transition:"all 0.15s",letterSpacing:"0.04em",border:`1.5px solid ${isCustom||(!value&&hasOpts)?"var(--pink)":"var(--border)"}`,background:isCustom||(!value&&hasOpts)?"var(--surface2)":"var(--surface)",color:isCustom||(!value&&hasOpts)?"var(--pink)":"var(--text3)"}}>Custom</button>
          </div>
          <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.04em",marginBottom:isCustom?8:0}}>Typical range: {dbEntry.typicalDose}</div>
        </>
      )}
      {(!hasOpts||isCustom||(!value&&hasOpts))&&(
        <input className="input" placeholder={hasOpts?"Enter custom dose...":"e.g. 400mg"} value={isCustom?value:""} onChange={e=>onChange(e.target.value)} autoFocus={isCustom||(!value&&hasOpts)} style={{marginTop:hasOpts?8:0}} />
      )}
      {!hasOpts&&value&&<input className="input" placeholder="e.g. 400mg" value={value} onChange={e=>onChange(e.target.value)} />}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("stack");
  const [supplements,setSupplements]=useState([]);
  const [moodLogs,setMoodLogs]=useState([]);
  const [suppHistory,setSuppHistory]=useState([]);
  const [loaded,setLoaded]=useState(false);
  const [saving,setSaving]=useState(false);

  // Modals
  const [modal,setModal]=useState(null); // "add"|"edit"|"mood"|"database"|"dbdetail"
  const [confirmDrop,setConfirmDrop]=useState(null); // supplement id
  const [editingSupp,setEditingSupp]=useState(null);
  const [dbDetailEntry,setDbDetailEntry]=useState(null);

  // Form state
  const EMPTY_FORM={name:"",dose:"",frequency:"Daily",times:["Morning"],notes:"",startDate:getToday()};
  const [form,setForm]=useState(EMPTY_FORM);
  const [formDbEntry,setFormDbEntry]=useState(null);
  const [formDefaultNotes,setFormDefaultNotes]=useState("");

  // Mood form
  const [moodForm,setMoodForm]=useState({emotion:"",energy:5,motivation:5,focus:5,sleep:5,mood_overall:5,notes:""});
  const [moodWindow,setMoodWindow]=useState(14);

  // DB modal
  const [dbQuery,setDbQuery]=useState("");
  const [dbCategory,setDbCategory]=useState("All");

  // Dropped section toggle
  const [showDropped,setShowDropped]=useState(false);

  useEffect(()=>{
    async function load(){
      const [{data:supps},{data:moods},{data:hist}]=await Promise.all([
        supabase.from("supplements").select("*").eq("user_id",UID).order("sort_order",{ascending:true}).order("id"),
        supabase.from("mood_logs").select("*").eq("user_id",UID).order("timestamp"),
        supabase.from("supp_history").select("*").eq("user_id",UID).order("id"),
      ]);
      if(supps)setSupplements(supps.map(s=>({...s,startDate:s.start_date,endDate:s.end_date})));
      if(moods)setMoodLogs(moods.map(m=>({...m,date:m.log_date})));
      if(hist)setSuppHistory(hist.map(h=>({...h,suppId:h.supp_id,suppName:h.supp_name})));
      setLoaded(true);
    }
    load();
  },[]);

  // ── Supplement actions ──
  async function addSupplement(){
    if(!form.name.trim())return;
    setSaving(true);
    const id=Date.now();
    const color=ACCENT_COLORS[supplements.filter(s=>s.active).length%ACCENT_COLORS.length];
    const sortOrder=supplements.filter(s=>s.active).length;
    const row={id,user_id:UID,name:form.name.trim(),dose:form.dose.trim(),frequency:form.frequency,times:form.times,notes:form.notes.trim(),start_date:form.startDate,active:true,color,sort_order:sortOrder};
    const histRow={user_id:UID,type:"added",supp_id:id,supp_name:form.name.trim(),date:getToday(),dose:form.dose.trim(),frequency:form.frequency,times:form.times};
    await Promise.all([supabase.from("supplements").insert([row]),supabase.from("supp_history").insert([histRow])]);
    setSupplements(p=>[...p,{...row,startDate:row.start_date}]);
    setSuppHistory(p=>[...p,{...histRow,suppId:id,suppName:form.name.trim()}]);
    setSaving(false);setModal(null);
  }

  async function saveSuppEdit(){
    if(!form.name.trim())return;
    setSaving(true);
    const updates={name:form.name.trim(),dose:form.dose.trim(),frequency:form.frequency,times:form.times,notes:form.notes.trim(),start_date:form.startDate};
    await supabase.from("supplements").update(updates).eq("id",editingSupp.id);
    setSupplements(p=>p.map(s=>s.id===editingSupp.id?{...s,...updates,startDate:form.startDate}:s));
    setSaving(false);setModal(null);setEditingSupp(null);
  }

  async function dropSupplement(id){
    const s=supplements.find(x=>x.id===id);
    const histRow={user_id:UID,type:"dropped",supp_id:id,supp_name:s.name,date:getToday()};
    await Promise.all([supabase.from("supplements").update({active:false,end_date:getToday()}).eq("id",id),supabase.from("supp_history").insert([histRow])]);
    setSupplements(p=>p.map(x=>x.id===id?{...x,active:false,endDate:getToday()}:x));
    setSuppHistory(p=>[...p,{...histRow,suppId:id,suppName:s.name}]);
    setConfirmDrop(null);
  }

  async function reactivate(id){
    const s=supplements.find(x=>x.id===id);
    const histRow={user_id:UID,type:"restarted",supp_id:id,supp_name:s.name,date:getToday()};
    await Promise.all([supabase.from("supplements").update({active:true,end_date:null}).eq("id",id),supabase.from("supp_history").insert([histRow])]);
    setSupplements(p=>p.map(x=>x.id===id?{...x,active:true,endDate:undefined}:x));
    setSuppHistory(p=>[...p,{...histRow,suppId:id,suppName:s.name}]);
  }

  async function moveSupplement(id,dir){
    const active=supplements.filter(s=>s.active);
    const idx=active.findIndex(s=>s.id===id);
    const newIdx=idx+dir;
    if(newIdx<0||newIdx>=active.length)return;
    const reordered=[...active];
    [reordered[idx],reordered[newIdx]]=[reordered[newIdx],reordered[idx]];
    const updates=reordered.map((s,i)=>supabase.from("supplements").update({sort_order:i}).eq("id",s.id));
    await Promise.all(updates);
    setSupplements(p=>{
      const inactive=p.filter(s=>!s.active);
      return[...reordered.map((s,i)=>({...s,sort_order:i})),...inactive];
    });
  }

  // ── Mood actions ──
  async function logMood(){
    if(!moodForm.emotion)return;
    setSaving(true);
    const ts=Date.now();
    const row={user_id:UID,emotion:moodForm.emotion,energy:moodForm.energy,motivation:moodForm.motivation,focus:moodForm.focus,sleep:moodForm.sleep,mood_overall:moodForm.mood_overall,notes:moodForm.notes,log_date:getToday(),timestamp:ts};
    await supabase.from("mood_logs").insert([row]);
    setMoodLogs(p=>[...p,{...row,date:row.log_date}]);
    setMoodForm({emotion:"",energy:5,motivation:5,focus:5,sleep:5,mood_overall:5,notes:""});
    setSaving(false);setModal(null);
  }

  async function deleteMoodEntry(ts){
    await supabase.from("mood_logs").delete().eq("timestamp",ts).eq("user_id",UID);
    setMoodLogs(p=>p.filter(m=>m.timestamp!==ts));
  }

  // ── Form helpers ──
  function openAdd(prefill={},dbEntry=null){
    setForm({...EMPTY_FORM,...prefill});
    setFormDbEntry(dbEntry);
    setFormDefaultNotes(prefill.notes||"");
    setEditingSupp(null);
    setModal("add");
  }

  function openEdit(s){
    setForm({name:s.name,dose:s.dose||"",frequency:s.frequency,times:s.times||["Morning"],notes:s.notes||"",startDate:s.startDate||s.start_date||getToday()});
    const dbMatch=SUPPLEMENT_DB.find(d=>d.name===s.name)||null;
    setFormDbEntry(dbMatch);
    setFormDefaultNotes(dbMatch?.notes||"");
    setEditingSupp(s);
    setModal("edit");
  }

  function handleNameChange(val){setForm(f=>({...f,name:val,dose:"",notes:""}));setFormDbEntry(null);setFormDefaultNotes("");}
  function handleSelectDB(s){
    const defaultDose=s.doseOptions?.length?s.doseOptions[0]:s.typicalDose;
    setForm(f=>({...f,name:s.name,dose:defaultDose,notes:s.notes}));
    setFormDbEntry(s);setFormDefaultNotes(s.notes);
  }
  function toggleTime(t){setForm(f=>({...f,times:f.times.includes(t)?f.times.filter(x=>x!==t):[...f.times,t]}));}

  // ── Derived ──
  const activeSupps=supplements.filter(s=>s.active).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));
  const inactiveSupps=supplements.filter(s=>!s.active);
  const sortedMoods=[...moodLogs].sort((a,b)=>b.timestamp-a.timestamp);
  const recentMoods=sortedMoods.slice(0,50);
  const sortedHistory=[...suppHistory].sort((a,b)=>new Date(b.date)-new Date(a.date));

  const windowedMoods=recentMoods.filter(m=>{
    const d=new Date(m.date+"T12:00:00");
    const cutoff=new Date();cutoff.setDate(cutoff.getDate()-moodWindow);
    return d>=cutoff;
  });

  const avgMetrics=MOOD_METRICS.map(m=>{
    const vals=windowedMoods.map(e=>e[m.key]).filter(Boolean);
    return{...m,avg:vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null};
  });

  // Trend engine
  const trendInsights=(()=>{
    if(moodLogs.length<3||suppHistory.length===0)return[];
    const insights=[];
    [...suppHistory].filter(h=>h.type==="added"||h.type==="dropped").sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(event=>{
      const od=getOnsetWindow(event.suppName);
      const pivot=new Date(event.date+"T12:00:00");
      const bs=new Date(pivot);bs.setDate(pivot.getDate()-od);
      const as2=new Date(pivot);as2.setDate(pivot.getDate()+1);
      const ae=new Date(pivot);ae.setDate(pivot.getDate()+od);
      const before=moodLogs.filter(m=>{const d=new Date(m.date+"T12:00:00");return d>=bs&&d<pivot;});
      const after=moodLogs.filter(m=>{const d=new Date(m.date+"T12:00:00");return d>=as2&&d<=ae;});
      if(before.length<2||after.length<2)return;
      const avg=(arr,key)=>arr.reduce((s,e)=>s+(e[key]||0),0)/arr.length;
      MOOD_METRICS.forEach(metric=>{
        const bA=avg(before,metric.key),aA=avg(after,metric.key),delta=aA-bA;
        if(Math.abs(delta)>=1.0)insights.push({suppName:event.suppName,eventType:event.type,eventDate:event.date,metric:metric.label,metricKey:metric.key,before:bA,after:aA,delta,beforeN:before.length,afterN:after.length,onsetDays:od,onsetLabel:getOnsetLabel(od)});
      });
    });
    return insights.sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
  })();

  const moodTrajectory=(()=>{
    const sorted=[...moodLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    if(sorted.length<4)return null;
    const cutoff=new Date();cutoff.setDate(cutoff.getDate()-30);
    const recent=sorted.filter(m=>new Date(m.date+"T12:00:00")>=cutoff);
    if(recent.length<4)return null;
    const mid=Math.floor(recent.length/2);
    const avg=(arr,key)=>arr.reduce((s,e)=>s+(e[key]||0),0)/arr.length;
    return MOOD_METRICS.map(m=>({...m,firstAvg:avg(recent.slice(0,mid),m.key),secondAvg:avg(recent.slice(mid),m.key),delta:avg(recent.slice(mid),m.key)-avg(recent.slice(0,mid),m.key)}));
  })();

  const filteredDB=SUPPLEMENT_DB.filter(s=>{
    const q=dbQuery.toLowerCase();
    return(!q||s.name.toLowerCase().includes(q)||s.category.toLowerCase().includes(q)||s.notes.toLowerCase().includes(q))&&(dbCategory==="All"||s.category===dbCategory);
  });

  const isAddOrEdit=modal==="add"||modal==="edit";

  if(!loaded)return(
    <div style={{minHeight:"100vh",background:"#fdf4f7",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:32}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontStyle:"italic",color:"#d6477e"}}>Rosette</div>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#b07a90",letterSpacing:"0.14em"}}>Loading your wellness journal…</div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",fontFamily:"var(--sans)",color:"var(--text)",paddingBottom:100}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        :root{--bg:#fdf4f7;--surface:#ffffff;--surface2:#fce8ef;--border:#f0d0dc;--border2:#e4b0c4;--pink:#d6477e;--pink-light:#e879a0;--pink-dim:#c07090;--text:#3d1a28;--text2:#7a4058;--text3:#b07a90;--sans:'DM Sans',sans-serif;--serif:'Cormorant Garamond',serif;--mono:'DM Mono',monospace;}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;animation:fadeUp .22s ease;box-shadow:0 2px 12px rgba(200,80,120,.06)}
        .supp-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 18px;transition:border-color .2s,box-shadow .2s;animation:fadeUp .22s ease;box-shadow:0 2px 12px rgba(200,80,120,.05)}
        .supp-card:hover{border-color:var(--border2);box-shadow:0 4px 20px rgba(200,80,120,.1)}
        .input{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--text);font-family:var(--sans);font-size:14px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s}
        .input:focus{border-color:var(--pink-dim);box-shadow:0 0 0 3px rgba(214,71,126,.08)}
        .input::placeholder{color:var(--text3)}
        .select{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--text);font-family:var(--sans);font-size:14px;width:100%;outline:none;cursor:pointer}
        .pill{border:1px solid var(--border);background:var(--surface);color:var(--text3);padding:6px 14px;border-radius:20px;font-size:11px;font-family:var(--mono);cursor:pointer;transition:all .18s;letter-spacing:.04em}
        .pill:hover,.pill.on{border-color:var(--pink-dim);color:var(--pink);background:var(--surface2)}
        .btn-primary{background:var(--pink);color:#fff;border:none;border-radius:8px;padding:13px 24px;font-family:var(--sans);font-size:13px;font-weight:600;letter-spacing:.04em;cursor:pointer;width:100%;transition:opacity .2s,transform .15s;box-shadow:0 3px 14px rgba(214,71,126,.28)}
        .btn-primary:hover{opacity:.9;transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.35;cursor:default;transform:none;box-shadow:none}
        .btn-sm{background:transparent;border:1px solid var(--border2);color:var(--text3);border-radius:6px;padding:5px 12px;font-family:var(--mono);font-size:10px;letter-spacing:.06em;cursor:pointer;transition:all .18s;white-space:nowrap}
        .btn-sm:hover{border-color:var(--pink-dim);color:var(--pink);background:var(--surface2)}
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
        .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);display:flex;z-index:100;max-width:480px;margin:0 auto}
        .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px 14px;border:none;background:none;cursor:pointer;font-family:var(--mono);font-size:9px;letter-spacing:.08em;color:var(--text3);transition:color .18s;text-transform:uppercase}
        .nav-btn.active{color:var(--pink)}
        .nav-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
        .db-cats{display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin-bottom:6px;-webkit-mask-image:linear-gradient(to right,black 85%,transparent 100%);mask-image:linear-gradient(to right,black 85%,transparent 100%)}
        .db-cats::-webkit-scrollbar{display:none}
        .mood-card-border{border-left-width:3px;border-left-style:solid}
        .save-overlay{position:absolute;inset:0;background:rgba(253,244,247,.6);display:flex;align-items:center;justify-content:center;border-radius:20px 20px 0 0;z-index:10}
        .icon-btn{background:none;border:none;cursor:pointer;padding:4px;color:var(--text3);transition:color .18s;line-height:1;display:flex;align-items:center}
        .icon-btn:hover{color:var(--pink)}
      `}</style>

      {/* Header */}
      <div style={{maxWidth:480,margin:"0 auto",padding:"36px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:34,fontWeight:500,color:"var(--text)",letterSpacing:"-0.01em",lineHeight:1}}>Rosette</h1>
            <p style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:6,letterSpacing:"0.14em"}}>WELLNESS & SUPPLEMENT JOURNAL</p>
          </div>
          <button onClick={()=>setModal("mood")} style={{background:"var(--pink)",color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontSize:11,fontFamily:"var(--mono)",fontWeight:500,letterSpacing:"0.07em",cursor:"pointer",boxShadow:"0 3px 12px rgba(214,71,126,.25)"}}>LOG MOOD</button>
        </div>
        <div style={{height:1,background:"linear-gradient(90deg,var(--pink) 0%,transparent 55%)",marginTop:18}}/>
      </div>

      {/* Content */}
      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 20px 0"}}>

        {/* ── MY STACK ── */}
        {tab==="stack"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {/* Stack-relevant stats */}
            <div style={{display:"flex",gap:8}}>
              {[
                {label:"Active",val:activeSupps.length,color:"var(--pink)"},
                {label:"Days Tracking",val:suppHistory.length>0?daysSince(suppHistory.slice().sort((a,b)=>new Date(a.date)-new Date(b.date))[0]?.date||getToday()):0,color:"#9d6dc4"},
                {label:"Last Change",val:sortedHistory.length>0?`${daysSince(sortedHistory[0].date)}d ago`:"—",color:"var(--text2)"},
              ].map(s=>(
                <div key={s.label} className="stat-box">
                  <div style={{fontSize:s.val===0&&s.label==="Days Tracking"?"22px":typeof s.val==="string"?"16px":"26px",fontFamily:"var(--serif)",color:s.color,fontWeight:500,lineHeight:1}}>{s.val}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:5,letterSpacing:"0.08em"}}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
              <span className="section-title">Active Supplements</span>
              <div style={{display:"flex",gap:8}}>
                <button className="btn-sm" onClick={()=>setModal("database")}>Browse DB</button>
                <button onClick={()=>openAdd()} style={{background:"var(--pink)",color:"#fff",border:"none",borderRadius:6,padding:"6px 16px",fontSize:11,fontFamily:"var(--mono)",fontWeight:500,letterSpacing:"0.07em",cursor:"pointer"}}>+ ADD</button>
              </div>
            </div>

            {activeSupps.length===0&&(
              <div style={{padding:"48px 0",textAlign:"center",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14}}>
                <div style={{fontFamily:"var(--serif)",fontSize:22,fontStyle:"italic",color:"var(--text2)",marginBottom:10}}>Your stack is empty</div>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",letterSpacing:"0.06em",lineHeight:1.7}}>Track your supplements to start<br/>discovering what works for you.</div>
                <button onClick={()=>setModal("database")} style={{marginTop:16,background:"transparent",border:"1px solid var(--border2)",borderRadius:8,padding:"8px 20px",fontFamily:"var(--mono)",fontSize:11,color:"var(--pink)",cursor:"pointer",letterSpacing:"0.06em"}}>Browse Database</button>
              </div>
            )}

            {activeSupps.map((s,idx)=>(
              <div key={s.id} className="supp-card" style={{borderLeft:`2.5px solid ${s.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:14,color:"var(--text)",marginBottom:6}}>{s.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {s.dose&&<Tag color={s.color}>{s.dose}</Tag>}
                      <Tag color="#9d6dc4">{s.frequency}</Tag>
                      {s.times?.map(t=><Tag key={t} color="var(--text3)">{t}</Tag>)}
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                    {/* Reorder */}
                    <div style={{display:"flex",flexDirection:"column",gap:1}}>
                      <button className="icon-btn" onClick={()=>moveSupplement(s.id,-1)} disabled={idx===0} style={{opacity:idx===0?0.2:1}}>
                        <svg viewBox="0 0 16 16" style={{width:12,height:12}}><path d="M8 4l-4 4h8z"/></svg>
                      </button>
                      <button className="icon-btn" onClick={()=>moveSupplement(s.id,1)} disabled={idx===activeSupps.length-1} style={{opacity:idx===activeSupps.length-1?0.2:1}}>
                        <svg viewBox="0 0 16 16" style={{width:12,height:12}}><path d="M8 12l4-4H4z"/></svg>
                      </button>
                    </div>
                    <button className="btn-sm" onClick={()=>openEdit(s)}>EDIT</button>
                    <button className="btn-sm" onClick={()=>setConfirmDrop(s.id)} style={{borderColor:"#f0d0dc"}}>DROP</button>
                  </div>
                </div>
                <div style={{marginTop:8,fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.04em"}}>Since {formatDate(s.startDate||s.start_date)} · {daysSince(s.startDate||s.start_date)} days</div>
                {s.notes&&<div style={{fontFamily:"var(--sans)",fontSize:12,color:"var(--text3)",marginTop:8,paddingTop:8,borderTop:"1px solid var(--border)",lineHeight:1.6}}>{s.notes}</div>}
              </div>
            ))}

            {/* Dropped section — collapsible */}
            {inactiveSupps.length>0&&(
              <div style={{marginTop:4}}>
                <button onClick={()=>setShowDropped(p=>!p)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:"4px 0"}}>
                  <span className="section-title" style={{fontSize:16}}>Dropped ({inactiveSupps.length})</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:2}}>{showDropped?"▲ hide":"▼ show"}</span>
                </button>
                {showDropped&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
                    {inactiveSupps.map(s=>(
                      <div key={s.id} className="supp-card" style={{opacity:0.5}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontFamily:"var(--sans)",fontWeight:500,fontSize:14,textDecoration:"line-through",color:"var(--text2)"}}>{s.name}</div>
                            <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:4}}>Dropped {formatDate(s.endDate||s.end_date)}</div>
                          </div>
                          <button className="btn-sm" onClick={()=>reactivate(s.id)} style={{opacity:3}}>RESTART</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── MOOD LOG ── */}
        {tab==="log"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Averages card with window toggle */}
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.12em",color:"var(--text3)"}}>AVERAGES</div>
                <div style={{display:"flex",gap:6}}>
                  {[7,14,30].map(w=>(
                    <button key={w} onClick={()=>setMoodWindow(w)} style={{fontFamily:"var(--mono)",fontSize:10,padding:"3px 10px",borderRadius:12,cursor:"pointer",border:`1px solid ${moodWindow===w?"var(--pink)":"var(--border)"}`,background:moodWindow===w?"var(--surface2)":"transparent",color:moodWindow===w?"var(--pink)":"var(--text3)",letterSpacing:"0.04em"}}>{w}d</button>
                  ))}
                </div>
              </div>
              {windowedMoods.length===0?(
                <div style={{textAlign:"center",padding:"12px 0",fontFamily:"var(--serif)",fontSize:16,fontStyle:"italic",color:"var(--text3)"}}>No entries in this window</div>
              ):avgMetrics.map(m=>(
                <div key={m.key} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--text2)",fontWeight:500}}>{m.label}</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--pink)",fontWeight:500}}>{m.avg?m.avg.toFixed(1):"—"}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:m.avg?`${(m.avg/10)*100}%`:"0%",background:m.avg>=7?"var(--pink)":m.avg>=4?"#9d6dc4":"var(--text3)"}}/></div>
                </div>
              ))}
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="section-title">Entries</span>
              <button onClick={()=>setModal("mood")} style={{background:"var(--pink)",color:"#fff",border:"none",borderRadius:6,padding:"6px 16px",fontSize:11,fontFamily:"var(--mono)",fontWeight:500,letterSpacing:"0.07em",cursor:"pointer"}}>+ LOG</button>
            </div>

            {recentMoods.length===0&&(
              <div style={{padding:"52px 0",textAlign:"center"}}>
                <div style={{fontFamily:"var(--serif)",fontSize:22,fontStyle:"italic",color:"var(--text2)",marginBottom:8}}>Nothing logged yet</div>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",letterSpacing:"0.06em"}}>Tap Log Mood to record how you're feeling</div>
              </div>
            )}

            {recentMoods.map((e,i)=>{
              const emo=MOOD_EMOTIONS.find(x=>x.key===e.emotion);
              const borderColor=emo?.color||"var(--border)";
              return(
                <div key={i} className="card mood-card-border" style={{padding:"14px 18px",borderLeftColor:borderColor,position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontFamily:"var(--serif)",fontSize:17,fontStyle:"italic",color:borderColor,fontWeight:500}}>{emo?.label}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.06em"}}>{formatDate(e.date||e.log_date)}</div>
                      <button className="icon-btn" onClick={()=>deleteMoodEntry(e.timestamp)} title="Delete entry" style={{color:"var(--border2)"}}>
                        <svg viewBox="0 0 16 16" style={{width:12,height:12,stroke:"currentColor",fill:"none",strokeWidth:1.5}}><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Mini bar metrics */}
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {MOOD_METRICS.map(m=>(
                      <div key={m.key} style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",width:52,letterSpacing:"0.04em",flexShrink:0}}>{m.label.split(" ")[0].toUpperCase()}</span>
                        <div style={{flex:1,height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${(e[m.key]/10)*100}%`,background:e[m.key]>=7?"var(--pink)":e[m.key]>=4?"#9d6dc4":"#b07a90",borderRadius:2}}/>
                        </div>
                        <span style={{fontFamily:"var(--mono)",fontSize:10,color:e[m.key]>=7?"var(--pink)":e[m.key]>=4?"#9d6dc4":"var(--text3)",fontWeight:500,width:14,textAlign:"right"}}>{e[m.key]}</span>
                      </div>
                    ))}
                  </div>
                  {e.notes&&<div style={{fontFamily:"var(--sans)",fontSize:12,color:"var(--text3)",borderTop:"1px solid var(--border)",paddingTop:10,marginTop:10,lineHeight:1.6}}>{e.notes}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TRENDS / INSIGHTS ── */}
        {tab==="trends"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {moodLogs.length<3&&(
              <div style={{padding:"48px 24px",textAlign:"center",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14}}>
                <div style={{fontFamily:"var(--serif)",fontSize:22,fontStyle:"italic",color:"var(--text2)",marginBottom:10}}>Not enough data yet</div>
                {/* Progress indicator */}
                <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:12}}>
                  {[1,2,3].map(n=>(
                    <div key={n} style={{width:32,height:32,borderRadius:"50%",background:moodLogs.length>=n?"var(--pink)":"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:11,color:moodLogs.length>=n?"#fff":"var(--text3)",fontWeight:600}}>{n}</div>
                  ))}
                </div>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",letterSpacing:"0.06em"}}>{moodLogs.length} of 3 entries logged</div>
              </div>
            )}

            {moodTrajectory&&(
              <div className="card">
                <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.12em",color:"var(--text3)",marginBottom:4}}>OVERALL TREND</div>
                <div style={{fontFamily:"var(--serif)",fontSize:14,fontStyle:"italic",color:"var(--text2)",marginBottom:18}}>First half vs. second half of the past 30 days</div>
                {moodTrajectory.map(m=>{
                  const isUp=m.delta>=0.3,isDown=m.delta<=-0.3;
                  const c=isUp?"var(--pink)":isDown?"#9d6dc4":"var(--text3)";
                  return(
                    <div key={m.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:12,marginBottom:12,borderBottom:"1px solid var(--border)"}}>
                      <span style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--text2)",fontWeight:500,flex:1}}>{m.label}</span>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)"}}>{m.firstAvg.toFixed(1)}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:16,color:c,fontWeight:600}}>{isUp?"↑":isDown?"↓":"→"}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:11,color:c,fontWeight:600}}>{m.secondAvg.toFixed(1)}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:10,color:c,minWidth:40,textAlign:"right"}}>{m.delta>0?"+":""}{m.delta.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {moodLogs.length>=3&&suppHistory.length>0&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className="section-title">Supplement Impact</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.08em"}}>RESEARCH-BACKED WINDOWS</span>
                </div>

                {trendInsights.length===0&&(
                  <div className="card" style={{textAlign:"center",padding:"32px 20px"}}>
                    <div style={{fontFamily:"var(--serif)",fontSize:18,fontStyle:"italic",color:"var(--text2)",marginBottom:8}}>No strong correlations yet</div>
                    <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",lineHeight:1.7,letterSpacing:"0.04em"}}>Correlations surface when mood shifts 1+ point within a supplement's onset window. Keep logging consistently.</div>
                  </div>
                )}

                {trendInsights.map((ins,i)=>{
                  const isPos=ins.delta>0;
                  // Distinguish: positive delta on a positive metric = good (pink), negative delta on negative = also good
                  const positiveMetrics=["energy","motivation","focus","sleep","mood_overall"];
                  const isGood=isPos; // higher is always better for our metrics
                  const ac=isGood?"#d6477e":"#9d6dc4";
                  const bg=isGood?"#fff0f5":"#f5f0ff";
                  const bc=isGood?"#f0c0d4":"#ddd0f8";
                  const dAbs=Math.abs(ins.delta);
                  const strength=dAbs>=2.5?"Strong":dAbs>=1.5?"Moderate":"Mild";
                  return(
                    <div key={i} style={{background:bg,border:`1px solid ${bc}`,borderLeft:`3px solid ${ac}`,borderRadius:14,padding:"16px 18px",animation:"fadeUp .22s ease"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div>
                          <div style={{fontFamily:"var(--sans)",fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:3}}>{ins.suppName}</div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            <span style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.08em",padding:"2px 8px",borderRadius:4,background:`${ac}18`,color:ac,border:`1px solid ${ac}33`}}>{ins.eventType==="added"?"ADDED":"DROPPED"}</span>
                            <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>{formatDate(ins.eventDate)}</span>
                            <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",padding:"2px 8px",borderRadius:4,background:"var(--border)",border:"1px solid var(--border2)"}}>{ins.onsetLabel} · {ins.onsetDays}d window</span>
                          </div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"var(--mono)",fontSize:18,fontWeight:600,color:ac,lineHeight:1}}>{isPos?"+":""}{ins.delta.toFixed(1)}</div>
                          <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:2,letterSpacing:"0.06em"}}>{strength.toUpperCase()}</div>
                        </div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{fontFamily:"var(--sans)",fontSize:12,color:"var(--text2)",fontWeight:500}}>{ins.metric}</span>
                          <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)"}}>{ins.before.toFixed(1)} → <span style={{color:ac,fontWeight:600}}>{ins.after.toFixed(1)}</span></span>
                        </div>
                        <div style={{height:6,background:"rgba(200,80,120,0.1)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(ins.before/10)*100}%`,background:"var(--border2)",borderRadius:3}}/></div>
                        <div style={{height:6,background:"rgba(200,80,120,0.1)",borderRadius:3,overflow:"hidden",marginTop:3}}><div style={{height:"100%",width:`${(ins.after/10)*100}%`,background:ac,borderRadius:3,transition:"width .5s ease"}}/></div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                          <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>Before ({ins.beforeN} entries)</span>
                          <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>After ({ins.afterN} entries)</span>
                        </div>
                      </div>
                      <div style={{fontFamily:"var(--serif)",fontSize:14,fontStyle:"italic",color:"var(--text2)",lineHeight:1.5,borderTop:`1px solid ${bc}`,paddingTop:10}}>
                        {ins.eventType==="added"?"After adding":"After dropping"} {ins.suppName}, your {ins.metric.toLowerCase()} {isPos?"improved":"declined"} by {dAbs.toFixed(1)} points over the following {ins.onsetDays} days.
                      </div>
                    </div>
                  );
                })}

                {trendInsights.length>0&&(
                  <div style={{padding:"12px 16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",lineHeight:1.8,letterSpacing:"0.05em"}}>DISCLAIMER — Correlations are not causation. Mood shifts may reflect many factors. Use as a starting point for reflection, not medical guidance.</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── HISTORY (inside stack as bottom section or separate tab) ── */}
        {tab==="history"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card">
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.12em",color:"var(--text3)",marginBottom:18}}>SUPPLEMENT TIMELINE</div>
              {sortedHistory.length===0&&<div style={{textAlign:"center",padding:"24px 0",fontFamily:"var(--serif)",fontSize:18,fontStyle:"italic",color:"var(--text3)"}}>No changes recorded</div>}
              {sortedHistory.map((h,i)=>(
                <div key={i} style={{display:"flex",gap:14,paddingBottom:14,borderBottom:i<sortedHistory.length-1?"1px solid var(--border)":"none",marginBottom:i<sortedHistory.length-1?14:0}}>
                  <div style={{width:6,height:6,borderRadius:"50%",marginTop:6,flexShrink:0,background:h.type==="added"?"var(--pink)":h.type==="dropped"?"var(--text3)":"#9d6dc4"}}/>
                  <div>
                    <div style={{fontSize:13,fontFamily:"var(--sans)",fontWeight:500}}>
                      <span style={{color:h.type==="added"?"var(--pink)":h.type==="dropped"?"var(--text3)":"#9d6dc4"}}>{h.type.charAt(0).toUpperCase()+h.type.slice(1)}</span>
                      {" — "}<span style={{color:"var(--text)"}}>{h.suppName||h.supp_name}</span>
                    </div>
                    {h.dose&&<div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:3}}>{h.dose} · {h.frequency}</div>}
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:2}}>{formatDate(h.date)}</div>
                  </div>
                </div>
              ))}
            </div>
            {activeSupps.length>0&&(
              <div className="card">
                <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.12em",color:"var(--text3)",marginBottom:16}}>CURRENT STACK</div>
                {activeSupps.map((s,i)=>(
                  <div key={s.id} style={{display:"flex",justifyContent:"space-between",paddingBottom:12,marginBottom:12,borderBottom:i<activeSupps.length-1?"1px solid var(--border)":"none"}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                      <span style={{fontFamily:"var(--sans)",fontSize:13,fontWeight:500,color:"var(--text)"}}>{s.name}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--pink)"}}>{s.frequency}</div>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)"}}>since {formatDate(s.startDate||s.start_date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="bottom-nav" style={{left:"50%",transform:"translateX(-50%)"}}>
        {[
          {k:"stack",label:"Stack",icon:<><rect x="3" y="3" width="10" height="3" rx="1"/><rect x="3" y="8" width="10" height="3" rx="1"/><rect x="3" y="13" width="7" height="3" rx="1"/></>},
          {k:"log",label:"Mood",icon:<><path d="M12 2C8.69 2 6 4.69 6 8c0 2.97 2.03 5.44 4.77 6.14L12 17l1.23-2.86C16.02 13.44 18 10.97 18 8c0-3.31-2.69-6-6-6z"/><circle cx="12" cy="8" r="2"/></>},
          {k:"trends",label:"Trends",icon:<><polyline points="3 14 7 8 11 11 15 5"/><line x1="3" y1="18" x2="17" y2="18"/></>},
          {k:"history",label:"History",icon:<><circle cx="9" cy="9" r="6"/><polyline points="9 6 9 9 11 11"/><path d="M14.5 14.5L18 18"/></>},
        ].map(({k,label,icon})=>(
          <button key={k} className={`nav-btn ${tab===k?"active":""}`} onClick={()=>setTab(k)}>
            <svg viewBox="0 0 18 18">{icon}</svg>
            {label}
          </button>
        ))}
      </div>

      {/* ── CONFIRM DROP ── */}
      {confirmDrop&&<ConfirmDrop name={supplements.find(s=>s.id===confirmDrop)?.name} onConfirm={()=>dropSupplement(confirmDrop)} onCancel={()=>setConfirmDrop(null)} />}

      {/* ── ADD / EDIT SUPPLEMENT MODAL ── */}
      {isAddOrEdit&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box" style={{position:"relative"}}>
            {saving&&<div className="save-overlay"><div style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--pink)",letterSpacing:"0.08em"}}>Saving…</div></div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26}}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:400,fontStyle:"italic",color:"var(--text)"}}>{modal==="edit"?"Edit Supplement":"Add to Stack"}</h2>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <span className="field-label">Supplement Name</span>
                {modal==="edit"?(
                  <input className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                ):(
                  <NameAutofill value={form.name} onChange={handleNameChange} onSelect={handleSelectDB} />
                )}
              </div>
              <div>
                <span className="field-label">Dose</span>
                <DoseSelector dbEntry={formDbEntry} value={form.dose} onChange={v=>setForm(f=>({...f,dose:v}))} />
              </div>
              <div>
                <span className="field-label">Frequency</span>
                <select className="select" value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))}>
                  {FREQUENCIES.map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <span className="field-label">Time of Day <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"var(--text3)"}}>— select all that apply</span></span>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {TIMES_OF_DAY.map(t=>(
                    <button key={t} className={`pill ${form.times.includes(t)?"on":""}`} onClick={()=>toggleTime(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span className="field-label" style={{marginBottom:0}}>Start Date</span>
                </div>
                <input type="date" className="input" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} />
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span className="field-label" style={{marginBottom:0}}>Notes</span>
                  {formDefaultNotes&&form.notes!==formDefaultNotes&&(
                    <button onClick={()=>setForm(f=>({...f,notes:formDefaultNotes}))} style={{background:"none",border:"none",fontFamily:"var(--mono)",fontSize:9,color:"var(--pink)",cursor:"pointer",letterSpacing:"0.06em"}}>RESTORE DEFAULT</button>
                  )}
                </div>
                <input className="input" placeholder="Optional..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
              </div>
              <button className="btn-primary" onClick={modal==="edit"?saveSuppEdit:addSupplement} disabled={!form.name.trim()||saving} style={{marginTop:4}}>
                {modal==="edit"?"Save Changes":"Add to Stack"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOG MOOD MODAL ── */}
      {modal==="mood"&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box" style={{position:"relative"}}>
            {saving&&<div className="save-overlay"><div style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--pink)",letterSpacing:"0.08em"}}>Saving…</div></div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26}}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:400,fontStyle:"italic",color:"var(--text)"}}>How are you feeling?</h2>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:22}}>
              <div>
                <span className="field-label">Emotion</span>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {MOOD_EMOTIONS.map(e=>(
                    <button key={e.key} onClick={()=>setMoodForm(f=>({...f,emotion:e.key}))}
                      style={{border:`1.5px solid ${moodForm.emotion===e.key?e.color:"var(--border)"}`,background:moodForm.emotion===e.key?`${e.color}12`:"var(--surface)",color:moodForm.emotion===e.key?e.color:"var(--text2)",borderRadius:8,padding:"9px 10px",fontFamily:"var(--sans)",fontSize:12,cursor:"pointer",transition:"all .18s",textAlign:"center",fontWeight:500}}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="field-label">Daily Metrics — 1 to 10</span>
                <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:16}}>
                  {MOOD_METRICS.map(m=>(
                    <div key={m.key}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--text2)",fontWeight:500}}>{m.label}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)"}}>{m.low} · {m.high}</span>
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
              <button className="btn-primary" onClick={logMood} disabled={!moodForm.emotion||saving}>Save Entry</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DATABASE MODAL ── */}
      {modal==="database"&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box" style={{maxHeight:"94vh"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:400,fontStyle:"italic",color:"var(--text)"}}>Supplement Database</h2>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <input className="input" placeholder="Search by name, category, or effect..." value={dbQuery} onChange={e=>setDbQuery(e.target.value)} style={{marginBottom:12}} />
            <div className="db-cats">
              {["All",...CATEGORIES].map(c=>(
                <button key={c} className={`pill ${dbCategory===c?"on":""}`} style={{flexShrink:0,fontSize:10}} onClick={()=>setDbCategory(c)}>{c}</button>
              ))}
            </div>
            <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.08em",marginBottom:4}}>{filteredDB.length} RESULTS — TAP TO EXPAND</div>
            <div>
              {filteredDB.map((s,i)=>(
                <div key={i} className="db-row" onClick={()=>setDbDetailEntry(s)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <div>
                      <div style={{fontFamily:"var(--sans)",fontSize:14,fontWeight:500,color:"var(--text)",marginBottom:5}}>{s.name}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Tag color="var(--pink)">{s.typicalDose}</Tag><Tag color="#9d6dc4">{s.category}</Tag></div>
                    </div>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",flexShrink:0,marginTop:2,letterSpacing:"0.04em"}}>▸</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DB DETAIL MODAL ── */}
      {dbDetailEntry&&(
        <div className="modal-wrap" onClick={e=>e.target===e.currentTarget&&setDbDetailEntry(null)}>
          <div className="modal-box">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <h2 style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:400,fontStyle:"italic",color:"var(--text)",marginBottom:6}}>{dbDetailEntry.name}</h2>
                <div style={{display:"flex",gap:6}}><Tag color="var(--pink)">{dbDetailEntry.typicalDose}</Tag><Tag color="#9d6dc4">{dbDetailEntry.category}</Tag></div>
              </div>
              <button onClick={()=>setDbDetailEntry(null)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <div style={{fontFamily:"var(--sans)",fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:20,padding:"14px 16px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)"}}>
              {dbDetailEntry.notes}
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.1em",color:"var(--text3)",marginBottom:10}}>COMMON DOSES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {dbDetailEntry.doseOptions.map(d=><span key={d} style={{fontFamily:"var(--mono)",fontSize:12,padding:"6px 14px",borderRadius:20,border:"1px solid var(--border2)",color:"var(--pink)",background:"var(--surface2)"}}>{d}</span>)}
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.1em",color:"var(--text3)",marginBottom:8}}>ONSET WINDOW</div>
              <div style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--text2)"}}>{getOnsetLabel(getOnsetWindow(dbDetailEntry.name))} — effects typically felt within {getOnsetWindow(dbDetailEntry.name)} days</div>
            </div>
            <button className="btn-primary" onClick={()=>{openAdd({name:dbDetailEntry.name,dose:dbDetailEntry.doseOptions?.[0]||dbDetailEntry.typicalDose,notes:dbDetailEntry.notes},dbDetailEntry);setDbDetailEntry(null);}}>
              + Add to Stack
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
