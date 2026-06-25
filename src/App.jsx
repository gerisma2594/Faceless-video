import { useState, useRef } from "react";

const ELEVENLABS_VOICES = {
  nayra: [
    { name: "Fatima", id: "EXAVITQu4vr4xnSDxMaL", lang: "عربي", desc: "صوت نسائي دافئ" },
    { name: "Layla",  id: "XB0fDUnXU5powFXDhCwa", lang: "عربي", desc: "صوت احترافي ناعم" },
    { name: "Sara",   id: "pFZP5JQG7iQjIQuC4Bku", lang: "فرنسي", desc: "صوت فرنسي أنثوي" },
  ],
  procoach: [
    { name: "Rachel",  id: "21m00Tcm4TlvDq8ikWAM", lang: "English", desc: "Warm professional female" },
    { name: "Bella",   id: "EXAVITQu4vr4xnSDxMaL", lang: "English", desc: "Soft & engaging" },
    { name: "Dorothy", id: "ThT5KcBeYPX3keUQqHPh", lang: "English", desc: "Clear & authoritative" },
  ],
};

const CANVA_TEMPLATES = {
  nayra: {
    "رييل تعليمي": "https://www.canva.com/search/templates?q=educational+reel+arabic",
    "رييل بيعي":   "https://www.canva.com/search/templates?q=sales+instagram+reel",
    "رييل إلهامي": "https://www.canva.com/search/templates?q=motivational+reel",
    "رييل قصة":    "https://www.canva.com/search/templates?q=story+reel+instagram",
  },
  procoach: {
    "Educational Reel":   "https://www.canva.com/search/templates?q=educational+instagram+reel+coach",
    "Sales Reel":         "https://www.canva.com/search/templates?q=sales+reel+business",
    "Inspirational Reel": "https://www.canva.com/search/templates?q=inspirational+reel+coach",
    "Story Reel":         "https://www.canva.com/search/templates?q=story+reel+personal+brand",
  },
};

const MUSIC_MOODS = {
  "تعليمي":    { mood: "هادئ + تحفيزي", capcut: "background study lo-fi chill", emoji: "🎵" },
  "ملهم":      { mood: "صاعد + عاطفي",  capcut: "uplifting inspirational cinematic", emoji: "🎶" },
  "بيعي":      { mood: "حيوي + عصري",   capcut: "trendy upbeat corporate pop", emoji: "🔥" },
  "قصة نجاح":  { mood: "دافئ + أصيل",   capcut: "warm acoustic storytelling", emoji: "✨" },
  "Educational":       { mood: "Calm + focused",    capcut: "lo-fi study background chill", emoji: "🎵" },
  "Inspirational":     { mood: "Rising + emotional", capcut: "uplifting cinematic motivational", emoji: "🎶" },
  "Sales":             { mood: "Energetic + modern", capcut: "trendy upbeat pop corporate", emoji: "🔥" },
  "Testimonial-style": { mood: "Warm + authentic",   capcut: "warm acoustic soft storytelling", emoji: "✨" },
};

const BRANDS = {
  nayra: {
    id: "nayra", label: "NAYRA نيرا", lang: "ar",
    accent: "#C9A84C", accentSoft: "#C9A84C22", accentText: "#C9A84C",
    bg: "#0F0E1A", card: "#16152A", border: "#2A2850",
    tagline: "محتوى يجذب — بدون كاميرا",
    niches: ["تعليم الكانفا","مهارات رقمية","دورات أونلاين","ريادة الأعمال","تصميم جرافيك"],
    tones: ["تعليمي","ملهم","بيعي","قصة نجاح"],
    placeholder: "مثال: كيف تبدأين مشروعك الرقمي بدون خبرة",
  },
  procoach: {
    id: "procoach", label: "The Pro Coach Brand", lang: "en",
    accent: "#3DFFD0", accentSoft: "#3DFFD022", accentText: "#3DFFD0",
    bg: "#0C0F12", card: "#131820", border: "#1E2730",
    tagline: "Content that converts — no camera needed",
    niches: ["Canva templates","Life coaching","Business coaching","Digital products","Personal branding"],
    tones: ["Educational","Inspirational","Sales","Testimonial-style"],
    placeholder: "e.g. How coaches can make passive income with Canva templates",
  },
};

const CONTENT_TYPES = {
  nayra:    ["رييل تعليمي","رييل بيعي","رييل إلهامي","رييل قصة"],
  procoach: ["Educational Reel","Sales Reel","Inspirational Reel","Story Reel"],
};

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

function buildPrompt(brand, topic, tone, contentType, editor, brandVoice = "") {
  const vc = brandVoice ? (brand.id === "nayra" ? `\nأسلوب العلامة التجارية:\n${brandVoice}\n` : `\nBrand voice:\n${brandVoice}\n`) : "";
  if (brand.id === "nayra") {
    return `أنتِ خبيرة محتوى Instagram Reels فيسلس للمرأة الجزائرية في التعليم الرقمي.\n${vc}\nالموضوع: ${topic} | النبرة: ${tone} | نوع: ${contentType} | مونتاج: ${editor}\nJSON فقط:\n{"hook":"","script":[{"second":"0-3","text":""},{"second":"3-8","text":""},{"second":"8-20","text":""},{"second":"20-27","text":""},{"second":"27-30","text":""}],"scenes":[{"number":1,"duration":"3 ثوان","visual":"","broll":"english keywords","capcut_tip":""},{"number":2,"duration":"5 ثوان","visual":"","broll":"english keywords","capcut_tip":""},{"number":3,"duration":"12 ثانية","visual":"","broll":"english keywords","capcut_tip":""},{"number":4,"duration":"7 ثوان","visual":"","broll":"english keywords","capcut_tip":""},{"number":5,"duration":"3 ثوان","visual":"","broll":"english keywords","capcut_tip":""}],"voiceover":"","caption":"","hashtags":""}`;
  }
  return `You are an expert faceless Instagram Reels strategist for English-speaking coaches.\n${vc}\nTopic: ${topic} | Tone: ${tone} | Type: ${contentType} | Editor: ${editor}\nJSON only:\n{"hook":"","script":[{"second":"0-3","text":""},{"second":"3-8","text":""},{"second":"8-20","text":""},{"second":"20-27","text":""},{"second":"27-30","text":""}],"scenes":[{"number":1,"duration":"3s","visual":"","broll":"keywords","capcut_tip":""},{"number":2,"duration":"5s","visual":"","broll":"keywords","capcut_tip":""},{"number":3,"duration":"12s","visual":"","broll":"keywords","capcut_tip":""},{"number":4,"duration":"7s","visual":"","broll":"keywords","capcut_tip":""},{"number":5,"duration":"3s","visual":"","broll":"keywords","capcut_tip":""}],"voiceover":"","caption":"","hashtags":""}`;
}

function buildCalendarPrompt(brand, topics, tone, contentType, editor, brandVoice = "") {
  const list = topics.map((t, i) => `Day ${i+1}: ${t}`).join("\n");
  const vc = brandVoice ? `Brand voice:\n${brandVoice}\n` : "";
  if (brand.id === "nayra") return `أنشئي 7 حزم محتوى Reels.\n${vc}\n${list}\nالنبرة: ${tone} | ${contentType} | ${editor}\nJSON array فقط: [{"day":1,"topic":"","hook":"","voiceover":"","caption":"","hashtags":"","music":""},...]`;
  return `Generate 7 Reels packages.\n${vc}\n${list}\nTone: ${tone} | ${contentType} | ${editor}\nJSON array only: [{"day":1,"topic":"","hook":"","voiceover":"","caption":"","hashtags":"","music":""},...]`;
}

function buildHookPrompt(brand, hooks) {
  if (brand.id === "nayra") return `تعلمي من هذه الهوكات وأنشئي 5 جديدة:\n${hooks}\nJSON فقط: {"hooks":["","","","",""]}`;
  return `Study these hooks and generate 5 new ones:\n${hooks}\nJSON only: {"hooks":["","","","",""]}`;
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw { status: res.status };
  const data = await res.json();
  const raw = data.content.map(b => b.text || "").join("");
  const a = Math.min(...["{","["].map(c => raw.indexOf(c)).filter(i => i !== -1));
  const b2 = Math.max(...["}","]"].map(c => raw.lastIndexOf(c)));
  return JSON.parse(raw.slice(a, b2 + 1));
}

function CopyBtn({ text, brand }) {
  const [copied, setCopied] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }} style={{ background: copied ? brand.accentSoft : "transparent", border: `1px solid ${copied ? brand.accent : "#ffffff30"}`, color: copied ? brand.accentText : "#aaa", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "✓" : "Copy"}</button>;
}

function Section({ title, icon, children, brand, copyText, collapsible = false }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: brand.card, border: `1px solid ${brand.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: open ? 12 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: collapsible ? "pointer" : "default" }} onClick={() => collapsible && setOpen(v => !v)}>
          <span>{icon}</span>
          <span style={{ color: brand.accentText, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>{title}</span>
          {collapsible && <span style={{ color: "#555", fontSize: 10 }}>{open ? "▲" : "▼"}</span>}
        </div>
        {copyText && <CopyBtn text={copyText} brand={brand} />}
      </div>
      {open && children}
    </div>
  );
}

function SceneCard({ scene, brand }) {
  const kws = (scene.broll || "").split(",").map(k => k.trim()).filter(Boolean);
  return (
    <div style={{ background: brand.bg, border: `1px solid ${brand.border}`, borderRadius: 9, padding: "11px 13px", marginBottom: 9 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <div style={{ background: brand.accent, color: brand.bg, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>{scene.number}</div>
        <span style={{ color: "#888", fontSize: 11 }}>{scene.duration}</span>
      </div>
      <p style={{ color: "#E0DDD8", fontSize: 13, margin: "0 0 9px" }}>🎬 {scene.visual}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
        {kws.map((kw, i) => (
          <div key={i} style={{ display: "flex" }}>
            <a href={`https://www.pexels.com/search/videos/${encodeURIComponent(kw)}/`} target="_blank" rel="noopener noreferrer" style={{ background: brand.accentSoft, color: brand.accentText, borderRadius: "4px 0 0 4px", padding: "3px 7px", fontSize: 11, textDecoration: "none", border: `1px solid ${brand.accent}44`, borderRight: "none" }}>🎥 Pexels</a>
            <a href={`https://pixabay.com/videos/search/${encodeURIComponent(kw)}/`} target="_blank" rel="noopener noreferrer" style={{ background: "#1a1a2e", color: "#7c83fd", borderRadius: "0 4px 4px 0", padding: "3px 7px", fontSize: 11, textDecoration: "none", border: "1px solid #7c83fd44", borderLeft: "none" }}>Pixabay</a>
          </div>
        ))}
      </div>
      {scene.capcut_tip && <p style={{ color: "#666", fontSize: 11, margin: 0, fontStyle: "italic" }}>✂️ {scene.capcut_tip}</p>}
    </div>
  );
}

function VoiceoverSection({ voiceover, brand, isAr, brandId }) {
  const voices = ELEVENLABS_VOICES[brandId];
  const [sel, setSel] = useState(voices[0]);
  return (
    <Section title={isAr ? "الفويس أوفر" : "Voiceover"} icon="🎙️" brand={brand} copyText={voiceover} collapsible>
      <p style={{ color: "#E0DDD8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px", fontStyle: "italic" }}>{voiceover}</p>
      <div style={{ borderTop: `1px solid ${brand.border}`, paddingTop: 12 }}>
        <p style={{ color: "#666", fontSize: 11, margin: "0 0 8px", textTransform: "uppercase" }}>{isAr ? "اختاري الصوت:" : "Choose voice:"}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {voices.map(v => (
            <button key={v.id} onClick={() => setSel(v)} style={{ background: sel.id === v.id ? brand.accentSoft : "transparent", border: `1px solid ${sel.id === v.id ? brand.accent : brand.border}`, color: sel.id === v.id ? brand.accentText : "#888", borderRadius: 7, padding: "8px 12px", cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600 }}>{v.name}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{v.lang} · {v.desc}</span>
            </button>
          ))}
        </div>
        <a href="https://elevenlabs.io/app/speech-synthesis/text-to-speech" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: brand.accent, color: brand.bg, borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          🔊 {isAr ? `افتحي ElevenLabs — ${sel.name}` : `Open ElevenLabs — ${sel.name}`}
        </a>
      </div>
    </Section>
  );
}

function MusicSection({ tone, brand, isAr }) {
  const mood = MUSIC_MOODS[tone] || { mood: "Chill", capcut: "background chill music", emoji: "🎵" };
  return (
    <Section title={isAr ? "الموسيقى" : "Music"} icon={mood.emoji} brand={brand} collapsible>
      <p style={{ color: brand.accentText, fontWeight: 700, margin: "0 0 8px" }}>{mood.mood}</p>
      <div style={{ background: brand.bg, border: `1px solid ${brand.border}`, borderRadius: 7, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <code style={{ color: brand.accentText, fontSize: 12 }}>{mood.capcut}</code>
        <CopyBtn text={mood.capcut} brand={brand} />
      </div>
    </Section>
  );
}

function ResultPackage({ result, brand, isAr, tone, contentType, onSave, isSaved }) {
  return (
    <div>
      <Section title={isAr ? "الهوك" : "Hook"} icon="⚡" brand={brand} copyText={result.hook}>
        <p style={{ fontSize: 19, fontWeight: 800, color: "#F7F6F2", lineHeight: 1.4, margin: 0, borderRight: isAr ? `3px solid ${brand.accent}` : "none", borderLeft: !isAr ? `3px solid ${brand.accent}` : "none", paddingRight: isAr ? 12 : 0, paddingLeft: !isAr ? 12 : 0 }}>{result.hook}</p>
      </Section>
      <Section title={isAr ? "السكريبت" : "Script"} icon="📝" brand={brand} copyText={result.script?.map(s => `[${s.second}s] ${s.text}`).join("\n")} collapsible>
        {result.script?.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7, alignItems: "flex-start" }}>
            <div style={{ background: brand.accentSoft, color: brand.accentText, borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{item.second}s</div>
            <p style={{ color: "#E0DDD8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.text}</p>
          </div>
        ))}
      </Section>
      <Section title={isAr ? "المشاهد + B-Roll" : "Scenes + B-Roll"} icon="🎬" brand={brand} collapsible>
        {result.scenes?.map((scene, i) => <SceneCard key={i} scene={scene} brand={brand} isAr={isAr} />)}
      </Section>
      <VoiceoverSection voiceover={result.voiceover} brand={brand} isAr={isAr} brandId={brand.id} />
      <MusicSection tone={tone} brand={brand} isAr={isAr} />
      <Section title={isAr ? "قالب كانفا" : "Canva Template"} icon="🎨" brand={brand} collapsible>
        <a href={CANVA_TEMPLATES[brand.id]?.[contentType] || "https://www.canva.com/search/templates?q=instagram+reel"} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: "#7B2FD4", color: "#fff", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          🎨 {isAr ? "افتحي قالب كانفا" : "Open Canva Template"}
        </a>
      </Section>
      <Section title={isAr ? "كابشن" : "Caption"} icon="✍️" brand={brand} copyText={result.caption + "\n\n" + result.hashtags} collapsible>
        <p style={{ color: "#E0DDD8", fontSize: 13, lineHeight: 1.7, margin: "0 0 10px", whiteSpace: "pre-line" }}>{result.caption}</p>
        <p style={{ color: brand.accentText, fontSize: 12, lineHeight: 1.8, margin: 0 }}>{result.hashtags}</p>
      </Section>
      {onSave && (
        <button onClick={onSave} disabled={isSaved} style={{ width: "100%", background: isSaved ? brand.accentSoft : "transparent", border: `1px solid ${isSaved ? brand.accent : brand.border}`, color: isSaved ? brand.accentText : "#666", borderRadius: 9, padding: "10px", fontSize: 13, cursor: isSaved ? "default" : "pointer", fontFamily: "inherit", marginBottom: 8 }}>
          {isSaved ? (isAr ? "✓ محفوظ" : "✓ Saved") : (isAr ? "💾 حفظ" : "💾 Save")}
        </button>
      )}
    </div>
  );
}

export default function ContentStudio() {
  const [activeBrand, setActiveBrand] = useState("nayra");
  const [activeTab, setActiveTab] = useState("single");
  const brand = BRANDS[activeBrand];
  const isAr = activeBrand === "nayra";
  const [topic, setTopic] = useState(""); const [tone, setTone] = useState(""); const [contentType, setContentType] = useState(""); const [editor, setEditor] = useState("");
  const [loading, setLoading] = useState(false); const [result, setResult] = useState(null); const [error, setError] = useState(""); const [savedId, setSavedId] = useState(null);
  const [calTopics, setCalTopics] = useState(Array(7).fill("")); const [calLoading, setCalLoading] = useState(false); const [calResult, setCalResult] = useState(null); const [calError, setCalError] = useState(""); const [activeDay, setActiveDay] = useState(0);
  const [hookInput, setHookInput] = useState(""); const [hookLoading, setHookLoading] = useState(false); const [hookResult, setHookResult] = useState(null); const [hookError, setHookError] = useState("");
  const [brandVoice, setBrandVoice] = useState(""); const [showVoice, setShowVoice] = useState(false);
  const [history, setHistory] = useState([]);
  const editorOpts = isAr ? ["CapCut","Canva فيديو","الاثنان"] : ["CapCut","Canva Video","Both"];
  const fmt = (e) => e?.status === 429 ? (isAr ? "⏳ انتظري دقيقة" : "⏳ Wait 1 min, rate limit") : e?.status === 401 ? "🔒 API key error" : `❌ Error ${e?.status||""} — retry`;
  const inp = { width:"100%", boxSizing:"border-box", background:brand.card, border:`1px solid ${brand.border}`, borderRadius:9, color:"#F7F6F2", fontSize:13, padding:"10px 12px", fontFamily:"inherit", outline:"none", direction:isAr?"rtl":"ltr" };
  const lbl = { display:"block", color:"#888", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 };
  const btn = (dis) => ({ width:"100%", background:dis?brand.accentSoft:brand.accent, color:dis?brand.accentText:brand.bg, border:"none", borderRadius:10, padding:"14px", fontSize:14, fontWeight:800, cursor:dis?"not-allowed":"pointer", fontFamily:"inherit" });
  async function generate() {
    if (!topic.trim()||!tone||!contentType||!editor){setError(isAr?"يرجى ملء جميع الحقول":"Fill all fields");return;}
    setError("");setLoading(true);setResult(null);setSavedId(null);
    try{setResult(await callClaude(buildPrompt(brand,topic,tone,contentType,editor,brandVoice)));}catch(e){setError(fmt(e));}finally{setLoading(false);}
  }
  async function generateCal() {
    if(calTopics.some(t=>!t.trim())||!tone||!contentType||!editor){setCalError(isAr?"أدخلي كل المواضيع":"Enter all topics");return;}
    setCalError("");setCalLoading(true);setCalResult(null);
    try{const r=await callClaude(buildCalendarPrompt(brand,calTopics,tone,contentType,editor,brandVoice));setCalResult(Array.isArray(r)?r:r.days||[]);setActiveDay(0);}catch(e){setCalError(fmt(e));}finally{setCalLoading(false);}
  }
  async function generateHooks() {
    if(!hookInput.trim()){setHookError(isAr?"أدخلي الهوكات":"Enter hooks");return;}
    setHookError("");setHookLoading(true);setHookResult(null);
    try{const r=await callClaude(buildHookPrompt(brand,hookInput));setHookResult(r.hooks||[]);}catch(e){setHookError(fmt(e));}finally{setHookLoading(false);}
  }
  const tabs=[{id:"single",label:isAr?"رييل":"Single",icon:"✦"},{id:"calendar",label:isAr?"7 أيام":"7-Day",icon:"📅"},{id:"hooks",label:isAr?"هوكات":"Hooks",icon:"⚡"},{id:"history",label:isAr?"السجل":"History",icon:"🗂️"}];
  return (
    <div style={{minHeight:"100vh",background:brand.bg,fontFamily:"'Inter','Segoe UI',sans-serif",color:"#F7F6F2",direction:isAr?"rtl":"ltr",transition:"background 0.4s"}}>
      <div style={{borderBottom:`1px solid ${brand.border}`,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:brand.bg,zIndex:10}}>
        <div><div style={{fontWeight:800,fontSize:14}}>✦ Content Studio</div><div style={{color:brand.accentText,fontSize:10}}>{brand.tagline}</div></div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={()=>setShowVoice(v=>!v)} style={{background:showVoice?brand.accentSoft:"transparent",border:`1px solid ${showVoice?brand.accent:brand.border}`,color:showVoice?brand.accentText:"#666",borderRadius:6,padding:"5px 10px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>🧠 {isAr?"صوتي":"My Voice"}</button>
          <div style={{display:"flex",background:brand.card,border:`1px solid ${brand.border}`,borderRadius:7,overflow:"hidden"}}>
            {Object.values(BRANDS).map(b=>(
              <button key={b.id} onClick={()=>{setActiveBrand(b.id);setResult(null);setCalResult(null);setHookResult(null);setError("");}} style={{padding:"5px 11px",fontSize:11,fontWeight:700,background:activeBrand===b.id?b.accent:"transparent",color:activeBrand===b.id?b.bg:"#888",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                {b.id==="nayra"?"NAYRA":"ProCoach"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {showVoice&&(
        <div style={{background:brand.card,borderBottom:`1px solid ${brand.border}`,padding:"14px 18px"}}>
          <label style={lbl}>🧠 {isAr?"الصقي أفضل 10 كابشنات لك — AI سيتعلم أسلوبك":"Paste your best 10 captions — AI learns your style"}</label>
          <textarea value={brandVoice} onChange={e=>setBrandVoice(e.target.value)} rows={4} style={{...inp,resize:"vertical"}} placeholder={isAr?"كابشناتك الأفضل أداءً...":"Your best performing captions..."} />
        </div>
      )}
      <div style={{display:"flex",borderBottom:`1px solid ${brand.border}`}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:"10px 4px",fontSize:11,fontWeight:activeTab===t.id?700:400,background:"transparent",border:"none",borderBottom:activeTab===t.id?`2px solid ${brand.accent}`:"2px solid transparent",color:activeTab===t.id?brand.accentText:"#666",cursor:"pointer",fontFamily:"inherit"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px"}}>
        {activeTab==="single"&&(!result?(
          <>
            <div style={{marginBottom:14}}><label style={lbl}>{isAr?"الموضوع":"Topic"}</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder={brand.placeholder} rows={3} style={{...inp,resize:"vertical"}} /></div>
            <div style={{marginBottom:16}}><label style={lbl}>{isAr?"اقتراحات":"Suggestions"}</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{brand.niches.map(n=><button key={n} onClick={()=>setTopic(n)} style={{background:topic===n?brand.accentSoft:brand.card,border:`1px solid ${topic===n?brand.accent:brand.border}`,color:topic===n?brand.accentText:"#bbb",borderRadius:18,padding:"4px 11px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>)}</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[{label:isAr?"النبرة":"Tone",opts:brand.tones,val:tone,set:setTone},{label:isAr?"نوع المحتوى":"Type",opts:CONTENT_TYPES[activeBrand],val:contentType,set:setContentType}].map(f=>(
                <div key={f.label}><label style={lbl}>{f.label}</label><div style={{display:"flex",flexDirection:"column",gap:4}}>{f.opts.map(o=><button key={o} onClick={()=>f.set(o)} style={{background:f.val===o?brand.accentSoft:brand.card,border:`1px solid ${f.val===o?brand.accent:brand.border}`,color:f.val===o?brand.accentText:"#bbb",borderRadius:7,padding:"7px 9px",fontSize:12,cursor:"pointer",textAlign:isAr?"right":"left",fontFamily:"inherit"}}>{o}</button>)}</div></div>
              ))}
            </div>
            <div style={{marginBottom:20}}><label style={lbl}>{isAr?"المونتاج":"Editor"}</label><div style={{display:"flex",gap:7}}>{editorOpts.map(o=><button key={o} onClick={()=>setEditor(o)} style={{flex:1,background:editor===o?brand.accentSoft:brand.card,border:`1px solid ${editor===o?brand.accent:brand.border}`,color:editor===o?brand.accentText:"#bbb",borderRadius:8,padding:"9px 5px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{o}</button>)}</div></div>
            {error&&<p style={{color:"#FF6B6B",fontSize:12,marginBottom:10,textAlign:"center"}}>{error}</p>}
            <button onClick={generate} disabled={loading} style={btn(loading)}>{loading?(isAr?"⏳ جاري الإنشاء...":"⏳ Generating..."):(isAr?"✦ أنشئي حزمة المحتوى":"✦ Generate Content Package")}</button>
          </>
        ):(
          <>
            <ResultPackage result={result} brand={brand} isAr={isAr} tone={tone} contentType={contentType} onSave={()=>{const e={id:Date.now(),brand:activeBrand,topic,tone,contentType,result,createdAt:new Date().toLocaleTimeString()};setHistory(h=>[e,...h]);setSavedId(e.id);}} isSaved={!!savedId} />
            <button onClick={()=>{setResult(null);setTopic("");setTone("");setContentType("");setEditor("");setError("");setSavedId(null);}} style={{width:"100%",background:"transparent",border:`1px solid ${brand.border}`,color:"#666",borderRadius:9,padding:"11px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{isAr?"← رييل جديد":"← New reel"}</button>
          </>
        ))}
        {activeTab==="calendar"&&(!calResult?(
          <>
            <p style={{color:"#888",fontSize:13,marginBottom:16}}>{isAr?"أدخلي 7 مواضيع ← توليد ← 7 حزم كاملة":"Enter 7 topics ← Generate ← 7 full packages"}</p>
            {calTopics.map((t,i)=><div key={i} style={{marginBottom:9}}><label style={lbl}>{isAr?`اليوم ${i+1}`:`Day ${i+1}`}</label><input value={t} onChange={e=>{const a=[...calTopics];a[i]=e.target.value;setCalTopics(a);}} placeholder={isAr?`موضوع اليوم ${i+1}`:`Day ${i+1} topic`} style={{...inp,padding:"9px 12px"}} /></div>)}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"14px 0"}}>
              {[{label:isAr?"النبرة":"Tone",opts:brand.tones,val:tone,set:setTone},{label:isAr?"المونتاج":"Editor",opts:editorOpts,val:editor,set:setEditor}].map(f=>(
                <div key={f.label}><label style={lbl}>{f.label}</label><div style={{display:"flex",flexDirection:"column",gap:4}}>{f.opts.map(o=><button key={o} onClick={()=>f.set(o)} style={{background:f.val===o?brand.accentSoft:brand.card,border:`1px solid ${f.val===o?brand.accent:brand.border}`,color:f.val===o?brand.accentText:"#bbb",borderRadius:7,padding:"6px 9px",fontSize:11,cursor:"pointer",textAlign:isAr?"right":"left",fontFamily:"inherit"}}>{o}</button>)}</div></div>
              ))}
            </div>
            {calError&&<p style={{color:"#FF6B6B",fontSize:12,marginBottom:10,textAlign:"center"}}>{calError}</p>}
            <button onClick={generateCal} disabled={calLoading} style={btn(calLoading)}>{calLoading?(isAr?"⏳ جاري إنشاء 7 أيام...":"⏳ Generating 7 days..."):(isAr?"📅 أنشئي تقويم 7 أيام":"📅 Generate 7-Day Calendar")}</button>
          </>
        ):(
          <>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{calResult.map((_,i)=><button key={i} onClick={()=>setActiveDay(i)} style={{background:activeDay===i?brand.accentSoft:brand.card,border:`1px solid ${activeDay===i?brand.accent:brand.border}`,color:activeDay===i?brand.accentText:"#888",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{isAr?`يوم ${i+1}`:`Day ${i+1}`}</button>)}</div>
            {calResult[activeDay]&&(
              <div>
                <div style={{background:brand.card,border:`1px solid ${brand.border}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}><p style={{color:"#888",fontSize:10,margin:"0 0 4px",textTransform:"uppercase"}}>{isAr?"الموضوع":"Topic"}</p><p style={{color:"#F7F6F2",fontSize:14,fontWeight:700,margin:0}}>{calResult[activeDay].topic}</p></div>
                <Section title={isAr?"الهوك":"Hook"} icon="⚡" brand={brand} copyText={calResult[activeDay].hook}><p style={{fontSize:17,fontWeight:800,color:"#F7F6F2",margin:0}}>{calResult[activeDay].hook}</p></Section>
                <VoiceoverSection voiceover={calResult[activeDay].voiceover} brand={brand} isAr={isAr} brandId={brand.id} />
                <Section title={isAr?"كابشن":"Caption"} icon="✍️" brand={brand} copyText={calResult[activeDay].caption+"\n\n"+calResult[activeDay].hashtags} collapsible><p style={{color:"#E0DDD8",fontSize:13,lineHeight:1.7,margin:"0 0 10px",whiteSpace:"pre-line"}}>{calResult[activeDay].caption}</p><p style={{color:brand.accentText,fontSize:12,lineHeight:1.8,margin:0}}>{calResult[activeDay].hashtags}</p></Section>
                {calResult[activeDay].music&&<Section title={isAr?"موسيقى":"Music"} icon="🎵" brand={brand}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:brand.bg,border:`1px solid ${brand.border}`,borderRadius:7,padding:"8px 12px"}}><code style={{color:brand.accentText,fontSize:12}}>{calResult[activeDay].music}</code><CopyBtn text={calResult[activeDay].music} brand={brand} /></div></Section>}
              </div>
            )}
            <button onClick={()=>setCalResult(null)} style={{width:"100%",background:"transparent",border:`1px solid ${brand.border}`,color:"#666",borderRadius:9,padding:"11px",fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>{isAr?"← تقويم جديد":"← New calendar"}</button>
          </>
        ))}
        {activeTab==="hooks"&&(
          <>
            <p style={{color:"#888",fontSize:13,marginBottom:14}}>{isAr?"الصقي هوكاتك الناجحة ← AI يتعلم أسلوبك ← 5 هوكات جديدة":"Paste best hooks ← AI learns style ← 5 new hooks"}</p>
            <div style={{marginBottom:14}}><label style={lbl}>{isAr?"هوكاتك (واحد في كل سطر)":"Your hooks (one per line)"}</label><textarea value={hookInput} onChange={e=>setHookInput(e.target.value)} rows={6} style={{...inp,resize:"vertical"}} placeholder={isAr?"هوك 1\nهوك 2\n...":"Hook 1\nHook 2\n..."} /></div>
            {hookError&&<p style={{color:"#FF6B6B",fontSize:12,marginBottom:10,textAlign:"center"}}>{hookError}</p>}
            <button onClick={generateHooks} disabled={hookLoading} style={{...btn(hookLoading),marginBottom:16}}>{hookLoading?(isAr?"⏳ جاري التعلم...":"⏳ Learning..."):(isAr?"⚡ أنشئي 5 هوكات":"⚡ Generate 5 Hooks")}</button>
            {hookResult&&hookResult.map((h,i)=>(
              <div key={i} style={{background:brand.card,border:`1px solid ${brand.border}`,borderRadius:10,padding:"13px 15px",marginBottom:9,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                <p style={{color:"#F7F6F2",fontSize:14,fontWeight:700,margin:0,flex:1}}><span style={{color:brand.accentText,marginRight:8,marginLeft:8}}>{i+1}.</span>{h}</p>
                <CopyBtn text={h} brand={brand} />
              </div>
            ))}
          </>
        )}
        {activeTab==="history"&&(history.length===0?(
          <div style={{textAlign:"center",padding:"50px 20px"}}><p style={{fontSize:32,margin:"0 0 10px"}}>🗂️</p><p style={{color:"#555",fontSize:14}}>{isAr?"لا يوجد محتوى محفوظ بعد":"No saved content yet"}</p></div>
        ):(
          <>
            <p style={{color:"#666",fontSize:11,marginBottom:14}}>{history.length} {isAr?"حزمة محفوظة":"packages saved"}</p>
            {history.map(entry=>(
              <div key={entry.id} style={{background:brand.card,border:`1px solid ${brand.border}`,borderRadius:11,padding:"13px 15px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{background:entry.brand==="nayra"?"#C9A84C22":"#3DFFD022",color:entry.brand==="nayra"?"#C9A84C":"#3DFFD0",borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700}}>{entry.brand==="nayra"?"NAYRA":"ProCoach"}</span>
                  <span style={{color:"#555",fontSize:10}}>{entry.createdAt}</span>
                </div>
                <p style={{color:"#F7F6F2",fontSize:14,fontWeight:700,margin:"0 0 5px"}}>{entry.topic}</p>
                <p style={{color:"#888",fontSize:12,margin:"0 0 10px",fontStyle:"italic"}}>"{entry.result.hook}"</p>
                <div style={{display:"flex",gap:6}}>
                  <CopyBtn text={entry.result.hook} brand={brand} />
                  <CopyBtn text={entry.result.voiceover} brand={brand} />
                  <CopyBtn text={entry.result.caption+"\n\n"+entry.result.hashtags} brand={brand} />
                </div>
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
