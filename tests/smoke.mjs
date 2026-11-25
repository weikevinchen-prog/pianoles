// Rooktest in headless Chrome: opent elk scherm, simuleert noten en meldt JavaScript-fouten.
// Gebruik:  node tests/smoke.mjs            (start zelf een python-webserver op poort 8123)
// Vereist: Chrome of Edge en Python. Geen npm nodig (gebruikt het Chrome DevTools Protocol via WebSocket).
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8123, DBG = 9333;
const CHROME = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(p => p && existsSync(p));
if (!CHROME) { console.error('Geen Chrome gevonden (zet CHROME=pad)'); process.exit(2); }

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Klein MIDI-bestand (type 1): spoor 1 = melodie hoog, spoor 2 = bas.
function tinyMidi() {
  const vlq = n => { const b = [n & 127]; while ((n >>= 7)) b.unshift((n & 127) | 128); return b; };
  const track = evs => { const body = []; for (const [dt, ...b] of evs) body.push(...vlq(dt), ...b); body.push(0, 0xff, 0x2f, 0); const l = body.length; return [0x4d, 0x54, 0x72, 0x6b, l >>> 24, (l >>> 16) & 255, (l >>> 8) & 255, l & 255, ...body]; };
  const t1 = track([[0, 0x90, 72, 100], [480, 0x80, 72, 0], [0, 0x90, 76, 90], [480, 0x80, 76, 0]]);
  const t2 = track([[0, 0x91, 48, 80], [960, 0x81, 48, 0]]);
  return new Uint8Array([0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, 0, 2, 0x01, 0xe0, ...t1, ...t2]);
}
const server = spawn(process.platform === 'win32' ? 'python' : 'python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
const profile = mkdtempSync(join(tmpdir(), 'pianoles-smoke-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${profile}`, '--no-first-run', '--window-size=844,390', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0;
const pending = new Map(), errors = [];
function send(method, params = {}) {
  return new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
}
async function evaluate(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}

let failed = false;
const check = (ok, msg) => { console.log(`${ok ? '✔' : '✘'} ${msg}`); if (!ok) failed = true; };

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try { target = (await (await fetch(`http://127.0.0.1:${DBG}/json/list`)).json()).find(t => t.type === 'page'); } catch (e) { /* nog niet klaar */ }
  }
  if (!target) throw new Error('Chrome start niet');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result); }
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map(a => a.value ?? a.description).join(' '));
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error' && !/fonts\.g|favicon/.test(msg.params.entry.url || '')) errors.push(`${msg.params.entry.text} ${msg.params.entry.url || ''}`);
  });
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');
  await send('DOM.enable');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  for (let i = 0; i < 40; i++) { await sleep(150); if (await evaluate('!!window.pianoles').catch(() => false)) break; }
  check(await evaluate('!!window.pianoles'), 'app start (modules geladen)');

  const go = async (hash, wait = 400) => { await evaluate(`location.hash='${hash}'`); await sleep(wait); };
  const note = async (m, wait = 80) => { await evaluate(`pianoles.input.noteOn(${m},.8,'midi');pianoles.input.noteOff(${m},'midi')`); await sleep(wait); };
  const text = sel => evaluate(`document.querySelector('${sel}')?.textContent||''`);

  for (const h of ['#/', '#/verbinden', '#/kalibratie', '#/cursus', '#/instaptest', '#/spelen', '#/liedjes', '#/opwarming', '#/voortgang', '#/instellingen']) {
    await go(h);
    const html = await evaluate('document.getElementById("app").innerHTML.length');
    check(html > 100 && !(await text('#app')).includes('Er liep iets mis'), `scherm ${h}`);
  }

  // Les 1.2 "De C vinden": stap 1 uitleg, stap 2 alle C's (C3 C4 C5), stap 3 alle C's van laag naar hoog
  await evaluate('pianoles.store.resetAll()');
  await evaluate(`pianoles.store.update(s=>{s.lessons['h1-l1']={stars:3,status:'done'}})`);
  await go('#/les/h1-l2', 500);
  check((await text('#lPrompt')).includes('links van een groepje van 2'), 'les h1-l2 start met uitleg');
  await evaluate('document.querySelector("#lCtl button").click()');
  await sleep(200);
  await note(50);                                     // D3: fout
  check((await evaluate('document.getElementById("lFb").className')).includes('bad'), 'foute noot geeft rode feedback');
  for (const m of [48, 60, 72]) await note(m);
  await sleep(900);
  check((await text('#lPrompt')).includes('van laag'), 'na alle C\'s volgt de volgende stap');
  for (const m of [24, 36, 48, 60, 72, 84, 96, 108]) await note(m);
  await sleep(1000);
  check((await text('.result-card h2')).length > 0, 'resultaatscherm verschijnt');
  const stars = await evaluate(`pianoles.store.get().lessons['h1-l2']?.stars`);
  check(stars === 3 || stars === 2, `sterren bewaard (${stars})`);   // 11 juist, 1 fout = 92%
  check(await evaluate(`!!document.querySelector('a[href="#/les/h1-l3"]')`), 'knop naar volgende les');

  // Benoemen-stap (h1-l6 stap 2) via knoppen
  await evaluate(`pianoles.store.update(s=>{for(const k of ['h1-l2','h1-l3','h1-l4','h1-l5'])s.lessons[k]={stars:1,status:'done'}})`);
  await go('#/les/h1-l6', 500);
  await evaluate('document.querySelector("#lCtl button").click()');
  await sleep(200);
  check(await evaluate('document.querySelectorAll(".answers button").length') === 7, 'benoemen: 7 antwoordknoppen');

  // Vrij spelen: wachtmodus met Toonladder C
  await go('#/spelen', 500);
  await evaluate('document.getElementById("btnPlay").click()');
  await sleep(2800);
  for (const m of [60, 62, 64]) await note(m, 700);
  const st = await text('#stats');
  check(/Juist 3/.test(st), `vrij spelen telt juiste noten (${st})`);
  await evaluate('document.getElementById("mode").value="demo";document.getElementById("mode").dispatchEvent(new Event("change"))');
  await evaluate('document.getElementById("btnPlay").click()');
  await sleep(600);

  // Instaptest: beantwoord de speelvragen door de gevraagde noot te spelen, stop dan de test
  await evaluate(`pianoles.store.update(s=>{s.lessons['h1-l1']={stars:3,status:'done'}})`);
  await go('#/instaptest', 400);
  await evaluate('document.getElementById("go").click()');
  await sleep(300);
  const PCS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let answered = 0;
  for (let i = 0; i < 10; i++) {
    const nn = await text('#lPrompt .nn');
    const r = /^([A-G])(\d)?$/.exec(nn);
    if (!r) break;
    await note(r[2] ? (+r[2] + 1) * 12 + PCS[r[1]] : 60 + PCS[r[1]], 750);
    answered++;
  }
  check(answered >= 10 || (await evaluate('document.querySelectorAll(".answers button").length')) === 7, `instaptest: speelvragen beantwoord (${answered}) en benoemen bereikt`);
  await evaluate('[...document.querySelectorAll("button")].find(b=>b.textContent==="Stop de test").click()');
  await sleep(300);
  check((await text('.result-card h2')).length > 0, 'instaptest toont resultaat na stoppen');

  // ---------- fase 2 ----------
  await evaluate(`pianoles.store.update(s=>{for(const k of ['h1-l1','h1-l2','h1-l3','h1-l4','h1-l5','h1-l6','h1-l7','h1-ex'])s.lessons[k]={stars:2,status:'done'}})`);
  // h2-l1: uitleg met handen, dan vingers aantikken
  await go('#/les/h2-l1', 500);
  check(await evaluate('document.querySelectorAll(".panel .hand-fig").length') === 2, 'vingernummers: twee handtekeningen');
  await evaluate('document.querySelector("#lCtl button").click()');
  await sleep(200);
  for (let i = 0; i < 5; i++) {
    const p = await text('#lPrompt');
    const f = /vinger (\d)/.exec(p)?.[1];
    await evaluate(`document.querySelector('.hand-fig.rh rect[data-finger="${f}"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
    await sleep(800);
  }
  check((await text('#lPrompt')).includes('linkerhand'), 'vingers aantikken RH klaar, nu LH');

  // h2-l3: C-positie RH met vingerplay en een stukje in fases
  await evaluate(`pianoles.store.update(s=>{s.lessons['h2-l1']={stars:3,status:'done'};s.lessons['h2-l2']={stars:3,status:'done'}})`);
  await go('#/les/h2-l3', 500);
  await evaluate('document.querySelector("#lCtl button").click()');
  await sleep(200);
  for (const m of [60, 62, 64, 65, 67]) await note(m);
  await sleep(900);
  for (const m of [67, 65, 64, 62, 60]) await note(m);
  await sleep(900);
  check((await text('#lPrompt')).includes('Speel met'), 'vingerplay-stap gestart');
  const RH = { 1: 60, 2: 62, 3: 64, 4: 65, 5: 67 };
  for (let i = 0; i < 8; i++) {
    const f = /vinger (\d)/.exec(await text('#lPrompt'))?.[1];
    await note(RH[f], 800);
  }
  check((await text('#lPrompt')).includes('Luister'), 'stukje start met voorspelen');
  await evaluate('[...document.querySelectorAll("#lCtl button")].find(b=>b.textContent.startsWith("Overslaan")).click()');
  await sleep(2800);
  check((await text('#lPrompt')).includes('eigen tempo'), 'daarna wachtmodus');
  // noten op hun tel (70 bpm); de wachtmodus houdt de klok tegen tot de juiste noot komt
  const beats = [0, 1, 2, 3, 4, 8, 9, 10, 11, 12], pitches = [60, 62, 64, 65, 67, 67, 65, 64, 62, 60];
  for (let i = 0; i < beats.length; i++) {
    await note(pitches[i], 0);
    if (i + 1 < beats.length) await sleep((beats[i + 1] - beats[i]) * 857 + 60);
  }
  await sleep(4500);
  check(/Op tempo|100% juist/.test((await text('#lCount')) + (await text('#lFb'))), 'wachtmodus foutloos → door naar op tempo');
  await go('#/', 300);

  // Vrij spelen met vingerzetting (Toonladder C) toont de handlaag zonder fouten
  await go('#/spelen', 400);
  await evaluate('document.getElementById("btnPlay").click()');
  await sleep(3000);
  await note(60, 300);
  await go('#/', 300);

  // ---------- fase 3 ----------
  await evaluate(`import('./js/lesson/course.js').then(c=>pianoles.store.update(s=>{for(const x of c.flat())s.lessons[x.lesson.id]={stars:1,status:'done'}}))`);
  // notenleesquiz: twee keer fout -> de naam verschijnt onder de noot -> die spelen
  await go('#/les/h7-l2/2', 2500);
  check(await evaluate('!!document.querySelector(".panel.top svg")'), 'leesquiz tekent een notenbalk (VexFlow geladen)');
  await note(30, 150); await note(30, 400);
  const lbl = await evaluate(`[...document.querySelectorAll('.panel.top svg text')].map(t=>t.textContent).find(t=>/^[A-G]\\d$/.test(t))||''`);
  const PC2 = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  if (lbl) await note((+lbl[1] + 1) * 12 + PC2[lbl[0]], 300);
  check(lbl && (await evaluate('document.getElementById("lFb").className')).includes('ok'), `leesquiz: hint (${lbl}) en juiste noot`);
  // stuk met notenbalk boven vallende noten
  await go('#/les/h7-l5/2', 3000);
  check(await evaluate('!!document.querySelector(".staff-panel .staff-svg svg")'), 'weergave "samen": notenbalk zichtbaar');
  check(await evaluate('document.querySelectorAll(".staff-panel .vf-stavenote").length') > 4, 'notenbalk bevat noten');
  // Für Elise: opmaat, 3/8, twee handen
  await go('#/les/h15-l3/2', 3000);
  check(await evaluate('document.querySelectorAll(".staff-panel .vf-stavenote").length') > 4, 'Für Elise (3/8 met opmaat) rendert');
  // ritme met metronoom (anyKey)
  await go('#/les/h6-l1/2', 400);
  await evaluate('[...document.querySelectorAll("#lCtl button")].find(b=>b.textContent.startsWith("Overslaan"))?.click()');
  await sleep(2600);
  await note(70, 200);
  check(/Juist|eigen|tempo/i.test(await text('#lPrompt')), 'ritme-oefening loopt');
  await go('#/cursus', 400);
  check(await evaluate('document.querySelectorAll("details.chapter").length') === 15, 'cursus toont 15 hoofdstukken');
  await go('#/', 200);

  // ---------- fase 4 ----------
  await go('#/opwarming', 500);
  const woItems = await evaluate('document.querySelectorAll(".wo-list li").length');
  check(woItems >= 4, `opwarming stelt ${woItems} oefeningen samen`);
  await evaluate('document.getElementById("wPlus").click()');
  await sleep(200);
  check(await evaluate('pianoles.store.get().settings.workoutBpm') === 76, 'tempo van de opwarming instelbaar');
  await go('#/opwarming/start', 1500);
  check((await text('#lPrompt')).length > 10 && (await text('#title')).length > 3, 'opwarming start met de eerste oefening');
  await go('#/metronoom', 400);
  await evaluate('document.getElementById("mGo").click()');
  await sleep(1300);
  check(await evaluate('!!document.querySelector("#mBeats span.on")'), 'metronoom tikt (visuele tel)');
  await evaluate('document.getElementById("mPlus").click()');
  check(await evaluate('pianoles.store.get().settings.metroBpm') === 82, 'metronoom: tempo + bewaard');
  await go('#/', 300);

  // ---------- fase 5 ----------
  await go('#/liedjes', 400);
  const nSongs = await evaluate('document.querySelectorAll(".song-card").length');
  check(nSongs >= 25, `bibliotheek toont ${nSongs} liedjes`);
  await go('#/liedjes/3', 300);
  check(await evaluate('document.querySelectorAll(".song-card").length') < nSongs, 'filter op niveau werkt');
  // Op tempo, 150 %, niets spelen -> alles gemist -> resultaat met moeilijkste maten -> oefen deze maten
  await go('#/liedje/hot-cross-buns', 600);
  await evaluate('const m=document.getElementById("sMode");m.value="play";m.dispatchEvent(new Event("change"))');
  for (let i = 0; i < 5; i++) await evaluate('document.getElementById("tPlus").click()');
  check((await text('#tVal')) === '150%', 'tempo tot 150 %');
  await evaluate('document.getElementById("sPlay").click()');
  for (let i = 0; i < 40 && !(await evaluate('document.getElementById("done").classList.contains("show")')); i++) await sleep(300);
  check(await evaluate('document.getElementById("done").classList.contains("show")'), 'resultaatscherm na het liedje');
  check(/gemist/.test(await text('#rGrid')) && /Moeilijkste maten/.test(await text('#rHard')), `gedetailleerde feedback (${await text('#rHard')})`);
  await evaluate('document.getElementById("rPractice").click()');
  await sleep(300);
  check(await evaluate('pianoles.current.state.loop.on && pianoles.current.state.mode==="wait"'), '"Oefen deze maten" zet een lus in de wachtmodus');
  // alleen rechterhand: de app speelt links mee
  await evaluate('const h=document.getElementById("sHands");h.value="rh";h.dispatchEvent(new Event("change"))');
  check(await evaluate('pianoles.current.engine.hands==="rh"'), 'alleen rechts oefenen');
  // eigen MIDI-bestand via de bibliotheek
  const midiPath = join(profile, 'test.mid');
  writeFileSync(midiPath, Buffer.from(tinyMidi()));
  await go('#/liedjes', 300);
  const doc = await send('DOM.getDocument', {});
  const node = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '#midi' });
  await send('DOM.setFileInputFiles', { nodeId: node.nodeId, files: [midiPath] });
  await sleep(800);
  check((await evaluate('location.hash')) === '#/liedje/eigen' && (await text('#title')) === 'test', 'eigen MIDI-bestand opent in de speler');
  check(await evaluate('pianoles.current.engine.notes.some(n=>n.hand==="lh") && pianoles.current.engine.notes.some(n=>n.hand==="rh")'), 'MIDI automatisch gesplitst in twee handen');
  await go('#/', 200);

  // ---------- fase 6 ----------
  await go('#/instellingen', 400);
  await evaluate('document.querySelector(".preset[data-i=\\"1\\"]").click()');
  check(await evaluate('pianoles.store.get().settings.rhColor') === '#3b82f6', 'handkleuren: voorinstelling blauw/oranje');
  await evaluate('{const s=document.querySelector("select[data-key=effects]");s.value="false";s.dispatchEvent(new Event("change"))}');
  check(await evaluate('pianoles.store.get().settings.effects===false && document.documentElement.classList.contains("no-anim")'), 'animaties uitzetten');
  await evaluate('{const s=document.querySelector("select[data-key=effects]");s.value="true";s.dispatchEvent(new Event("change"))}');
  // latency meten: 16 tikken, telkens ~40 ms na de tik
  await go('#/latency', 300);
  await evaluate('document.getElementById("go").click()');
  await sleep(300 + 4 * 750 + 40);
  for (let i = 0; i < 16; i++) { const t0 = Date.now(); await note(60, 0); await sleep(750 - (Date.now() - t0)); }
  await sleep(1200);
  const latTxt = await text('#status');
  check(/gemiddeld/.test(latTxt), `latency gemeten (${latTxt.replace(/\s+/g, ' ').slice(0, 60)})`);
  await evaluate('[...document.querySelectorAll("#ctl button")].find(b=>b.textContent.startsWith("Bewaar"))?.click()');
  const lat = await evaluate('pianoles.store.get().settings.latency');
  check(Math.abs(lat) < 300, `latency bewaard (${lat} ms)`);
  // viering na een les met sterren (h1-l3, vanaf stap 2: centrale C, uitleg, quiz)
  await go('#/les/h1-l3/2', 400);
  await note(60, 900);
  await evaluate('document.querySelector("#lCtl button").click()');
  await sleep(200);
  for (let i = 0; i < 6; i++) {
    const nn = await text('#lPrompt .nn');
    const r = /^C(\d)$/.exec(nn);
    if (r) await note((+r[1] + 1) * 12, 750);
  }
  await sleep(200);
  check(await evaluate('!!document.querySelector(".result-card .burst")'), 'sterrenburst bij een les met sterren');
  // streakmelding wanneer vandaag de eerste volle minuut erbij komt
  await evaluate(`pianoles.store.update(s=>{s.practice[Object.keys(s.practice).sort().pop()||'x']=0; for (const k in s.practice) if (k===new Date().toISOString().slice(0,10)) s.practice[k]=0;}); pianoles.store.update(s=>{const d=new Date();const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');s.practice[k]=10}); pianoles.store.addPractice(70)`);
  await sleep(200);
  check(await evaluate('document.getElementById("appToast")?.classList.contains("show")'), 'melding bij een groeiende reeks');
  await go('#/voortgang', 400);
  check(await evaluate('document.querySelectorAll(".heat .h").length') === 28 && await evaluate('document.querySelectorAll(".chp").length') === 15, 'voortgang: 4-wekenkaart en 15 hoofdstukken');
  await go('#/', 200);

  // Export/import van voortgang
  const json = await evaluate('pianoles.store.exportJSON()');
  await evaluate('pianoles.store.resetAll()');
  await evaluate(`pianoles.store.importJSON(${JSON.stringify(json)})`);
  check(await evaluate(`pianoles.store.get().lessons['h1-l2']?.status==='done'`), 'export → import behoudt voortgang');

  check(errors.length === 0, `geen JavaScript-fouten${errors.length ? ':\n  ' + errors.join('\n  ') : ''}`);
} catch (e) {
  console.error('✘ rooktest gecrasht:', e.message, errors);
  failed = true;
} finally {
  try { ws?.close(); } catch (e) { /* */ }
  chrome.kill();
  server.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* Chrome houdt soms nog bestanden vast */ }
}
process.exit(failed ? 1 : 0);
