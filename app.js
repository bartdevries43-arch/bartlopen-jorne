/* ================================================================== *
 *  Jorne, bartlopen Personal Trainer, sterker worden en afvallen
 *  12-weken krachtprogramma, 3 sessies/week (ma/wo/vr), sportschool.
 *  Full-body A/B/C, progressive overload, richting 100 kg.
 * ================================================================== */

const CONFIG = {
  appName:    "Sterker worden",
  runner:     "Jorne",
  goal:       "Sterker worden en afvallen richting 100 kg",
  startDate:  new Date(2026, 6, 13),
  storeKey:   "jorne-pt.log.v1",
  coachHandle:"@bartlopen",
  athleteWord:"strijder",
  bwStart:    113,
  bwGoal:     100,
  mottos: ["Beginnen maar, strijder! 💪", "Lekker bezig, strijder!", "Je wordt week na week sterker.", "Halverwege, sterk volgehouden! ⚡", "Bijna door je programma, knap werk!", "Programma voltooid! Wat een beest! 🏅"],
};

const RUNNER = CONFIG.runner;
const GOAL = CONFIG.goal;
const START_DATE = CONFIG.startDate;
const STORE_KEY = CONFIG.storeKey;
const TOTAL_WEEKS = 12;
const DAY_OFFSET = { ma: 0, di: 1, wo: 2, do: 3, vr: 4, za: 5, zo: 6 };
const DAY_LABEL = { ma: "Maandag", wo: "Woensdag", vr: "Vrijdag" };

/* --- De drie full-body workouts (roteren: ma=A, wo=B, vr=C) -------- */
const WORKOUTS = {
  A: { letter: "A", title: "Full body A", focus: "Squat & duwen",
    coach: "Full body A, strijder. De grote basisliften: squat, bankdrukken, roeien en overhead press. Hier bouw je je kracht.",
    exercises: [
      { name: "Back squat (of goblet squat)",      tag: "Benen",     cue: "Borst hoog, knieën naar buiten, rustig zakken tot je dijen parallel zijn. Rust 2 tot 3 min tussen de sets." },
      { name: "Bankdrukken (barbell of dumbbell)", tag: "Borst",     cue: "Schouderbladen samen, laat de stang of dumbbells gecontroleerd tot je borst zakken en duw krachtig terug." },
      { name: "Barbell row",                       tag: "Rug",       cue: "Romp voorover en rug recht, trek de stang naar je onderbuik en knijp je schouderbladen samen." },
      { name: "Overhead press",                    tag: "Schouders", cue: "Staand, buik strak, duw de stang recht boven je hoofd zonder je rug hol te trekken." },
      { name: "Plank",                             tag: "Core",      cue: "Billen aan, buik strak, één rechte lijn van hoofd tot hielen. 3×40 sec." },
      { name: "Roeimachine-intervallen",           tag: "Conditie",  cue: "8 min: 40 sec stevig, 20 sec rustig. Lekker zweten voor de vetverbranding." },
    ] },
  B: { letter: "B", title: "Full body B", focus: "Hinge & trekken",
    coach: "Full body B, strijder. Deadlift en trekwerk voor een sterke rug, met een rustige conditieafsluiter.",
    exercises: [
      { name: "Trap-bar deadlift",           tag: "Benen & rug", cue: "Sterke romp, duw de grond weg met je hele voet, rug mooi recht. Rust 2 tot 3 min tussen de sets." },
      { name: "Lat pulldown",                tag: "Rug",         cue: "Trek de stang naar je bovenborst, ellebogen omlaag, niet slingeren. Lukken pull-ups? Nog beter." },
      { name: "Incline dumbbell press",      tag: "Borst",       cue: "Bankje schuin, duw de dumbbells boven je bovenborst samen." },
      { name: "Bulgaarse split squat",       tag: "Benen",       cue: "Achterste voet op een bankje, zak recht naar beneden. Per been. Top voor kracht en balans." },
      { name: "Zijwaartse schouderheffing",  tag: "Schouders",   cue: "Lichte dumbbells, armen zijwaarts tot schouderhoogte, gecontroleerd laten zakken." },
      { name: "Hangende knieheffen",         tag: "Core",        cue: "Rustig omhoog, geen zwaai, voel je onderbuik. 3×12." },
      { name: "Wandelen op de helling",      tag: "Conditie",    cue: "10 min stevig doorstappen op een helling. Rustige, effectieve vetverbranding." },
    ] },
  C: { letter: "C", title: "Full body C", focus: "Volume & metabool",
    coach: "Full body C, strijder. Wat meer herhalingen en een pittig circuit om lekker af te branden.",
    exercises: [
      { name: "Front squat (of leg press)",   tag: "Benen",       cue: "Ellebogen hoog, romp rechtop, diep en gecontroleerd zakken. Leg press mag ook." },
      { name: "Kabel roeien (seated row)",    tag: "Rug",         cue: "Rechtop zitten, trek naar je buik, knijp samen, laat rustig terug." },
      { name: "Chest press",                  tag: "Borst",       cue: "Machine of dumbbells, duw gecontroleerd weg en voel je borst." },
      { name: "Hip thrust",                   tag: "Billen",      cue: "Bovenrug op het bankje, knijp bovenaan je billen hard aan." },
      { name: "Biceps + triceps superset",    tag: "Armen",       cue: "10 biceps curls direct gevolgd door 10 triceps pushdowns, 3 rondes. Lekkere pump." },
      { name: "Farmer's carry",               tag: "Grip & core", cue: "Zware dumbbells, rechtop lopen, 3×30 meter. Grip en romp aan het werk." },
      { name: "Kettlebell-circuit",           tag: "Conditie",    cue: "3 rondes: 15 kettlebell swings, 30 sec hardlopen op de plaats, 20 mountain climbers." },
    ] },
};
const ORDER = [ { day: "ma", w: "A" }, { day: "wo", w: "B" }, { day: "vr", w: "C" } ];

const WEEKS = [{"week": 1, "dates": "13–19 jul", "phase": "Fase 1 · Techniek & basis", "deload": false, "sets": 3, "reps": "10-12", "note": "Rustig de bewegingen leren, techniek boven gewicht."}, {"week": 2, "dates": "20–26 jul", "phase": "Fase 1 · Techniek & basis", "deload": false, "sets": 3, "reps": "10-12", "note": "Zelfde oefeningen, kies net iets meer gewicht."}, {"week": 3, "dates": "27 jul–2 aug", "phase": "Fase 1 · Techniek & basis", "deload": false, "sets": 3, "reps": "8-10", "note": "Iets zwaarder, laatste 2 herhalingen mogen pittig zijn."}, {"week": 4, "dates": "3–9 aug", "phase": "Fase 1 · Techniek & basis", "deload": true, "sets": 2, "reps": "10", "note": "Deloadweek: lichter en fris, je lichaam tankt bij."}, {"week": 5, "dates": "10–16 aug", "phase": "Fase 2 · Sterker worden", "deload": false, "sets": 4, "reps": "8-10", "note": "Volume omhoog: 4 sets. Blijf netjes in techniek."}, {"week": 6, "dates": "17–23 aug", "phase": "Fase 2 · Sterker worden", "deload": false, "sets": 4, "reps": "8-10", "note": "Zoek per oefening een klein beetje meer gewicht."}, {"week": 7, "dates": "24–30 aug", "phase": "Fase 2 · Sterker worden", "deload": false, "sets": 4, "reps": "6-8", "note": "Zwaarder en korter, echt kracht opbouwen."}, {"week": 8, "dates": "31 aug–6 sep", "phase": "Fase 2 · Sterker worden", "deload": true, "sets": 2, "reps": "10", "note": "Deloadweek: even gas terug, dan sta je er sterker."}, {"week": 9, "dates": "7–13 sep", "phase": "Fase 3 · Kracht & scherp", "deload": false, "sets": 4, "reps": "6-8", "note": "Kracht scherp: kies gewichten die uitdagen."}, {"week": 10, "dates": "14–20 sep", "phase": "Fase 3 · Kracht & scherp", "deload": false, "sets": 4, "reps": "6-8", "note": "Probeer op je hoofdoefeningen een record te tikken."}, {"week": 11, "dates": "21–27 sep", "phase": "Fase 3 · Kracht & scherp", "deload": false, "sets": 5, "reps": "5-6", "note": "Piekweek: 5 sets, zwaar maar beheerst."}, {"week": 12, "dates": "28 sep–4 okt", "phase": "Fase 3 · Kracht & scherp", "deload": true, "sets": 3, "reps": "5", "note": "Afsluiter: test hoe sterk je bent geworden. Trots zijn!"}];

const INFO = [
  { icon: "💪", title: "Progressive overload, de sleutel", items: [
    "Word elke week een beetje sterker: iets meer gewicht, een herhaling extra of een setje erbij.",
    "Noteer je gewichten en herhalingen in de app, dan zie je je groei zwart-op-wit.",
    "Kies een gewicht waarbij de laatste 1 à 2 herhalingen echt pittig zijn, maar je techniek netjes blijft.",
    "Lukt het bovenste aantal herhalingen makkelijk? Volgende keer een tandje zwaarder." ] },
  { icon: "🍽️", title: "Afvallen: rustig en houdbaar", items: [
    "Afvallen draait om energiebalans: eet iets minder dan je verbruikt, zo'n 300 tot 500 kcal per dag.",
    "Mik op ongeveer 0,5 tot 1 kg per week. Rustig aan houdt je sterk en houdt het vol.",
    "Groente, volkoren en eiwit vullen goed en houden je energie stabiel.",
    "Van 113 naar 100 kg is heel haalbaar: consistent zijn wint van streng zijn." ] },
  { icon: "🥩", title: "Genoeg eiwit binnen", items: [
    "Eiwit beschermt je spieren terwijl je afvalt, en helpt je herstellen.",
    "Mik op ongeveer 1,6 tot 2,0 gram eiwit per kilo lichaamsgewicht per dag.",
    "Verdeel het over je dag: bij elke maaltijd een portie (vlees, vis, ei, kwark, peulvruchten).",
    "Een eiwitrijke snack na je training is een prima gewoonte." ] },
  { icon: "🛌", title: "Herstel & slaap", items: [
    "Je wordt niet sterker in de sportschool maar in je herstel erna.",
    "Slaap 7 tot 9 uur; dat is je beste hersteltool, zeker tijdens het afvallen.",
    "Ma, wo, vr is mooi verdeeld: steeds een dag rust tussen je sessies.",
    "Voel je je uitgeput of blijft spierpijn hangen? Neem gerust een extra rustdag." ] },
  { icon: "⚽", title: "Combineren met voetbal", items: [
    "Je voetbaltraining en wedstrijden tellen mee als conditie en vetverbranding.",
    "Plan zware beensessies niet vlak vóór een wedstrijd; luister naar je benen.",
    "Voel je benen zwaar van het voetballen? Houd de squats dan wat lichter die dag.",
    "Combineer slim: kracht maakt je op het veld ook explosiever en minder blessuregevoelig." ] },
  { icon: "🏠", title: "Thuis alleen je lichaam?", items: [
    "Geen sportschool? Vervang met push-ups, split squats, glute bridges, plank en burpees.",
    "Maak het zwaarder met meer herhalingen, langzamer tempo of 1-benige varianten.",
    "Een stevige work-out van 30 min met je eigen gewicht houdt je ritme erin.",
    "Zie het als bonus op een rustdag of als de sportschool er even niet in zit." ] },
];

const BADGES = [
  { id: "first",   icon: "🏋️", name: "Eerste training",  desc: "1 training afgevinkt",     test: (s) => s.done >= 1 },
  { id: "ten",     icon: "🔟",  name: "Tien op de teller",desc: "10 trainingen gedaan",     test: (s) => s.done >= 10 },
  { id: "half",    icon: "⚡",  name: "Halverwege",       desc: "50% van het programma",    test: (s) => s.done >= s.total / 2 },
  { id: "week",    icon: "✅",  name: "Week compleet",    desc: "Een hele week (3x) af",    test: (s) => s.fullWeeks >= 1 },
  { id: "volume",  icon: "🚛",  name: "Tien ton",         desc: "10.000 kg totaal getild",  test: (s) => s.volume >= 10000 },
  { id: "strong",  icon: "💥",  name: "Krachtpatser",     desc: "Een set met ≥ 60 kg",      test: (s) => s.bestWeight >= 60 },
  { id: "drop5",   icon: "📉",  name: "Vijf eraf",        desc: "5 kg lichter dan de start", test: (s) => s.bw > 0 && s.bw <= CONFIG.bwStart - 5 },
  { id: "hundred", icon: "🎯",  name: "De 100 aangetikt", desc: "100 kg of lichter",        test: (s) => s.bw > 0 && s.bw <= CONFIG.bwGoal },
];

/* ================================================================== *
 *  State & helpers
 * ================================================================== */
let log = loadLog();
function loadLog() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
function saveLog() { localStorage.setItem(STORE_KEY, JSON.stringify(log)); }
const $ = (id) => document.getElementById(id);
const escapeHtml = (v = "") => String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const sid = (week, day) => `w${week}-${day}`;
const workoutFor = (day) => WORKOUTS[(ORDER.find((o) => o.day === day) || ORDER[0]).w];

function dateAtDay(dayIndex) { const d = new Date(START_DATE.getTime()); d.setDate(d.getDate() + dayIndex); d.setHours(12,0,0,0); return d; }
function sessionDate(week, day) { return dateAtDay((week - 1) * 7 + (DAY_OFFSET[day] ?? 0)); }
function isoDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
const todayIso = isoDate(new Date());
function currentWeek() {
  const diff = Math.floor((new Date().setHours(12,0,0,0) - START_DATE.getTime()) / 864e5);
  return Math.min(TOTAL_WEEKS, Math.max(1, Math.floor(diff / 7) + 1));
}

function planningEntries() { return Array.isArray(log.__planning) ? log.__planning : []; }
function planningForWeek(week) {
  const s = isoDate(dateAtDay((week-1)*7)), e = isoDate(dateAtDay((week-1)*7+6));
  return planningEntries().filter((x) => x.start <= e && (x.end || x.start) >= s);
}
const PLANNING_META = { rest: { icon: "🩹", label: "Rust" }, vacation: { icon: "🌴", label: "Vakantie" }, event: { icon: "📅", label: "Moment" } };

function bwEntries() { return Array.isArray(log.__bw) ? log.__bw.slice().sort((a,b) => a.date < b.date ? -1 : 1) : []; }
function latestBw() { const e = bwEntries(); return e.length ? e[e.length-1].kg : 0; }

/* ================================================================== *
 *  Stats
 * ================================================================== */
function schemeOf(week) { return WEEKS[week-1]; }
function computeStats() {
  let done = 0, volume = 0, bestWeight = 0, fullWeeks = 0;
  const records = {};
  const total = TOTAL_WEEKS * ORDER.length;
  const seq = [];
  WEEKS.forEach((wk) => {
    let wkDone = 0;
    ORDER.forEach((o) => {
      const e = log[sid(wk.week, o.day)];
      const isDone = !!(e && e.done);
      seq.push(isDone);
      if (isDone) {
        done++; wkDone++;
        const wo = WORKOUTS[o.w];
        const ex = (e.ex) || {};
        Object.keys(ex).forEach((k) => {
          const kg = parseFloat(ex[k].weight) || 0, reps = parseFloat(ex[k].reps) || 0;
          if (kg > 0) {
            volume += kg * reps * (wk.sets || 1);
            if (kg > bestWeight) bestWeight = kg;
            const nm = wo.exercises[k] ? wo.exercises[k].name : k;
            if (!records[nm] || kg > records[nm]) records[nm] = kg;
          }
        });
      }
    });
    if (wkDone === ORDER.length) fullWeeks++;
  });
  let streak = 0, run = 0;
  seq.forEach((d) => { if (d) { run++; streak = Math.max(streak, run); } else run = 0; });
  return { done, total, volume: Math.round(volume), bestWeight, fullWeeks, streak, records, bw: latestBw() };
}

/* ================================================================== *
 *  Render
 * ================================================================== */
function greetingWord() { const h = new Date().getHours(); return h < 6 ? "Goedenacht" : h < 12 ? "Goedemorgen" : h < 18 ? "Goedemiddag" : "Goedenavond"; }

function renderHero(stats) {
  $("runnerName").textContent = RUNNER;
  $("goalText").textContent = GOAL;
  $("heroGreeting").textContent = `${greetingWord()}, ${RUNNER.split(" ")[0]} 👋`;
  const pct = Math.round((stats.done / stats.total) * 100);
  $("ringPct").textContent = `${pct}%`;
  const c = 2 * Math.PI * 52;
  const fg = $("ringFg");
  fg.style.strokeDasharray = c; fg.style.strokeDashoffset = c;
  requestAnimationFrame(() => { fg.style.strokeDashoffset = c * (1 - pct / 100); });
  const m = CONFIG.mottos;
  $("heroMotto").textContent = pct >= 100 ? m[5] : pct >= 80 ? m[4] : pct >= 50 ? m[3] : pct >= 20 ? m[2] : pct > 0 ? m[1] : m[0];
}

function animateCount(el, to, suffix = "") {
  const t0 = performance.now(), dur = 700, dec = to % 1 !== 0;
  const finalTxt = (dec ? to.toFixed(1) : Math.round(to)) + suffix;
  function step(t) { const k = Math.min(1, (t - t0) / dur); const v = to * (1 - Math.pow(1 - k, 3)); el.textContent = (dec ? v.toFixed(1) : Math.round(v)) + suffix; if (k < 1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
  setTimeout(() => { el.textContent = finalTxt; }, dur + 60);
}
function renderStats(stats) {
  const cw = currentWeek();
  const weekDone = ORDER.reduce((n, o) => n + (log[sid(cw, o.day)]?.done ? 1 : 0), 0);
  animateCount($("statDone"), stats.done);
  const ton = stats.volume >= 1000 ? Math.round(stats.volume / 100) / 10 : stats.volume;
  $("statVolume").textContent = stats.volume >= 1000 ? `${ton} ton` : `${stats.volume} kg`;
  animateCount($("statStreak"), stats.streak);
  $("statWeek").textContent = `${weekDone}/${ORDER.length}`;
}

function renderBodyweight(stats) {
  const cur = stats.bw || CONFIG.bwStart;
  const span = CONFIG.bwStart - CONFIG.bwGoal;
  const lost = Math.max(0, CONFIG.bwStart - cur);
  const pct = Math.max(0, Math.min(100, Math.round((lost / span) * 100)));
  $("bwCurrent").textContent = stats.bw ? `${cur} kg` : `${CONFIG.bwStart} kg`;
  $("bwLost").textContent = stats.bw ? `${Math.round(lost * 10) / 10} kg eraf` : "nog te loggen";
  $("bwFill").style.width = `${pct}%`;
  $("bwGoalLabel").textContent = `Doel ${CONFIG.bwGoal} kg`;
}

function nextSession() {
  const cw = currentWeek();
  for (let w = cw; w <= TOTAL_WEEKS; w++) {
    for (const o of ORDER) { if (!log[sid(w, o.day)]?.done) return { week: w, day: o.day }; }
  }
  return null;
}
function renderNextUp() {
  const box = $("nextUp"), n = nextSession();
  if (!n) { box.innerHTML = `<div class="nextup-card"><span class="nextup-eyebrow">Klaar!</span><strong class="nextup-title">Programma voltooid 🏅</strong><span class="nextup-meta">Wat een beest, strijder.</span></div>`; return; }
  const wo = workoutFor(n.day), wk = schemeOf(n.week);
  box.innerHTML = `
    <span class="nextup-eyebrow">Volgende training · week ${n.week} · ${DAY_LABEL[n.day]}</span>
    <button class="nextup-card" type="button">
      <span class="nextup-mark">${wo.letter}</span>
      <span class="nextup-body">
        <strong class="nextup-title">${wo.title} · ${wo.focus}</strong>
        <span class="nextup-meta">${wk.sets} sets × ${wk.reps} · ${wo.exercises.length} oefeningen</span>
      </span>
      <span class="nextup-go">›</span>
    </button>`;
  box.querySelector(".nextup-card").addEventListener("click", () => openDetail(n.week, n.day));
}

function tagOf(wk) { return wk.deload ? `<span class="week-tag tag-deload">deload</span>` : `<span class="week-tag">${wk.sets}×${wk.reps}</span>`; }

function renderWeeks() {
  const cw = currentWeek();
  let html = "", lastPhase = "";
  WEEKS.forEach((wk, i) => {
    if (wk.phase !== lastPhase) { html += `<h4 class="sub-phase reveal">${wk.phase}</h4>`; lastPhase = wk.phase; }
    const rows = ORDER.map((o) => {
      const wo = WORKOUTS[o.w], e = log[sid(wk.week, o.day)] || {};
      const isToday = isoDate(sessionDate(wk.week, o.day)) === todayIso;
      const logged = e.done ? `<span class="session-logged">✓ afgerond</span>` : "";
      return `
        <button class="session ${e.done ? "is-done" : ""} ${isToday ? "is-today" : ""}" data-week="${wk.week}" data-day="${o.day}">
          <span class="session-day">${wo.letter}</span>
          <span class="session-body">
            <span class="session-title">${wo.title}${isToday ? ' <span class="today-badge">Vandaag</span>' : ""}</span>
            <span class="session-meta">${DAY_LABEL[o.day]} · ${wo.focus}</span>
            ${logged}
          </span>
          <span class="session-check">${e.done ? "✓" : ""}</span>
        </button>`;
    }).join("");
    const plans = planningForWeek(wk.week);
    const strip = plans.length ? `<div class="week-planning">${plans.map((x) => { const m = PLANNING_META[x.type] || PLANNING_META.rest; return `<span>${m.icon} ${escapeHtml(x.title)}</span>`; }).join("")}</div>` : "";
    const allDone = ORDER.every((o) => log[sid(wk.week, o.day)]?.done);
    const stateClass = wk.week === cw ? "is-current" : wk.week < cw ? (allDone ? "is-complete" : "is-missed") : "";
    const tag = wk.week === cw ? `<span class="week-tag tag-now">Nu</span>` : wk.week < cw ? (allDone ? `<span class="week-tag tag-done">✓ af</span>` : `<span class="week-tag tag-missed">gemist</span>`) : tagOf(wk);
    html += `
      <article class="week-card reveal ${stateClass}" style="--i:${i % 4}">
        <header class="week-head">
          <div><span class="week-no">Week ${wk.week}</span><span class="week-dates">${wk.dates}</span></div>
          ${tag}
        </header>
        ${wk.note ? `<p class="week-note">${wk.deload ? "😌 " : "🎯 "}${wk.note}</p>` : ""}
        ${strip}
        <div class="session-list">${rows}</div>
      </article>`;
  });
  $("weeksList").innerHTML = html;
  $("weeksList").querySelectorAll(".session").forEach((b) => b.addEventListener("click", () => openDetail(+b.dataset.week, b.dataset.day)));
  observeReveals();
}

function renderRecords(stats) {
  const names = Object.keys(stats.records);
  const rows = [
    ["🏋️ Trainingen gedaan", `${stats.done} / ${stats.total}`],
    ["🚛 Totaal getild", stats.volume >= 1000 ? `${Math.round(stats.volume / 100) / 10} ton` : `${stats.volume} kg`],
    ["💥 Zwaarste set", stats.bestWeight ? `${stats.bestWeight} kg` : "–"],
    ["🔥 Langste reeks", `${stats.streak}`],
  ];
  let extra = "";
  if (names.length) {
    const top = names.map((n) => [n, stats.records[n]]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    extra = `<div class="record-lifts"><span class="record-lifts-head">Zwaarste per oefening</span>${top.map(([n, kg]) => `<div class="record-row"><span>${escapeHtml(n)}</span><strong>${kg} kg</strong></div>`).join("")}</div>`;
  }
  $("recordsGrid").innerHTML = rows.map(([k, v]) => `<div class="record-cell"><span>${k}</span><strong>${v}</strong></div>`).join("") + extra;
}

function flatSessions() { const a = []; WEEKS.forEach((wk) => ORDER.forEach((o) => a.push({ week: wk.week, day: o.day }))); return a; }
function renderConsistency() {
  const grid = document.querySelector(".stats-grid");
  if (!grid) return;
  let sec = document.getElementById("consistencyStrip");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "consistencyStrip";
    sec.className = "panel consistency-panel reveal";
    grid.parentNode.insertBefore(sec, grid.nextSibling);
  }
  const cw = currentWeek();
  let done = 0, total = 0;
  const cols = WEEKS.map((wk) => {
    const cells = ORDER.map((o) => {
      const e = log[sid(wk.week, o.day)] || {};
      const dIso = isoDate(sessionDate(wk.week, o.day));
      total++;
      if (e.done) done++;
      const cls = e.done ? "is-done" : dIso < todayIso ? "is-missed" : "is-todo";
      return `<span class="ccell ${cls}${dIso === todayIso ? " is-today" : ""}" title="Week ${wk.week} \u00b7 ${DAY_LABEL[o.day]}"></span>`;
    }).join("");
    return `<div class="cweek${wk.week === cw ? " is-current" : ""}"><div class="ccells">${cells}</div><span class="cweek-no">${wk.week}</span></div>`;
  }).join("");
  const pct = total ? Math.round((done / total) * 100) : 0;
  sec.innerHTML = `
    <h3 class="panel-head">Consistentie <span class="panel-sub">elk blokje is een training</span></h3>
    <div class="cweeks">${cols}</div>
    <div class="cons-foot">
      <div class="cons-legend"><span><i class="ck ck-done"></i>afgerond</span><span><i class="ck ck-missed"></i>gemist</span><span><i class="ck ck-todo"></i>komt nog</span></div>
      <span class="cons-score"><strong>${done}/${total}</strong> gedaan \u00b7 ${pct}%</span>
    </div>`;
}

function renderBadges(stats) {
  $("badgeGrid").innerHTML = BADGES.map((b) => { const got = b.test(stats); return `
    <div class="badge ${got ? "got" : "locked"}" title="${b.desc}">
      <span class="badge-icon">${got ? b.icon : "🔒"}</span><strong>${b.name}</strong><span class="badge-desc">${b.desc}</span>
    </div>`; }).join("");
}
function renderInfo() {
  $("infoList").innerHTML = INFO.map((c, i) => `
    <article class="info-card reveal" style="--i:${i}">
      <span class="info-icon">${c.icon}</span><h4>${c.title}</h4>
      <ul>${c.items.map((t) => `<li>${t}</li>`).join("")}</ul>
    </article>`).join("");
}

/* ----- Detail (workout loggen) ------------------------------------- */
function openDetail(week, day) {
  const wo = workoutFor(day), wk = schemeOf(week), e = log[sid(week, day)] || { ex: {} };
  const ex = e.ex || {};
  $("detailTitle").textContent = `Week ${week} · ${DAY_LABEL[day]}`;
  const rows = wo.exercises.map((x, k) => {
    const v = ex[k] || {};
    return `
      <div class="ex-row">
        <div class="ex-top"><span class="ex-tag">${x.tag}</span><span class="ex-scheme">${wk.sets} × ${wk.reps}</span></div>
        <h4 class="ex-name">${x.name}</h4>
        <p class="ex-cue">${x.cue}</p>
        <div class="ex-inputs">
          <label>Gewicht<input type="number" inputmode="decimal" min="0" step="0.5" id="ex-w-${k}" value="${v.weight ?? ""}" placeholder="kg" /></label>
          <label>Herhalingen<input type="number" inputmode="numeric" min="0" step="1" id="ex-r-${k}" value="${v.reps ?? ""}" placeholder="reps" /></label>
        </div>
      </div>`;
  }).join("");
  $("detailBody").innerHTML = `
    <div class="detail-hero">
      <span class="detail-kind">Workout ${wo.letter} · ${wo.focus}</span>
      <h2 class="detail-title-big">${wo.title}</h2>
      <p class="detail-goal">${wk.sets} sets × ${wk.reps} herhalingen · ${wk.deload ? "deloadweek, lekker licht" : "kies gewicht waarbij de laatste reps pittig zijn"}</p>
    </div>
    <section class="detail-block"><div class="coach-note"><span class="coach-badge">${(CONFIG.coachHandle||"@bartlopen")}</span><p>${wo.coach}</p></div></section>
    <section class="detail-block"><h3 class="block-head">Oefeningen · vul je gewicht en herhalingen in</h3>${rows}</section>
    <div class="detail-actions">
      <button class="btn-primary" id="saveDone" type="button">${e.done ? "✓ Afgerond, opslaan" : "Training afronden"}</button>
      ${e.done ? `<button class="btn-ghost" id="undoDone" type="button">Toch niet gedaan</button>` : ""}
      <button class="btn-ghost" id="saveOnly" type="button">Alleen opslaan</button>
    </div>`;
  const collect = () => {
    const data = {};
    wo.exercises.forEach((x, k) => { const w = $(`ex-w-${k}`).value.trim(), r = $(`ex-r-${k}`).value.trim(); if (w || r) data[k] = { weight: w, reps: r }; });
    return data;
  };
  const store = (done) => { log[sid(week, day)] = { done, ex: collect(), date: isoDate(sessionDate(week, day)) }; saveLog(); };
  $("saveDone").addEventListener("click", () => { store(true); toast(DONE()); closeDetail(); renderAll(); });
  $("saveOnly").addEventListener("click", () => { store(!!e.done); toast("Opgeslagen 💾"); closeDetail(); renderAll(); });
  if ($("undoDone")) $("undoDone").addEventListener("click", () => { store(false); toast("Weer op niet-gedaan"); closeDetail(); renderAll(); });
  $("listView").classList.add("hidden");
  $("detailView").classList.remove("hidden");
  $("detailView").classList.add("is-in");
  $("backButton").classList.remove("hidden");
  window.scrollTo(0, 0);
}
function closeDetail() {
  $("detailView").classList.remove("is-in");
  $("detailView").classList.add("hidden");
  $("listView").classList.remove("hidden");
  $("backButton").classList.add("hidden");
}
const DONE_MSGS = ["💪 Sterk gedaan, strijder!", "🔥 Weer eentje in de pocket!", "🙌 Knap volgehouden!", "🌟 Zo bouw je 'm op!", "✅ Weer een stap sterker."];
function DONE() { return DONE_MSGS[Math.floor(Math.random() * DONE_MSGS.length)]; }

/* ----- Planning ---------------------------------------------------- */
function renderPlanning() {
  const list = $("planningList"), items = planningEntries();
  if (!items.length) { list.innerHTML = `<p class="planning-empty">Nog niets ingepland. Voeg een vakantie of rustperiode toe.</p>`; return; }
  list.innerHTML = items.slice().sort((a,b) => a.start < b.start ? -1 : 1).map((x, i) => {
    const m = PLANNING_META[x.type] || PLANNING_META.rest;
    const range = x.end && x.end !== x.start ? `${x.start} t/m ${x.end}` : x.start;
    return `<div class="planning-item"><span class="planning-ico">${m.icon}</span><div class="planning-txt"><strong>${escapeHtml(x.title)}</strong><span>${range}${x.note ? " · " + escapeHtml(x.note) : ""}</span></div><button class="planning-del" data-i="${i}" aria-label="Verwijderen">✕</button></div>`;
  }).join("");
  list.querySelectorAll(".planning-del").forEach((b) => b.addEventListener("click", () => {
    const arr = planningEntries().slice().sort((a,b) => a.start < b.start ? -1 : 1); arr.splice(+b.dataset.i, 1); log.__planning = arr; saveLog(); renderPlanning(); renderWeeks();
  }));
}

/* ----- Agenda-export (.ics) ---------------------------------------- */
function pad(n) { return String(n).padStart(2, "0"); }
function icsDate(d) { return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`; }
function calendarFile() {
  let out = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nPRODID:-//bartlopen//PT//NL\r\n";
  WEEKS.forEach((wk) => ORDER.forEach((o) => {
    const wo = WORKOUTS[o.w], d = sessionDate(wk.week, o.day), nd = new Date(d.getTime() + 864e5);
    out += "BEGIN:VEVENT\r\n";
    out += `UID:${sid(wk.week, o.day)}@bartlopen\r\n`;
    out += `DTSTART;VALUE=DATE:${icsDate(d)}\r\nDTEND;VALUE=DATE:${icsDate(nd)}\r\n`;
    out += `SUMMARY:💪 ${wo.title} (${wk.sets}x${wk.reps})\r\n`;
    out += `DESCRIPTION:${wo.focus}. ${wo.exercises.map((x) => x.name).join(", ")}\r\n`;
    out += "END:VEVENT\r\n";
  }));
  out += "END:VCALENDAR\r\n";
  return out;
}
function download(name, text, type) { const b = new Blob([text], { type }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 1000); }

/* ----- Back-up ----------------------------------------------------- */
function exportBackup() { download("jorne-pt-backup.json", JSON.stringify(log), "application/json"); toast("Back-up opgeslagen ⬇︎"); }
function importBackup(file) { const r = new FileReader(); r.onload = () => { try { log = JSON.parse(r.result) || {}; saveLog(); renderAll(); toast("Back-up geladen ⬆︎"); } catch (e) { toast("Kon back-up niet lezen"); } }; r.readAsText(file); }

/* ----- Toast / reveal / splash ------------------------------------- */
let toastTimer;
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600); }
let io, initialRevealDone = false;
function observeReveals() {
  if (initialRevealDone) { document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")); return; }
  io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}

/* ================================================================== *
 *  Orchestratie
 * ================================================================== */
function renderAll() {
  const stats = computeStats();
  renderHero(stats); renderStats(stats); renderConsistency(); renderBodyweight(stats); renderNextUp();
  renderWeeks(); renderRecords(stats); renderBadges(stats); renderInfo(); renderPlanning();
  observeReveals();
}

function wireEvents() {
  $("backButton").addEventListener("click", closeDetail);
  $("resetButton").addEventListener("click", () => { if (confirm("Weet je zeker dat je je voortgang wilt wissen?")) { log = {}; saveLog(); renderAll(); toast("Voortgang gewist"); } });
  $("exportBtn").addEventListener("click", exportBackup);
  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (e) => { if (e.target.files[0]) importBackup(e.target.files[0]); });
  $("pdfBtn").addEventListener("click", () => { document.body.classList.add("print-schema"); window.print(); setTimeout(() => document.body.classList.remove("print-schema"), 500); });
  $("calendarBtn").addEventListener("click", () => { download("jorne-krachtschema.ics", calendarFile(), "text/calendar"); toast("Agenda-bestand opgeslagen 🗓"); });
  // bodyweight log
  $("bwSave").addEventListener("click", () => {
    const v = parseFloat($("bwInput").value); if (!v || v < 40 || v > 300) { toast("Vul een gewicht in kg in"); return; }
    const arr = bwEntries(); arr.push({ date: todayIso, kg: Math.round(v * 10) / 10 }); log.__bw = arr; saveLog(); $("bwInput").value = ""; renderAll(); toast("Gewicht opgeslagen ⚖️");
  });
  // planning
  $("togglePlanningForm").addEventListener("click", () => { const f = $("planningForm"); const open = f.classList.toggle("hidden"); $("togglePlanningForm").setAttribute("aria-expanded", String(!open)); });
  $("cancelPlanning").addEventListener("click", () => { $("planningForm").classList.add("hidden"); $("togglePlanningForm").setAttribute("aria-expanded", "false"); });
  $("planningForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const entry = { type: $("planType").value, title: $("planTitle").value.trim() || "Rustperiode", start: $("planStart").value, end: $("planEnd").value || $("planStart").value, note: $("planNote").value.trim() };
    if (!entry.start) { toast("Kies een startdatum"); return; }
    const arr = planningEntries().slice(); arr.push(entry); log.__planning = arr; saveLog();
    e.target.reset(); $("planningForm").classList.add("hidden"); $("togglePlanningForm").setAttribute("aria-expanded", "false");
    renderPlanning(); renderWeeks(); toast("Toegevoegd aan je planning");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireEvents(); renderAll();
  requestAnimationFrame(() => document.querySelectorAll(".hero.reveal, .stats-grid.reveal, .consistency.reveal").forEach((el) => el.classList.add("in")));
  setTimeout(() => { const s = $("splash"); if (s) s.classList.add("gone"); }, 700);
  setTimeout(() => { initialRevealDone = true; document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")); }, 1300);
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  /* Auto-verversen: nieuwe versie neemt over -> pagina herlaadt zichzelf een keer */
  const hadController = !!navigator.serviceWorker.controller;
  let autoReloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || autoReloaded) return;
    autoReloaded = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
