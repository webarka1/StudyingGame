/* =====================================================
   SCRIPT.JS — Focus Quest (event 12 hari + game leveling)
   Logika timer + checklist event tetap seperti versi awal; ditambah game layer di bagian bawah.
   ===================================================== */

/* ---------- DATA RENCANA 12 HARI: [mapel, deskripsi, menit fokus] ---------- */
const plan = [
 {title:"Diagnosis + geometri dasar", tasks:[
  ["Matematika","Tes awal 10–15 soal campuran; catat kesalahan hitung dan waktu.",45],
  ["Inggris Tingkat Lanjut","Kerjakan 1–2 teks dan bedah alasan setiap jawaban.",25],
  ["Bahasa Indonesia","Latihan ide pokok, simpulan, dan informasi tersirat.",20],
  ["Bahasa Inggris","Latihan singkat untuk menjaga kemampuan.",15],
  ["Review","Tulis 3 kelemahan utama hari ini.",10]]},
 {title:"Geometri bidang",tasks:[
  ["Matematika","Luas, keliling, kesebangunan, dan hubungan antarbangun.",45],
  ["Inggris Tingkat Lanjut","Latihan inferensi dan makna dalam konteks.",25],
  ["Bahasa Indonesia","Cari bukti jawaban langsung dari teks.",20],
  ["Program Keahlian","Latihan singkat tipe soal tryout.",20]]},
 {title:"Geometri ruang",tasks:[
  ["Matematika","Volume, luas permukaan, jarak atau sudut ruang sesuai kisi-kisi.",45],
  ["Inggris Tingkat Lanjut","Satu teks dengan timer dan evaluasi.",25],
  ["Bahasa Indonesia","Latihan simpulan dan tujuan penulis.",20],
  ["Bahasa Inggris","Latihan singkat.",15]]},
 {title:"Trigonometri dasar",tasks:[
  ["Matematika","Sin, cos, tan, segitiga siku-siku, sudut istimewa.",45],
  ["Inggris Tingkat Lanjut","Bedah pilihan jawaban yang menjebak.",25],
  ["Bahasa Indonesia","2–3 teks dengan batas waktu.",20],
  ["Program Keahlian","Latihan singkat.",20]]},
 {title:"Trigonometri lanjutan",tasks:[
  ["Matematika","Identitas, persamaan, aturan sinus/cosinus jika termasuk cakupan.",45],
  ["Inggris Tingkat Lanjut","Latihan inferensi dan evaluasi jawaban.",25],
  ["Bahasa Indonesia","Latihan menemukan informasi penting.",20],
  ["Bahasa Inggris","Latihan singkat.",15]]},
 {title:"Geometri + trigonometri campuran",tasks:[
  ["Matematika","Soal campuran tanpa melihat rumus; cek satuan dan hitungan.",50],
  ["Inggris Tingkat Lanjut","Satu set soal dan analisis kesalahan.",25],
  ["Bahasa Indonesia","Latihan membaca efektif.",20],
  ["Program Keahlian","Satu set latihan singkat.",20]]},
 {title:"Tes Matematika berbatas waktu",tasks:[
  ["Matematika","Simulasi satu set soal dengan timer; catat akurasi dan waktu.",50],
  ["Inggris Tingkat Lanjut","Latihan terukur dan evaluasi.",25],
  ["Bahasa Indonesia","Satu sesi latihan teks.",20],
  ["Review","Catat tipe soal yang paling menyita waktu.",15]]},
 {title:"Perbaiki kelemahan terbesar",tasks:[
  ["Matematika","Fokus pada 2–3 tipe soal yang paling sering salah.",50],
  ["Inggris Tingkat Lanjut","Latihan bagian tersulit.",25],
  ["Bahasa Indonesia","Cari bukti jawaban tanpa membaca ulang seluruh teks.",20],
  ["Bahasa Inggris","Latihan pemeliharaan.",15]]},
 {title:"Simulasi campuran",tasks:[
  ["Matematika","Soal campuran dari berbagai materi dengan batas waktu.",50],
  ["Program Keahlian","Satu set latihan.",20],
  ["Inggris Tingkat Lanjut","Satu teks/latihan terukur.",25],
  ["Bahasa Indonesia","Latihan teks.",20]]},
 {title:"Mini-simulasi beberapa mapel",tasks:[
  ["Matematika","Latihan terukur, lalu ulas semua kesalahan.",45],
  ["Inggris Tingkat Lanjut","Latihan dengan timer.",25],
  ["Bahasa Indonesia","Latihan membaca dan simpulan.",20],
  ["Program Keahlian","Review soal yang pernah salah.",20]]},
 {title:"Review terakhir",tasks:[
  ["Matematika","Ulangi tipe soal yang pernah salah; buat satu halaman rumus.",40],
  ["Inggris Tingkat Lanjut","Review catatan dan jebakan jawaban.",20],
  ["Bahasa Indonesia","Review strategi teks.",15],
  ["Program Keahlian","Review ringkas.",15],
  ["Bahasa Inggris","Review singkat.",15]]},
 {title:"Pemanasan ringan",tasks:[
  ["Matematika","Rumus penting dan beberapa soal mudah–sedang.",25],
  ["Inggris Tingkat Lanjut","Baca catatan ringkas.",10],
  ["Bahasa Indonesia","Review strategi menjawab.",10],
  ["Program Keahlian","Review ringan.",10],
  ["Persiapan ujian","Siapkan perlengkapan dan tidur cukup.",10]]}
];

/* ---------- MAPEL (jam belajar) — "match" = nama mapel di plan yang dihitung ke kelompok ini.
   Target jam dihitung OTOMATIS dari plan di atas, jadi kalau plan diubah, jam ikut berubah. ---------- */
const SUBJECTS = [
 {id:"mtk",  name:"Matematika",        short:"MTK",      color:"#D71920", match:["Matematika"]},
 {id:"indo", name:"Bahasa Indonesia",  short:"B. Indo",  color:"#1B8FD6", match:["Bahasa Indonesia"]},
 {id:"ing",  name:"Bahasa Inggris",    short:"Inggris",  color:"#7C3AED", match:["Inggris Tingkat Lanjut","Bahasa Inggris"]},
 {id:"ahli", name:"Program Keahlian",  short:"Keahlian", color:"#F2B84B", match:["Program Keahlian"]},
 {id:"misc", name:"Review & Persiapan",short:"Review",   color:"#3DDC97", match:["Review","Persiapan ujian"]}
];
/* Level unlock per mapel: terbuka saat jam belajar mapel itu mencapai persen tertentu dari targetnya */
const LEVELS = [{p:.25,n:"Pemanasan",r:"I"},{p:.5,n:"Terbiasa",r:"II"},{p:.75,n:"Tajam",r:"III"},{p:1,n:"Master",r:"IV"}];
/* Rank keseluruhan: berdasarkan persen total jam belajar dari seluruh target */
const RANKS = [{p:0,n:"Newbie"},{p:.1,n:"Rookie"},{p:.3,n:"Focused"},{p:.55,n:"Grinder"},{p:.8,n:"Elite"},{p:1,n:"Final Boss"}];

const $ = id => document.getElementById(id);
/* Event spesial 12 hari aktif sampai tanggal ini (format YYYY-MM-DD). Setelahnya otomatis jadi mode belajar biasa. */
const EVENT_END = "2026-11-06";
const pad = n => String(n).padStart(2,"0");
const dk = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const EVENT = dk(new Date()) <= EVENT_END;
const KEY = "focusQuest_v1";
let saved = {};
try{ saved = JSON.parse(localStorage.getItem(KEY)||"{}"); }catch(e){}
let completed = new Set(saved.completed||[]);
let seen = saved.seen ? new Set(saved.seen) : null;   // unlock yang sudah pernah diberi notifikasi
let activeKey=null, mode="focus", running=false, remaining=25*60, total=25*60, interval=null, unlockedBreak=false, focusFinished=false;

function persist(){ try{ localStorage.setItem(KEY, JSON.stringify({completed:[...completed], seen:seen?[...seen]:[]})); }catch(e){} }
function key(d,t){ return d+"-"+t; }
function taskData(k){ if(k==="free"){ const f=SUBJECTS.find(x=>x.id===$("freeSubject").value)||SUBJECTS[0]; return [f.name,"Sesi belajar bebas — EXP cair setelah fokus selesai.",Number($("focusLength").value)]; } const [d,t]=k.split("-").map(Number); return plan[d].tasks[t]; }
function isDone(k){ return completed.has(k); }
function previousDone(d,t){ if(t>0) return isDone(key(d,t-1)); if(d===0) return true; return plan[d-1].tasks.every((_,i)=>isDone(key(d-1,i))); }
function firstAvailable(){ for(let d=0;d<plan.length;d++) for(let t=0;t<plan[d].tasks.length;t++){ let k=key(d,t); if(!isDone(k)&&previousDone(d,t)) return k; } return null; }
function duration(){ return Number($("focusLength").value)*60; }
function breakDuration(){ return Number($("breakLength").value)*60; }
function fmt(s){ s=Math.max(0,Math.ceil(s)); return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); }
function fmtMin(m){ m=Math.round(m); const h=Math.floor(m/60), r=m%60; return h?(r?h+"j "+r+"m":h+"j"):m+"m"; }
function setNotice(msg,kind=""){ const n=$("notice"); n.textContent=msg; n.className="notice "+kind; }
function stopInterval(){ if(interval){ clearInterval(interval); interval=null; } running=false; }
function subjectOf(name){ return SUBJECTS.find(s=>s.match.includes(name)) || SUBJECTS[SUBJECTS.length-1]; }

/* ---------- HITUNG JAM ---------- */
function stats(){
  const per={}; SUBJECTS.forEach(s=>per[s.id]={target:0,done:0,sessions:0,doneSessions:0});
  plan.forEach((p,d)=>p.tasks.forEach((t,i)=>{ const s=subjectOf(t[0]); per[s.id].target+=t[2]; per[s.id].sessions++; if(isDone(key(d,i))){ per[s.id].done+=t[2]; per[s.id].doneSessions++; } }));
  const target=Object.values(per).reduce((a,x)=>a+x.target,0), done=Object.values(per).reduce((a,x)=>a+x.done,0);
  return {per,target,done};
}
function unlockedSet(st){
  const u=new Set();
  SUBJECTS.forEach(s=>{ const x=st.per[s.id]; LEVELS.forEach((l,i)=>{ if(x.target&&x.done>=Math.ceil(x.target*l.p)) u.add(s.id+":"+i); }); });
  return u;
}
function rankIndex(st){ const p=st.target?st.done/st.target:0; let r=0; RANKS.forEach((x,i)=>{ if(p>=x.p) r=i; }); return r; }

/* ---------- RENDER ---------- */
function renderTasks(){
 const container=$("tasks"); container.innerHTML="";
 let d=plan.findIndex((p,i)=>p.tasks.some((_,t)=>!isDone(key(i,t))));
 if(d<0) d=11;
 let day=plan[d]; let finished=day.tasks.filter((_,t)=>isDone(key(d,t))).length;
 $("dayProgress").textContent="Hari "+(d+1)+" — "+day.title+" · "+finished+" dari "+day.tasks.length+" sesi selesai";
 day.tasks.forEach((task,t)=>{
  let k=key(d,t), done=isDone(k), unlocked=previousDone(d,t), active=activeKey===k;
  let row=document.createElement("label"); row.className="task"+(active?" active":"")+(done?" done":"")+(!unlocked&&!done?" locked":"");
  let check=document.createElement("input"); check.type="checkbox"; check.checked=done; check.disabled=done||!unlocked||!(active&&focusFinished&&unlockedBreak);
  check.addEventListener("change",()=>{ if(check.checked&&activeKey===k&&focusFinished&&unlockedBreak){ completed.add(k); const _t=taskData(k); logStudy(subjectOf(_t[0]).id,_t[2],"Quest: "+_t[0]); activeKey=null; mode="focus"; focusFinished=false; unlockedBreak=false; remaining=duration(); total=remaining; stopInterval(); persist(); renderAll(); setNotice("Quest selesai! Pilih sesi berikutnya yang terbuka.","good"); announceUnlocks(); } });
  let info=document.createElement("div"); info.style.flex="1";
  let title=document.createElement("div"); title.className="tasktitle"; title.textContent=task[0];
  let desc=document.createElement("div"); desc.className="taskmeta"; desc.textContent=task[1]+" • "+task[2]+" menit fokus";
  info.append(title,desc);
  let badge=document.createElement("span"); badge.className="taskbadge"; badge.textContent=done?"SELESAI":active?(focusFinished?(unlockedBreak?"SIAP DICENTANG":"ISTIRAHAT"):"AKTIF"):unlocked?"TERBUKA":"TERKUNCI";
  row.append(check,info,badge);
  row.addEventListener("click",e=>{ if(e.target===check) return; if(!done&&unlocked){ selectTask(k); } });
  container.append(row);
 });
}
function renderDays(){
 const c=$("days"); c.innerHTML="";
 plan.forEach((p,d)=>{
  const done=p.tasks.every((_,t)=>isDone(key(d,t))), current=p.tasks.some((_,t)=>!isDone(key(d,t)))&&(d===0||plan[d-1].tasks.every((_,t)=>isDone(key(d-1,t))));
  const box=document.createElement("div"); box.className="day"+(current?" current":"")+(done?" finished":"");
  const head=document.createElement("div"); head.className="dayhead";
  const left=document.createElement("div"); const strong=document.createElement("strong"); strong.textContent="Hari "+(d+1)+" — "+p.title;
  const small=document.createElement("small"); small.textContent=p.tasks.filter((_,t)=>isDone(key(d,t))).length+"/"+p.tasks.length+" sesi selesai • "+fmtMin(p.tasks.reduce((a,x)=>a+x[2],0))+" fokus"; left.append(strong,small);
  const tag=document.createElement("span"); tag.className="tag"; tag.textContent=done?"TUNTAS":current?"SEDANG JALAN":"TERKUNCI";
  head.append(left,tag);
  const chips=document.createElement("div"); chips.className="chips";
  p.tasks.forEach((x,t)=>{ const s=subjectOf(x[0]); const ch=document.createElement("span"); ch.className="chip"+(isDone(key(d,t))?" ok":""); ch.style.setProperty("--c",s.color); ch.textContent=x[0]+" ("+x[2]+"m)"; chips.append(ch); });
  box.append(head,chips); c.append(box);
 });
}
function renderStats(){
 $("completedCount").textContent=completed.size;
 let mins=0; completed.forEach(k=>{ const x=taskData(k); if(x) mins+=x[2]; });
 $("focusTotal").textContent=fmtMin(mins);
 $("streak").textContent=plan.filter((p,d)=>p.tasks.every((_,t)=>isDone(key(d,t)))).length+"/12";
 const all=completed.size===plan.reduce((a,p)=>a+p.tasks.length,0);
 const tp=$("topStatus"); tp.textContent=all?"Semua quest selesai!":activeKey?"Quest aktif":"Quest terkunci"; tp.classList.toggle("on",all||!!activeKey);
 if(!EVENT){ tp.textContent=running?"Sedang fokus":"Siap belajar"; tp.classList.toggle("on",running); $("completedCount").textContent=G.sess; $("focusTotal").textContent=fmtMin(G.min); $("streak").textContent=gStreak()+" hari"; $("streakL").textContent="Streak"; }
}
function renderSubjects(st){
 const c=$("subjects"); c.innerHTML="";
 SUBJECTS.forEach(s=>{
  const x=st.per[s.id], pct=x.target?Math.min(100,x.done/x.target*100):0;
  let lv=-1; LEVELS.forEach((l,i)=>{ if(x.target&&x.done>=Math.ceil(x.target*l.p)) lv=i; });
  const nextL=LEVELS[lv+1]; let nextTxt;
  if(!nextL) nextTxt="Semua level terbuka — mapel ini sudah Master!";
  else nextTxt="Level \""+nextL.n+"\" terbuka "+fmtMin(Math.max(0,Math.ceil(x.target*nextL.p)-x.done))+" lagi.";
  const card=document.createElement("div"); card.className="subj"; card.style.setProperty("--c",s.color);
  card.innerHTML='<div class="subj-head"><div><div class="subj-name"></div><div class="subj-short"></div></div><span class="subj-lvl"></span></div>'+
   '<div class="subj-hours"><strong></strong><span></span></div><div class="progress"><div class="bar"></div></div><div class="subj-next"></div><div class="lvl-row"></div>';
  card.querySelector(".subj-name").textContent=s.name;
  card.querySelector(".subj-short").textContent=x.doneSessions+"/"+x.sessions+" sesi";
  const lb=card.querySelector(".subj-lvl"); lb.textContent=lv<0?"Terkunci":LEVELS[lv].n; if(lv===LEVELS.length-1) lb.classList.add("max");
  card.querySelector(".subj-hours strong").textContent=fmtMin(x.done);
  card.querySelector(".subj-hours span").textContent="dari target "+fmtMin(x.target);
  card.querySelector(".bar").style.width=pct+"%";
  card.querySelector(".subj-next").textContent=nextTxt;
  const row=card.querySelector(".lvl-row");
  LEVELS.forEach((l,i)=>{ const on=i<=lv; const d=document.createElement("div"); d.className="lvl"+(on?" on":"")+(freshKeys.has(s.id+":"+i)?" fresh":""); d.innerHTML='<i></i><span></span>'; d.querySelector("i").textContent=on?l.r:"•"; d.querySelector("span").textContent=l.n; d.title=l.n+" — "+Math.round(l.p*100)+"% target ("+fmtMin(Math.ceil(x.target*l.p))+")"; row.append(d); });
  c.append(card);
 });
}
function renderUnlocks(st,u){
 const ri=rankIndex(st), pct=st.target?st.done/st.target:0;
 $("rankName").textContent=RANKS[ri].n;
 $("rankBar").style.width=Math.min(100,pct*100)+"%";
 const nx=RANKS[ri+1];
 $("rankNext").textContent=nx?"Rank \""+nx.n+"\" terbuka "+fmtMin(Math.max(0,Math.ceil(st.target*nx.p)-st.done))+" lagi. Total belajar: "+fmtMin(st.done)+" dari "+fmtMin(st.target)+".":"Rank tertinggi tercapai. Kamu resmi Final Boss! Total belajar: "+fmtMin(st.done)+".";
 const lad=$("rankLadder"); lad.innerHTML="";
 RANKS.forEach((r,i)=>{ const d=document.createElement("div"); d.className="rk"+(i<=ri?" on":"")+(i===ri?" now":""); const a=document.createElement("span"); a.textContent=r.n; const b=document.createElement("span"); b.textContent=r.p?fmtMin(Math.ceil(st.target*r.p)):"Mulai"; d.append(a,b); lad.append(d); });
 const wall=$("badgeWall"); wall.innerHTML="";
 SUBJECTS.forEach(s=>LEVELS.forEach((l,i)=>{ const on=u.has(s.id+":"+i); const b=document.createElement("div"); b.className="bdg"+(on?" on":""); b.style.setProperty("--c",s.color); b.innerHTML='<i></i><strong></strong><span></span>'; b.querySelector("i").textContent=l.r; b.querySelector("strong").textContent=s.short+" · "+l.n; b.querySelector("span").textContent=on?"Terbuka":"Terkunci"; wall.append(b); }));
 $("badgeCount").textContent=u.size+" dari "+(SUBJECTS.length*LEVELS.length)+" badge terbuka";
}
function renderTimer(){
 $("clock").textContent=fmt(remaining);
 $("phase").textContent=mode==="focus"?(focusFinished?"FOKUS SELESAI":"WAKTU FOKUS"):"WAKTU ISTIRAHAT";
 const ring=$("ringFg"), C=565.49; ring.style.strokeDashoffset=String(C*(1-(total?(total-remaining)/total:0))); ring.classList.toggle("break",mode==="break");
 $("startBtn").textContent=running?"Sedang berjalan":mode==="break"?"Mulai istirahat":focusFinished?(unlockedBreak?"Istirahat selesai":"Mulai istirahat"):"Mulai fokus";
 $("startBtn").disabled=(!activeKey&&EVENT)||running||(mode==="focus"&&focusFinished&&unlockedBreak);
 $("pauseBtn").disabled=!running;
 $("sessionName").textContent=activeKey?taskData(activeKey)[0]:(EVENT?"Pilih quest pertamamu":"Pilih mapel lalu mulai");
 $("freeSubject").disabled=activeKey==="free";
 $("sessionDesc").textContent=activeKey?taskData(activeKey)[1]:(EVENT?"Timer harus selesai sebelum tugas bisa dicentang.":"EXP dan koin cair saat sesi fokus selesai penuh.");
}
let freshKeys=new Set();
function renderAll(){
 const st=stats(), u=unlockedSet(st);
 renderTasks(); renderDays(); renderStats(); renderSubjects(st); renderUnlocks(st,u); renderTimer();
 if(EVENT){ $("heroHours").textContent=fmtMin(st.target); $("heroSessions").textContent=plan.reduce((a,p)=>a+p.tasks.length,0); }
 else{ $("heroHours").textContent=fmtMin(G.min); $("heroSessions").textContent=G.sess; $("heroThird").textContent="Lv "+G.lv; }
 gRender();
}

/* ---------- UNLOCK: notifikasi saat level/rank baru terbuka ---------- */
function toast(title,msg){
 const t=document.createElement("div"); t.className="toast"; const b=document.createElement("b"); b.textContent=title; t.append(b,document.createTextNode(msg));
 $("toasts").append(t); setTimeout(()=>{ t.classList.add("out"); setTimeout(()=>t.remove(),450); },5200);
}
function announceUnlocks(){
 const st=stats(), u=unlockedSet(st); freshKeys=new Set();
 if(seen===null){ seen=new Set(u); persist(); return; }          // pertama kali: jangan spam notifikasi
 u.forEach(k=>{ if(!seen.has(k)){ seen.add(k); freshKeys.add(k); const [sid,i]=k.split(":"); const s=SUBJECTS.find(x=>x.id===sid); toast("Level terbuka!",s.name+" — "+LEVELS[i].n); } });
 const rk="rank:"+rankIndex(st); if(!seen.has(rk)){ seen.add(rk); if(rankIndex(st)>0) toast("Rank naik!","Sekarang kamu "+RANKS[rankIndex(st)].n); }
 persist(); renderAll();
}

/* ---------- TIMER (logika asli) ---------- */
function selectTask(k){
 if(!previousDone(...k.split("-").map(Number))||isDone(k)) return;
 if(activeKey===k) return;
 if(running) stopInterval();
 activeKey=k; mode="focus"; focusFinished=false; unlockedBreak=false; remaining=duration(); total=remaining;
 renderAll(); setNotice("Quest dipilih. Tekan Mulai Fokus untuk memulai timer.");
}
function startTimer(){
 if(!activeKey) return;
 if(mode==="focus"&&focusFinished){ mode="break"; remaining=breakDuration(); total=remaining; unlockedBreak=false; }
 if(mode==="break"&&unlockedBreak){ return; }
 if(remaining<=0) return;
 running=true; renderTimer();
 interval=setInterval(()=>{
  remaining--; renderTimer();
  if(remaining<=0){
   stopInterval(); remaining=0; const wasFree=activeKey==="free", doneMin=total/60;
   if(mode==="focus"){ if(wasFree) logStudy($("freeSubject").value,doneMin,"Sesi fokus "+doneMin+" mnt selesai"); focusFinished=true; mode="break"; remaining=breakDuration(); total=remaining; unlockedBreak=false; renderAll(); setNotice(wasFree?"Fokus selesai! EXP sudah masuk. Istirahat dulu ya.":"Fokus selesai! Sekarang istirahat. Checklist masih terkunci sampai timer istirahat selesai.","good"); }
   else{ unlockedBreak=true; if(wasFree){ activeKey=null; mode="focus"; focusFinished=false; unlockedBreak=false; remaining=duration(); total=remaining; } renderAll(); setNotice(wasFree?"Istirahat selesai. Siap sesi berikutnya?":"Istirahat selesai. Sekarang kamu boleh centang quest ini kalau tugasnya benar-benar sudah dikerjakan.","good"); }
  }
 },1000);
}
$("startBtn").addEventListener("click",()=>{
 if(!activeKey){ if(!EVENT){ activeKey="free"; mode="focus"; focusFinished=false; unlockedBreak=false; remaining=duration(); total=remaining; } else{ let k=firstAvailable(); if(k) selectTask(k); else{ setNotice("Semua quest selesai. Kamu resmi Final Boss!","good"); return; } } }
 if(mode==="break"&&unlockedBreak) return;
 startTimer();
});
$("pauseBtn").addEventListener("click",()=>{ stopInterval(); renderTimer(); setNotice("Timer dijeda. Tekan lanjut saat siap."); });
$("resetBtn").addEventListener("click",()=>{
 stopInterval(); mode="focus"; focusFinished=false; unlockedBreak=false; remaining=duration(); total=remaining; renderAll(); setNotice("Sesi timer direset. Progres checklist yang sudah selesai tetap tersimpan.");
});
$("focusLength").addEventListener("change",()=>{ if(!running&&!focusFinished&&mode==="focus"){ remaining=duration(); total=remaining; renderTimer(); } });
$("breakLength").addEventListener("change",()=>{ if(!running&&mode==="break"&&!unlockedBreak){ remaining=breakDuration(); total=remaining; renderTimer(); } });

/* ---------- TEMA TERANG/GELAP ---------- */
$("themeBtn").addEventListener("click",()=>{
 const dark=document.documentElement.classList.toggle("dark");
 try{ localStorage.setItem("fqTheme",dark?"dark":"light"); }catch(e){}
});

/* ---------- SCROLL PROGRESS + REVEAL ---------- */
const bar=$("scrollBar");
function onScroll(){ const h=document.documentElement.scrollHeight-innerHeight; bar.style.width=(h>0?scrollY/h*100:0)+"%"; }
addEventListener("scroll",onScroll,{passive:true}); onScroll();
const revealEls=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }),{threshold:.08});
 revealEls.forEach(el=>io.observe(el));
}else revealEls.forEach(el=>el.classList.add("in"));

/* =====================================================
   GAME LAYER — Level, EXP, koin, misi daily/weekly/monthly, arena, jelajah, toko
   Disimpan terpisah dari progres roadmap (kunci "focusQuestGame_v1").
   Event spesial 12 hari aktif sampai EVENT_END (lihat atas); setelahnya jadi mode belajar biasa.
   ===================================================== */
const GKEY="focusQuestGame_v1", EVENT_MULT=1.5;
/* [periode, id, ikon, judul, metrik, target, EXP, koin]  periode: d=daily w=weekly m=monthly */
const GQ=[
 ["d","d1","⏱️","Belajar 2 jam hari ini","min",120,120,30],
 ["d","d2","🎯","Selesaikan 3 sesi belajar","sess",3,60,15],
 ["d","d3","📚","Belajar 2 mapel berbeda","subj",2,50,10],
 ["d","d4","⚡","Main Latihan Kilat 1x","arena",1,40,10],
 ["d","d5","🧭","Jelajahi 1 tempat belajar","explore",1,30,10],
 ["d","dc","🎁","Peti Harian (klaim semua daily)","chest",0,100,40],
 ["w","w1","🔥","Belajar 10 jam minggu ini","min",600,500,150],
 ["w","w2","📅","Aktif belajar 5 hari (min. 30 mnt)","active",5,300,80],
 ["w","w3","🎯","Selesaikan 20 sesi belajar","sess",20,300,80],
 ["w","w4","🧠","Sentuh 4 mapel berbeda","subj",4,200,60],
 ["w","wc","🎁","Peti Mingguan","chest",0,300,100],
 ["m","m1","🏔️","Belajar 40 jam bulan ini","min",2400,2000,600],
 ["m","m2","🗓️","Aktif belajar 20 hari","active",20,1200,300],
 ["m","m3","💯","Selesaikan 100 sesi belajar","sess",100,1500,400],
 ["m","m4","⚡","Main Latihan Kilat 15x","arena",15,600,150],
 ["m","mc","🎁","Peti Bulanan","chest",0,1000,300]
];
const GR=[[1,"Newbie"],[5,"Pelajar Rajin"],[10,"Pemburu Soal"],[15,"Ahli Fokus"],[20,"Master Rumus"],[30,"Legenda Kelas"],[40,"Dewa Belajar"]];
const GX=[["kh","Khan Academy","Materi & latihan gratis, dari matematika sampai sains.","https://www.khanacademy.org"],
 ["qz","Quizizz","Kuis interaktif rasa game.","https://quizizz.com"],
 ["kt","Kahoot!","Kuis seru, bisa adu cepat bareng teman.","https://kahoot.it"],
 ["dl","Duolingo","Latih Inggris 5 menit sehari.","https://www.duolingo.com"],
 ["wg","World Geography Games","Game tebak peta & negara.","https://world-geography-games.com"],
 ["ty","Typing.com","Latihan ngetik biar makin gesit.","https://www.typing.com"],
 ["ch","Chess.com","Catur: asah fokus dan logika.","https://www.chess.com"],
 ["wk","Wikipedia","Cari tahu hal baru, rabbit hole sehat.","https://id.wikipedia.org"]];
const GB=[["first","🌱","Langkah Pertama",()=>G.sess>=1],["h1","⏳","1 Jam Total",()=>G.min>=60],["h10","🔥","10 Jam Total",()=>G.min>=600],["h50","💎","50 Jam Total",()=>G.min>=3000],
 ["s3","📅","Streak 3 Hari",()=>gStreak()>=3],["s7","🏆","Streak 7 Hari",()=>gStreak()>=7],["l5","⭐","Level 5",()=>G.lv>=5],["l10","🌟","Level 10",()=>G.lv>=10],["l20","👑","Level 20",()=>G.lv>=20],
 ["ar","⚡","Arena 10x",()=>G.arenaN>=10],["ex","🧭","Penjelajah (5 situs)",()=>new Set(Object.keys(G.explored).map(k=>k.split("|")[1])).size>=5]];
const gFresh=()=>({xp:0,lv:1,coins:0,sess:0,min:0,arenaN:0,days:{},claimed:{},explored:{},badges:[],inv:[],nid:10,
 shop:[{id:1,n:"Nonton 1 episode",p:60},{id:2,n:"Main game 30 menit",p:80},{id:3,n:"Jajan favorit",p:100},{id:4,n:"Scroll sosmed 15 menit",p:40},{id:5,n:"Rebahan tanpa rasa bersalah",p:120}]});
let G; try{ G={...gFresh(),...JSON.parse(localStorage.getItem(GKEY)||"{}")}; }catch(e){ G=gFresh(); }
let gTab="d";
const gSave=()=>{ try{ localStorage.setItem(GKEY,JSON.stringify(G)); }catch(e){} };
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
/* EXP yang dibutuhkan naik ±18% tiap level (bukan flat 100) */
const gNeed=l=>Math.round(100*Math.pow(1.18,l-1)/5)*5;
const gRank=()=>GR.filter(r=>G.lv>=r[0]).pop();
const gToday=()=>dk(new Date());
function gDay(){ const k=gToday(); return G.days[k]||(G.days[k]={min:0,sess:0,arena:0,explore:0,subj:{}}); }
function gPeriod(p){
 const n=new Date(); let a=new Date(n.getFullYear(),n.getMonth(),n.getDate()), b;
 if(p==="d") b=new Date(a.getFullYear(),a.getMonth(),a.getDate()+1);
 else if(p==="w"){ a=new Date(a.getFullYear(),a.getMonth(),a.getDate()-(a.getDay()+6)%7); b=new Date(a.getFullYear(),a.getMonth(),a.getDate()+7); }
 else{ a=new Date(n.getFullYear(),n.getMonth(),1); b=new Date(n.getFullYear(),n.getMonth()+1,1); }
 return {a:dk(a),b:dk(b),end:b};
}
function gStat(p){
 const r=gPeriod(p), o={min:0,sess:0,arena:0,explore:0,active:0,subj:0}, ss=new Set();
 for(const k in G.days) if(k>=r.a&&k<r.b){ const d=G.days[k]; o.min+=d.min; o.sess+=d.sess; o.arena+=d.arena; o.explore+=d.explore; if(d.min>=30) o.active++; for(const s in d.subj) if(d.subj[s]>0) ss.add(s); }
 o.subj=ss.size; return o;
}
function gStreak(){
 let n=0, d=new Date();
 if(!((G.days[dk(d)]||{}).min>=10)) d.setDate(d.getDate()-1);
 while((G.days[dk(d)]||{}).min>=10){ n++; d.setDate(d.getDate()-1); }
 return n;
}
function gLeft(p){ const ms=gPeriod(p).end-Date.now(), h=Math.floor(ms/36e5); return h>=48?Math.floor(h/24)+" hari lagi":h+"j "+Math.floor(ms%36e5/6e4)+"m lagi"; }

/* ---------- efek: confetti + bunyi ---------- */
function confetti(){
 for(let i=0;i<40;i++){ const e=document.createElement("i"); e.className="cf";
  e.style.cssText="left:"+Math.random()*100+"vw;background:hsl("+Math.random()*360+" 90% 60%);--dx:"+(Math.random()*200-100)+"px;animation-delay:"+Math.random()*.4+"s";
  document.body.append(e); setTimeout(()=>e.remove(),2600); }
}
function beep(f){
 try{ const a=new (window.AudioContext||window.webkitAudioContext)(), o=a.createOscillator(), g=a.createGain();
  o.frequency.value=f; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.15,a.currentTime); g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.4); o.start(); o.stop(a.currentTime+.4); }catch(e){}
}

/* ---------- inti reward ---------- */
function gain(xp,c,why){
 G.xp+=xp; G.coins+=c; toast("+"+xp+" EXP · +"+c+" 🪙",why);
 let up=false;
 while(G.xp>=gNeed(G.lv)){ G.xp-=gNeed(G.lv); G.lv++; const b=20+G.lv*5; G.coins+=b; up=true; toast("LEVEL UP! Lv "+G.lv,"Bonus +"+b+" 🪙 · level berikutnya butuh "+gNeed(G.lv)+" EXP"); }
 if(up){ confetti(); beep(880); }
 GB.forEach(b=>{ if(!G.badges.includes(b[0])&&b[3]()){ G.badges.push(b[0]); toast("Badge baru!",b[1]+" "+b[2]); } });
 gSave(); gRender();
}
/* dipanggil tiap sesi belajar selesai (mode bebas: saat fokus selesai; mode event: saat quest dicentang) */
function logStudy(sid,m,label){
 const d=gDay(); d.min+=m; d.sess++; d.subj[sid]=(d.subj[sid]||0)+m; G.min+=m; G.sess++;
 const mult=(1+Math.min(gStreak(),10)*.05)*(EVENT?EVENT_MULT:1);
 beep(660); gain(Math.round((m+10)*mult),Math.max(1,Math.round(m/5)),label+(mult>1?" · bonus x"+mult.toFixed(2)+(EVENT?" (event)":""):""));
}

/* ---------- misi ---------- */
const gCk=q=>q[1]+"@"+gPeriod(q[0]).a;
function gProg(q){
 if(q[4]==="chest"){ const o=GQ.filter(x=>x[0]===q[0]&&x[4]!=="chest"); return [o.filter(x=>G.claimed[gCk(x)]).length,o.length]; }
 return [Math.min(gStat(q[0])[q[4]],q[5]),q[5]];
}
function gCard(q){
 const [v,g]=gProg(q), done=v>=g, cl=!!G.claimed[gCk(q)], u=q[4]==="min"?" mnt":"", go=done&&!cl;
 return '<div class="mq'+(go?" ready":"")+(cl?" cl":"")+'"><div class="mq-i">'+q[2]+'</div><div class="mq-b"><strong>'+q[3]+'</strong><div class="progress"><div class="bar" style="width:'+Math.min(100,v/g*100)+'%"></div></div><small>'+v+u+" / "+g+u+" · +"+q[6]+" EXP · +"+q[7]+' 🪙</small></div><button class="btn sm '+(go?"gold":"ghost")+'" data-claim="'+q[1]+'" '+(go?"":"disabled")+">"+(cl?"✓":"Klaim")+"</button></div>";
}
$("gQuests").addEventListener("click",e=>{
 const b=e.target.closest("[data-claim]"); if(!b) return;
 const q=GQ.find(x=>x[1]===b.dataset.claim); if(!q||G.claimed[gCk(q)]) return;
 G.claimed[gCk(q)]=1; gain(q[6],q[7],q[3]);
});
$("gSeg").addEventListener("click",e=>{ const b=e.target.closest("[data-p]"); if(!b) return; gTab=b.dataset.p; gRender(); });

/* ---------- arena: Latihan Kilat ---------- */
let ar=null;
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function genQ(){
 const t=rnd(0,3); let a,b;
 if(t===0){ a=rnd(12,99); b=rnd(12,99); return [a+" + "+b,a+b]; }
 if(t===1){ a=rnd(30,99); b=rnd(10,a-1); return [a+" − "+b,a-b]; }
 if(t===2){ a=rnd(3,15); b=rnd(3,15); return [a+" × "+b,a*b]; }
 b=rnd(3,12); a=b*rnd(3,12); return [a+" ÷ "+b,a/b];
}
function nextQ(){ ar.q=genQ(); $("aq").textContent=(ar.i+1)+"/5 · "+ar.q[0]+" = ?"; $("aa").value=""; $("aa").focus(); }
$("arenaBtn").addEventListener("click",()=>{ ar={i:0,ok:0,t:Date.now()}; $("arenaIntro").hidden=true; $("arenaPlay").hidden=false; nextQ(); });
$("arenaPlay").addEventListener("submit",e=>{
 e.preventDefault(); if($("aa").value==="") return;
 const good=+$("aa").value===ar.q[1]; if(good) ar.ok++;
 const f=$("arenaPlay"); f.className=good?"good":"bad"; setTimeout(()=>f.className="",300);
 if(++ar.i<5) return nextQ();
 const sec=Math.round((Date.now()-ar.t)/1000), d=gDay(); d.arena++; G.arenaN++;
 const ok=d.arena<=3, xp=ok?ar.ok*10+(ar.ok===5?20:0)+(ar.ok>=4&&sec<40?15:0):0;
 $("arenaPlay").hidden=true; $("arenaIntro").hidden=false;
 $("arenaRes").textContent="Benar "+ar.ok+"/5 dalam "+sec+" detik."+(ok?"":" (EXP arena hari ini habis, maks 3x)");
 if(ok) gain(xp,ar.ok,"Latihan Kilat"); else{ gSave(); gRender(); }
});

/* ---------- jelajah ---------- */
$("gSites").addEventListener("click",e=>{
 const b=e.target.closest("[data-site]"); if(!b) return;
 const x=GX.find(v=>v[0]===b.dataset.site), k=gToday()+"|"+x[0];
 window.open(x[3],"_blank","noopener");
 if(!G.explored[k]){ G.explored[k]=1; gDay().explore++; gain(25,5,"Jelajah: "+x[1]); }
});

/* ---------- toko ---------- */
document.getElementById("toko").addEventListener("click",e=>{
 const t=e.target.closest("button"); if(!t) return;
 if(t.dataset.buy){ const s=G.shop.find(v=>v.id==t.dataset.buy); if(s&&G.coins>=s.p){ G.coins-=s.p; G.inv.push({id:G.nid++,n:s.n}); toast("Dibeli!",s.n); } }
 else if(t.dataset.use){ G.inv=G.inv.filter(v=>v.id!=t.dataset.use); toast("Nikmati hadiahmu!","Kamu sudah kerja keras."); }
 else if(t.dataset.del) G.shop=G.shop.filter(v=>v.id!=t.dataset.del);
 else return;
 gSave(); gRender();
});
$("addForm").addEventListener("submit",e=>{ e.preventDefault(); G.shop.push({id:G.nid++,n:$("rn").value.trim(),p:Math.max(5,+$("rp").value||50)}); $("rn").value=""; gSave(); gRender(); });

/* ---------- render game ---------- */
function gRender(){
 const n=gNeed(G.lv), r=gRank();
 $("lvPill").textContent="Lv "+G.lv+" · 🪙 "+G.coins;
 $("gLv").textContent=G.lv; $("gRank").textContent=r[1];
 $("gXpBar").style.width=G.xp/n*100+"%";
 $("gXpTxt").textContent=G.xp+" / "+n+" EXP · "+(n-G.xp)+" lagi ke Lv "+(G.lv+1);
 $("gCoins").textContent=G.coins; $("gStreak").textContent=gStreak(); $("gHours").textContent=fmtMin(G.min);
 $("gLadder").innerHTML=GR.map(x=>'<div class="rk'+(G.lv>=x[0]?" on":"")+(x===r?" now":"")+'"><span>'+x[1]+"</span><span>Lv "+x[0]+"</span></div>").join("");
 $("gBadges").innerHTML=GB.map(b=>'<div class="bdg'+(G.badges.includes(b[0])?" on":"")+'"><i>'+b[1]+"</i><strong>"+b[2]+"</strong><span>"+(G.badges.includes(b[0])?"Terbuka":"Terkunci")+"</span></div>").join("");
 $("gBadgeCount").textContent=G.badges.length+" dari "+GB.length+" badge terbuka";
 $$("#gSeg [data-p]").forEach(b=>b.classList.toggle("on",b.dataset.p===gTab));
 $("gReset").textContent="Reset "+gLeft(gTab);
 $("gQuests").innerHTML=GQ.filter(q=>q[0]===gTab).map(gCard).join("");
 $("gSites").innerHTML=GX.map(x=>{ const got=G.explored[gToday()+"|"+x[0]];
  return '<div class="row-item"><div><strong>'+x[1]+"</strong><small>"+x[2]+'</small></div><button class="btn sm '+(got?"line":"red")+'" data-site="'+x[0]+'">'+(got?"Buka lagi ✓":"Buka +25 EXP")+"</button></div>"; }).join("");
 $("gShop").innerHTML=G.shop.map(s=>'<div class="row-item"><div><strong>'+esc(s.n)+"</strong><small>"+s.p+' 🪙</small></div><button class="btn sm red" data-buy="'+s.id+'" '+(G.coins>=s.p?"":"disabled")+'>Beli</button><button class="xbtn" data-del="'+s.id+'" aria-label="Hapus">✕</button></div>').join("");
 $("gInv").innerHTML=G.inv.length?G.inv.map(v=>'<div class="row-item"><div><strong>🎟️ '+esc(v.n)+'</strong></div><button class="btn sm line" data-use="'+v.id+'">Pakai</button></div>').join(""):'<p class="tiny">Belum ada voucher. Kumpulkan koin dulu!</p>';
}
const $$=s=>document.querySelectorAll(s);

/* ---------- mode: event spesial vs belajar biasa ---------- */
function applyMode(){
 document.querySelectorAll("[data-event]").forEach(e=>e.hidden=!EVENT);
 document.querySelectorAll("[data-free]").forEach(e=>e.hidden=EVENT);
 $("freeSubject").innerHTML=SUBJECTS.map(s=>'<option value="'+s.id+'">'+s.name+"</option>").join("");
 if(!EVENT){
  $("heroEyebrow").textContent="Daily Study • Focus Quest"; $("brandSub").textContent="STUDY · LOCK IN";
  $("heroL1").textContent="Total waktu belajar"; $("heroL2").textContent="Total sesi fokus"; $("heroL3").textContent="Level kamu";
  $("heroCta2").href="#level"; $("heroCta2").textContent="Lihat Misi";
  setNotice("Pilih mapel, lalu mulai fokus. EXP dan koin cair saat sesi fokus selesai penuh.");
 }
 let n=0; document.querySelectorAll(".section").forEach(s=>{ if(s.hidden) return; const e=s.querySelector(".eyebrow[data-t]"); if(e) e.textContent=String(++n).padStart(2,"0")+" — "+e.dataset.t; });
}
setInterval(()=>{ $("gReset").textContent="Reset "+gLeft(gTab); },30000);
applyMode();

/* ---------- MULAI ---------- */
if(seen===null){ seen=new Set(unlockedSet(stats())); seen.add("rank:"+rankIndex(stats())); persist(); }
renderAll();
if(EVENT){ const first=firstAvailable(); if(first) selectTask(first); }
